import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCourse } from '../hooks/useCourses'
import { useTourDates, type TourDate } from '../hooks/useTourDates'
import { MapboxMap } from '../components/MapboxMap'
import OfflineMapManager from '../components/OfflineMapManager'
import { supabase } from '../lib/supabase'
import type { CourseWaypoint } from '../hooks/useOfflineMap'

/* ----- Helpers ----- */
function formatDeparture(dateStr: string): string {
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const m = parseInt(parts[1], 10)
  const d = parseInt(parts[2], 10)
  return `${m}월 ${d}일`
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-500 text-white',
  intermediate: 'bg-amber-500 text-white',
  advanced: 'bg-red-500 text-white',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
}

/* ----- Review type & fetch ----- */
interface Review {
  id: string
  course_id: string
  user_id: string | null
  rating: number
  content: string | null
  created_at: string
}

async function fetchReviews(courseId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('course_id', courseId)
    .limit(5)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Review[]
}

/* ----- Waypoints fetch (S4-04-D) ----- */
async function fetchWaypoints(courseId: string): Promise<CourseWaypoint[]> {
  const { data, error } = await supabase
    .from('course_waypoints')
    .select('*')
    .eq('course_id', courseId)
    .order('type', { ascending: true })

  if (error) throw error
  return (data ?? []) as CourseWaypoint[]
}

/* ----- Photo area skeleton ----- */
function PhotoSkeleton() {
  return (
    <div
      className="h-56 w-full animate-pulse"
      style={{
        background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
      }}
    />
  )
}

/* ----- Photo area ----- */
function CoursePhoto({
  photoUrl,
  difficulty,
  onBack,
}: {
  photoUrl: string | null
  difficulty: string | null
  onBack: () => void
}) {
  const d = (difficulty ?? 'beginner') as string
  return (
    <div className="relative h-56 w-full overflow-hidden">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
          }}
        />
      )}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-3 top-3 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
        aria-label="뒤로 가기"
      >
        ←
      </button>
      <span
        className={`absolute bottom-3 right-3 rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[d] ?? DIFFICULTY_STYLES.beginner}`}
      >
        {DIFFICULTY_LABEL[d] ?? '입문'}
      </span>
    </div>
  )
}

/* ----- Basic info section ----- */
function CourseBasicInfo({
  name,
  distance_km,
  duration_days,
  min_pax,
  price_krw,
}: {
  name: string
  distance_km: number | null
  duration_days: number | null
  min_pax: number | null
  price_krw: number | null
}) {
  const items = [
    { label: '거리', value: distance_km != null ? `${distance_km}km` : '-' },
    { label: '기간', value: duration_days != null ? `${duration_days}일` : '-' },
    { label: '최소인원', value: min_pax != null ? `${min_pax}명` : '-' },
    {
      label: '가격',
      value: price_krw != null ? `${price_krw.toLocaleString()}원~` : '-',
    },
  ]
  const icons = ['🗺️', '⏱️', '👥', '💰']
  return (
    <section className="mt-4 rounded-card bg-white p-4 shadow-card">
      <h1 className="text-xl font-bold text-rl-green">{name}</h1>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
        {items.map((item, i) => (
          <div key={item.label}>
            <p className="text-xs text-gray-400">
              {icons[i]} {item.label}
            </p>
            <p className="text-sm font-medium text-rl-green">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ----- Tour date card ----- */
function TourDateCard({
  date,
  onReserve,
}: {
  date: TourDate
  onReserve: (dateId: string) => void
}) {
  const remaining = (date.available_seats ?? 0) - (date.current_pax ?? 0)
  const isClosed = remaining <= 0

  return (
    <div className="flex items-center justify-between gap-3 rounded-btn border border-rl-green/10 bg-rl-bg p-3">
      <div>
        <p className="font-medium text-rl-green">
          {formatDeparture(date.departure_date)}
        </p>
        <p className="text-sm text-gray-500">
          {isClosed ? '마감' : `${remaining}석 남음`}
        </p>
      </div>
      <button
        type="button"
        disabled={isClosed}
        onClick={() => onReserve(date.id)}
        className="shrink-0 rounded-btn bg-rl-orange px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        예약하기
      </button>
    </div>
  )
}

/* ----- Review row ----- */
function ReviewRow({ review }: { review: Review }) {
  const stars = '★'.repeat(Math.min(5, Math.max(0, review.rating)))
  const dateStr =
    review.created_at != null
      ? new Date(review.created_at).toLocaleDateString('ko-KR')
      : ''
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <p className="text-sm text-rl-orange">{stars}</p>
      <p className="mt-1 text-sm text-rl-green">{review.content ?? '-'}</p>
      <p className="mt-1 text-xs text-gray-400">{dateStr}</p>
    </div>
  )
}

/* ----- CourseDetail ----- */
export function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tourDatesRef = useRef<HTMLElement>(null)

  const { data: course, isLoading: courseLoading, isError: courseError } = useCourse(id)
  const { data: tourDates = [], isLoading: datesLoading, isError: datesError } = useTourDates(id)
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => fetchReviews(id!),
    enabled: !!id,
  })

  // S4-04-D: 웨이포인트 조회 (오프라인 지도용)
  const { data: waypoints = [] } = useQuery({
    queryKey: ['waypoints', id],
    queryFn: () => fetchWaypoints(id!),
    enabled: !!id,
  })

  const photoUrl =
    course?.photos != null && Array.isArray(course.photos) && course.photos[0]
      ? course.photos[0]
      : null

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null

  if (courseLoading && !course) {
    return (
      <div className="min-h-full bg-rl-bg">
        <PhotoSkeleton />
        <div className="p-4">
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
        <p className="text-rl-green">코스 정보를 불러오지 못했습니다</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-3 rounded-btn bg-rl-green px-4 py-2 text-sm text-white"
        >
          뒤로 가기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-rl-bg pb-8">
      <CoursePhoto
        photoUrl={photoUrl}
        difficulty={course.difficulty}
        onBack={() => navigate(-1)}
      />

      <div className="px-4 pb-8">
        <CourseBasicInfo
          name={course.name_ko}
          distance_km={course.distance_km}
          duration_days={course.duration_days}
          min_pax={course.min_pax}
          price_krw={course.price_krw}
        />

        <div className="relative z-0">
          <MapboxMap
            courseId={id!}
            className="mt-4 h-64 w-full rounded-card overflow-hidden"
          />
        </div>

        {/* S4-04-D: 오프라인 지도 다운로드 */}
        {waypoints.length > 0 && (
          <div className="mt-3">
            <OfflineMapManager
              courseId={id!}
              waypoints={waypoints}
            />
          </div>
        )}

        {course.description_ko && (
          <section className="mt-4 rounded-card bg-white p-4 shadow-card">
            <h2 className="font-bold text-rl-green">코스 소개</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
              {course.description_ko}
            </p>
          </section>
        )}

        <section
          ref={tourDatesRef}
          className="mt-4 rounded-card bg-white p-4 shadow-card"
        >
          <h2 className="font-bold text-rl-green">출발 날짜 선택</h2>
          {datesLoading && (
            <div className="mt-3 space-y-2">
              <div className="h-14 animate-pulse rounded-btn bg-gray-200" />
              <div className="h-14 animate-pulse rounded-btn bg-gray-200" />
            </div>
          )}
          {!datesLoading && datesError && (
            <p className="mt-3 text-sm text-red-500">
              날짜 정보를 불러오지 못했습니다. 새로고침 해주세요.
            </p>
          )}
          {!datesLoading && !datesError && tourDates.length === 0 && (
            <p className="mt-3 text-sm text-gray-500">
              현재 예약 가능한 날짜가 없습니다
            </p>
          )}
          {!datesLoading && !datesError && tourDates.length > 0 && (
            <div className="mt-3 space-y-2">
              {tourDates.map((date) => (
                <TourDateCard
                  key={date.id}
                  date={date}
                  onReserve={(dateId) => navigate(`/booking/${dateId}`)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 mb-24 rounded-card bg-white p-4 shadow-card">
          <h2 className="font-bold text-rl-green">
            리뷰
            {avgRating != null && (
              <span className="ml-2 text-sm font-normal text-rl-orange">
                {avgRating.toFixed(1)}점
              </span>
            )}
          </h2>
          {reviewsLoading && (
            <div className="mt-3 h-20 animate-pulse rounded bg-gray-100" />
          )}
          {!reviewsLoading && reviews.length === 0 && (
            <p className="mt-3 text-sm text-gray-500">아직 리뷰가 없습니다</p>
          )}
          {!reviewsLoading && reviews.length > 0 && (
            <div className="mt-3">
              {reviews.map((review) => (
                <ReviewRow key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}