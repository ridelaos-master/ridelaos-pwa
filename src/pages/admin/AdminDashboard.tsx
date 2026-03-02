import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarCheck,
  TrendingUp,
  Clock,
  Users,
  ChevronRight,
  Loader2,
  AlertCircle,
  Bike,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ── 타입 정의 ──
interface DashboardStats {
  totalBookings: number
  monthlyRevenue: number
  pendingBookings: number
  totalCourses: number
}

interface RecentBooking {
  id: string
  customer_name: string
  phone: string
  party_size: number
  total_price_krw: number
  payment_status: 'pending' | 'paid' | 'cancelled'
  created_at: string
  tour_dates?: {
    departure_date: string
    courses?: {
      name_ko: string
    }
  }
}

interface UpcomingTour {
  id: string
  departure_date: string
  available_seats: number
  current_pax: number
  courses?: {
    name_ko: string
    min_pax: number
  }
}

// ── 상태 배지 컴포넌트 ──
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: '대기' },
    paid: { bg: 'bg-green-50', text: 'text-green-700', label: '결제완료' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: '취소' },
  }
  const c = config[status] || config.pending
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}

// ── 금액 포맷 ──
function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

// ── 날짜 포맷 ──
function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

// ── 메인 컴포넌트 ──
export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [upcomingTours, setUpcomingTours] = useState<UpcomingTour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      setError(null)

      // 이번 달 시작/끝
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
      const today = now.toISOString().split('T')[0]

      // 병렬로 데이터 조회
      const [
        { count: totalBookings },
        { data: monthlyBookings },
        { count: pendingBookings },
        { count: totalCourses },
        { data: recent },
        { data: upcoming },
      ] = await Promise.all([
        // 1. 총 예약 수
        supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true }),

        // 2. 이번 달 결제 완료 예약 (매출 계산용)
        supabase
          .from('bookings')
          .select('total_price_krw')
          .eq('payment_status', 'paid')
          .gte('created_at', monthStart)
          .lte('created_at', monthEnd),

        // 3. 대기 중 예약 수
        supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('payment_status', 'pending'),

        // 4. 총 코스 수
        supabase
          .from('courses')
          .select('*', { count: 'exact', head: true }),

        // 5. 최근 예약 5건
        supabase
          .from('bookings')
          .select(`
            id, customer_name, phone, party_size, total_price_krw,
            payment_status, created_at,
            tour_dates (
              departure_date,
              courses ( name_ko )
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5),

        // 6. 이번 달 이후 출발 투어
        supabase
          .from('tour_dates')
          .select(`
            id, departure_date, available_seats, current_pax,
            courses ( name_ko, min_pax )
          `)
          .gte('departure_date', today)
          .order('departure_date', { ascending: true })
          .limit(5),
      ])

      // 매출 합산
      const monthlyRevenue = (monthlyBookings || []).reduce(
        (sum, b) => sum + (b.total_price_krw || 0),
        0
      )

      setStats({
        totalBookings: totalBookings || 0,
        monthlyRevenue,
        pendingBookings: pendingBookings || 0,
        totalCourses: totalCourses || 0,
      })

      setRecentBookings((recent as RecentBooking[]) || [])
      setUpcomingTours((upcoming as UpcomingTour[]) || [])
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // ── 로딩 상태 ──
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1A3A2A]" />
          <p className="text-sm text-gray-400">대시보드 로딩 중...</p>
        </div>
      </div>
    )
  }

  // ── 에러 상태 ──
  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="rounded-lg bg-[#1A3A2A] px-4 py-2 text-sm text-white hover:opacity-90"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6 flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-[#1A3A2A]" />
        <h1 className="text-xl font-bold text-[#1A3A2A]">대시보드</h1>
      </div>

      {/* ── 핵심 지표 카드 ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {/* 총 예약 */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <CalendarCheck className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">총 예약</span>
          </div>
          <p className="text-2xl font-bold text-[#1A3A2A]">{stats?.totalBookings || 0}</p>
          <p className="text-xs text-gray-400">전체 기간</p>
        </div>

        {/* 이번 달 매출 */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">이번 달 매출</span>
          </div>
          <p className="text-2xl font-bold text-[#1A3A2A]">
            {formatKRW(stats?.monthlyRevenue || 0)}
          </p>
          <p className="text-xs text-gray-400">결제 완료 기준</p>
        </div>

        {/* 대기 중 */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">대기 중</span>
          </div>
          <p className="text-2xl font-bold text-[#1A3A2A]">{stats?.pendingBookings || 0}</p>
          <p className="text-xs text-gray-400">결제 대기 예약</p>
        </div>

        {/* 등록 코스 */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <Bike className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">등록 코스</span>
          </div>
          <p className="text-2xl font-bold text-[#1A3A2A]">{stats?.totalCourses || 0}</p>
          <p className="text-xs text-gray-400">운영 중</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── 최근 예약 ── */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-bold text-[#1A3A2A]">최근 예약</h2>
            <Link
              to="/admin/bookings"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1A3A2A]"
            >
              전체 보기 <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-400">예약 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-[#1A3A2A]">
                        {booking.customer_name}
                      </p>
                      <StatusBadge status={booking.payment_status} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {booking.tour_dates?.courses?.name_ko || '코스 미지정'}
                      {booking.tour_dates?.departure_date &&
                        ` · ${formatDate(booking.tour_dates.departure_date)}`}
                      {` · ${booking.party_size}명`}
                    </p>
                  </div>
                  <div className="ml-3 text-right">
                    <p className="text-sm font-medium text-[#1A3A2A]">
                      {formatKRW(booking.total_price_krw)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(booking.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 출발 예정 투어 ── */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-bold text-[#1A3A2A]">출발 예정 투어</h2>
            <Link
              to="/admin/tour-dates"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1A3A2A]"
            >
              전체 보기 <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {upcomingTours.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-400">예정된 투어가 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingTours.map((tour) => {
                const fillRate = tour.available_seats > 0
                  ? Math.round((tour.current_pax / tour.available_seats) * 100)
                  : 0
                const daysUntil = Math.ceil(
                  (new Date(tour.departure_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <div key={tour.id} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#1A3A2A]">
                          {tour.courses?.name_ko || '코스명 없음'}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {tour.departure_date} · {daysUntil > 0 ? `D-${daysUntil}` : '오늘 출발'}
                        </p>
                      </div>
                      <div className="ml-3 text-right">
                        <p className="text-sm font-medium text-[#1A3A2A]">
                          <Users className="mr-1 inline h-3.5 w-3.5" />
                          {tour.current_pax}/{tour.available_seats}
                        </p>
                      </div>
                    </div>
                    {/* 좌석 게이지 */}
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillRate >= 80 ? 'bg-red-400' : fillRate >= 50 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${Math.min(fillRate, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
