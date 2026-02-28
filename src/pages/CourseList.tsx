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

/* ----- FilterTabs ----- */
function FilterTabs({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2">
      <div className="flex gap-2">
        {DIFFICULTY_TABS.map((tab) => (
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
          </button>
        ))}
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

/* ----- CourseCard ----- */
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

  return (
    <Link
      to={`/courses/${course.id}`}
      className="block overflow-hidden rounded-card bg-white shadow-card transition hover:shadow-md"
    >
      <div className="relative h-40 w-full">
        <div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
          }}
        />
        <span
          className={`absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_BADGE_STYLES[difficulty] ?? DIFFICULTY_BADGE_STYLES.beginner}`}
        >
          {DIFFICULTY_LABEL[difficulty] ?? '입문'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base text-rl-green">{course.name_ko}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {distance} · {period}
        </p>
        {minPax && (
          <p className="mt-0.5 text-xs text-gray-400">{minPax}</p>
        )}
        <p className="mt-2 font-bold text-lg text-rl-orange">{price}</p>
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

  return (
    <div className="min-h-full bg-rl-bg">
      <h1 className="mb-4 text-xl font-bold text-rl-green">코스 목록</h1>

      <FilterTabs value={difficultyFilter} onChange={setDifficultyFilter} />

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
