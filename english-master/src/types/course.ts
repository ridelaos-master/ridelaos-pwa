/** Supabase regions 테이블 (일부 필드) */
export interface Region {
  id: string;
  name_ko: string;
  country_id?: string;
  lat?: number;
  lng?: number;
}

/** Supabase courses 테이블 + 조인된 region 정보 */
export interface Course {
  id: string;
  region_id: string;
  name_ko: string;
  difficulty: string | null;
  distance_km: number | null;
  duration_days: number | null;
  min_pax: number | null;
  price_krw: number | null;
  gpx_url: string | null;
  offline_tile_url: string | null;
  description_ko: string | null;
  photos: string[] | null;
  /** 조인된 regions.name_ko */
  regions?: { name_ko: string } | null;
}

export type CourseWithRegion = Course & {
  region_name?: string;
};
