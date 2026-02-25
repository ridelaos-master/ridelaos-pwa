# RIDELAOS_MASTER_CONTEXT.md
# Ride Laos — 프로젝트 마스터 컨텍스트
# 이 파일을 Claude·Cursor AI 대화 시작 시 항상 첨부하세요
# 마지막 업데이트: 2026-02-24

---

## 🏍️ 프로젝트 한 줄 요약
라오스 현지 3년 운영 기반의 한국인 특화 오토바이 라이딩 투어 예약 PWA 앱

---

## 👤 운영자 정보
- 대표: David (한국인, 라오스 비엔티안 거주)
- 운영 경력: 라오스 현지 오토바이 투어 3년
- 개발 방식: 혼자 직접 개발 (Cursor AI 활용) + 일부 외주
- 현재 위치: Phase 0 진행 중

---

## 🎯 서비스 정의
- **앱 이름**: Ride Laos
- **브랜드 약자**: RL
- **도메인**: ridelaos.com (단일 도메인)
- **타깃**: 한국인 남성 35~55세, 오토바이 동호회 회원
- **핵심 차별화 3가지**:
  1. 오프라인 생존 지도 (비행기 모드에서도 작동)
  2. 한국어 UI + 카카오 생태계 (로그인·결제·알림톡)
  3. 안전 시스템 (긴급출동 버튼 → GPS → 카카오채널 연결)
- **수익 모델**: 투어 패키지 직접 판매 (1인 ₩480,000~1,500,000)
- **목표**: 1년차 160명, BEP 런칭 후 4~6개월

---

## 🗺️ 7대 코스
| 코스 | 지역 | 기간 | 가격 | 최소인원 |
|------|------|------|------|----------|
| A | 비엔티안-방비엥 | 2박3일 | ₩480,000~ | 2명 |
| B | 방비엥 어드벤처 | 4박5일 | ₩720,000~ | 3명 |
| C | 루앙프라방 문화 | 3박4일 | ₩650,000~ | 2명 |
| D | 비엔티안 근교 | 1박2일 | ₩280,000~ | 2명 |
| E | 타켁 루프 | 4박5일 | ₩1,100,000~ | 3명 |
| F | 볼라벤 고원 | 3박4일 | ₩980,000~ | 3명 |
| G | 라오스 종단 | 7박8일 | ₩1,500,000~ | 4명 |

---

## 🛠️ 기술 스택 (확정)
```
프론트엔드:  React 18 + Vite + TypeScript + Tailwind CSS
상태관리:    React Query (서버) + Context API (UI)
DB·Auth:     Supabase (PostgreSQL + Storage + Edge Functions)
지도:        Mapbox GL JS (오프라인 타일 캐싱)
오프라인:    Vite PWA + Workbox
결제:        카카오페이 글로벌 API (주) + Stripe (보조)
알림:        카카오 알림톡 API
분석:        PostHog
배포:        Vercel (GitHub 자동 배포)
개발도구:    Cursor AI + GitHub
```

---

## 🗄️ DB 스키마 (5계층 구조)
```sql
countries     (id, code, name_ko, currency)
regions       (id, country_id, name_ko, lat, lng)
courses       (id, region_id, name_ko, difficulty, distance_km,
               duration_days, min_pax, price_krw, gpx_url,
               offline_tile_url, description_ko, photos)
tour_dates    (id, course_id, departure_date, available_seats,
               current_pax DEFAULT 0,
               status: 'open'|'confirmed'|'closed')
bookings      (id, tour_date_id, user_id, party_size,
               total_price_krw,
               payment_status: 'pending'|'paid'|'failed'|'cancelled',
               kakao_order_id, is_group_booking, participants,
               coupon_code, discount_amount)

course_waypoints (id, course_id, name_ko, lat, lng,
                  type: 'photospot'|'gas'|'hospital'|'accommodation')
reviews          (id, user_id, course_id, rating, content, photos)
completions      (id, user_id, course_id, completed_at)
coupons          (id, user_id, code, discount_rate, expires_at, used)
referrals        (id, user_id, code, count)
```

---

## 📱 화면 구조
```
1. 홈 화면          ← Stitch 시제품 완성 ✅
2. 코스 선택        ← Stitch 시제품 완성 ✅
3. 코스 상세        ← Stitch 시제품 완성 ✅
4. 일정·인원 선택   ← Stitch 시제품 완성 ✅
5. 결제하기         ← Stitch 시제품 완성 ✅
6. 예약 완료        ← Stitch 시제품 완성 ✅
7. 마이페이지       ← 미제작
8. 안전 페이지      ← 미제작
9. 관리자 대시보드  ← 미제작
```

---

## 🎨 디자인 시스템 (확정)
```
Primary:       #1A3A2A  (Deep Forest Green)
Secondary:     #2D6A4F  (Mid Green)
Accent:        #F4A261  (Warm Orange)
Background:    #F5F5F5  (Light Gray)
Card:          #FFFFFF  + shadow: 0 2px 12px rgba(0,0,0,0.08)
Success:       #D8F3DC  (Light Green)
Error:         #FADBD8  (Light Red)
Font:          Arial / Korean-friendly sans-serif
Border radius: 12~16px (카드), 8px (버튼)
예약번호 prefix: RL-YYYYMMDD (예: RL-20261105)
```

---

## 🔑 API 키 위치
```
⚠️ 실제 키 값은 이 파일에 절대 저장하지 마세요

.env.local 위치:  /ridelaos-pwa/.env.local
Vercel 환경변수:  Vercel 대시보드 > ridelaos-pwa > Settings > Env Variables
키 백업 위치:     Notion 비공개 페이지 또는 1Password

필요한 키 목록:
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY:sb_publishable_eoxOvefbnBfw5eQw9ttl9Q_vgCMK8Vq
VITE_KAKAO_APP_KEY          (JavaScript 키)
VITE_MAPBOX_TOKEN
KAKAO_REST_API_KEY          (서버용)
KAKAO_ADMIN_KEY             (서버용 — 절대 프론트엔드 노출 금지)
KAKAO_PAY_CID
KAKAO_PAY_SECRET
STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY           (서버용)
POSTHOG_API_KEY
```

---

## 🔗 프로젝트 링크
```
GitHub:      https://github.com/[계정]/ridelaos-pwa  (Private)
Vercel:      https://ridelaos-pwa.vercel.app
Production:  https://ridelaos.com   ← Sprint 6 후 연결
Supabase:    https://yljvrlzlxcgmlxmmjgcg.supabase.co
카카오채널:   http://pf.kakao.com/_anAqX

---

## 📋 전체 개발 로드맵
```
Phase 0   사전 준비          ⏳ 진행 중
Sprint 1  기반 구축          ⬜ 대기  (1~2주차)
Sprint 2  코스·지도·안전     ⬜ 대기  (3~9주차)
Sprint 3  예약·결제·알림톡   ⬜ 대기  (10~13주차) ← 외주 검토
Sprint 4  마이페이지·바이럴  ⬜ 대기  (14~15주차)
Sprint 5  SEO·최적화         ⬜ 대기  (16~17주차)
Sprint 6  런칭               ⬜ 대기  (18주차)
```

---

## ✅ 완료된 작업

### 기획·설계
- [x] 사업계획서 v5.0 완성
- [x] 전체 WBS 작업명세서 완성 (62개 태스크)
- [x] Stitch UI 시제품 완성 (6개 화면)
- [x] 예약 흐름 5단계 설계
- [x] 마스터 컨텍스트 파일 생성

### Phase 0 — 사전 준비
- [x] P-01 도메인 등록 — ridelaos.com
- [x] P-02 카카오 개발자 앱 등록
- [x] P-03 카카오 로그인 설정
- [x] P-04 카카오톡 채널 개설
- [ ] P-05 카카오페이 글로벌 가맹점 신청 ← 가장 먼저!
- [x] P-06 Supabase 프로젝트 생성
- [x] P-07 GitHub 레포지토리 생성 (ridelaos-pwa)
- [x] P-08 Vercel 프로젝트 연결
- [ ] P-09 Mapbox API 키 발급
- [ ] P-10 타켁·팍세 파트너 계약 착수
- [ ] P-11 콘텐츠 준비 착수

---

## ⏳ 현재 진행 중
```
[ Phase 0 — 사전 준비 시작 ]

우선순위:
1순위: P-05 카카오페이 가맹점 신청 (심사 2~4주 소요)
2순위: P-01~P-04, P-06~P-09 순서대로

Phase 0 작업명세서: 별도 docx 파일 참고
```

---

## ❗ 미결 이슈
```
없음 (Phase 0 새로 시작)
```

---

## 🚫 개발 원칙
```
1. .env.local 파일을 GitHub에 커밋하지 말 것
2. Admin 키·service_role key를 프론트엔드에 넣지 말 것
3. 카카오페이 Production 키는 심사 완료 전 사용 금지
4. Supabase RLS 비활성화하지 말 것
5. 태스크 단위로 완료 후 다음 태스크 진행
```

---

## 💡 Claude·Cursor AI 사용법
```
새 대화 시작 시:
"Ride Laos PWA 개발 중이야.
이 파일이 프로젝트 컨텍스트야: [이 파일 첨부]
오늘 할 작업: [태스크 내용]"

태스크 완료 후 업데이트 요청:
"마스터 컨텍스트 업데이트해줘.
완료: [항목]
다음: [항목]"
```

---

## 📞 외주 발주 인수인계 패키지
```
전달 5가지:
1. 이 파일 (RIDELAOS_MASTER_CONTEXT.md)
2. 해당 스프린트 작업명세서 docx
3. Stitch 시제품 이미지 6장
4. GitHub ridelaos-pwa Collaborator 초대
5. Supabase 읽기 전용 접근

외주 추천 태스크:
S2-07  오프라인 캐싱:    $300~400
S3-04  카카오페이 연동:  $400~600
S3-08  알림톡 자동화:    $300~400
```

---

## 🔄 업데이트 루틴
```
태스크 완료마다:
1. git commit -m "완료: [태스크번호] [태스크명]"
2. Claude에게 컨텍스트 업데이트 요청
3. git add RIDELAOS_MASTER_CONTEXT.md && git commit
```

---
*이 파일은 Ride Laos 프로젝트의 단일 진실 공급원(Single Source of Truth)입니다.*
