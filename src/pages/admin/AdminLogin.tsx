import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { Lock, AlertCircle, Bike } from 'lucide-react'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // 약간의 딜레이로 브루트포스 방지
    setTimeout(() => {
      const success = login(password)
      if (success) {
        navigate('/admin')
      } else {
        setError('비밀번호가 올바르지 않습니다.')
        setPassword('')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* 로고 영역 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A3A2A]">
            <Bike className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A3A2A]">Ride Laos Admin</h1>
          <p className="mt-1 text-sm text-gray-500">관리자 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자 비밀번호 입력"
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#1A3A2A] focus:ring-1 focus:ring-[#1A3A2A]"
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full rounded-lg bg-[#1A3A2A] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? '확인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          비밀번호를 잊으셨다면 환경변수를 확인하세요.
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
