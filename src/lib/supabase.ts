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
export interface Database {
  public: {
    Tables: {
      courses: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      tour_dates: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      bookings: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      // 추가 테이블은 CLI 생성 시 채워짐
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
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
