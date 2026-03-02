import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import {
  LayoutDashboard,
  CalendarCheck,
  Map,
  CalendarDays,
  Star,
  FileText,
  LogOut,
  Bike,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: '대시보드', end: true },
  { to: '/admin/bookings', icon: CalendarCheck, label: '예약 관리', end: false },
  { to: '/admin/courses', icon: Map, label: '코스 관리', end: false },
  { to: '/admin/tour-dates', icon: CalendarDays, label: '투어 날짜', end: false },
  { to: '/admin/reviews', icon: Star, label: '리뷰 관리', end: false },
  { to: '/admin/content', icon: FileText, label: '콘텐츠', end: false },
]

export function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#1A3A2A] text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A3A2A]'
    }`

  const SidebarContent = () => (
    <>
      {/* 로고 */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A3A2A]">
          <Bike className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1A3A2A]">Ride Laos</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={navLinkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 하단 */}
      <div className="border-t border-gray-100 px-3 py-4">
        <NavLink
          to="/"
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
        >
          🌐 사이트 보기
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 데스크톱 사이드바 */}
      <aside className="hidden w-60 flex-col border-r border-gray-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex h-full w-60 flex-col bg-white shadow-lg">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 모바일 헤더 */}
        <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Bike className="h-5 w-5 text-[#1A3A2A]" />
            <span className="text-sm font-bold text-[#1A3A2A]">Ride Laos Admin</span>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout