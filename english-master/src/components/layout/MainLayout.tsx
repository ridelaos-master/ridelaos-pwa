import { Outlet, NavLink } from 'react-router-dom';

function IconHome() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function IconCourse() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function IconBooking() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IconNotification() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

const navItems = [
  { to: '/', end: true, label: '홈', icon: IconHome },
  { to: '/courses', end: false, label: '코스', icon: IconCourse },
  { to: '/bookings', end: false, label: '예약확인', icon: IconBooking },
  { to: '/mypage', end: false, label: '마이페이지', icon: IconUser },
] as const;

export default function MainLayout() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-rl-bg">
      {/* 상단 헤더: 로고 + 알림 */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 h-14 bg-white safe-area-pt shadow-[0_1px_0_0_rgba(26,58,42,0.06)]">
        <h1 className="text-lg font-semibold text-rl-green tracking-tight antialiased">
          Ride Laos
        </h1>
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 -mr-1 text-rl-green/90 hover:text-rl-green hover:bg-rl-bg rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rl-green/20 focus-visible:ring-offset-2"
          aria-label="알림"
        >
          <IconNotification />
        </button>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-auto min-h-0">
        <Outlet />
      </main>

      {/* 하단 탭 바: 모바일 UI 최적화 */}
      <nav className="flex-shrink-0 bg-white safe-area-pb shadow-[0_-1px_0_0_rgba(26,58,42,0.06)]">
        <div className="flex">
          {navItems.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-3 gap-1.5 min-h-[56px] transition-all duration-200 touch-manipulation border-t-2 ${
                  isActive
                    ? 'text-rl-green border-rl-green bg-rl-bg/30'
                    : 'text-neutral-400 border-transparent hover:text-rl-green-mid active:bg-rl-bg/50'
                }`
              }
            >
              <Icon />
              <span className="text-[11px] font-medium tracking-tight">
                {label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
