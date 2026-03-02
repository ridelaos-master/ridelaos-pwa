import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

const ADMIN_STORAGE_KEY = 'ridelaos_admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24시간

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 세션 복원
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(ADMIN_STORAGE_KEY)
      if (session) {
        const { expiry } = JSON.parse(session)
        if (Date.now() < expiry) {
          setIsAuthenticated(true)
        } else {
          sessionStorage.removeItem(ADMIN_STORAGE_KEY)
        }
      }
    } catch {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    }
  }, [])

  const login = useCallback((password: string): boolean => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('VITE_ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.')
      return false
    }

    if (password === adminPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify({ expiry: Date.now() + SESSION_DURATION })
      )
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(ADMIN_STORAGE_KEY)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
