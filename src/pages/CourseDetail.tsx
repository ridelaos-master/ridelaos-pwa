import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCourse } from '../hooks/useCourses'
import { useTourDates, type TourDate } from '../hooks/useTourDates'
import { MapboxMap } from '../components/MapboxMap'
import OfflineMapManager from '../components/OfflineMapManager'
import { supabase } from '../lib/supabase'
import type { CourseWaypoint } from '../hooks/useOfflineMap'

/* ===== Types ===== */
interface ItineraryDay {
  day: number
  title: string
  description: string
  distance_km: number
  highlight?: boolean
  tip?: string
}

interface CourseDetails {
  level_stars: number
  level_label: string
  core_value: string
  highlights: string[]
  itinerary: ItineraryDay[]
  includes: string[]
  excludes: string[]
  requirements: string[]
  recommended_for: string[]
  packing_tips: string[]
  photo_points: string[]
  meeting_point: string
  insurance_notice: string
}

/* ===== Constants ===== */
const COMMON_INCLUDES = [
  'Honda CRF250L 대여',
  '헬멧 및 기본 보호장비',
  '2인 1실 숙박 (등급 업그레이드 가능)',
  '전문 가이드 동행',
  '비상 지원 차량',
  '현지 기본 보험',
]

const COMMON_EXCLUDES = [
  '항공권 및 라오스 입국 비자',
  '개인 음료 및 주류',
  '개인 여행자 보험',
]

/* ===== Helpers (기존 유지) ===== */
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

/* ===== Review type & fetch (기존 유지) ===== */
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

/* ===== Waypoints fetch (S4-04-D, 기존 유지) ===== */
async function fetchWaypoints(courseId: string): Promise<CourseWaypoint[]> {
  const { data, error } = await supabase
    .from('course_waypoints')
    .select('*')
    .eq('course_id', courseId)
    .order('type', { ascending: true })

  if (error) throw error
  return (data ?? []) as CourseWaypoint[]
}

/* ===== Photo skeleton (기존 유지) ===== */
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

/* ===== Photo area (기존 유지) ===== */
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

/* ===== Level Badge (NEW) ===== */
function LevelBadge({ stars, label }: { stars: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-rl-green/10 px-3 py-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-sm ${i < stars ? 'text-rl-orange' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
      <span className="text-xs font-medium text-rl-green">{label}</span>
    </div>
  )
}

/* ===== Basic info (UPDATED: tagline + level + rating 추가) ===== */
function CourseBasicInfo({
  name,
  tagline,
  coreValue,
  levelStars,
  levelLabel,
  distance_km,
  duration_days,
  min_pax,
  price_krw,
  avgRating,
  reviewCount,
}: {
  name: string
  tagline: string | null
  coreValue: string | null
  levelStars: number | null
  levelLabel: string | null
  distance_km: number | null
  duration_days: number | null
  min_pax: number | null
  price_krw: number | null
  avgRating: number | null
  reviewCount: number
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

      {tagline && (
        <p className="mt-1 text-sm text-gray-500">{tagline}</p>
      )}

      {coreValue && (
        <p className="mt-1.5 text-sm font-semibold text-rl-orange">
          "{coreValue}"
        </p>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {levelStars != null && levelLabel && (
          <LevelBadge stars={levelStars} label={levelLabel} />
        )}
        {avgRating != null && (
          <span className="inline-flex items-center gap-1 text-sm text-gray-500">
            <span className="text-rl-orange">★</span>
            {avgRating.toFixed(1)}
            <span className="text-xs">({reviewCount})</span>
          </span>
        )}
      </div>

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

/* ===== Highlights (NEW) ===== */
function HighlightsSection({ items }: { items: string[] }) {
  return (
    <section className="mt-4 rounded-card bg-white p-4 shadow-card">
      <h2 className="font-bold text-rl-green">✨ 코스 하이라이트</h2>
      <div className="mt-3 space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 rounded-lg bg-rl-orange/10 p-3"
          >
            <span className="mt-0.5 font-bold text-rl-orange">▸</span>
            <span className="text-sm leading-relaxed text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ===== Itinerary Accordion (NEW) ===== */
function ItinerarySection({ days }: { days: ItineraryDay[] }) {
  const [openDay, setOpenDay] = useState<number | null>(0)

  return (
    <section className="mt-4 rounded-card bg-white p-4 shadow-card">
      <h2 className="font-bold text-rl-green">📅 상세 일정</h2>
      <div className="mt-3 space-y-2">
        {days.map((day, idx) => {
          const isOpen = openDay === idx
          return (
            <div
              key={day.day}
              className={`overflow-hidden rounded-xl border transition-all ${
                day.highlight
                  ? 'border-rl-orange/40 bg-rl-orange/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenDay(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                      day.highlight ? 'bg-rl-orange' : 'bg-rl-green'
                    }`}
                  >
                    {day.day}
                  </span>
                  <div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-rl-green">
                      {day.highlight && '⭐ '}Day {day.day}
                    </span>
                    <span className="text-xs text-gray-500">{day.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xs">{day.distance_km}km</span>
                  <span className="text-sm">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 px-3 pb-3 pt-2">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {day.description}
                  </p>
                  {day.tip && (
                    <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-blue-50 p-2.5">
                      <span className="text-base">💡</span>
                      <div>
                        <span className="text-xs font-semibold text-blue-700">운영 팁</span>
                        <p className="mt-0.5 text-xs text-blue-600">{day.tip}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ===== Includes / Excludes 2-column (NEW) ===== */
function IncludesExcludesSection({
  includes,
  excludes,
}: {
  includes: string[]
  excludes: string[]
}) {
  const allIncludes = [...COMMON_INCLUDES, ...includes]
  const allExcludes = [...COMMON_EXCLUDES, ...excludes]

  return (
    <section className="mt-4 rounded-card bg-white p-4 shadow-card">
      <h2 className="font-bold text-rl-green">📦 포함 / 불포함</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-green-50 p-3">
          <h3 className="mb-2 flex items-center gap-1 text-sm font-bold text-green-800">
            <span className="text-green-600">✓</span> 포함사항
          </h3>
          <ul className="space-y-1.5">
            {allIncludes.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="mt-0.5 text-xs text-green-500">✓</span>
                <span className="text-xs leading-relaxed text-green-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-red-50 p-3">
          <h3 className="mb-2 flex items-center gap-1 text-sm font-bold text-red-800">
            <span className="text-red-500">✗</span> 불포함
          </h3>
          <ul className="space-y-1.5">
            {allExcludes.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="mt-0.5 text-xs text-red-400">✗</span>
                <span className="text-xs leading-relaxed text-red-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ===== Insurance Notice (NEW) ===== */
function InsuranceNotice({ text }: { text: string }) {
  return (
    <div className="mt-3 mx-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3">
      <div className="flex items-start gap-2">
        <span className="text-base">⚠️</span>
        <div>
          <span className="text-sm font-bold text-amber-800">보험 안내</span>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-700">{text}</p>
        </div>
      </div>
    </div>
  )
}

/* ===== Requirements + Recommended (NEW) ===== */
function RequirementsSection({
  requirements,
  recommendedFor,
}: {
  requirements: string[]
  recommendedFor: string[]
}) {
  return (
    <section className="mt-4 rounded-card bg-white p-4 shadow-card">
      {requirements.length > 0 && (
        <div>
          <h2 className="font-bold text-rl-green">🛡️ 참가 요건</h2>
          <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <ul className="space-y-1.5">
              {requirements.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 text-xs text-amber-500">⚠</span>
                  <span className="text-sm text-amber-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {recommendedFor.length > 0 && (
        <div className={requirements.length > 0 ? 'mt-4' : ''}>
          <h3 className="text-sm font-bold text-rl-green">🎯 이런 분께 추천합니다</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {recommendedFor.map((item, i) => (
              <span
                key={i}
                className="rounded-full bg-rl-green/10 px-3 py-1 text-xs font-medium text-rl-green"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

/* ===== Packing Tips + Photo Points (collapsible, NEW) ===== */
function PackingPhotoSection({
  packingTips,
  photoPoints,
}: {
  packingTips: string[]
  photoPoints: string[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="mt-4 rounded-card bg-white shadow-card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="text-sm font-bold text-rl-green">
          🎒 준비물 & 📸 사진포인트
        </span>
        <span className="text-sm text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-gray-100 px-4 pb-4 pt-3">
          {packingTips.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">추천 준비물</h4>
              <div className="flex flex-wrap gap-2">
                {packingTips.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs text-gray-700"
                  >
                    🎒 {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {photoPoints.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">추천 사진 포인트</h4>
              <div className="flex flex-wrap gap-2">
                {photoPoints.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-lg bg-rl-orange/10 px-2.5 py-1.5 text-xs font-medium text-rl-orange"
                  >
                    📸 {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

/* ===== Meeting Point (NEW) ===== */
function MeetingPointSection({ point }: { point: string }) {
  return (
    <section className="mt-4 rounded-card bg-rl-green p-4 shadow-card">
      <h2 className="font-bold text-white">📍 집결지</h2>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-2xl">🏁</span>
        <div>
          <p className="font-medium text-white">{point}</p>
          <p className="mt-0.5 text-xs text-white/60">출발 당일 오전 집합</p>
        </div>
      </div>
    </section>
  )
}

/* ===== Tour date card (기존 유지) ===== */
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

/* ===== Review row (기존 유지) ===== */
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

/* ================================================ */
/* ===== CourseDetail Main Component ============== */
/* ================================================ */
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

  // details JSON 파싱 (하위호환: null이거나 빈 객체면 무시)
  const details: CourseDetails | null =
    course?.details && typeof course.details === 'object' && Object.keys(course.details).length > 0
      ? (course.details as CourseDetails)
      : null

  /* ----- Loading ----- */
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

  /* ----- Error ----- */
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

  /* ----- Render ----- */
  return (
    <div className="min-h-full bg-rl-bg pb-8">
      {/* ━━━ 1. 사진 ━━━ */}
      <CoursePhoto
        photoUrl={photoUrl}
        difficulty={course.difficulty}
        onBack={() => navigate(-1)}
      />

      <div className="px-4 pb-8">
        {/* ━━━ 2+3. 코스명 + 태그라인 + 레벨 + 기본정보 ━━━ */}
        <CourseBasicInfo
          name={course.name_ko}
          tagline={course.tagline ?? null}
          coreValue={details?.core_value ?? null}
          levelStars={details?.level_stars ?? null}
          levelLabel={details?.level_label ?? null}
          distance_km={course.distance_km}
          duration_days={course.duration_days}
          min_pax={course.min_pax}
          price_krw={course.price_krw}
          avgRating={avgRating}
          reviewCount={reviews.length}
        />

        {/* ━━━ Details 기반 섹션 (details 있을 때만) ━━━ */}
        {details ? (
          <>
            {/* 4. 하이라이트 */}
            {details.highlights?.length > 0 && (
              <HighlightsSection items={details.highlights} />
            )}

            {/* 5. 일정표 아코디언 */}
            {details.itinerary?.length > 0 && (
              <ItinerarySection days={details.itinerary} />
            )}

            {/* 6. 포함/불포함 2컬럼 */}
            <IncludesExcludesSection
              includes={details.includes ?? []}
              excludes={details.excludes ?? []}
            />

            {/* 7. 보험 안내 경고 박스 */}
            {details.insurance_notice && (
              <InsuranceNotice text={details.insurance_notice} />
            )}

            {/* 8. 참가요건 + 추천대상 */}
            {((details.requirements?.length ?? 0) > 0 ||
              (details.recommended_for?.length ?? 0) > 0) && (
              <RequirementsSection
                requirements={details.requirements ?? []}
                recommendedFor={details.recommended_for ?? []}
              />
            )}

            {/* 9. 준비물 + 사진포인트 (접기) */}
            {((details.packing_tips?.length ?? 0) > 0 ||
              (details.photo_points?.length ?? 0) > 0) && (
              <PackingPhotoSection
                packingTips={details.packing_tips ?? []}
                photoPoints={details.photo_points ?? []}
              />
            )}

            {/* 10. 집결지 */}
            {details.meeting_point && (
              <MeetingPointSection point={details.meeting_point} />
            )}
          </>
        ) : (
          /* ━━━ Fallback: details 없으면 기존 description_ko ━━━ */
          course.description_ko && (
            <section className="mt-4 rounded-card bg-white p-4 shadow-card">
              <h2 className="font-bold text-rl-green">코스 소개</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                {course.description_ko}
              </p>
            </section>
          )
        )}

        {/* ━━━ 11. 지도 ━━━ */}
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

        {/* ━━━ 12. 출발 날짜 ━━━ */}
        <section
          ref={tourDatesRef}
          className="mt-4 rounded-card bg-white p-4 shadow-card"
        >
          <h2 className="font-bold text-rl-green">🗓️ 출발 날짜 선택</h2>
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

        {/* ━━━ 13. 리뷰 ━━━ */}
        <section className="mt-4 mb-24 rounded-card bg-white p-4 shadow-card">
          <h2 className="font-bold text-rl-green">
            ⭐ 리뷰
            {avgRating != null && (
              <span className="ml-2 text-sm font-normal text-rl-orange">
                {avgRating.toFixed(1)}점 ({reviews.length}건)
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
