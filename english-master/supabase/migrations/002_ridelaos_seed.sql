-- ============================================================
-- Ride Laos — 시드 데이터 (1-04)
-- 라오스 + 5개 지역
-- ============================================================

-- 라오스 (국가)
INSERT INTO public.countries (id, code, name_ko, currency)
VALUES (
  'a0000001-0001-4000-8000-000000000001'::uuid,
  'LA',
  '라오스',
  'KRW'
)
ON CONFLICT (code) DO UPDATE SET
  name_ko = EXCLUDED.name_ko,
  currency = EXCLUDED.currency,
  updated_at = now();

-- 5개 지역 (비엔티안, 방비엥, 루앙프라방, 타켁, 볼라벤)
INSERT INTO public.regions (id, country_id, name_ko, lat, lng) VALUES
  (
    'b0000001-0001-4000-8000-000000000001'::uuid,
    'a0000001-0001-4000-8000-000000000001'::uuid,
    '비엔티안',
    17.9757,
    102.6331
  ),
  (
    'b0000001-0001-4000-8000-000000000002'::uuid,
    'a0000001-0001-4000-8000-000000000001'::uuid,
    '방비엥',
    18.9333,
    102.4500
  ),
  (
    'b0000001-0001-4000-8000-000000000003'::uuid,
    'a0000001-0001-4000-8000-000000000001'::uuid,
    '루앙프라방',
    19.8845,
    102.1350
  ),
  (
    'b0000001-0001-4000-8000-000000000004'::uuid,
    'a0000001-0001-4000-8000-000000000001'::uuid,
    '타켁',
    17.4100,
    104.8300
  ),
  (
    'b0000001-0001-4000-8000-000000000005'::uuid,
    'a0000001-0001-4000-8000-000000000001'::uuid,
    '볼라벤 고원',
    15.1167,
    106.2333
  )
ON CONFLICT (id) DO UPDATE SET
  country_id = EXCLUDED.country_id,
  name_ko = EXCLUDED.name_ko,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  updated_at = now();
