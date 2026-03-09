import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'

export function LoginButton() {
  const { i18n } = useTranslation()
  const { user, loading, signInWithKakao, signOut } = useAuth()

  if (loading) {
    return (
      <span className="text-sm text-white/80">로딩 중...</span>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/90 truncate max-w-[140px]">
          {user.user_metadata?.nickname ?? user.user_metadata?.name ?? '라이더'}
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded-btn bg-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/30"
        >
          로그아웃
        </button>
      </div>
    )
  }

  // 카카오 로그인은 한국어 환경에서만 표시
  if (i18n.language !== 'ko') return null

  return (
    <button
      type="button"
      onClick={() => signInWithKakao()}
      className="rounded-btn px-4 py-2 text-sm font-semibold text-[#000000] transition hover:opacity-90"
      style={{ backgroundColor: '#FEE500' }}
    >
      🟡 카카오로 시작하기
    </button>
  )
}
