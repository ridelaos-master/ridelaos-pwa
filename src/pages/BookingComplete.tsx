import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, ChevronLeft, MessageCircle, CalendarCheck, MapPin } from 'lucide-react'
import { usePushNotification } from '../hooks/usePushNotification'

export function BookingComplete() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { scheduleBookingReminders, isEnabled } = usePushNotification()

  const bookingId = sessionStorage.getItem('bookingId') ?? ''
  const totalPrice = Number(sessionStorage.getItem('totalPrice') ?? 0)
  const courseName = sessionStorage.getItem('courseName') ?? ''
  const departureDate = sessionStorage.getItem('departureDate') ?? ''
  const partySize = sessionStorage.getItem('partySize') ?? ''

  const bookingIdShort = bookingId ? bookingId.slice(0, 8) : 'N/A'
  const formattedPrice = totalPrice.toLocaleString('ko-KR')

  useEffect(() => {
    if (isEnabled && bookingId && courseName && departureDate) {
      scheduleBookingReminders({
        bookingId,
        courseName,
        departureDate,
      })
    }
  }, [])

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-rl-bg font-sans text-rl-green">
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
          {t('booking.complete')}
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pt-8 pb-32">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rl-green/10">
          <CheckCircle2 className="h-12 w-12 text-rl-green" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-rl-green">
          {t('booking.complete')}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          예약 내역을 확인해주세요
        </p>

        <section className="mt-6 w-full rounded-card bg-white p-5 shadow-card">
          <h3 className="mb-3 text-sm font-bold text-rl-green">예약 정보</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t('booking.bookingNumber')}</span>
              <span className="font-mono text-sm font-medium text-rl-green">{bookingIdShort}</span>
            </div>

            {courseName && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">코스</span>
                <span className="text-sm font-medium text-rl-green">{courseName}</span>
              </div>
            )}

            {departureDate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">출발일</span>
                <span className="text-sm font-medium text-rl-green">{departureDate}</span>
              </div>
            )}

            {partySize && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">인원</span>
                <span className="text-sm font-medium text-rl-green">{partySize}명</span>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="text-sm font-bold text-gray-500">{t('booking.totalPrice')}</span>
                <span className="text-lg font-bold text-rl-orange">
                  {totalPrice > 0 ? `₩${formattedPrice}` : '-'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 w-full rounded-card bg-white p-5 shadow-card">
          <h3 className="mb-3 text-sm font-bold text-rl-green">다음 단계 안내</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rl-orange/10">
                <MessageCircle className="h-4 w-4 text-rl-orange" />
              </div>
              <div>
                <p className="text-sm font-medium text-rl-green">카카오톡 확인 메시지</p>
                <p className="text-xs text-gray-500">담당자가 24시간 내 카카오톡으로 예약 확인 연락드립니다</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rl-green/10">
                <CalendarCheck className="h-4 w-4 text-rl-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-rl-green">출발 D-7 준비 안내</p>
                <p className="text-xs text-gray-500">출발 7일 전 준비물, 집결지 등 상세 안내를 보내드립니다</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rl-green/10">
                <MapPin className="h-4 w-4 text-rl-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-rl-green">출발 당일</p>
                <p className="text-xs text-gray-500">비엔티안 시내 Ride Laos 사무실에서 집결합니다</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 w-full rounded-card border border-rl-orange/30 bg-rl-orange/5 p-4">
          <p className="text-center text-sm text-rl-green">
            예약 취소는 <span className="font-bold">마이페이지 → 내 예약</span>에서 가능합니다.
            <br />
            <span className="text-xs text-gray-500">출발 7일 전까지 무료 취소 가능</span>
          </p>
        </div>
      </main>

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
