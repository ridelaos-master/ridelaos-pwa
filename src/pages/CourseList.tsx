import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCourses, type Course } from '../hooks/useCourses'
import { COURSE_EN_DATA } from '../data/courseDataEn'

/* ----- Filter: difficulty tab value ----- */
const DIFFICULTY_TAB_VALUES = ['', 'beginner', 'intermediate', 'advanced'] as const

const DIFFICULTY_BADGE_STYLES: Record<string, string> = {
  beginner: 'bg-green-500 text-white',
  intermediate: 'bg-amber-500 text-white',
  advanced: 'bg-red-500 text-white',
  '입문': 'bg-green-500 text-white',
  '초급': 'bg-green-500 text-white',
  '초중급': 'bg-amber-500 text-white',
  '중급': 'bg-amber-500 text-white',
  '중상급': 'bg-amber-500 text-white',
  '상급': 'bg-red-500 text-white',
  '최상급': 'bg-red-500 text-white',
}

/* ----- FilterTabs (IMPROVED: 개수 표시 추가) ----- */
function FilterTabs({
  value,
  onChange,
  counts,
}: {
  value: string
  onChange: (v: string) => void
  counts: Record<string, number>
}) {
  const { t } = useTranslation()
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2">
      <div className="flex gap-2">
        {DIFFICULTY_TAB_VALUES.map((tabValue) => {
          const filterKey = tabValue || 'all'
          const count = tabValue === '' ? counts.all : (counts[tabValue] ?? 0)
          return (
            <button
              key={filterKey}
              type="button"
              onClick={() => onChange(tabValue)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                value === tabValue
                  ? 'bg-rl-green text-white'
                  : 'border border-rl-green/30 bg-white text-rl-green hover:bg-rl-bg'
              }`}
            >
              {t(`courses.filter.${filterKey}`)}
              <span className="ml-1 text-xs opacity-70">{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ----- SkeletonCard ----- */
function SkeletonCard() {
  return (
    <div className="h-64 animate-pulse rounded-card bg-gray-200" />
  )
}

/* ----- Level stars helper ----- */
function LevelStars({ stars }: { stars: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-xs ${i < stars ? 'text-rl-orange' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </span>
  )
}

/* ----- CourseCard (IMPROVED: tagline, photos, level stars) ----- */
function CourseCard({ course }: { course: Course }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const enData = COURSE_EN_DATA[course.id]
  const difficulty = (course.difficulty ?? 'beginner') as string
  const distance =
    course.distance_km != null ? `${course.distance_km}km` : '-'
  const period =
    course.duration_days != null ? t('courses.card.days', { count: course.duration_days }) : '-'
  const minPax = course.min_pax != null ? t('courses.card.minPax', { count: course.min_pax }) : ''
  const price =
    course.price_krw != null
      ? `₩${course.price_krw.toLocaleString()}`
      : '-'

  // tagline (S6-01) — EN 분기
  const tagline = isEn
    ? (enData?.tagline_en ?? null)
    : ((course as Record<string, unknown>).tagline as string | null)

  // details에서 level 정보 추출
  const details = (course as Record<string, unknown>).details as Record<string, unknown> | null
  const levelStars = details?.level_stars as number | null
  const levelLabel = details?.level_label as string | null

  // 첫 번째 사진 URL
  const photoUrl =
    course.photos != null && Array.isArray(course.photos) && course.photos[0]
      ? course.photos[0]
      : null

  return (
    <Link
      to={`/courses/${course.id}`}
      className="block overflow-hidden rounded-card bg-white shadow-card transition hover:shadow-md"
    >
      {/* 썸네일 */}
      <div className="relative h-44 w-full overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={course.name_ko}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.style.background =
                  'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)'
              }
            }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
            }}
          />
        )}
        {/* 난이도 배지 */}
        <span
          className={`absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_BADGE_STYLES[difficulty] ?? DIFFICULTY_BADGE_STYLES.beginner}`}
        >
          {t(`courses.level.${difficulty}`, difficulty)}
        </span>
        {/* 기간/거리 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6">
          <div className="flex items-center gap-2 text-xs text-white/90">
            <span>🗺️ {distance}</span>
            <span>·</span>
            <span>⏱️ {period}</span>
          </div>
        </div>
      </div>

      {/* 카드 본문 */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base text-rl-green">{isEn ? (enData?.name_en ?? course.name_ko) : course.name_ko}</h3>
          {levelStars != null && (
            <div className="shrink-0 flex flex-col items-end">
              <LevelStars stars={levelStars} />
              {levelLabel && (
                <span className="text-xs text-gray-400 mt-0.5">{t(`courses.level.${levelLabel}`, levelLabel)}</span>
              )}
            </div>
          )}
        </div>

        {tagline && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{tagline}</p>
        )}

        <div className="mt-3 flex items-end justify-between">
          <div>
            {minPax && (
              <p className="text-xs text-gray-400">{minPax}</p>
            )}
          </div>
          <p className="font-bold text-lg text-rl-orange">{price}</p>
        </div>
      </div>
    </Link>
  )
}

/* ----- CourseList ----- */
export function CourseList() {
  const { t } = useTranslation()
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const { data: courses = [], isLoading, isError, refetch } = useCourses()

  const filteredCourses = useMemo(() => {
    if (!difficultyFilter) return courses
    return courses.filter((c) => (c.difficulty ?? '') === difficultyFilter)
  }, [courses, difficultyFilter])

  // 필터 탭에 개수 표시
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: courses.length }
    for (const course of courses) {
      const d = course.difficulty ?? 'beginner'
      c[d] = (c[d] ?? 0) + 1
    }
    return c
  }, [courses])

  return (
    <div className="min-h-full bg-rl-bg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-rl-green">{t('courses.title')}</h1>
        <span className="text-sm text-gray-400">{t('courses.card.count', { count: courses.length })}</span>
      </div>

      <FilterTabs
        value={difficultyFilter}
        onChange={setDifficultyFilter}
        counts={counts}
      />

      <div className="mt-4 space-y-4">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!isLoading && isError && (
          <div className="rounded-card bg-white p-6 text-center shadow-card">
            <p className="text-rl-green">{t('courses.card.loadError')}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-btn bg-rl-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t('courses.card.retry')}
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredCourses.length === 0 && (
          <div className="rounded-card bg-white p-6 text-center shadow-card">
            <p className="text-gray-500">{t('courses.card.noResult')}</p>
          </div>
        )}

        {!isLoading && !isError && filteredCourses.length > 0 && (
          <>
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
