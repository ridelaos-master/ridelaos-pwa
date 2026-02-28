# RIDELAOS_MASTER_CONTEXT.md
# Ride Laos PWA — 마스터 컨텍스트
# 최종 업데이트: 2026-02-28

---

## 1. 프로젝트 개요

- **프로젝트명:** Ride Laos PWA
- **목적:** 라오스 오토바이 투어 예약 앱
- **타겟:** 한국 남성 35~55세
- **개발자:** David (단독 개발, Cursor AI 활용)
- **로컬 경로:** C:\Projects\ridelaos-pwa

---

## 2. 기술 스택

- **프론트엔드:** React 18 + Vite + TypeScript + Tailwind CSS
- **백엔드:** Supabase (PostgreSQL + Auth + Storage)
- **지도:** Mapbox GL JS
- **상태관리:** React Query (TanStack Query)
- **라우팅:** React Router v6
- **폼:** React Hook Form + Zod
- **PWA:** vite-plugin-pwa + Workbox
- **배포:** Vercel
- **패키지매니저:** npm

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
| Supabase | https://yljvrlzlxcgmlxmmjgcg.supabase.co |
| 카카오 개발자 | https://developers.kakao.com/console/app/1392646 |
| 로컬 개발 | http://localhost:5173 |

---

## 5. 환경변수 (.env.local)

```
VITE_SUPABASE_URL=https://yljvrlzlxcgmlxmmjgcg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_eoxOvefbnBfw5eQw9ttl9Q_vgCMK8Vq...
VITE_KAKAO_APP_KEY=26b8f79af28f47d706959931eb971ad0
VITE_MAPBOX_TOKEN=pk.eyJ1IjoicmlkZWxhb3MiLCJhIjoiY21...
```

---

## 6. 디자인 토큰 (Tailwind)

```javascript
colors: {
  primary: '#1A3A2A',      // Deep Forest Green (헤더, 버튼)
  secondary: '#2D6A4F',    // Mid Green
  accent: '#F4A261',       // Warm Orange (강조)
  background: '#F5F5F5',   // 배경
  card: '#FFFFFF',
  success: '#D8F3DC',
  error: '#FADBD8'
}
borderRadius: { card: '16px', button: '8px' }
fontFamily: { sans: ['Arial', 'Noto Sans KR', 'sans-serif'] }
```

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
7. **reviews** (id, user_id, course_id, rating, content, photos)
8. **completions** (id, user_id, course_id, completed_at)
9. **coupons** (id, user_id, code, discount_rate, expires_at, used)
10. **referrals** (id, user_id, code, count)

### RLS 정책
- countries, regions, courses, tour_dates, course_waypoints, reviews → 전체 읽기 가능
- bookings, completions, coupons, referrals → 본인 데이터만

---

## 8. 7개 투어 코스

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
/booking/complete → BookingComplete
/mypage → MyPage
/safety → Safety
/auth/callback → AuthCallback
```

---

## 10. Sprint 진행 현황

### Sprint 1 — 기반 구축 (완료)
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

### Sprint 2 — 코스 목록 & 상세 (예정)
- 홈 화면 UI
- 코스 목록 페이지
- 코스 상세 페이지
- Mapbox 지도 연동
- 오프라인 타일 캐싱

### Sprint 3 — 예약 & 결제 (예정)
- 투어 날짜 선택
- 예약 폼
- 카카오페이 연동
- 예약 확인 페이지

### Sprint 4 — 마이페이지 (예정)
- 예약 내역
- 완주 기록
- 리뷰 작성
- 쿠폰/추천인

### Sprint 5 — 안전 & 오프라인 (예정)
- 오프라인 지도
- 긴급 연락처
- 안전 가이드

### Sprint 6 — 출시 준비 (예정)
- ridelaos.com 도메인 연결
- 성능 최적화
- Lighthouse 점수 90+
- 카카오 비즈앱 등록 완료

---

## 11. 주요 파일 구조

```
src/
├── components/
│   ├── Layout.tsx          # 헤더 + 하단 네비
│   └── LoginButton.tsx     # 카카오 로그인 버튼
├── hooks/
│   ├── useAuth.ts          # 카카오 Auth
│   ├── useCourses.ts       # 코스 조회
│   ├── useTourDates.ts     # 투어 날짜 조회
│   └── useBookings.ts      # 예약 조회
├── lib/
│   └── supabase.ts         # Supabase 클라이언트
├── pages/
│   ├── Home.tsx
│   ├── CourseList.tsx
│   ├── CourseDetail.tsx
│   ├── Booking.tsx
│   ├── Payment.tsx
│   ├── BookingComplete.tsx
│   ├── MyPage.tsx
│   ├── Safety.tsx
│   └── AuthCallback.tsx
└── App.tsx
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

---

## 14. 참고 사항

- PWA 아이콘 임시 파일 → workbox maximumFileSizeToCacheInBytes 10MB 설정
  → 실제 아이콘으로 교체 시 2MB로 줄일 것
- Git 브랜치: main (로컬 + GitHub 모두 main으로 통일)
- Vercel 프로젝트명: ridelaos-mv
- Supabase 프로젝트명: ridelaos
