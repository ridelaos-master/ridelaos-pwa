// src/pages/ReviewWritePage.tsx
// S7-07: 리뷰 작성 전용 페이지
// 라우트: /review/write?courseId=xxx&courseName=xxx&bookingId=xxx

import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReviewForm from '../components/review/ReviewForm';

export default function ReviewWritePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation('review');

  const courseId = searchParams.get('courseId') || '';
  const courseName = decodeURIComponent(searchParams.get('courseName') || '');
  const bookingId = searchParams.get('bookingId') || undefined;

  if (!courseId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-gray-500">잘못된 접근입니다.</p>
        <button
          onClick={() => navigate('/')}
          className="text-orange-500 text-sm font-medium hover:underline"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-900">{t('form.title')}</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* 리뷰 작성 폼 */}
      <ReviewForm
        courseId={courseId}
        courseName={courseName}
        bookingId={bookingId}
      />
    </div>
  );
}
