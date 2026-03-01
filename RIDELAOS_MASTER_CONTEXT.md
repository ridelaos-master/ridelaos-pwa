# RIDELAOS_MASTER_CONTEXT.md
# Ride Laos PWA — 마스터 컨텍스트
# 최종 업데이트: 2026-03-01 (Sprint 3 완료)

---

## 1. 프로젝트 개요

- **프로젝트명:** Ride Laos PWA
- **목적:** 라오스 오토바이 투어 예약 앱
- **타겟:** 한국 남성 35~55세
- **개발자:** David (단독 개발, Cursor AI 활용)
- **로컬 경로:** C:\Projects\ridelaos-pwa

---

## 2. 기술 스택

- **프론트엔드:** React 18 + Vite + TypeScript + Tailwind CSS v4
- **백엔드:** Supabase (PostgreSQL + Auth + Storage)
- **지도:** Mapbox GL JS v3.19.0
- **상태관리:** React Query (TanStack Query v5)
- **라우팅:** React Router v7
- **폼:** React Hook Form + Zod
- **PWA:** vite-plugin-pwa + Workbox
- **배포:** Vercel
- **패키지매니저:** npm
- **기타:** date-fns, lucide-react, zustand

---

## 3. 계정 정보

| 서비스 | 계정 | 이메일 |
|--------|------|--------|
| GitHub | ridelaos-master | ridelaosapp@gmail.com |
| Vercel | ridelaos-master | ridelaosapp@gmail.com |
| Supabase | ridelaos-master | ridelaosapp@gmail.com |
| 카카오 개발자 | - | - |
| Mapbox | - | - |

---

## 4. 서비스 URL

| 서비스 | URL |
|--------|-----|
| GitHub | https://github.com/ridelaos-master/ridelaos-pwa |
| Vercel | https://ridelaos-mv.vercel.app |
| Supabase (신규) | https://krzzeqjljxugrdafspqe.supabase.co |
| 카카오 개발자 | https://developers.kakao.com/console/app/1392646 |
| 로컬 개발 | http://localhost:5173 (또는 5174) |

---

## 5. 환경변수 (.env.local)

```
VITE_SUPABASE_URL=https://krzzeqjljxugrdafspqe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_KAKAO_APP_KEY=26b8f79af28f47d706959931eb971ad0
VITE_MAPBOX_TOKEN=pk.eyJ1IjoicmlkZWxhb3MiLCJhIjoiY21...
KAKAO_PAY_SECRET=49091ae2c1bcd5d432f707b6fd5a4803
VITE_APP_URL=http://localhost:5173
```

---

## 6. 디자인 토큰 (Tailwind — tailwind.config.js)

```javascript
colors: {
  'rl-green':     '#1A3A2A',  // Primary (헤더, 버튼, 텍스트)
  'rl-green-mid': '#2D6A4F',  // Secondary
  'rl-orange':    '#F4A261',  // Accent (강조, 가격, 버튼)
  'rl-bg':        '#F5F5F5',  // 배경
  'rl-success':   '#D8F3DC',
  'rl-error':     '#FADBD8',
}
boxShadow: { card: '0 2px 12px rgba(0,0,0,0.08)' }
borderRadius: { card: '16px', btn: '8px' }
fontFamily: { sans: ['Arial', 'Malgun Gothic', 'Apple SD Gothic Neo', 'sans-serif'] }
```

> ⚠️ Tailwind v4 사용 중 — CSS-first config, 디자인 토큰은 tailwind.config.js에 정의됨

---

## 7. DB 스키마 (10개 테이블)

### 메인 테이블
1. **countries** (id, code, name_ko, currency)
2. **regions** (id, country_id, name_ko, lat, lng)
3. **courses** (id, region_id, name_ko, difficulty, distance_km, duration_days, min_pax, price_krw, gpx_url, offline_tile_url, description_ko, photos)
4. **tour_dates** (id, course_id, departure_date, available_seats, current_pax, status)
5. **bookings** (id, tour_date_id, user_id, party_size, total_price_krw, payment_status, kakao_order_id, is_group_booking, participants, coupon_code, discount_amount)

### 보조 테이블
6. **course_waypoints** (id, course_id, name_ko, lat, lng, type)
   - type 값: 'start' | 'waypoint' | 'end' | 'rest'
7. **reviews** (id, user_id, course_id, rating, content, photos, created_at)
8. **completions** (id, user_id, course_id, completed_at)
9. **coupons** (id, user_id, code, discount_rate, expires_at, used)
10. **referrals** (id, user_id, code, count)

### RLS 정책
- countries, regions, courses, tour_dates, course_waypoints, reviews → 전체 읽기 가능
- bookings, completions, coupons, referrals → 본인 데이터만

---

## 8. 7개 투어 코스 (Supabase 시드 데이터 입력 완료)

| 코드 | 이름 | 난이도 | 기간 | 최소인원 | 가격 |
|------|------|--------|------|----------|------|
| A | 비엔티안-방비엥 | beginner | 3일 | 2명 | ₩480,000 |
| B | 방비엥 어드벤처 | intermediate | 5일 | 3명 | ₩720,000 |
| C | 루앙프라방 문화 | beginner | 4일 | 2명 | ₩650,000 |
| D | 비엔티안 근교 | beginner | 2일 | 2명 | ₩280,000 |
| E | 타켁 루프 | advanced | 5일 | 3명 | ₩1,100,000 |
| F | 볼라벤 고원 | intermediate | 4일 | 3명 | ₩980,000 |
| G | 라오스 종단 | advanced | 8일 | 4명 | ₩1,500,000 |

---

## 9. 라우팅 구조

```
/ → Home
/courses → CourseList
/courses/:id → CourseDetail
/booking/:dateId → Booking
/payment → Payment
/booking-complete → BookingComplete
/mypage → MyPage
/safety → Safety
/auth/callback → AuthCallback
```

---

## 10. Sprint 진행 현황

### Sprint 1 — 기반 구축 (✅ 완료)
| 태스크 | 상태 | 비고 |
|--------|------|------|
| S1-01 Git 연결 | ✅ | |
| S1-02 패키지 설치 | ✅ | |
| S1-03 Tailwind 설정 | ✅ | |
| S1-04 Supabase 연결 | ✅ | |
| S1-05 DB 스키마 | ✅ | 10개 테이블 |
| S1-06 RLS 정책 | ✅ | |
| S1-07 카카오 로그인 | ⏳ | 비즈앱 등록 후 처리 |
| S1-08 React Router | ✅ | 하단 네비 4개 |
| S1-09 React Query | ✅ | useQuery 제네릭 적용 |
| S1-10 PWA 설정 | ✅ | workbox 10MB 임시 설정 |
| S1-11 Vercel 배포 | ✅ | ridelaos-mv.vercel.app |
| S1-12 시드 데이터 | ✅ | 7개 코스 입력 완료 |

### Sprint 2 — 코스 목록 & 상세 (✅ 완료)
| 태스크 | 상태 | 커밋 | 비고 |
|--------|------|------|------|
| S2-01 홈 화면 레이아웃 | ✅ | a532f50 | HeroBanner, FeaturedCourses, NoticeBanner |
| S2-02 히어로 배너 개선 | ✅ | 1d5ff4e | 통계 뱃지, 🚗 이모지 |
| S2-03 추천 코스 Supabase 연동 | ✅ | 1d5ff4e | 실데이터, 스켈레톤 로딩 |
| S2-04 공지 배너 개선 | ✅ | 1d5ff4e | NOTICES 배열, 닫기 버튼 |
| S2-05 코스 목록 페이지 | ✅ | 613b73b | 전체 레이아웃 |
| S2-06 코스 카드 컴포넌트 | ✅ | 613b73b | 난이도 뱃지, 가격 |
| S2-07 필터 & 정렬 | ✅ | 613b73b | 난이도 탭 필터 |
| S2-08 useCourses 훅 연결 | ✅ | 613b73b | Supabase 실데이터 |
| S2-09 빈 상태/로딩 UI | ✅ | 613b73b | 스켈레톤, 에러, 빈 상태 |
| S2-10 코스 상세 레이아웃 | ✅ | dc1b2b1 | 포토, 정보, 날짜, 리뷰 |
| S2-11 포토 영역 | ✅ | dc1b2b1 | 그라데이션, 뒤로가기 버튼 |
| S2-12 코스 정보 섹션 | ✅ | dc1b2b1 | 2열 그리드 |
| S2-13 투어 날짜 선택 | ✅ | dc1b2b1 | 잔여석, 예약 이동 |
| S2-14 리뷰 섹션 | ✅ | dc1b2b1 | 평균 별점, 리뷰 목록 |
| S2-15 Mapbox 초기화 | ✅ | 9a3ebf3 | outdoors 스타일, 라오스 중심 |
| S2-16 코스 경로 표시 | ✅ | 9a3ebf3 | 오렌지 라인, 마커 |
| S2-17 웨이포인트 팝업 | ✅ | 9a3ebf3 | 클릭 시 팝업 |
| S2-18 오프라인 타일 캐싱 | ✅ | 9a3ebf3 | Workbox CacheFirst |
| S2-19 지도 로딩 최적화 | ✅ | 9a3ebf3 | CourseDetail에 삽입 |
| S2-20 useCourseDetail 훅 | ✅ | 0b4a121 | 병렬 쿼리 |
| S2-21 SEO 메타태그 | ✅ | 0b4a121 | OG 태그, 이모지 파비콘 |
| S2-22 에러 바운더리 | ✅ | 0b4a121 | ErrorBoundary.tsx |
| S2-23 반응형 검증 | ✅ | 0b4a121 | 375px 기준 |
| S2-24 Vercel 배포 설정 | ✅ | 0b4a121 | vercel.json SPA 라우팅 |

### Sprint 3 — 예약 & 결제 (✅ 완료)
| 태스크 | 상태 | 비고 |
|--------|------|------|
| S3-01 useTourDates 훅 | ✅ | open 상태 날짜 조회, course_id 필터 |
| S3-02 useTourDateDetail 훅 | ✅ | 단건 조회 + courses JOIN, 잔여석/예약가능 계산 |
| S3-03 투어 날짜 → 예약 폼 이동 | ✅ | CourseDetail → /booking/:dateId 네비게이션 |
| S3-04 예약 폼 UI (Booking.tsx) | ✅ | 이름, 전화, 비상연락처, 인원, 특이사항, Zod 검증 |
| S3-05 useCreateBooking 훅 | ✅ | bookings INSERT (anon), participants JSON |
| S3-06 카카오페이 결제 (Payment.tsx) | ✅ | 비즈앱 등록 전 alert 처리, 실결제 코드 주석 보관 |
| S3-07 Vite 카카오페이 프록시 설정 | ✅ | vite.config.ts /kakaopay 프록시 |
| S3-08 tour_dates 시드 데이터 | ✅ | 10건 (7개 코스, 2026-04 ~ 2026-05) |
| S3-09 예약 완료 페이지 (BookingComplete) | ✅ | 체크 아이콘, 예약번호, 금액, 홈/마이페이지 버튼 |
| S3-10 마이페이지 예약 목록 (MyPage) | ✅ | bookings → tour_dates → courses JOIN, 상태 뱃지 |
| S3-11 CourseDetail 에러 처리 | ✅ | useTourDates isError 상태 분리 표시 |
| S3-12 카카오페이 실결제 연동 | 🔜 | 비즈앱 승인 후 Payment.tsx 주석 해제하여 복원 |
| S3-13 Vercel Serverless 함수 | 🔜 | api/ 폴더 존재, 배포 환경 결제 처리 |
| S1-07 카카오 로그인 (이월) | 🔜 | 카카오 비즈앱 미등록, account_email 권한 없음 |

### Sprint 4 — 마이페이지 & 안전 (⏳ 예정)
- 예약 상세 보기 (예약 카드 클릭 → 상세 페이지)
- 완주 기록
- 리뷰 작성
- 쿠폰/추천인
- 카카오 로그인 연동 (비즈앱 승인 후)
- 카카오페이 실결제 연동 (비즈앱 승인 후)
- Safety 페이지 구현 (긴급 연락처, 안전 가이드)

### Sprint 5 — 안전 & 오프라인 (⏳ 예정)
- 오프라인 지도
- 긴급 연락처
- 안전 가이드

### Sprint 6 — 출시 준비 (⏳ 예정)
- ridelaos.com 도메인 연결
- 성능 최적화
- Lighthouse 점수 90+
- 카카오 비즈앱 등록 완료

---

## 11. 주요 파일 구조 (Sprint 3 진행 기준)

```
src/
├── components/
│   ├── Layout.tsx           # 헤더 + 하단 네비 (max-w-[480px])
│   ├── LoginButton.tsx      # 카카오 로그인 버튼
│   ├── MapboxMap.tsx        # Mapbox 지도 컴포넌트 (S2-15~19)
│   └── ErrorBoundary.tsx    # 전역 에러 바운더리 (S2-22)
├── hooks/
│   ├── useAuth.ts           # 카카오 Auth
│   ├── useCourses.ts        # 코스 목록 조회 (Course 타입 export)
│   ├── useCourseDetail.ts   # 코스 상세 병렬 쿼리 (S2-20)
│   ├── useTourDates.ts      # 투어 날짜 조회 (S3-01)
│   ├── useTourDateDetail.ts # 투어 날짜 단건 + 코스 JOIN (S3-02)
│   ├── useCreateBooking.ts  # 예약 생성 mutation (S3-05)
│   └── useBookings.ts       # 예약 조회
├── lib/
│   └── supabase.ts          # Supabase 클라이언트
├── pages/
│   ├── Home.tsx             # 홈 (HeroBanner, FeaturedCourses, NoticeBanner)
│   ├── CourseList.tsx       # 코스 목록 (필터 탭, 카드 목록)
│   ├── CourseDetail.tsx     # 코스 상세 (지도, 날짜, 리뷰, 예약 버튼)
│   ├── Booking.tsx          # 예약 폼 (S3-04, Zod 검증)
│   ├── Payment.tsx          # 카카오페이 결제 (S3-06, 비즈앱 대기)
│   ├── BookingComplete.tsx  # 예약 완료 (S3-09)
│   ├── MyPage.tsx           # 마이페이지 (S3-10, 예약 목록)
│   ├── Safety.tsx           # 안전 가이드 (미구현)
│   └── AuthCallback.tsx     # 카카오 로그인 콜백
├── App.tsx                  # 라우팅 + ErrorBoundary
├── main.tsx                 # QueryClient, BrowserRouter
└── index.css                # Tailwind 디렉티브
api/                         # Vercel Serverless 함수 (카카오페이 등)
supabase/                    # 마이그레이션, 시드 SQL
scripts/                     # 유틸리티 스크립트
index.html                   # SEO 메타태그, OG 태그, 이모지 파비콘
vercel.json                  # SPA 라우팅 설정
vite.config.ts               # PWA + Workbox + 카카오페이 프록시
tailwind.config.js           # 디자인 토큰
```

---

## 12. 개발 원칙

1. .env.local 파일 GitHub 커밋 금지
2. Admin 키·service_role key 프론트엔드 노출 금지
3. Supabase RLS 비활성화 금지
4. 태스크 단위로 완료 확인 후 다음 진행
5. Cursor AI 대화창 태스크마다 새로 시작
6. 여러 태스크 동시 진행 금지

---

## 13. 카카오 설정

- **앱 ID:** 1392646
- **JavaScript 키:** 26b8f79af28f47d706959931eb971ad0
- **Redirect URI 등록:**
  - http://localhost:5173/auth/callback
  - https://ridelaos.com/auth/callback
  - https://ridelaos-mv.vercel.app/auth/callback
  - https://yljvrlzlxcgmlxmmjgcg.supabase.co/auth/v1/callback
- **S1-07 보류 이유:** 비즈앱 미등록으로 account_email 권한 없음
- **해결 방법:** 카카오 비즈앱 등록 후 Client Secret 발급 → Supabase 재설정
- **카카오페이:** TC0ONETIME (테스트 CID) 사용 중, 비즈앱 등록 후 실결제 CID 전환 필요
- **상태 (2026-03-01):** 비즈앱 등록 대기 중

---

## 14. 참고 사항

- PWA 아이콘 임시 파일 → workbox maximumFileSizeToCacheInBytes 10MB 설정
  → 실제 아이콘으로 교체 시 2MB로 줄일 것
- Git 브랜치: main (로컬 + GitHub 모두 main으로 통일)
- Vercel 프로젝트명: ridelaos-mv
- Supabase 프로젝트명: ridelaos (신규 URL: krzzeqjljxugrdafspqe.supabase.co)
- Mapbox 기본 중심: [102.6331, 17.9757] (비엔티안), zoom: 6
- course_waypoints 미입력 시 지도는 라오스 전체 뷰로 표시됨
