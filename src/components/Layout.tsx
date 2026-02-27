import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { LoginButton } from './LoginButton'

export function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-rl-bg font-sans text-rl-green">
      <header
        className="flex items-center justify-between px-4 py-3 text-white shadow-card"
        style={{ backgroundColor: '#1A3A2A' }}
      >
        <h1 className="text-xl font-semibold">Ride Laos</h1>
        <LoginButton />
      </header>
      <main className="flex-1 overflow-auto p-4 pb-20">
        <Outlet />
      </main>
      <nav
        className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-white/10 py-2 text-sm"
        style={{ backgroundColor: '#1A3A2A' }}
      >
        <div className="mx-auto flex w-full max-w-[480px] justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 text-white/90 transition ${
              isActive ? 'font-semibold' : ''
            }`
          }
          style={({ isActive }) =>
            isActive ? { color: '#F4A261' } : undefined
          }
        >
          <span aria-hidden>🏠</span>
          <span>홈</span>
        </NavLink>
        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 text-white/90 transition ${
              isActive ? 'font-semibold' : ''
            }`
          }
          style={({ isActive }) =>
            isActive ? { color: '#F4A261' } : undefined
          }
        >
          <span aria-hidden>🗺️</span>
          <span>코스</span>
        </NavLink>
        <NavLink
          to="/mypage"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 text-white/90 transition ${
              isActive ? 'font-semibold' : ''
            }`
          }
          style={({ isActive }) =>
            isActive ? { color: '#F4A261' } : undefined
          }
        >
          <span aria-hidden>👤</span>
          <span>마이페이지</span>
        </NavLink>
        <NavLink
          to="/safety"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 text-white/90 transition ${
              isActive ? 'font-semibold' : ''
            }`
          }
          style={({ isActive }) =>
            isActive ? { color: '#F4A261' } : undefined
          }
        >
          <span aria-hidden>🛡️</span>
          <span>안전</span>
        </NavLink>
        </div>
      </nav>
    </div>
  )
}
