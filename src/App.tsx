import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { testConnection } from './lib/supabase'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { AdminRoute } from './components/AdminRoute'

// 기존 페이지 (lazy)
const AuthCallback = lazy(() => import('./pages/AuthCallback').then(m => ({ default: m.AuthCallback })))
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const CourseList = lazy(() => import('./pages/CourseList').then(m => ({ default: m.CourseList })))
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(m => ({ default: m.CourseDetail })))
const Booking = lazy(() => import('./pages/Booking').then(m => ({ default: m.Booking })))
const Payment = lazy(() => import('./pages/Payment').then(m => ({ default: m.Payment })))
const BookingComplete = lazy(() => import('./pages/BookingComplete').then(m => ({ default: m.BookingComplete })))
const MyPage = lazy(() => import('./pages/MyPage').then(m => ({ default: m.MyPage })))
const Safety = lazy(() => import('./pages/Safety'))
const BikeRental = lazy(() => import('./pages/BikeRental').then(m => ({ default: m.BikeRental })))
const TravelInfo = lazy(() => import('./pages/TravelInfo').then(m => ({ default: m.TravelInfo })))
const TravelInfoDetail = lazy(() => import('./pages/TravelInfoDetail').then(m => ({ default: m.TravelInfoDetail })))
const ReviewWritePage = lazy(() => import('./pages/ReviewWritePage'))

// 관리자 페이지 (lazy)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./components/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'))
const AdminTourDates = lazy(() => import('./pages/admin/AdminTourDates'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'))
const AdminContent = lazy(() => import('./pages/admin/AdminContent'))

function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-rl-green border-t-transparent" />
        <p className="text-sm text-gray-400">로딩 중...</p>
      </div>
    </div>
  )
}

function App() {
  useEffect(() => { testConnection() }, [])

  return (
    <div className="min-h-screen bg-rl-bg font-sans text-rl-green">
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* 기존 사용자 라우트 */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/booking/:dateId" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/booking-complete" element={<BookingComplete />} />
            <Route path="/review/write" element={<ReviewWritePage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/rent" element={<BikeRental />} />
              <Route path="/travel-info" element={<TravelInfo />} />
              <Route path="/travel-info/:categoryId" element={<TravelInfoDetail />} />
            </Route>

            {/* 관리자 라우트 */}
            <Route
              path="/admin/login"
              element={
                <AdminAuthProvider>
                  <AdminLogin />
                </AdminAuthProvider>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminAuthProvider>
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                </AdminAuthProvider>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="tour-dates" element={<AdminTourDates />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="content" element={<AdminContent />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
