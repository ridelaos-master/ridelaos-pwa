import NotificationBanner from '../components/NotificationBanner'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFeaturedCourses, type FeaturedCourseRow } from '../hooks/useCourses'
import { COURSE_EN_DATA } from '../data/courseDataEn'

/* ----- HeroBanner ----- */
function HeroBanner() {
  const { t } = useTranslation()
  return (
    <section className="relative h-80 w-full overflow-hidden rounded-b-3xl">
      <img
        src="/images/hero-banner.png"
        alt="라오스 오토바이 투어"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-5">
        <div className="mb-3 flex gap-2">
          {[t('home.tag7courses'), t('home.tagSafety'), t('home.tag3years')].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold leading-tight text-white drop-shadow-lg">
          {t('home.heroTitle')}
        </h2>
        <p className="mt-1 text-sm text-white/90 drop-shadow">
          {t('home.heroSubtitle')}
        </p>
      </div>
    </section>
  )
}

/* ----- QuickMenu ----- */
function QuickMenu() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <section className="px-4">
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/courses')}
          className="flex flex-1 flex-col items-center gap-2 rounded-card bg-white py-4 shadow-card transition active:scale-95"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rl-green/10 text-2xl">
            🗺️
          </span>
          <span className="text-sm font-medium text-rl-green">{t('home.quickTour')}</span>
        </button>
        <button
          onClick={() => navigate('/rent')}
          className="flex flex-1 flex-col items-center gap-2 rounded-card bg-white py-4 shadow-card transition active:scale-95"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rl-orange/10 text-2xl">
            🏍️
          </span>
          <span className="text-sm font-medium text-rl-green">{t('home.quickRent')}</span>
        </button>
        <button
          onClick={() => navigate('/travel-info')}
          className="flex flex-1 flex-col items-center gap-2 rounded-card bg-white py-4 shadow-card transition active:scale-95"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
            📖
          </span>
          <span className="text-sm font-medium text-rl-green">{t('home.quickTravel')}</span>
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
  // English keys (filter)
  beginner: 'bg-green-500/90 text-white',
  intermediate: 'bg-amber-500/90 text-white',
  advanced: 'bg-red-500/90 text-white',
  // Korean keys (DB)
  '입문': 'bg-green-500/90 text-white',
  '초급': 'bg-green-500/90 text-white',
  '초중급': 'bg-amber-500/90 text-white',
  '중급': 'bg-amber-500/90 text-white',
  '중상급': 'bg-amber-500/90 text-white',
  '상급': 'bg-red-500/90 text-white',
  '최상급': 'bg-red-500/90 text-white',
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
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const enData = COURSE_EN_DATA[course.id]
  const difficulty = (course.difficulty ?? 'beginner') as string
  const period =
    course.duration_days != null ? t('courses.card.days', { count: course.duration_days }) : '-'
  const price =
    course.price_krw != null
      ? `₩${course.price_krw.toLocaleString()}`
      : '-'

  const displayName = isEn ? (enData?.name_en ?? course.name_ko) : course.name_ko
  const displayTagline = isEn
    ? (enData?.tagline_en ?? null)
    : (course.tagline ?? null)

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
          alt={displayName}
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
          {t(`courses.level.${difficulty}`, difficulty)}
        </span>
        <h3 className="mt-2 font-bold text-sm text-rl-green">
          {displayName}
        </h3>
        {displayTagline && (
          <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
            {displayTagline}
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
              <span className="text-xs text-gray-400">{t(`courses.level.${details.level_label}`, details.level_label)}</span>
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
  const { t } = useTranslation()
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
          {t(`courses.filter.${course.difficulty}`, course.difficulty)}
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
  const { t } = useTranslation()
  const { data, isLoading, isError } = useFeaturedCourses()

  const showFallback = isError || !data || data.length === 0

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-rl-green">
        <span className="h-5 w-1 shrink-0 rounded-full bg-rl-orange" />
        {t('home.featuredTitle')}
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
        {t('home.viewAll')}
      </Link>
    </section>
  )
}

/* ----- NoticeBanner ----- */
function NoticeBanner() {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <section className="rounded-btn border-l-4 border-rl-orange bg-rl-orange/10 p-4">
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0" role="img" aria-label="공지">
          📢
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-rl-green">{t('home.notification')}</p>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="shrink-0 rounded p-1 text-sm text-rl-green/50 transition hover:bg-rl-orange/20 hover:text-rl-green"
              aria-label="해당 공지 닫기"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----- Home ----- */
export function Home() {
  return (
    <div className="space-y-6 bg-rl-bg">
      <HeroBanner />
      <QuickMenu />
      <NotificationBanner />
      <FeaturedCourses />
      <NoticeBanner />
    </div>
  )
}