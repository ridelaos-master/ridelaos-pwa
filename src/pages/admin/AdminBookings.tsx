import { useEffect, useState, useMemo } from 'react'
import {
  CalendarCheck,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ── 타입 ──
interface Booking {
  id: string
  tour_date_id: string | null
  user_id: string | null
  party_size: number
  total_price_krw: number
  payment_status: 'pending' | 'paid' | 'cancelled'
  is_group_booking: boolean
  participants: { name: string; phone: string } | null
  coupon_code: string | null
  discount_amount: number
  created_at: string
  // 클라이언트에서 조합
  tour_dates?: {
    departure_date: string
    courses?: { name_ko: string }
  }
}

type SortField = 'created_at' | 'name' | 'total_price_krw' | 'departure_date'
type SortDir = 'asc' | 'desc'
type StatusFilter = 'all' | 'pending' | 'paid' | 'cancelled'

// ── 상태 배지 ──
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

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ── 상세 모달 ──
function BookingDetailModal({
  booking,
  onClose,
  onStatusChange,
  updating,
}: {
  booking: Booking
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
  updating: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-lg">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-bold text-[#1A3A2A]">예약 상세</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="space-y-4 px-5 py-4">
          {/* 고객 정보 */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-400">고객 정보</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">이름</span>
                <span className="font-medium text-[#1A3A2A]">{booking.participants?.name || '미입력'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">전화번호</span>
                <span className="text-[#1A3A2A]">{booking.participants?.phone || '-'}</span>
              </div>
            </div>
          </div>

          {/* 예약 정보 */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-400">예약 정보</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">코스</span>
                <span className="font-medium text-[#1A3A2A]">
                  {booking.tour_dates?.courses?.name_ko || '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">출발일</span>
                <span className="text-[#1A3A2A]">
                  {booking.tour_dates?.departure_date || '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">인원</span>
                <span className="text-[#1A3A2A]">{booking.party_size}명</span>
              </div>
            </div>
          </div>

          {/* 결제 정보 */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-400">결제 정보</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">금액</span>
                <span className="font-bold text-[#E8A54B]">
                  {formatKRW(booking.total_price_krw)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">상태</span>
                <StatusBadge status={booking.payment_status} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">예약일시</span>
                <span className="text-[#1A3A2A]">{formatDateTime(booking.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 상태 변경 버튼 */}
        <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
          {booking.payment_status !== 'paid' && (
            <button
              onClick={() => onStatusChange(booking.id, 'paid')}
              disabled={updating}
              className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {updating ? '처리 중...' : '결제 완료'}
            </button>
          )}
          {booking.payment_status !== 'cancelled' && (
            <button
              onClick={() => onStatusChange(booking.id, 'cancelled')}
              disabled={updating}
              className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {updating ? '처리 중...' : '취소'}
            </button>
          )}
          {booking.payment_status !== 'pending' && (
            <button
              onClick={() => onStatusChange(booking.id, 'pending')}
              disabled={updating}
              className="flex-1 rounded-lg bg-yellow-500 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
            >
              {updating ? '처리 중...' : '대기로 변경'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ──
export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 필터 & 검색
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // 모달
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      setLoading(true)
      setError(null)

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, tour_date_id, user_id, party_size, total_price_krw, payment_status, is_group_booking, participants, coupon_code, discount_amount, created_at')
        .order('created_at', { ascending: false })

      if (bookingsError) throw bookingsError

      const tourDateIds = [...new Set(
        (bookingsData || []).map(b => b.tour_date_id).filter(Boolean)
      )]

      let tourDatesMap: Record<string, { departure_date: string; course_id: string }> = {}
      let coursesMap: Record<string, { name_ko: string }> = {}

      if (tourDateIds.length > 0) {
        const { data: tourDatesData } = await supabase
          .from('tour_dates')
          .select('id, departure_date, course_id')
          .in('id', tourDateIds)

        if (tourDatesData) {
          tourDatesData.forEach(td => {
            tourDatesMap[td.id] = { departure_date: td.departure_date, course_id: td.course_id }
          })

          const courseIds = [...new Set(tourDatesData.map(td => td.course_id).filter(Boolean))]
          if (courseIds.length > 0) {
            const { data: coursesData } = await supabase
              .from('courses')
              .select('id, name_ko')
              .in('id', courseIds)

            if (coursesData) {
              coursesData.forEach(c => {
                coursesMap[c.id] = { name_ko: c.name_ko }
              })
            }
          }
        }
      }

      const combined: Booking[] = (bookingsData || []).map(b => {
        const tourDate = b.tour_date_id ? tourDatesMap[b.tour_date_id] : null
        const course = tourDate?.course_id ? coursesMap[tourDate.course_id] : null
        return {
          ...b,
          tour_dates: tourDate ? {
            departure_date: tourDate.departure_date,
            courses: course ? { name_ko: course.name_ko } : undefined,
          } : undefined,
        } as Booking
      })

      setBookings(combined)
    } catch (err) {
      console.error('Bookings fetch error:', err)
      setError('예약 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 상태 변경
  async function handleStatusChange(bookingId: string, newStatus: string) {
    try {
      setUpdating(true)
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: newStatus })
        .eq('id', bookingId)

      if (updateError) throw updateError

      // 로컬 상태 업데이트
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, payment_status: newStatus as Booking['payment_status'] } : b
        )
      )

      // 모달의 선택된 예약도 업데이트
      setSelectedBooking((prev) =>
        prev && prev.id === bookingId
          ? { ...prev, payment_status: newStatus as Booking['payment_status'] }
          : prev
      )
    } catch (err) {
      console.error('Status update error:', err)
      alert('상태 변경 중 오류가 발생했습니다.')
    } finally {
      setUpdating(false)
    }
  }

  // 필터링 + 정렬
  const filteredBookings = useMemo(() => {
    let result = [...bookings]

    // 상태 필터
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.payment_status === statusFilter)
    }

    // 검색
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (b) =>
          (b.participants?.name || '').toLowerCase().includes(q) ||
          (b.participants?.phone || '').includes(q) ||
          (b.tour_dates?.courses?.name_ko || '').toLowerCase().includes(q)
      )
    }

    // 정렬
    result.sort((a, b) => {
      let valA: string | number = ''
      let valB: string | number = ''

      switch (sortField) {
        case 'created_at':
          valA = a.created_at
          valB = b.created_at
          break
        case 'name':
          valA = a.participants?.name || ''
          valB = b.participants?.name || ''
          break
        case 'total_price_krw':
          valA = a.total_price_krw
          valB = b.total_price_krw
          break
        case 'departure_date':
          valA = a.tour_dates?.departure_date || ''
          valB = b.tour_dates?.departure_date || ''
          break
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [bookings, statusFilter, searchQuery, sortField, sortDir])

  // 정렬 토글
  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronDown className="h-3 w-3 text-gray-300" />
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3 w-3 text-[#1A3A2A]" />
    ) : (
      <ChevronDown className="h-3 w-3 text-[#1A3A2A]" />
    )
  }

  // ── 로딩 ──
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1A3A2A]" />
          <p className="text-sm text-gray-400">예약 데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  // ── 에러 ──
  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchBookings}
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
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarCheck className="h-6 w-6 text-[#1A3A2A]" />
          <h1 className="text-xl font-bold text-[#1A3A2A]">예약 관리</h1>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {filteredBookings.length}건
          </span>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          새로고침
        </button>
      </div>

      {/* 검색 & 필터 */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        {/* 검색 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="고객명, 전화번호, 코스명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#1A3A2A] focus:ring-1 focus:ring-[#1A3A2A]"
          />
        </div>

        {/* 상태 필터 */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {(['all', 'pending', 'paid', 'cancelled'] as StatusFilter[]).map((status) => {
            const labels: Record<StatusFilter, string> = {
              all: '전체',
              pending: '대기',
              paid: '결제완료',
              cancelled: '취소',
            }
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-[#1A3A2A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {labels[status]}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 데스크톱 테이블 ── */}
      <div className="hidden rounded-xl bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th
                  className="cursor-pointer px-4 py-3 text-xs font-medium text-gray-500 hover:text-[#1A3A2A]"
                  onClick={() => toggleSort('created_at')}
                >
                  <span className="flex items-center gap-1">
                    예약일 <SortIcon field="created_at" />
                  </span>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-xs font-medium text-gray-500 hover:text-[#1A3A2A]"
                  onClick={() => toggleSort('name')}
                >
                  <span className="flex items-center gap-1">
                    고객명 <SortIcon field="name" />
                  </span>
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">코스</th>
                <th
                  className="cursor-pointer px-4 py-3 text-xs font-medium text-gray-500 hover:text-[#1A3A2A]"
                  onClick={() => toggleSort('departure_date')}
                >
                  <span className="flex items-center gap-1">
                    출발일 <SortIcon field="departure_date" />
                  </span>
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">인원</th>
                <th
                  className="cursor-pointer px-4 py-3 text-xs font-medium text-gray-500 hover:text-[#1A3A2A]"
                  onClick={() => toggleSort('total_price_krw')}
                >
                  <span className="flex items-center gap-1">
                    금액 <SortIcon field="total_price_krw" />
                  </span>
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">상태</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    {searchQuery || statusFilter !== 'all'
                      ? '검색 결과가 없습니다.'
                      : '예약 내역이 없습니다.'}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-600">
                      {formatDateTime(booking.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1A3A2A]">
                      {booking.participants?.name || '미입력'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {booking.tour_dates?.courses?.name_ko || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {booking.tour_dates?.departure_date || '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{booking.party_size}</td>
                    <td className="px-4 py-3 font-medium text-[#1A3A2A]">
                      {formatKRW(booking.total_price_krw)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={booking.payment_status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#1A3A2A]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 모바일 카드 리스트 ── */}
      <div className="space-y-3 lg:hidden">
        {filteredBookings.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? '검색 결과가 없습니다.'
                : '예약 내역이 없습니다.'}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="cursor-pointer rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1A3A2A]">{booking.participants?.name || '미입력'}</span>
                  <StatusBadge status={booking.payment_status} />
                </div>
                <span className="font-medium text-[#1A3A2A]">
                  {formatKRW(booking.total_price_krw)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  {booking.tour_dates?.courses?.name_ko || '-'} ·{' '}
                  {booking.tour_dates?.departure_date || '-'} · {booking.party_size}명
                </span>
                <span>{formatDateTime(booking.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── 상세 모달 ── */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  )
}

export default AdminBookings
