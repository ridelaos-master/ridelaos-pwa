import { useNavigate, Link } from 'react-router-dom'

/* ----- HeroBanner ----- */
function HeroBanner() {
  const navigate = useNavigate()
  return (
    <section
      className="relative h-64 w-full overflow-hidden rounded-b-2xl"
      style={{
        background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 p-4">
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

/* ----- Featured course type & static data ----- */
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface FeaturedCourse {
  id: string
  name: string
  difficulty: Difficulty
  period: string
  price: string
}

const FEATURED_COURSES: FeaturedCourse[] = [
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

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner: 'bg-green-500/90 text-white',
  intermediate: 'bg-amber-500/90 text-white',
  advanced: 'bg-red-500/90 text-white',
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
}

/* ----- FeaturedCourseCard ----- */
function FeaturedCourseCard({ course }: { course: FeaturedCourse }) {
  return (
    <article className="min-w-[200px] shrink-0 overflow-hidden rounded-card bg-white shadow-card">
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
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-rl-green">
        <span className="h-5 w-1 shrink-0 rounded-full bg-rl-orange" />
        추천 코스
      </h2>
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-3 pb-2">
          {FEATURED_COURSES.map((course) => (
            <FeaturedCourseCard key={course.id} course={course} />
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
function NoticeBanner() {
  return (
    <section className="rounded-btn border-l-4 border-rl-orange bg-rl-orange/10 p-4">
      <div className="flex items-start gap-3">
        <span className="text-lg" role="img" aria-label="공지">
          📢
        </span>
        <p className="text-sm text-rl-green">
          2026년 3월 투어 얼리버드 할인 진행 중! 선착순 10명 20% 할인
        </p>
      </div>
    </section>
  )
}

/* ----- Home ----- */
export function Home() {
  return (
    <div className="space-y-6 bg-rl-bg">
      <HeroBanner />
      <FeaturedCourses />
      <NoticeBanner />
    </div>
  )
}
