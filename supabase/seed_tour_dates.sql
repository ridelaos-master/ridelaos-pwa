-- ============================================================
-- tour_dates 시드 데이터 삽입
-- Supabase 대시보드 → SQL Editor에서 실행하세요.
-- ============================================================

-- 1. 코스 ID 조회 (먼저 실행해서 name_ko와 UUID 확인)
SELECT id, name_ko FROM courses ORDER BY name_ko;

-- 2. 아래 INSERT 실행
--    방법 A: 서브쿼리 사용 (name_ko 패턴으로 course_id 자동 매칭)
--    방법 B: 1번 조회 결과의 UUID를 복사해 [코스A-UUID] 자리를 채운 뒤 실행

-- ----- 방법 A: 서브쿼리로 한 번에 실행 -----
INSERT INTO tour_dates (course_id, departure_date, available_seats, current_pax, status)
VALUES
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%비엔티안%방비엥%' ORDER BY name_ko LIMIT 1), '2026-03-15', 8, 2, 'open' ),
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%비엔티안%방비엥%' ORDER BY name_ko LIMIT 1), '2026-04-05', 8, 0, 'open' ),
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%방비엥%어드벤처%' ORDER BY name_ko LIMIT 1), '2026-03-20', 6, 1, 'open' ),
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%방비엥%어드벤처%' ORDER BY name_ko LIMIT 1), '2026-04-10', 6, 0, 'open' ),
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%루앙프라방%' ORDER BY name_ko LIMIT 1), '2026-03-25', 8, 3, 'open' ),
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%비엔티안%근교%' ORDER BY name_ko LIMIT 1), '2026-03-08', 10, 0, 'open' ),
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%비엔티안%근교%' ORDER BY name_ko LIMIT 1), '2026-03-22', 10, 4, 'open' ),
  ( (SELECT id FROM courses WHERE (name_ko ILIKE '%타켁%' OR name_ko ILIKE '%타켓%루프%') ORDER BY name_ko LIMIT 1), '2026-04-15', 6, 0, 'open' ),
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%볼라벤%' ORDER BY name_ko LIMIT 1), '2026-04-20', 6, 2, 'open' ),
  ( (SELECT id FROM courses WHERE name_ko ILIKE '%라오스%종단%' ORDER BY name_ko LIMIT 1), '2026-05-01', 8, 0, 'open' );

-- ----- 방법 B: UUID를 직접 넣을 때 (1번 조회 결과로 교체) -----
-- INSERT INTO tour_dates (course_id, departure_date, available_seats, current_pax, status)
-- VALUES
--   ('[비엔티안-방비엥 UUID]', '2026-03-15', 8, 2, 'open'),
--   ('[비엔티안-방비엥 UUID]', '2026-04-05', 8, 0, 'open'),
--   ('[방비엥 어드벤처 UUID]', '2026-03-20', 6, 1, 'open'),
--   ('[방비엥 어드벤처 UUID]', '2026-04-10', 6, 0, 'open'),
--   ('[루앙프라방 문화 UUID]', '2026-03-25', 8, 3, 'open'),
--   ('[비엔티안 근교 UUID]', '2026-03-08', 10, 0, 'open'),
--   ('[비엔티안 근교 UUID]', '2026-03-22', 10, 4, 'open'),
--   ('[타켁/타켓 루프 UUID]', '2026-04-15', 6, 0, 'open'),
--   ('[볼라벤 고원 UUID]', '2026-04-20', 6, 2, 'open'),
--   ('[라오스 종단 UUID]', '2026-05-01', 8, 0, 'open');
