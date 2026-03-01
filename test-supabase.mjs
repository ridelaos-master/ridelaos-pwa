// 임시 테스트: Supabase courses 조회
// 실행: node --env-file=.env.local test-supabase.mjs
// 또는: set VITE_SUPABASE_URL=... && set VITE_SUPABASE_ANON_KEY=... && node test-supabase.mjs

import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL ?? 'https://yljvrlzlxcgmlxmmjgcg.supabase.co'
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!key) {
  console.error('VITE_SUPABASE_ANON_KEY가 없습니다. .env.local을 사용하거나 환경 변수를 설정하세요.')
  process.exit(1)
}

const supabase = createClient(url, key)

const { data, error } = await supabase
  .from('courses')
  .select('id, name_ko')

console.log('data:', data)
console.log('error:', error)
