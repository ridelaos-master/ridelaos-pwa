import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Phone, MessageCircle } from 'lucide-react'

const BIKES = [
  {
    id: 1,
    name: 'Honda CRF250L',
    category: '어드벤처',
    engine: '250cc',
    description: '오프로드와 장거리 투어에 최적화된 듀얼퍼포즈 바이크',
    pricePerDay: 50,
    priceUnit: 'USD',
    features: ['오프로드 가능', '경량 바디', 'ABS 장착'],
    available: true,
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=250&fit=crop',
  },
  {
    id: 2,
    name: 'Honda CRF300L',
    category: '어드벤처',
    engine: '300cc',
    description: 'CRF250L의 업그레이드 버전. 더 강력한 토크와 편안한 시트',
    pricePerDay: 60,
    priceUnit: 'USD',
    features: ['오프로드 가능', '장거리 편안', 'ABS 장착'],
    available: true,
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=400&h=250&fit=crop',
  },
  {
    id: 3,
    name: 'Honda Wave 125',
    category: '시티/근교',
    engine: '125cc',
    description: '비엔티안 시내와 근교 여행에 적합한 가벼운 스쿠터',
    pricePerDay: 15,
    priceUnit: 'USD',
    features: ['연비 우수', '초보 가능', '시내 이동'],
    available: true,
    image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?w=400&h=250&fit=crop',
  },
  {
    id: 4,
    name: 'Honda CB500X',
    category: '투어링',
    engine: '500cc',
    description: '장거리 투어링에 최적. 편안한 라이딩 포지션과 충분한 파워',
    pricePerDay: 80,
    priceUnit: 'USD',
    features: ['장거리 투어링', '편안한 시트', 'ABS 장착'],
    available: false,
    image: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=400&h=250&fit=crop',
  },
]

function BikeCard({ bike }: { bike: typeof BIKES[0] }) {
  return (
    <div className={`rounded-card bg-white p-4 shadow-card ${!bike.available ? 'opacity-60' : ''}`}>
      {/* 이미지 영역 */}
      <img
        src={bike.image}
        alt={bike.name}
        className="h-40 w-full rounded-lg object-cover"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const fallback = document.createElement('div')
          fallback.className = 'flex h-40 items-center justify-center rounded-lg bg-gray-100'
          fallback.innerHTML = '<span class="text-5xl">🏍️</span>'
          target.parentElement?.insertBefore(fallback, target)
        }}
      />

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-rl-green">{bike.name}</h3>
          <span className="rounded-full bg-rl-green/10 px-2 py-0.5 text-xs font-medium text-rl-green">
            {bike.engine}
          </span>
        </div>

        <span className="mt-1 inline-block rounded bg-rl-orange/10 px-2 py-0.5 text-xs text-rl-orange">
          {bike.category}
        </span>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{bike.description}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {bike.features.map((f) => (
            <span key={f} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {f}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <span className="text-lg font-bold text-rl-orange">${bike.pricePerDay}</span>
            <span className="text-sm text-gray-400"> /일</span>
          </div>
          {bike.available ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              대여 가능
            </span>
          ) : (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
              준비중
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function BikeRental() {
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
          바이크 렌트
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      <main className="flex-1 px-4 pb-32">
        {/* 안내 섹션 */}
        <section className="mt-4 rounded-card bg-white p-4 shadow-card">
          <h2 className="font-bold text-rl-green">🏍️ Ride Laos 바이크 렌트</h2>
          <p className="mt-2 text-sm text-gray-500">
            라오스 현지에서 정비된 바이크를 렌트하세요. 헬멧, 장갑 등 기본 장비 포함.
            투어 참가자는 할인 가격으로 이용 가능합니다.
          </p>
          <div className="mt-3 rounded-lg border border-rl-orange/30 bg-rl-orange/5 p-3">
            <p className="text-xs text-rl-green">
              💡 <span className="font-medium">투어 참가자 특별 할인</span> — 투어 예약 시 렌트 20% 할인
            </p>
          </div>
        </section>

        {/* 바이크 목록 */}
        <section className="mt-4">
          <h3 className="font-bold text-rl-green">보유 바이크</h3>
          <div className="mt-3 space-y-4">
            {BIKES.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        </section>

        {/* 렌트 안내 */}
        <section className="mt-6 rounded-card bg-white p-4 shadow-card">
          <h3 className="font-bold text-rl-green">렌트 안내</h3>
          <div className="mt-3 space-y-3 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="shrink-0">📋</span>
              <div>
                <p className="font-medium text-rl-green">필요 서류</p>
                <p className="text-xs text-gray-500">여권, 국제운전면허증 (오토바이 면허 포함)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0">🛡️</span>
              <div>
                <p className="font-medium text-rl-green">보험</p>
                <p className="text-xs text-gray-500">기본 보험 포함. 추가 보험 옵션 문의</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0">🔧</span>
              <div>
                <p className="font-medium text-rl-green">포함 장비</p>
                <p className="text-xs text-gray-500">헬멧, 장갑, 사이드백 (250cc 이상)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0">📍</span>
              <div>
                <p className="font-medium text-rl-green">픽업/반납</p>
                <p className="text-xs text-gray-500">비엔티안 시내 Ride Laos 사무실</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 문의 버튼 */}
      <div className="fixed bottom-0 left-1/2 flex w-full max-w-[480px] -translate-x-1/2 gap-3 bg-white px-4 pt-3 pb-[env(safe-area-inset-bottom,0px)]">
        <button
          type="button"
          onClick={() => alert('카카오톡 상담 연결 예정')}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-btn bg-yellow-400 text-lg font-bold text-gray-900 transition hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5" />
          카카오톡 문의
        </button>
        <button
          type="button"
          onClick={() => window.open('tel:+85620XXXXXXXX')}
          className="flex h-14 w-14 items-center justify-center rounded-btn border-2 border-rl-green text-rl-green transition hover:bg-rl-green hover:text-white"
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
