import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

/** bookings 테이블 Row */
export interface Booking {
  id: string
  tour_date_id: string
  user_id: string
  party_size: number
  total_price_krw: number
  payment_status: 'pending' | 'paid' | 'failed' | 'cancelled'
  kakao_order_id: string | null
  is_group_booking: boolean | null
  participants: unknown
  coupon_code: string | null
  discount_amount: number | null
  [key: string]: unknown
}

async function fetchMyBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('id', { ascending: false })

  if (error) throw error
  return (data ?? []) as Booking[]
}

/** 내 예약 목록 (로그인 필요) */
export function useMyBookings() {
  const { user } = useAuth()

  return useQuery<Booking[]>({
    queryKey: ['bookings', user?.id],
    queryFn: () => fetchMyBookings(user!.id),
    enabled: !!user?.id,
  })
}
