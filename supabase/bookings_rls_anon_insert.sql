-- bookings 테이블: anon 역할로 INSERT 허용 (예약 임시 저장용)
-- Supabase 대시보드 → SQL Editor에서 실행하세요.

CREATE POLICY "anon_insert" ON bookings
  FOR INSERT TO anon
  WITH CHECK (true);
