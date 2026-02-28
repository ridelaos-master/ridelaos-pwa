import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/** tour_dates 테이블 Row (status: 'open' | 'confirmed' | 'closed') */
export interface TourDate {
  id: string
  course_id: string
  departure_date: string
  available_seats: number
  current_pax: number
  status: 'open' | 'confirmed' | 'closed'
  [key: string]: unknown
}

async function fetchTourDates(courseId: string): Promise<TourDate[]> {
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('tour_dates')
    .select('*')
    .eq('course_id', courseId)
    .eq('status', 'open')
    .gte('departure_date', today)
    .order('departure_date')

  if (error) throw error
  return (data ?? []) as TourDate[]
}

/** 출발 일정 조회 (status가 'open'인 것만) */
export function useTourDates(courseId: string | undefined) {
  return useQuery<TourDate[]>({
    queryKey: ['tour_dates', courseId],
    queryFn: () => fetchTourDates(courseId!),
    enabled: !!courseId,
  })
}
