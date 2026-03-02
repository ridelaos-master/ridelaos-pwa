import NotificationBanner from '../components/NotificationBanner'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFeaturedCourses, type FeaturedCourseRow } from '../hooks/useCourses'

/* ----- HeroBanner ----- */
function HeroBanner() {
  const navigate = useNavigate()
  return (
    <section
      className="relative h-72 w-full overflow-hidden rounded-b-2xl"
      style={{
        background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
      }}
    >
      <span
        className="absolute bottom-4 right-4 text-6xl opacity-20"
        role="img"
        aria-hidden
      >
        🚗
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white">
            7개 코스
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white">
            3년 연속
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white">
            안전 최우선
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">라오스를 달리다</h2>
        <p className="mt-1 text-sm text-white/80">
          오토바이로 만나는 라오스의 속살
        </p>
        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="mt-3 rounded-btn bg-rl-orange px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
        >
          코스 보기
        </button>
      </div>
    </section>
  )
}

/* ----- Featured course: fallback type & static data ----- */
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface FeaturedCourseFallback {
  id: string
  name: string
  difficulty: Difficulty
  period: string
  price: string
}

const FEATURED_COURSES_FALLBACK: FeaturedCourseFallback[] = [
  {
    id: 'vientiane-vangvieng',
    name: '비엔티안 - 방비엥',
    difficulty: 'beginner',
    period: '2박 3일',
    price: '₩480,000',
  },
  {
    id: 'thakhek-loop',
    name: '타켓 루프',
    difficulty: 'intermediate',
    period: '3박 4일',
    price: '₩1,100,000',
  },
  {
    id: 'bolaven-plateau',
    name: '볼라벤 고원',
    difficulty: 'advanced',
    period: '4박 5일',
    price: '₩980,000',
  },
]

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-500/90 text-white',
  intermediate: 'bg-amber-500/90 text-white',
  advanced: 'bg-red-500/90 text-white',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
}

/* ----- Skeleton card ----- */
function FeaturedCourseCardSkeleton() {
  return (
    <div className="min-w-[200px] h-36 shrink-0 animate-pulse rounded-card bg-gray-200" />
  )
}

/* ----- FeaturedCourseCard (API row) ----- */
function FeaturedCourseCard({
  course,
  onClick,
}: {
  course: FeaturedCourseRow
  onClick: () => void
}) {
  const difficulty = (course.difficulty ?? 'beginner') as string
  const period =
    course.duration_days != null ? `${course.duration_days}일` : '-'
  const price =
    course.price_krw != null
      ? `₩${course.price_krw.toLocaleString()}`
      : '-'

  const photoUrl =
    course.photos != null && Array.isArray(course.photos) && course.photos[0]
      ? course.photos[0]
      : null

  const details =
    course.details && typeof course.details === 'object' && Object.keys(course.details).length > 0
      ? (course.details as { level_stars?: number; level_label?: string })
      : null

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className="min-w-[200px] shrink-0 cursor-pointer overflow-hidden rounded-card bg-white shadow-card transition hover:shadow-md"
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={course.name_ko}
          className="h-24 w-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            if (target.parentElement) {
              const div = document.createElement('div')
              div.className = 'h-24 w-full'
              div.style.background = 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)'
              target.parentElement.insertBefore(div, target)
            }
          }}
        />
      ) : (
        <div
          className="h-24 w-full"
          style={{
            background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
          }}
        />
      )}
      <div className="p-3">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[difficulty] ?? DIFFICULTY_STYLES.beginner}`}
        >
          {DIFFICULTY_LABEL[difficulty] ?? '입문'}
        </span>
        <h3 className="mt-2 font-bold text-sm text-rl-green">
          {course.name_ko}
        </h3>
        {course.tagline && (
          <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
            {course.tagline}
          </p>
        )}
        {details?.level_stars != null && (
          <div className="mt-1 flex items-center gap-1">
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-xs ${i < (details.level_stars ?? 0) ? 'text-rl-orange' : 'text-gray-300'}`}>★</span>
              ))}
            </span>
            {details.level_label && (
              <span className="text-xs text-gray-400">{details.level_label}</span>
            )}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {period} · {price}
        </p>
      </div>
    </article>
  )
}

/* ----- FeaturedCourseCard (fallback) ----- */
function FeaturedCourseCardFallback({
  course,
  onClick,
}: {
  course: FeaturedCourseFallback
  onClick: () => void
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className="min-w-[200px] shrink-0 cursor-pointer overflow-hidden rounded-card bg-white shadow-card transition hover:shadow-md"
    >
      <div
        className="h-24 w-full"
        style={{
          background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
        }}
      />
      <div className="p-3">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[course.difficulty]}`}
        >
          {DIFFICULTY_LABEL[course.difficulty]}
        </span>
        <h3 className="mt-2 font-bold text-sm text-rl-green">{course.name}</h3>
        <p className="mt-1 text-xs text-gray-500">
          {course.period} · {course.price}
        </p>
      </div>
    </article>
  )
}

/* ----- FeaturedCourses ----- */
function FeaturedCourses() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useFeaturedCourses()

  const showFallback = isError || !data || data.length === 0

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-rl-green">
        <span className="h-5 w-1 shrink-0 rounded-full bg-rl-orange" />
        추천 코스
      </h2>
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-3 pb-2">
          {isLoading && (
            <>
              <FeaturedCourseCardSkeleton />
              <FeaturedCourseCardSkeleton />
              <FeaturedCourseCardSkeleton />
            </>
          )}
          {!isLoading && showFallback &&
            FEATURED_COURSES_FALLBACK.map((course) => (
              <FeaturedCourseCardFallback
                key={course.id}
                course={course}
                onClick={() => navigate(`/courses/${course.id}`)}
              />
            ))}
          {!isLoading && !showFallback &&
            data.map((course) => (
              <FeaturedCourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(`/courses/${course.id}`)}
              />
            ))}
        </div>
      </div>
      <Link
        to="/courses"
        className="inline-block text-sm font-medium text-rl-green-mid underline underline-offset-2 hover:text-rl-green"
      >
        전체 코스 보기
      </Link>
    </section>
  )
}

/* ----- NoticeBanner ----- */
const NOTICES = [
  '2026년 3월 투어 얼리버드 할인 진행 중! 선착순 10명 20% 할인',
] as const

function NoticeBanner() {
  const [dismissed, setDismissed] = useState<boolean[]>(() =>
    NOTICES.map(() => false)
  )

  const handleDismiss = (index: number) => {
    setDismissed((prev) => {
      const next = [...prev]
      next[index] = true
      return next
    })
  }

  const visibleNotices = NOTICES.map((text, i) => ({ text, i })).filter(
    (_, i) => !dismissed[i]
  )

  if (visibleNotices.length === 0) return null

  return (
    <section className="rounded-btn border-l-4 border-rl-orange bg-rl-orange/10 p-4">
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0" role="img" aria-label="공지">
          📢
        </span>
        <ul className="min-w-0 flex-1 space-y-2">
          {visibleNotices.map(({ text, i }) => (
            <li
              key={i}
              className="flex items-start justify-between gap-2"
            >
              <p className="text-sm text-rl-green">{text}</p>
              <button
                type="button"
                onClick={() => handleDismiss(i)}
                className="shrink-0 rounded p-1 text-sm text-rl-green/50 transition hover:bg-rl-orange/20 hover:text-rl-green"
                aria-label="해당 공지 닫기"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ----- Home ----- */
export function Home() {
  return (
    <div className="space-y-6 bg-rl-bg">
      <HeroBanner />
      <NotificationBanner />
      <FeaturedCourses />
      <NoticeBanner />
    </div>
  )
}