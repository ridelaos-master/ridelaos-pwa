import { useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface CreateBookingInput {
  tourDateId: string
  partySize: number
  totalPriceKrw: number
  name: string
  phone: string
  emergencyPhone: string
  specialRequest?: string
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          tour_date_id: input.tourDateId,
          user_id: null,
          party_size: input.partySize,
          total_price_krw: input.totalPriceKrw,
          payment_status: 'pending',
          kakao_order_id: null,
          is_group_booking: input.partySize > 1,
          participants: {
            name: input.name,
            phone: input.phone,
            emergencyPhone: input.emergencyPhone,
            specialRequest: input.specialRequest ?? '',
          },
          coupon_code: null,
          discount_amount: 0,
        })
        .select()
        .single()

      if (error) throw error
      return data as { id: string; [key: string]: unknown }
    },
  })
}
