import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const finishAuth = async () => {
      await supabase.auth.getSession()
      navigate('/', { replace: true })
    }
    finishAuth()
  }, [navigate])

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-rl-green-mid">로그인 처리 중...</p>
    </div>
  )
}
