import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const CATEGORIES = [
  { id: 'weather', icon: '🌤️', name: '날씨·시즌' },
  { id: 'regions', icon: '🗺️', name: '지역 정보' },
  { id: 'money', icon: '💰', name: '환전·결제' },
  { id: 'telecom', icon: '📱', name: '통신·인터넷' },
  { id: 'bike-maintenance', icon: '🏍️', name: '오토바이 정비' },
  { id: 'roads', icon: '⛽', name: '주유·도로' },
  { id: 'medical', icon: '🏥', name: '의료·안전' },
  { id: 'food', icon: '🍜', name: '음식·맛집' },
  { id: 'history', icon: '🏛️', name: '역사·문화' },
  { id: 'language', icon: '🗣️', name: '라오스어' },
  { id: 'visa', icon: '🛂', name: '비자·입국' },
  { id: 'packing', icon: '🎒', name: '준비물·짐싸기' },
]

export function TravelInfo() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-rl-bg font-sans text-rl-green">
      <header className="flex h-14 shrink-0 items-center bg-rl-green px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full p-2 text-white transition hover:opacity-90"
          aria-label="뒤로 가기"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">
          여행 정보
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      <main className="flex-1 px-4 pb-8">
        {/* 안내 섹션 */}
        <section className="mt-4 rounded-card bg-white p-4 shadow-card">
          <h2 className="font-bold text-rl-green">📖 라오스 여행 정보</h2>
          <p className="mt-2 text-sm text-gray-500">
            라오스 오토바이 투어를 위한 필수 정보를 카테고리별로 확인하세요.
            날씨, 도로 상황, 비자, 환전 등 여행 전 꼭 알아야 할 정보를 모았습니다.
          </p>
        </section>

        {/* 카테고리 그리드 */}
        <section className="mt-4">
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/travel-info/${cat.id}`)}
                className="flex flex-col items-center gap-2 rounded-card bg-white py-5 shadow-card transition active:scale-95"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rl-green/10 text-2xl">
                  {cat.icon}
                </span>
                <span className="text-xs font-medium text-rl-green">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
