import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import RideHomePage from './pages/RideHomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import CompletePage from './pages/CompletePage';
import MypagePage from './pages/MypagePage';
import SafetyPage from './pages/SafetyPage';

function App() {
  return (
    <div className="min-h-screen bg-rl-bg">
      <Routes>
        <Route element={<MainLayout />}>
          {/* 공개 */}
          <Route path="/" element={<RideHomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* 보호: 로그인 필요 */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complete"
            element={
              <ProtectedRoute>
                <CompletePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MypagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safety"
            element={
              <ProtectedRoute>
                <SafetyPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
