import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Course, CourseWithRegion } from '../types/course';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

function isEnvConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
}

export interface UseCoursesResult {
  courses: CourseWithRegion[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isEnvOk: boolean;
}

/** Supabase courses + regions 조인 데이터를 가져오는 훅. env 설정 여부를 함께 반환합니다. */
export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<CourseWithRegion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!isEnvConfigured()) {
      setError('Supabase API 키가 설정되지 않았습니다. .env.local에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 확인해 주세요.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // courses + regions 조인 (Supabase FK: courses.region_id -> regions.id)
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*, regions(name_ko)')
        .order('name_ko', { ascending: true });

      if (courseError) {
        setError(courseError.message);
        setCourses([]);
        return;
      }

      const list = (courseData ?? []) as (Course & { regions?: { name_ko: string } | null })[];
      const withRegion: CourseWithRegion[] = list.map((c) => ({
        ...c,
        region_name: c.regions?.name_ko ?? undefined,
      }));
      setCourses(withRegion);
    } catch (e) {
      const message = e instanceof Error ? e.message : '코스를 불러오는데 실패했습니다.';
      setError(message);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    isLoading,
    error,
    refetch: fetchCourses,
    isEnvOk: isEnvConfigured(),
  };
}
