import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, getDay } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import { useTourDateDetail } from '../hooks/useTourDateDetail'
import { useCreateBooking } from '../hooks/useCreateBooking'

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

const PHONE_REGEX = /^010-\d{4}-\d{4}$/

const bookingSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상 입력해주세요'),
  phone: z.string().regex(PHONE_REGEX, '010-0000-0000 형식으로 입력해주세요'),
  emergencyPhone: z.string().regex(PHONE_REGEX, '010-0000-0000 형식으로 입력해주세요'),
  partySizeStr: z.string().min(1, '인원을 선택해주세요'),
  specialRequest: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function formatDepartureWithWeekday(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][getDay(date)]
  return `${format(date, 'yyyy년 M월 d일')} (${weekday})`
}

export function Booking() {
  const { dateId } = useParams<{ dateId: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError, availableSeats, isBookable } =
    useTourDateDetail(dateId)
  const createBooking = useCreateBooking()

  const minPax = data?.course.min_pax ?? 1
  const priceKrw = data?.course.price_krw ?? 0

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      phone: '',
      emergencyPhone: '',
      partySizeStr: String(minPax),
      specialRequest: '',
    },
  })

  const partySizeStr = watch('partySizeStr')
  const partySize = Math.max(1, Math.min(10, parseInt(partySizeStr, 10) || minPax))
  const totalPrice = data != null ? priceKrw * partySize : 0

  useEffect(() => {
    if (data != null) {
      setValue('partySizeStr', String(data.course.min_pax))
    }
  }, [data?.course.min_pax, setValue])

  const onValid = async (formData: BookingFormData) => {
    if (!dateId || !data) return
    const partySizeNum = Math.max(
      1,
      Math.min(10, parseInt(formData.partySizeStr, 10) || minPax)
    )
    const totalPriceKrw = priceKrw * partySizeNum
    try {
      const result = await createBooking.mutateAsync({
        tourDateId: dateId,
        partySize: partySizeNum,
        totalPriceKrw,
        name: formData.name,
        phone: formData.phone,
        emergencyPhone: formData.emergencyPhone,
        specialRequest: formData.specialRequest,
      })
      sessionStorage.setItem('bookingId', result.id)
      sessionStorage.setItem('totalPrice', String(totalPriceKrw))
      sessionStorage.setItem('courseName', data.course.name_ko)
      sessionStorage.setItem('departureDate', formatDepartureWithWeekday(data.departure_date))
      sessionStorage.setItem('partySize', String(partySizeNum))
      console.log('저장됨:', result.id, totalPriceKrw)
      navigate('/payment')
    } catch {
      alert('예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const inputBase =
    'w-full rounded-btn border border-gray-300 px-3 py-2 text-sm focus:border-rl-green-mid focus:outline-none'
  const inputError = 'border-red-400'

  const personOptions = Array.from(
    { length: Math.max(1, 10 - minPax + 1) },
    (_, i) => minPax + i
  )

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
          예약하기
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      {/* 2. 코스 요약 카드 */}
      <main className="flex-1 px-0 pb-24">
        <section className="mx-4 mt-4 rounded-card bg-white p-4 shadow-card">
          {isLoading && (
            <div className="space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
            </div>
          )}

          {(isError || (data == null && !isLoading)) && (
            <p className="py-4 text-center text-sm text-gray-500">
              투어 정보를 불러올 수 없습니다
            </p>
          )}

          {data != null && !isLoading && (
            <>
              <h2 className="font-bold text-rl-green">
                {data.course.name_ko}{' '}
                {data.course.duration_days > 0 &&
                  `${data.course.duration_days}일 투어`}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {formatDepartureWithWeekday(data.departure_date)}
              </p>
              <span className="mt-2 inline-block rounded bg-rl-success px-2 py-0.5 text-sm text-rl-green">
                {DIFFICULTY_LABEL[data.course.difficulty] ?? '초급'}
              </span>
              <p className="mt-2 text-xl font-bold text-rl-orange">
                ₩{totalPrice.toLocaleString('ko-KR')}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                잔여 {availableSeats}석
              </p>
            </>
          )}
        </section>

        {/* 3. 예약자 정보 폼 */}
        <section className="mx-4 mt-4">
          <h3 className="font-bold text-rl-green">예약자 정보</h3>
          <form
            id="booking-form"
            onSubmit={handleSubmit(onValid)}
            className="mt-2 rounded-card border border-gray-200 bg-white p-4 shadow-card"
          >
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-rl-green">
                예약자명 *
              </label>
              <input
                type="text"
                placeholder="홍길동"
                className={`${inputBase} ${errors.name ? inputError : ''}`}
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-rl-green">
                휴대폰 번호 *
              </label>
              <input
                type="tel"
                placeholder="010-0000-0000"
                className={`${inputBase} ${errors.phone ? inputError : ''}`}
                {...register('phone', {
                  onChange: (e) => {
                    const formatted = formatPhoneInput(e.target.value)
                    e.target.value = formatted
                    setValue('phone', formatted, { shouldValidate: true })
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-rl-green">
                비상 연락처 *
              </label>
              <input
                type="tel"
                placeholder="010-0000-0000"
                className={`${inputBase} ${errors.emergencyPhone ? inputError : ''}`}
                {...register('emergencyPhone', {
                  onChange: (e) => {
                    const formatted = formatPhoneInput(e.target.value)
                    e.target.value = formatted
                    setValue('emergencyPhone', formatted, {
                      shouldValidate: true,
                    })
                  },
                })}
              />
              {errors.emergencyPhone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.emergencyPhone.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-rl-green">
                인원 *
              </label>
              <select
                className={`${inputBase} ${errors.partySizeStr ? inputError : ''}`}
                {...register('partySizeStr')}
              >
                {personOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </select>
              {errors.partySizeStr && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.partySizeStr.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-rl-green">
                특이사항 (선택)
              </label>
              <textarea
                rows={3}
                placeholder="알레르기, 부상 이력 등 알려주실 사항을 입력해주세요"
                className={`${inputBase} ${errors.specialRequest ? inputError : ''}`}
                {...register('specialRequest')}
              />
              {errors.specialRequest && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.specialRequest.message}
                </p>
              )}
            </div>
          </form>
        </section>
      </main>

      {/* 4. 하단 고정 결제 버튼 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 bg-white px-4 pt-3 pb-[env(safe-area-inset-bottom,0px)]">
        {!isBookable && data != null && (
          <p className="mb-2 text-center text-sm text-gray-500">
            마감된 투어입니다
          </p>
        )}
        <button
          type="submit"
          form="booking-form"
          disabled={!isBookable || data == null || createBooking.isPending}
          className="h-14 w-full rounded-btn bg-rl-orange text-lg font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createBooking.isPending
            ? '처리 중...'
            : data != null
              ? `₩${totalPrice.toLocaleString('ko-KR')} 결제하기`
              : '결제하기'}
        </button>
      </div>
    </div>
  )
}
