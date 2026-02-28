import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Course } from './useCourses'

const STALE_TIME_MS = 5 * 60 * 1000 // 5분

export interface CourseWaypoint {
  id: string
  course_id: string
  name_ko: string | null
  lat: number
  lng: number
  type: 'start' | 'waypoint' | 'end' | 'rest'
}

export interface CourseReview {
  id: string
  course_id: string
  user_id: string | null
  rating: number
  content: string | null
  created_at: string
}

async function fetchCourseDetail(id: string): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Course
}

async function fetchCourseWaypoints(courseId: string): Promise<CourseWaypoint[]> {
  const { data, error } = await supabase
    .from('course_waypoints')
    .select('*')
    .eq('course_id', courseId)
    .order('id')

  if (error) throw error
  return (data ?? []) as CourseWaypoint[]
}

async function fetchCourseReviews(courseId: string): Promise<CourseReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('course_id', courseId)
    .limit(5)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as CourseReview[]
}

/** 코스 상세 단건 조회 */
export function useCourseDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseDetail(id!),
    enabled: !!id,
    staleTime: STALE_TIME_MS,
  })
}

/** 코스 웨이포인트 조회 */
export function useCourseWaypoints(courseId: string | undefined) {
  return useQuery({
    queryKey: ['course_waypoints', courseId],
    queryFn: () => fetchCourseWaypoints(courseId!),
    enabled: !!courseId,
    staleTime: STALE_TIME_MS,
  })
}

/** 코스 리뷰 조회 (상위 5개) */
export function useCourseReviews(courseId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', courseId],
    queryFn: () => fetchCourseReviews(courseId!),
    enabled: !!courseId,
    staleTime: STALE_TIME_MS,
  })
}
