# S3-07 카카오페이 로컬 테스트 (Vercel Dev)

## 1. Vercel CLI 설치 ✅
```bash
npm install -g vercel
```

## 2. 로그인 및 프로젝트 연결
브라우저에서 로그인 후 터미널에서:
```bash
vercel login    # 브라우저 열리면 완료까지 진행
vercel link     # 프로젝트 선택 후 연결
```

## 3. 환경 변수 등록 (로컬 Development용)
**PowerShell:**
```powershell
cd c:\Projects\ridelaos-pwa

# KAKAO_PAY_SECRET (Development, Preview, Production 각각)
"49091ae2c1bcd5d432f707b6fd5a4803" | vercel env add KAKAO_PAY_SECRET development
"49091ae2c1bcd5d432f707b6fd5a4803" | vercel env add KAKAO_PAY_SECRET preview
"49091ae2c1bcd5d432f707b6fd5a4803" | vercel env add KAKAO_PAY_SECRET production

# VITE_APP_URL (Development만 - 로컬 결제 콜백)
"http://localhost:3000" | vercel env add VITE_APP_URL development
```

**참고:** 이미 `.env.local`에 값이 있으면 `vercel dev`가 로컬에서 해당 파일을 읽을 수 있습니다.  
Vercel 대시보드에 등록해 두면 배포/Preview에서도 동일한 값 사용 가능합니다.

## 4. Vercel Dev 서버 실행
```bash
vercel dev
```
→ **http://localhost:3000** 에서 앱 + `/api/kakaopay-ready` 등 API 동작

## 5. Payment.tsx
`fetch('/api/kakaopay-ready')` 그대로 사용.  
`vercel dev` 시 origin이 `http://localhost:3000`이므로 `/api` 요청이 자동 처리됩니다.
