import { useCourses } from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';

export default function RideHomePage() {
  const { courses, isLoading, error, refetch, isEnvOk } = useCourses();

  if (!isEnvOk) {
    return (
      <div className="min-h-full bg-rl-bg p-4">
        <div className="rounded-card bg-white shadow-card p-6 border border-rl-error/30">
          <p className="text-rl-green font-semibold mb-1">환경 설정 안내</p>
          <p className="text-neutral-600 text-sm">{error}</p>
          <p className="text-neutral-500 text-xs mt-3">
            프로젝트 루트에 .env.local 파일을 만들고 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 설정해 주세요.
          </p>
        </div>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="min-h-full bg-rl-bg p-4">
        <div className="rounded-card bg-white shadow-card p-6 border border-rl-error/30">
          <p className="text-rl-green font-semibold mb-1">데이터를 불러올 수 없습니다</p>
          <p className="text-neutral-600 text-sm">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 px-4 py-2 rounded-btn bg-rl-green text-white text-sm font-medium hover:bg-rl-green-mid transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-rl-bg p-4 pb-6">
      <section className="mb-6">
        <h2 className="text-rl-green font-semibold text-lg mb-3">추천 코스</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-card bg-white shadow-card overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-rl-green/10" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-1/4 bg-rl-green/20 rounded" />
                  <div className="h-5 w-3/4 bg-rl-green/20 rounded" />
                  <div className="h-4 w-1/3 bg-rl-green/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-card bg-white shadow-card p-8 text-center text-neutral-500">
            <p>등록된 코스가 없습니다.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {courses.map((course) => (
              <li key={course.id}>
                <CourseCard course={course} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
