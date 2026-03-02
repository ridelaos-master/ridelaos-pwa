import { useEffect, useState, useMemo } from 'react'
import {
  Star,
  Trash2,
  Loader2,
  AlertCircle,
  Filter,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ── 타입 ──
interface Review {
  id: string
  course_id: string
  user_id: string | null
  rating: number
  content: string
  created_at: string
  // 클라이언트 조합
  course_name?: string
}

interface CourseOption {
  id: string
  name_ko: string
}

// ── 별점 표시 ──
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ── 삭제 확인 모달 ──
function DeleteConfirmModal({
  onConfirm,
  onCancel,
  deleting,
}: {
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-base font-bold text-[#1A3A2A]">리뷰 삭제</h3>
        <p className="mb-4 text-sm text-gray-600">
          이 리뷰를 삭제하시겠습니까?
          <br />
          <span className="text-xs text-red-500">이 작업은 되돌릴 수 없습니다.</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ──
export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState(true)

  // 필터
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<number>(0) // 0 = 전체

  // 삭제
  const [deletingReview, setDeletingReview] = useState<Review | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      // courses 먼저 조회
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, name_ko')
        .order('name_ko', { ascending: true })

      if (coursesError) throw coursesError
      setCourses((coursesData as CourseOption[]) || [])

      const coursesMap: Record<string, string> = {}
      ;(coursesData || []).forEach((c: CourseOption) => {
        coursesMap[c.id] = c.name_ko
      })

      // reviews 조회
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (reviewsError) {
        // 테이블이 없는 경우
        if (reviewsError.code === '42P01' || reviewsError.message?.includes('does not exist')) {
          setTableExists(false)
          setReviews([])
          return
        }
        throw reviewsError
      }

      const combined: Review[] = (reviewsData || []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        course_id: r.course_id as string,
        user_id: (r.user_id as string) || null,
        rating: (r.rating as number) || 0,
        content: (r.content as string) || '',
        created_at: r.created_at as string,
        course_name: coursesMap[(r.course_id as string)] || '미지정',
      }))

      setReviews(combined)
    } catch (err) {
      console.error('Reviews fetch error:', err)
      setError('리뷰 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 필터링
  const filteredReviews = useMemo(() => {
    let result = [...reviews]
    if (courseFilter !== 'all') {
      result = result.filter((r) => r.course_id === courseFilter)
    }
    if (ratingFilter > 0) {
      result = result.filter((r) => r.rating === ratingFilter)
    }
    return result
  }, [reviews, courseFilter, ratingFilter])

  // 평균 별점
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }, [reviews])

  // 삭제
  async function handleDelete() {
    if (!deletingReview) return
    try {
      setDeleting(true)
      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', deletingReview.id)

      if (deleteError) throw deleteError
      setReviews((prev) => prev.filter((r) => r.id !== deletingReview.id))
      setDeletingReview(null)
    } catch (err) {
      console.error('Review delete error:', err)
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  // ── 로딩 ──
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1A3A2A]" />
          <p className="text-sm text-gray-400">리뷰 로딩 중...</p>
        </div>
      </div>
    )
  }

  // ── 에러 ──
  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchData}
            className="rounded-lg bg-[#1A3A2A] px-4 py-2 text-sm text-white hover:opacity-90"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-[#1A3A2A]" />
          <h1 className="text-xl font-bold text-[#1A3A2A]">리뷰 관리</h1>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {reviews.length}건
          </span>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          새로고침
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">총 리뷰</p>
          <p className="text-2xl font-bold text-[#1A3A2A]">{reviews.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">평균 별점</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#1A3A2A]">{avgRating.toFixed(1)}</p>
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">5점 리뷰</p>
          <p className="text-2xl font-bold text-[#1A3A2A]">
            {reviews.filter((r) => r.rating === 5).length}
          </p>
        </div>
      </div>

      {!tableExists ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <Star className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">reviews 테이블이 아직 생성되지 않았습니다.</p>
          <p className="mt-1 text-xs text-gray-400">
            고객이 리뷰를 작성하면 자동으로 생성됩니다.
          </p>
        </div>
      ) : (
        <>
          {/* 필터 */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <button
                onClick={() => setCourseFilter('all')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  courseFilter === 'all'
                    ? 'bg-[#1A3A2A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체 코스
              </button>
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCourseFilter(c.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    courseFilter === c.id
                      ? 'bg-[#1A3A2A] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c.name_ko}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[0, 5, 4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => setRatingFilter(r)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    ratingFilter === r
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r === 0 ? '전체' : `${r}점`}
                </button>
              ))}
            </div>
          </div>

          {/* 리뷰 리스트 */}
          {filteredReviews.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-400">
                {reviews.length === 0 ? '등록된 리뷰가 없습니다.' : '필터 결과가 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((review) => (
                <div key={review.id} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {review.course_name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {formatDateTime(review.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeletingReview(review)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {review.content || '(내용 없음)'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 삭제 확인 모달 */}
      {deletingReview && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeletingReview(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}

export default AdminReviews
