import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { testConnection } from './lib/supabase'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { AuthCallback } from './pages/AuthCallback'
import { Home } from './pages/Home'
import { CourseList } from './pages/CourseList'
import { CourseDetail } from './pages/CourseDetail'
import { Booking } from './pages/Booking'
import { Payment } from './pages/Payment'
import { BookingComplete } from './pages/BookingComplete'
import { MyPage } from './pages/MyPage'
import { Safety } from './pages/Safety'

function App() {
  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-rl-bg font-sans text-rl-green">
      <ErrorBoundary>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/booking/:dateId" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/booking/complete" element={<BookingComplete />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/safety" element={<Safety />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
