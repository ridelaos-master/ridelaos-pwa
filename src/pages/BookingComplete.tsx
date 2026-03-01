import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ChevronLeft } from 'lucide-react'

export function BookingComplete() {
  const navigate = useNavigate()

  const bookingId = sessionStorage.getItem('bookingId') ?? ''
  const totalPrice = Number(sessionStorage.getItem('totalPrice') ?? 0)
  const bookingIdShort = bookingId ? bookingId.slice(0, 8) : 'N/A'
  const formattedPrice = totalPrice.toLocaleString('ko-KR')

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-rl-bg font-sans text-rl-green">
      {/* 커스텀 헤더 */}
      <header className="flex h-14 shrink-0 items-center bg-rl-green px-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center justify-center rounded-full p-2 text-white transition hover:opacity-90"
          aria-label="홈으로"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">
          예약 완료
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      {/* 본문 */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-32">
        <CheckCircle2 className="h-16 w-16 text-rl-green" />
        <h2 className="mt-4 text-xl font-bold text-rl-green">
          예약이 완료되었습니다!
        </h2>

        <section className="mt-6 w-full rounded-card bg-white p-5 shadow-card">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-sm text-gray-500">예약번호</span>
            <span className="font-medium text-rl-green">{bookingIdShort}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-sm text-gray-500">결제 금액</span>
            <span className="font-bold text-rl-orange">
              {totalPrice > 0 ? `₩${formattedPrice}` : '-'}
            </span>
          </div>
        </section>

        <p className="mt-5 text-center text-sm text-gray-500">
          담당자가 확인 후 카카오톡으로 연락드립니다
        </p>
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 flex w-full max-w-[480px] -translate-x-1/2 gap-3 bg-white px-4 pt-3 pb-[env(safe-area-inset-bottom,0px)]">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="h-14 flex-1 rounded-btn border-2 border-rl-green text-lg font-bold text-rl-green transition hover:bg-rl-green hover:text-white"
        >
          홈으로
        </button>
        <button
          type="button"
          onClick={() => navigate('/mypage')}
          className="h-14 flex-1 rounded-btn bg-rl-orange text-lg font-bold text-white transition hover:opacity-90"
        >
          내 예약 확인
        </button>
      </div>
    </div>
  )
}
