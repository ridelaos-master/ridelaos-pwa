import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCourses, type Course } from '../hooks/useCourses'

/* ----- Filter: difficulty tab value ----- */
const DIFFICULTY_TABS = [
  { value: '', label: '전체' },
  { value: 'beginner', label: '입문' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
] as const

const DIFFICULTY_BADGE_STYLES: Record<string, string> = {
  beginner: 'bg-green-500 text-white',
  intermediate: 'bg-amber-500 text-white',
  advanced: 'bg-red-500 text-white',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
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
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2">
      <div className="flex gap-2">
        {DIFFICULTY_TABS.map((tab) => {
          const count = tab.value === '' ? counts.all : (counts[tab.value] ?? 0)
          return (
            <button
              key={tab.value || 'all'}
              type="button"
              onClick={() => onChange(tab.value)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                value === tab.value
                  ? 'bg-rl-green text-white'
                  : 'border border-rl-green/30 bg-white text-rl-green hover:bg-rl-bg'
              }`}
            >
              {tab.label}
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
  const difficulty = (course.difficulty ?? 'beginner') as string
  const distance =
    course.distance_km != null ? `${course.distance_km}km` : '-'
  const period =
    course.duration_days != null ? `${course.duration_days}일` : '-'
  const minPax = course.min_pax != null ? `최소 ${course.min_pax}명` : ''
  const price =
    course.price_krw != null
      ? `₩${course.price_krw.toLocaleString()}`
      : '-'

  // tagline (S6-01)
  const tagline = (course as Record<string, unknown>).tagline as string | null

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
          {DIFFICULTY_LABEL[difficulty] ?? '입문'}
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
          <h3 className="font-bold text-base text-rl-green">{course.name_ko}</h3>
          {levelStars != null && (
            <div className="shrink-0 flex flex-col items-end">
              <LevelStars stars={levelStars} />
              {levelLabel && (
                <span className="text-xs text-gray-400 mt-0.5">{levelLabel}</span>
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
        <h1 className="text-xl font-bold text-rl-green">코스 목록</h1>
        <span className="text-sm text-gray-400">{courses.length}개 코스</span>
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
            <p className="text-rl-green">코스를 불러오지 못했습니다</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-btn bg-rl-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              재시도
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredCourses.length === 0 && (
          <div className="rounded-card bg-white p-6 text-center shadow-card">
            <p className="text-gray-500">해당하는 코스가 없습니다</p>
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
