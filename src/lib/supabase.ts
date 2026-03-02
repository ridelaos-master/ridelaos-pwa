console.log('[DEBUG] Supabase URL:', import.meta.env.VITE_SUPABASE_URL?.substring(0, 30))
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Set them in .env.local'
  )
}

/**
 * Database type – 기본 틀.
 * 나중에 Supabase CLI로 생성: npx supabase gen types typescript
 *
 * bookings INSERT: anon 사용자 허용이 필요하면 Supabase SQL Editor에서
 * supabase/bookings_rls_anon_insert.sql 실행
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>
type AnyTable = { Row: AnyRow; Insert: AnyRow; Update: AnyRow; Relationships: [] }

export interface Database {
  public: {
    Tables: {
      courses: AnyTable
      tour_dates: AnyTable
      bookings: AnyTable
      reviews: AnyTable
      site_contents: AnyTable
      course_waypoints: AnyTable
      completions: AnyTable
      coupons: AnyTable
      referrals: AnyTable
      // 추가 테이블은 CLI 생성 시 채워짐: npx supabase gen types typescript
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export const supabase = createClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '')

/**
 * Supabase 연결 테스트: courses 테이블 count 조회
 */
export async function testConnection(): Promise<void> {
  try {
    const { count, error } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('[Supabase] 연결 테스트 실패:', error.message)
      return
    }
    console.log('[Supabase] 연결 성공. courses count:', count ?? 0)
  } catch (e) {
    console.error('[Supabase] 연결 테스트 예외:', e)
  }
}
