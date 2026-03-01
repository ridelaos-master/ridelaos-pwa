import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check } from 'lucide-react'

export function Payment() {
  const navigate = useNavigate()

  const bookingId = sessionStorage.getItem('bookingId') ?? 'N/A'
  const totalPrice = Number(sessionStorage.getItem('totalPrice') ?? 0)
  const formattedPrice = totalPrice.toLocaleString('ko-KR')

  const handleKakaoPay = () => {
    if (bookingId === 'N/A' || totalPrice <= 0) {
      alert('예약 정보가 없습니다.')
      return
    }
    alert('카카오페이 연동 준비 중입니다. 비즈앱 등록 완료 후 활성화됩니다.')
    navigate('/booking-complete')
  }

  /* --- 카카오페이 실결제 코드 (비즈앱 승인 후 복원) ---
  const handleKakaoPayReal = async () => {
    if (bookingId === 'N/A' || totalPrice <= 0) {
      alert('예약 정보가 없습니다.')
      return
    }
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        cid: 'TC0ONETIME',
        partner_order_id: bookingId,
        partner_user_id: 'ridelaos_user',
        item_name: '라오스 오토바이 투어',
        quantity: '1',
        total_amount: String(totalPrice),
        tax_free_amount: '0',
        approval_url: `${window.location.origin}/payment/success?bookingId=${bookingId}`,
        cancel_url: `${window.location.origin}/payment`,
        fail_url: `${window.location.origin}/payment`,
      })

      const res = await fetch('/kakaopay/online/v1/payment/ready', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })

      const data = (await res.json()) as Record<string, unknown> & {
        tid?: string
        next_redirect_app_url?: string
      }
      console.log('카카오페이 Ready 응답:', data)

      if (data.tid) {
        sessionStorage.setItem('kakaopay_tid', data.tid)
        if (data.next_redirect_app_url) {
          window.location.href = data.next_redirect_app_url
        } else {
          throw new Error(JSON.stringify(data))
        }
      } else {
        throw new Error(JSON.stringify(data))
      }
    } catch (err: any) {
      console.error('카카오페이 오류 상세:', JSON.stringify(err?.message), err)
      alert('오류: ' + (err?.message ?? String(err)))
    } finally {
      setIsLoading(false)
    }
  }
  --- */

  const bookingIdShort = bookingId === 'N/A' ? 'N/A' : bookingId.slice(0, 8)

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-rl-bg font-sans text-rl-green">
      {/* 1. 커스텀 헤더 */}
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
          결제
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      {/* 2. 예약 요약 카드 */}
      <div className="flex-1 pb-24">
      <section className="mx-4 mt-4 rounded-card bg-white p-4 shadow-card">
        <p className="text-sm text-gray-500">결제 금액</p>
        <p className="mt-1 text-2xl font-bold text-rl-orange">
          ₩{formattedPrice}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          예약번호 : {bookingIdShort}
        </p>
        <p className="mt-2 text-xs text-gray-400">
          결제 완료 후 취소/환불은 고객센터로 문의해주세요
        </p>
      </section>

      {/* 3. 결제 수단 선택 */}
      <section className="mx-4 mt-4">
        <h2 className="mb-3 font-bold text-rl-green">결제 수단</h2>
        <div className="rounded-card border-2 border-rl-orange bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-rl-green">카카오페이</p>
              <p className="text-sm text-gray-500">간편하게 결제하세요</p>
            </div>
            <Check className="h-6 w-6 shrink-0 text-rl-orange" />
          </div>
        </div>
      </section>
      </div>

      {/* 4. 하단 고정 결제 버튼 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 bg-white px-4 pt-3 pb-[env(safe-area-inset-bottom,0px)]">
        <button
          type="button"
          onClick={handleKakaoPay}
          className="h-14 w-full rounded-btn bg-rl-orange text-lg font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {`카카오페이로 ₩${formattedPrice} 결제`}
        </button>
      </div>
    </div>
  )
}
