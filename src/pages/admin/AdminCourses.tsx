import { useEffect, useState } from 'react'
import {
  Map,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Save,
  ImageIcon,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ── 타입 ──
interface Course {
  id: string
  region_id: string
  name_ko: string
  description_ko: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  distance_km: number
  duration_days: number
  min_pax: number
  price_krw: number
  gpx_url: string | null
  offline_tile_url: string | null
  photos: string[] | null
}

type CourseFormData = Omit<Course, 'id' | 'region_id' | 'gpx_url' | 'offline_tile_url'>

const EMPTY_FORM: CourseFormData = {
  name_ko: '',
  description_ko: '',
  difficulty: 'beginner',
  distance_km: 0,
  duration_days: 1,
  min_pax: 2,
  price_krw: 0,
  photos: [],
}

const DIFFICULTY_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  beginner: { label: '초급', bg: 'bg-green-50', text: 'text-green-700' },
  intermediate: { label: '중급', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  advanced: { label: '상급', bg: 'bg-red-50', text: 'text-red-700' },
}

function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

// ── 코스 편집 모달 ──
function CourseFormModal({
  course,
  onClose,
  onSave,
  saving,
}: {
  course: Course | null // null이면 신규
  onClose: () => void
  onSave: (data: CourseFormData, id?: string) => void
  saving: boolean
}) {
  const [form, setForm] = useState<CourseFormData>(
    course
      ? {
          name_ko: course.name_ko,
          description_ko: course.description_ko,
          difficulty: course.difficulty,
          distance_km: course.distance_km,
          duration_days: course.duration_days,
          min_pax: course.min_pax,
          price_krw: course.price_krw,
          photos: course.photos || [],
        }
      : { ...EMPTY_FORM }
  )
  const [photoInput, setPhotoInput] = useState('')

  const handleSubmit = () => {
    if (!form.name_ko.trim()) {
      alert('코스명을 입력해주세요.')
      return
    }
    onSave(form, course?.id)
  }

  const addPhoto = () => {
    if (photoInput.trim()) {
      setForm((f) => ({ ...f, photos: [...(f.photos || []), photoInput.trim()] }))
      setPhotoInput('')
    }
  }

  const removePhoto = (index: number) => {
    setForm((f) => ({ ...f, photos: (f.photos || []).filter((_, i) => i !== index) }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-lg">
        {/* 헤더 */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <h3 className="text-base font-bold text-[#1A3A2A]">
            {course ? '코스 수정' : '새 코스 추가'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-4 px-5 py-4">
          {/* 코스명 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">코스명 *</label>
            <input
              type="text"
              value={form.name_ko}
              onChange={(e) => setForm((f) => ({ ...f, name_ko: e.target.value }))}
              placeholder="예: 비엔티안-방비엥"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A] focus:ring-1 focus:ring-[#1A3A2A]"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">설명</label>
            <textarea
              value={form.description_ko}
              onChange={(e) => setForm((f) => ({ ...f, description_ko: e.target.value }))}
              placeholder="코스 설명을 입력하세요..."
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A] focus:ring-1 focus:ring-[#1A3A2A]"
            />
          </div>

          {/* 난이도 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">난이도</label>
            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  difficulty: e.target.value as Course['difficulty'],
                }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
            >
              <option value="beginner">초급</option>
              <option value="intermediate">중급</option>
              <option value="advanced">상급</option>
            </select>
          </div>

          {/* 숫자 입력 그리드 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">거리 (km)</label>
              <input
                type="number"
                value={form.distance_km}
                onChange={(e) => setForm((f) => ({ ...f, distance_km: Number(e.target.value) }))}
                min={0}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">기간 (일)</label>
              <input
                type="number"
                value={form.duration_days}
                onChange={(e) => setForm((f) => ({ ...f, duration_days: Number(e.target.value) }))}
                min={1}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">최소 인원</label>
              <input
                type="number"
                value={form.min_pax}
                onChange={(e) => setForm((f) => ({ ...f, min_pax: Number(e.target.value) }))}
                min={1}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">가격 (원)</label>
              <input
                type="number"
                value={form.price_krw}
                onChange={(e) => setForm((f) => ({ ...f, price_krw: Number(e.target.value) }))}
                min={0}
                step={10000}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
              />
            </div>
          </div>

          {/* 사진 URL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">사진 URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                placeholder="이미지 URL 입력"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
              />
              <button
                onClick={addPhoto}
                type="button"
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                추가
              </button>
            </div>
            {(form.photos || []).length > 0 && (
              <div className="mt-2 space-y-1.5">
                {(form.photos || []).map((url, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5"
                  >
                    <ImageIcon className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    <span className="flex-1 truncate text-xs text-gray-600">{url}</span>
                    <button
                      onClick={() => removePhoto(i)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="sticky bottom-0 border-t border-gray-100 bg-white px-5 py-4">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A3A2A] py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? '저장 중...' : course ? '수정 저장' : '코스 추가'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 삭제 확인 모달 ──
function DeleteConfirmModal({
  courseName,
  onConfirm,
  onCancel,
  deleting,
}: {
  courseName: string
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-base font-bold text-[#1A3A2A]">코스 삭제</h3>
        <p className="mb-4 text-sm text-gray-600">
          <strong>"{courseName}"</strong> 코스를 삭제하시겠습니까?
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
export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 모달 상태
  const [editingCourse, setEditingCourse] = useState<Course | null | 'new'>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('courses')
        .select('id, region_id, name_ko, difficulty, distance_km, duration_days, min_pax, price_krw, gpx_url, offline_tile_url, description_ko, photos')
        .order('name_ko', { ascending: true })

      if (fetchError) throw fetchError
      setCourses((data as Course[]) || [])
    } catch (err) {
      console.error('Courses fetch error:', err)
      setError('코스 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 저장 (추가/수정)
  async function handleSave(formData: CourseFormData, id?: string) {
    try {
      setSaving(true)

      if (id) {
        // 수정
        const { error: updateError } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', id)

        if (updateError) throw updateError

        setCourses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...formData } : c))
        )
      } else {
        // 추가
        const { data, error: insertError } = await supabase
          .from('courses')
          .insert(formData)
          .select()
          .single()

        if (insertError) throw insertError
        if (data) {
          setCourses((prev) => [...prev, data as Course])
        }
      }

      setEditingCourse(null)
    } catch (err) {
      console.error('Course save error:', err)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // 삭제
  async function handleDelete() {
    if (!deletingCourse) return
    try {
      setDeleting(true)

      const { error: deleteError } = await supabase
        .from('courses')
        .delete()
        .eq('id', deletingCourse.id)

      if (deleteError) throw deleteError

      setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id))
      setDeletingCourse(null)
    } catch (err) {
      console.error('Course delete error:', err)
      alert('삭제 중 오류가 발생했습니다. 해당 코스에 연결된 투어 날짜가 있을 수 있습니다.')
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
          <p className="text-sm text-gray-400">코스 데이터 로딩 중...</p>
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
            onClick={fetchCourses}
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
          <Map className="h-6 w-6 text-[#1A3A2A]" />
          <h1 className="text-xl font-bold text-[#1A3A2A]">코스 관리</h1>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {courses.length}개
          </span>
        </div>
        <button
          onClick={() => setEditingCourse('new')}
          className="flex items-center gap-1.5 rounded-lg bg-[#1A3A2A] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          코스 추가
        </button>
      </div>

      {/* ── 코스 카드 그리드 ── */}
      {courses.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <Map className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">등록된 코스가 없습니다.</p>
          <button
            onClick={() => setEditingCourse('new')}
            className="mt-3 text-sm font-medium text-[#1A3A2A] hover:underline"
          >
            첫 코스 추가하기
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const diff = DIFFICULTY_LABELS[course.difficulty] || DIFFICULTY_LABELS.beginner
            return (
              <div
                key={course.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* 썸네일 */}
                {course.photos && course.photos.length > 0 ? (
                  <div className="h-36 w-full overflow-hidden bg-gray-100">
                    <img
                      src={course.photos[0]}
                      alt={course.name_ko}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-36 items-center justify-center bg-gray-100">
                    <ImageIcon className="h-10 w-10 text-gray-300" />
                  </div>
                )}

                {/* 내용 */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A3A2A]">{course.name_ko}</h3>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${diff.bg} ${diff.text}`}
                      >
                        {diff.label}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#E8A54B]">
                      {formatKRW(course.price_krw)}
                    </p>
                  </div>

                  <p className="mb-3 line-clamp-2 text-xs text-gray-500">
                    {course.description_ko || '설명 없음'}
                  </p>

                  <div className="mb-3 flex gap-3 text-xs text-gray-400">
                    <span>{course.distance_km}km</span>
                    <span>{course.duration_days}일</span>
                    <span>최소 {course.min_pax}명</span>
                    <span>사진 {(course.photos || []).length}장</span>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      수정
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 py-1.5 text-xs text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── 편집 모달 ── */}
      {editingCourse && (
        <CourseFormModal
          course={editingCourse === 'new' ? null : editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {/* ── 삭제 확인 모달 ── */}
      {deletingCourse && (
        <DeleteConfirmModal
          courseName={deletingCourse.name_ko}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCourse(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}

export default AdminCourses
