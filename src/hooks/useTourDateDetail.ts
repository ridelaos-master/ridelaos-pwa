import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const STALE_TIME_MS = 30 * 1000 // 30초

export interface TourDateDetail {
  id: string
  departure_date: string
  available_seats: number
  current_pax: number
  status: 'open' | 'closed' | 'cancelled'
  course: {
    id: string
    name_ko: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    duration_days: number
    min_pax: number
    price_krw: number
    description_ko: string
  }
}

interface TourDateRow {
  id: string
  course_id: string
  departure_date: string
  available_seats: number
  current_pax: number
  status: string
  courses: {
    id: string
    name_ko: string
    difficulty: string | null
    duration_days: number | null
    min_pax: number | null
    price_krw: number | null
    description_ko: string | null
  } | null
}

function mapRowToDetail(row: TourDateRow): TourDateDetail {
  const course = row.courses
  if (!course) {
    throw new Error('Course not found')
  }
  return {
    id: row.id,
    departure_date: row.departure_date,
    available_seats: row.available_seats,
    current_pax: row.current_pax,
    status: row.status as TourDateDetail['status'],
    course: {
      id: course.id,
      name_ko: course.name_ko,
      difficulty: (course.difficulty ?? 'beginner') as TourDateDetail['course']['difficulty'],
      duration_days: course.duration_days ?? 0,
      min_pax: course.min_pax ?? 0,
      price_krw: course.price_krw ?? 0,
      description_ko: course.description_ko ?? '',
    },
  }
}

async function fetchTourDateDetail(dateId: string): Promise<TourDateDetail> {
  const { data, error } = await supabase
    .from('tour_dates')
    .select('*, courses(*)')
    .eq('id', dateId)
    .single()

  if (error) throw error
  if (!data) throw new Error('Tour date not found')
  return mapRowToDetail(data as TourDateRow)
}

export function useTourDateDetail(dateId: string | undefined) {
  const query = useQuery({
    queryKey: ['tourDateDetail', dateId],
    queryFn: () => fetchTourDateDetail(dateId!),
    enabled: !!dateId,
    staleTime: STALE_TIME_MS,
  })

  const data = query.data
  const availableSeats =
    data != null ? data.available_seats - data.current_pax : 0
  const isBookable =
    data != null && availableSeats > 0 && data.status === 'open'

  return {
    ...query,
    availableSeats,
    isBookable,
  }
}
