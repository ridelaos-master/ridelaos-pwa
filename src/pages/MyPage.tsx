// src/pages/MyPage.tsx
// S4-06: 마이페이지 완성
// 예약 내역, 완주 배지/스탬프, 리뷰 작성, 쿠폰/추천인

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Award,
  Star,
  Ticket,
  ChevronRight,
  X,
  Send,
  Gift,
  Copy,
  CheckCircle,
  MapPin,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

/* ─── 타입 정의 ─────────────────────────────── */

interface BookingRow {
  id: string
  party_size: number
  total_price_krw: number
  payment_status: string
  created_at: string
  tour_dates: {
    departure_date: string
    courses: { id: string; name_ko: string } | null
  } | null
}

interface CompletionRow {
  id: string
  course_id: string
  completed_at: string
  courses: { name_ko: string; difficulty: string; distance_km: number } | null
}

interface CouponRow {
  id: string
  code: string
  discount_rate: number
  expires_at: string
  used: boolean
}

interface ReferralRow {
  id: string
  code: string
  count: number
}

/* ─── 상수 ──────────────────────────────────── */

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: '대기', cls: 'bg-gray-200 text-gray-600' },
  paid: { label: '결제완료', cls: 'bg-rl-success text-rl-green' },
  cancelled: { label: '취소', cls: 'bg-rl-error text-red-600' },
}

const DIFFICULTY_BADGE: Record<string, { label: string; color: string }> = {
  beginner: { label: '입문', color: 'bg-green-100 text-green-700' },
  intermediate: { label: '중급', color: 'bg-amber-100 text-amber-700' },
  advanced: { label: '고급', color: 'bg-red-100 text-red-700' },
}

const TABS = [
  { key: 'bookings', label: '예약', icon: MapPin },
  { key: 'completions', label: '완주', icon: Award },
  { key: 'coupons', label: '쿠폰', icon: Ticket },
] as const

type TabKey = (typeof TABS)[number]['key']

/* ─── 데이터 fetch ──────────────────────────── */

async function fetchMyBookings(): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, party_size, total_price_krw, payment_status, created_at, tour_dates(departure_date, courses(id, name_ko))')
    .is('user_id', null)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return (data ?? []) as BookingRow[]
}

async function fetchCompletions(): Promise<CompletionRow[]> {
  const { data, error } = await supabase
    .from('completions')
    .select('id, course_id, completed_at, courses(name_ko, difficulty, distance_km)')
    .is('user_id', null)
    .order('completed_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as CompletionRow[]
}

async function fetchCoupons(): Promise<CouponRow[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .is('user_id', null)
    .order('expires_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as CouponRow[]
}

async function fetchReferral(): Promise<ReferralRow | null> {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .is('user_id', null)
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as ReferralRow | null
}

async function submitReview(params: {
  courseId: string
  rating: number
  content: string
}): Promise<void> {
  const { error } = await supabase.from('reviews').insert({
    course_id: params.courseId,
    user_id: null,
    rating: params.rating,
    content: params.content,
  })
  if (error) throw error
}

/* ─── 헬퍼 ──────────────────────────────────── */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatShortDate(dateStr: string): string {
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  return `${parseInt(parts[1])}월 ${parseInt(parts[2])}일`
}

/* ─── 스켈레톤 ──────────────────────────────── */

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

/* ─── 예약 카드 ─────────────────────────────── */

function BookingCard({
  booking,
  onWriteReview,
}: {
  booking: BookingRow
  onWriteReview: (courseId: string, courseName: string) => void
}) {
  const badge = STATUS_BADGE[booking.payment_status] ?? STATUS_BADGE.pending
  const courseName = booking.tour_dates?.courses?.name_ko ?? '-'
  const courseId = booking.tour_dates?.courses?.id ?? null
  const departure = booking.tour_dates?.departure_date
    ? formatShortDate(booking.tour_dates.departure_date)
    : '-'

  return (
    <div className="rounded-card bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">#{booking.id.slice(0, 8)}</span>
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
      <p className="mt-2 font-medium text-rl-green">{courseName}</p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {departure} / {booking.party_size}명
        </span>
        <span className="font-bold text-rl-orange">
          ₩{booking.total_price_krw.toLocaleString('ko-KR')}
        </span>
      </div>

      {/* 결제완료 상태일 때 리뷰 작성 버튼 */}
      {booking.payment_status === 'paid' && courseId && (
        <button
          type="button"
          onClick={() => onWriteReview(courseId, courseName)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-btn border border-rl-orange py-2 text-sm font-medium text-rl-orange transition active:bg-orange-50"
        >
          <Star size={14} />
          리뷰 작성
        </button>
      )}
    </div>
  )
}

/* ─── 완주 배지 카드 ────────────────────────── */

function CompletionCard({ completion }: { completion: CompletionRow }) {
  const courseName = completion.courses?.name_ko ?? '-'
  const difficulty = completion.courses?.difficulty ?? 'beginner'
  const distance = completion.courses?.distance_km ?? 0
  const badge = DIFFICULTY_BADGE[difficulty] ?? DIFFICULTY_BADGE.beginner
  const date = formatDate(completion.completed_at)

  return (
    <div className="rounded-card bg-white p-4 shadow-card flex items-center gap-4">
      {/* 스탬프 아이콘 */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rl-green/10">
        <Award size={28} className="text-rl-green" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-rl-green truncate">{courseName}</p>
          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {distance}km · {date}
        </p>
      </div>
    </div>
  )
}

/* ─── 완주 통계 ─────────────────────────────── */

function CompletionStats({ completions }: { completions: CompletionRow[] }) {
  const totalDistance = completions.reduce(
    (sum, c) => sum + (c.courses?.distance_km ?? 0),
    0
  )
  const totalCourses = completions.length
  const difficulties = completions.reduce(
    (acc, c) => {
      const d = c.courses?.difficulty ?? 'beginner'
      acc[d] = (acc[d] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="rounded-card bg-rl-green p-4 shadow-card text-white">
      <p className="text-xs text-white/70">나의 완주 기록</p>
      <div className="mt-2 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-2xl font-bold">{totalCourses}</p>
          <p className="text-xs text-white/70">코스</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{totalDistance.toLocaleString()}</p>
          <p className="text-xs text-white/70">km</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{difficulties['advanced'] ?? 0}</p>
          <p className="text-xs text-white/70">고급 완주</p>
        </div>
      </div>
    </div>
  )
}

/* ─── 쿠폰 카드 ─────────────────────────────── */

function CouponCard({ coupon }: { coupon: CouponRow }) {
  const isExpired = new Date(coupon.expires_at) < new Date()
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`rounded-card bg-white p-4 shadow-card border-l-4 ${
        coupon.used || isExpired
          ? 'border-gray-300 opacity-60'
          : 'border-rl-orange'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-rl-orange">
            {coupon.discount_rate}% 할인
          </p>
          <div className="mt-1 flex items-center gap-2">
            <code className="rounded bg-gray-100 px-2 py-0.5 text-sm font-mono text-rl-green">
              {coupon.code}
            </code>
            {!coupon.used && !isExpired && (
              <button type="button" onClick={copyCode} className="text-gray-400 active:text-rl-green">
                {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
        {coupon.used ? (
          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-500">사용됨</span>
        ) : isExpired ? (
          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-500">만료</span>
        ) : (
          <span className="rounded bg-rl-success px-2 py-0.5 text-xs font-medium text-rl-green">사용 가능</span>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        유효기간: {formatDate(coupon.expires_at)}
      </p>
    </div>
  )
}

/* ─── 추천인 코드 ───────────────────────────── */

function ReferralSection({ referral }: { referral: ReferralRow | null }) {
  const [copied, setCopied] = useState(false)

  if (!referral) return null

  const copyCode = async () => {
    await navigator.clipboard.writeText(referral.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-card bg-white p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Gift size={18} className="text-rl-orange" />
        <h3 className="font-bold text-rl-green">친구 초대</h3>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        친구에게 추천 코드를 공유하면 할인 쿠폰을 받을 수 있습니다
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-btn bg-rl-bg px-3 py-2.5 text-center font-mono font-bold text-rl-green">
          {referral.code}
        </code>
        <button
          type="button"
          onClick={copyCode}
          className="shrink-0 rounded-btn bg-rl-orange px-4 py-2.5 text-sm font-bold text-white active:opacity-80"
        >
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-400 text-center">
        현재 {referral.count}명 초대 완료
      </p>
    </div>
  )
}

/* ─── 리뷰 작성 모달 ───────────────────────── */

function ReviewModal({
  courseId,
  courseName,
  onClose,
  onSubmitted,
}: {
  courseId: string
  courseName: string
  onClose: () => void
  onSubmitted: () => void
}) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] })
      onSubmitted()
      onClose()
    },
  })

  const handleSubmit = () => {
    if (content.trim().length < 5) {
      alert('리뷰를 5자 이상 작성해주세요.')
      return
    }
    mutation.mutate({ courseId, rating, content: content.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-[480px] rounded-t-2xl bg-white p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-rl-green">리뷰 작성</h3>
          <button type="button" onClick={onClose} className="p-1 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">{courseName}</p>

        {/* 별점 */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className="text-2xl transition active:scale-110"
            >
              <span className={i <= rating ? 'text-rl-orange' : 'text-gray-300'}>
                ★
              </span>
            </button>
          ))}
          <span className="ml-2 self-center text-sm text-gray-500">{rating}점</span>
        </div>

        {/* 리뷰 내용 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="투어 경험을 공유해주세요 (최소 5자)"
          rows={4}
          className="w-full rounded-btn border border-gray-200 px-3 py-2.5 text-sm resize-none focus:border-rl-green focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-400 text-right">{content.length}자</p>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending || content.trim().length < 5}
          className="mt-3 w-full rounded-btn bg-rl-orange py-3 font-bold text-white transition active:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send size={16} />
          {mutation.isPending ? '등록 중...' : '리뷰 등록'}
        </button>

        {mutation.isError && (
          <p className="mt-2 text-sm text-red-500 text-center">
            등록에 실패했습니다. 다시 시도해주세요.
          </p>
        )}
      </div>
    </div>
  )
}

/* ─── 탭 바 ─────────────────────────────────── */

function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}) {
  return (
    <div className="flex rounded-card bg-white shadow-card overflow-hidden">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-rl-green text-white'
                : 'text-gray-400 active:bg-gray-50'
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

/* ─── 메인 페이지 ───────────────────────────── */

export function MyPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('bookings')
  const [reviewTarget, setReviewTarget] = useState<{
    courseId: string
    courseName: string
  } | null>(null)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const { data: bookings = [], isLoading: bookingsLoading, isError: bookingsError } =
    useQuery<BookingRow[]>({
      queryKey: ['myBookings'],
      queryFn: fetchMyBookings,
    })

  const { data: completions = [], isLoading: completionsLoading } =
    useQuery<CompletionRow[]>({
      queryKey: ['myCompletions'],
      queryFn: fetchCompletions,
      enabled: activeTab === 'completions',
    })

  const { data: coupons = [], isLoading: couponsLoading } =
    useQuery<CouponRow[]>({
      queryKey: ['myCoupons'],
      queryFn: fetchCoupons,
      enabled: activeTab === 'coupons',
    })

  const { data: referral } = useQuery<ReferralRow | null>({
    queryKey: ['myReferral'],
    queryFn: fetchReferral,
    enabled: activeTab === 'coupons',
  })

  const handleWriteReview = (courseId: string, courseName: string) => {
    setReviewTarget({ courseId, courseName })
  }

  return (
    <div className="min-h-full bg-rl-bg pb-24">
      {/* 프로필 헤더 */}
      <div className="bg-rl-green px-4 py-6">
        <h2 className="text-lg font-bold text-white">마이페이지</h2>
        <button
          type="button"
          onClick={() =>
            alert('카카오 로그인 준비 중입니다. 비즈앱 등록 완료 후 활성화됩니다.')
          }
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-btn bg-[#FEE500] py-3 font-bold text-[#391B1B] transition hover:opacity-90"
        >
          카카오로 로그인
        </button>
      </div>

      <div className="px-4 -mt-2 space-y-4">
        {/* 탭 바 */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── 예약 탭 ── */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookingsLoading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}

            {!bookingsLoading && bookingsError && (
              <p className="py-4 text-center text-sm text-red-500">
                예약 내역을 불러오지 못했습니다. 새로고침 해주세요.
              </p>
            )}

            {!bookingsLoading && !bookingsError && bookings.length === 0 && (
              <div className="py-12 text-center">
                <MapPin size={32} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-gray-400">예약 내역이 없습니다</p>
              </div>
            )}

            {!bookingsLoading &&
              !bookingsError &&
              bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onWriteReview={handleWriteReview}
                />
              ))}

            {/* 리뷰 등록 성공 토스트 */}
            {reviewSubmitted && (
              <div className="rounded-btn bg-rl-success p-3 text-center text-sm font-medium text-rl-green">
                리뷰가 등록되었습니다!
              </div>
            )}
          </div>
        )}

        {/* ── 완주 탭 ── */}
        {activeTab === 'completions' && (
          <div className="space-y-3">
            {completionsLoading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}

            {!completionsLoading && completions.length === 0 && (
              <div className="py-12 text-center">
                <Award size={32} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-gray-400">완주 기록이 없습니다</p>
                <p className="mt-1 text-xs text-gray-300">
                  투어를 완료하면 배지가 추가됩니다
                </p>
              </div>
            )}

            {!completionsLoading && completions.length > 0 && (
              <>
                <CompletionStats completions={completions} />
                {completions.map((c) => (
                  <CompletionCard key={c.id} completion={c} />
                ))}
              </>
            )}
          </div>
        )}

        {/* ── 쿠폰 탭 ── */}
        {activeTab === 'coupons' && (
          <div className="space-y-3">
            {/* 추천인 코드 */}
            <ReferralSection referral={referral ?? null} />

            {couponsLoading && (
              <>
                <SkeletonCard />
              </>
            )}

            {!couponsLoading && coupons.length === 0 && (
              <div className="py-12 text-center">
                <Ticket size={32} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-gray-400">보유 쿠폰이 없습니다</p>
              </div>
            )}

            {!couponsLoading &&
              coupons.map((c) => <CouponCard key={c.id} coupon={c} />)}
          </div>
        )}
      </div>

      {/* 리뷰 작성 모달 */}
      {reviewTarget && (
        <ReviewModal
          courseId={reviewTarget.courseId}
          courseName={reviewTarget.courseName}
          onClose={() => setReviewTarget(null)}
          onSubmitted={() => {
            setReviewSubmitted(true)
            setTimeout(() => setReviewSubmitted(false), 3000)
          }}
        />
      )}
    </div>
  )
}