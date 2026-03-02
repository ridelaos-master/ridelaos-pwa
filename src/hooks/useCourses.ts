import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/** 코스 테이블 Row (CLI 생성 전 기본 타입) */
export interface Course {
  id: string
  region_id: string
  name_ko: string
  difficulty: string | null
  distance_km: number | null
  duration_days: number | null
  min_pax: number | null
  price_krw: number | null
  gpx_url: string | null
  offline_tile_url: string | null
  description_ko: string | null
  photos: string[] | null
  [key: string]: unknown
}

async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('name_ko')

  if (error) throw error
  return (data ?? []) as Course[]
}

async function fetchCourse(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data as Course | null
}

/** 홈 추천 코스용 필드만 조회 (상위 3개) */
export type FeaturedCourseRow = Pick<
  Course,
  'id' | 'name_ko' | 'difficulty' | 'duration_days' | 'price_krw'
>

async function fetchFeaturedCourses(): Promise<FeaturedCourseRow[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, name_ko, difficulty, duration_days, price_krw, tagline')
    .limit(3)
    .order('name_ko')

  if (error) throw error
  return (data ?? []) as FeaturedCourseRow[]
}

/** 홈 추천 코스 3개 조회 */
export function useFeaturedCourses() {
  return useQuery<FeaturedCourseRow[]>({
    queryKey: ['courses', 'featured'],
    queryFn: fetchFeaturedCourses,
  })
}

/** 전체 코스 목록 조회 */
export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })
}

/** 특정 코스 상세 조회 */
export function useCourse(id: string | undefined) {
  return useQuery<Course | null>({
    queryKey: ['courses', id],
    queryFn: () => fetchCourse(id!),
    enabled: !!id,
  })
}
