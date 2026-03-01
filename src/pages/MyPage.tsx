import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

interface BookingRow {
  id: string
  party_size: number
  total_price_krw: number
  payment_status: string
  created_at: string
  tour_dates: {
    departure_date: string
    courses: { name_ko: string } | null
  } | null
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: '대기', cls: 'bg-gray-200 text-gray-600' },
  paid: { label: '결제완료', cls: 'bg-rl-success text-rl-green' },
  cancelled: { label: '취소', cls: 'bg-rl-error text-red-600' },
}

async function fetchMyBookings(): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, party_size, total_price_krw, payment_status, created_at, tour_dates(departure_date, courses(name_ko))')
    .is('user_id', null)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return (data ?? []) as BookingRow[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function SkeletonCard() {
  return (
    <div className="rounded-card bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="mt-3 h-4 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 flex justify-between">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}

function BookingCard({ booking }: { booking: BookingRow }) {
  const badge = STATUS_BADGE[booking.payment_status] ?? STATUS_BADGE.pending
  const courseName = booking.tour_dates?.courses?.name_ko ?? '-'
  const departure = booking.tour_dates?.departure_date
    ? formatDate(booking.tour_dates.departure_date)
    : '-'

  return (
    <div className="rounded-card bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          #{booking.id.slice(0, 8)}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
      <p className="mt-2 font-medium text-rl-green">{courseName}</p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-gray-500">{departure} / {booking.party_size}명</span>
        <span className="font-bold text-rl-orange">
          ₩{booking.total_price_krw.toLocaleString('ko-KR')}
        </span>
      </div>
    </div>
  )
}

export function MyPage() {
  const { data: bookings = [], isLoading, isError } = useQuery<BookingRow[]>({
    queryKey: ['myBookings'],
    queryFn: fetchMyBookings,
  })

  return (
    <div>
      <h2 className="text-lg font-bold text-rl-green">마이페이지</h2>

      {/* 카카오 로그인 */}
      <button
        type="button"
        onClick={() => alert('카카오 로그인 준비 중입니다. 비즈앱 등록 완료 후 활성화됩니다.')}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-btn bg-[#FEE500] py-3 font-bold text-[#391B1B] transition hover:opacity-90"
      >
        카카오로 로그인
      </button>

      {/* 예약 목록 */}
      <h3 className="mt-6 font-bold text-rl-green">예약 내역</h3>

      <div className="mt-3 space-y-3">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!isLoading && isError && (
          <p className="py-4 text-center text-sm text-red-500">
            예약 내역을 불러오지 못했습니다. 새로고침 해주세요.
          </p>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            예약 내역이 없습니다
          </p>
        )}

        {!isLoading && !isError && bookings.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  )
}
