-- ============================================================
-- Ride Laos — DB 스키마 (1-04)
-- 마스터 컨텍스트 5계층 구조 + 보조 테이블
-- ============================================================

-- 확장 (필요 시)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. countries
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.countries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       TEXT NOT NULL UNIQUE,
  name_ko    TEXT NOT NULL,
  currency   TEXT NOT NULL DEFAULT 'KRW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "countries_select_all"
  ON public.countries FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------
-- 2. regions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.regions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id  UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  name_ko     TEXT NOT NULL,
  lat         NUMERIC(10, 7),
  lng         NUMERIC(10, 7),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_regions_country_id ON public.regions(country_id);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "regions_select_all"
  ON public.regions FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------
-- 3. courses
-- ------------------------------------------------------------
CREATE TYPE course_difficulty AS ENUM ('easy', 'medium', 'hard');

CREATE TABLE IF NOT EXISTS public.courses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES public.regions(id) ON DELETE RESTRICT,
  name_ko           TEXT NOT NULL,
  difficulty        course_difficulty NOT NULL DEFAULT 'medium',
  distance_km       INTEGER,
  duration_days     INTEGER NOT NULL,
  min_pax           INTEGER NOT NULL DEFAULT 2,
  price_krw         INTEGER NOT NULL,
  gpx_url           TEXT,
  offline_tile_url  TEXT,
  description_ko   TEXT,
  photos            TEXT[] DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_region_id ON public.courses(region_id);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "courses_select_all"
  ON public.courses FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------
-- 4. tour_dates
-- ------------------------------------------------------------
CREATE TYPE tour_date_status AS ENUM ('open', 'confirmed', 'closed');

CREATE TABLE IF NOT EXISTS public.tour_dates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  departure_date  DATE NOT NULL,
  available_seats INTEGER NOT NULL,
  current_pax     INTEGER NOT NULL DEFAULT 0,
  status          tour_date_status NOT NULL DEFAULT 'open',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tour_dates_current_pax_lte_seats CHECK (current_pax <= available_seats)
);

CREATE INDEX idx_tour_dates_course_id ON public.tour_dates(course_id);
CREATE INDEX idx_tour_dates_departure_date ON public.tour_dates(departure_date);
CREATE INDEX idx_tour_dates_status ON public.tour_dates(status);

ALTER TABLE public.tour_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tour_dates_select_all"
  ON public.tour_dates FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------
-- 5. bookings
-- ------------------------------------------------------------
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_date_id     UUID NOT NULL REFERENCES public.tour_dates(id) ON DELETE RESTRICT,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  party_size       INTEGER NOT NULL,
  total_price_krw  INTEGER NOT NULL,
  payment_status   payment_status NOT NULL DEFAULT 'pending',
  kakao_order_id   TEXT,
  is_group_booking BOOLEAN NOT NULL DEFAULT false,
  participants     JSONB DEFAULT '[]',
  coupon_code      TEXT,
  discount_amount  INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_tour_date_id ON public.bookings(tour_date_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select_own"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bookings_insert_own"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_update_own"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. course_waypoints
-- ------------------------------------------------------------
CREATE TYPE waypoint_type AS ENUM ('photospot', 'gas', 'hospital', 'accommodation');

CREATE TABLE IF NOT EXISTS public.course_waypoints (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name_ko    TEXT NOT NULL,
  lat        NUMERIC(10, 7) NOT NULL,
  lng        NUMERIC(10, 7) NOT NULL,
  type       waypoint_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_course_waypoints_course_id ON public.course_waypoints(course_id);

ALTER TABLE public.course_waypoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "course_waypoints_select_all"
  ON public.course_waypoints FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------
-- 7. reviews
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id  UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content    TEXT,
  photos     TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_course_id ON public.reviews(course_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all"
  ON public.reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "reviews_insert_own"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 8. completions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id    UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_completions_user_id ON public.completions(user_id);
CREATE INDEX idx_completions_course_id ON public.completions(course_id);

ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "completions_select_own"
  ON public.completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "completions_insert_own"
  ON public.completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 9. coupons
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code          TEXT NOT NULL,
  discount_rate INTEGER NOT NULL CHECK (discount_rate > 0 AND discount_rate <= 100),
  expires_at    TIMESTAMPTZ NOT NULL,
  used          BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coupons_user_id ON public.coupons(user_id);
CREATE INDEX idx_coupons_code ON public.coupons(code);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_select_own"
  ON public.coupons FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "coupons_update_own"
  ON public.coupons FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (true);

-- INSERT는 서버/관리자만 (Edge Function 또는 service_role)
-- 필요 시 service_role로만 INSERT 허용하는 정책 추가

-- ------------------------------------------------------------
-- 10. referrals
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code       TEXT NOT NULL UNIQUE,
  count      INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_user_id ON public.referrals(user_id);
CREATE INDEX idx_referrals_code ON public.referrals(code);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_select_own"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "referrals_insert_own"
  ON public.referrals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "referrals_update_own"
  ON public.referrals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- updated_at 트리거 (공통)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN (SELECT unnest(ARRAY[
    'countries', 'regions', 'courses', 'tour_dates', 'bookings',
    'course_waypoints', 'reviews', 'completions', 'coupons', 'referrals'
  ]))
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON public.%I; CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;
