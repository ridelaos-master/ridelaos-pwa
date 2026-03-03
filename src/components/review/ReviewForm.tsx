// src/components/review/ReviewForm.tsx
// S7-07: 리뷰 작성 폼 (별점 + 제목 + 내용 + 사진)

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import ReviewPhotoUpload from './ReviewPhotoUpload';
import { reviewService } from '../../services/reviewService';
import type { ReviewFormData } from '../../types/review';

interface ReviewFormProps {
  courseId: string;
  courseName: string;
  bookingId?: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ courseId, courseName, bookingId, onSuccess }: ReviewFormProps) {
  const { t, i18n } = useTranslation('review');
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ReviewFormData>({
    course_id: courseId,
    booking_id: bookingId,
    rating: 0,
    title: '',
    content: '',
    photos: [],
    language: (i18n.language as 'ko' | 'en' | 'lo') || 'ko'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = formData.rating > 0
    && formData.title.length >= 2
    && formData.content.length >= 10;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      await reviewService.createReview(formData);
      onSuccess?.();
      navigate(-1);
    } catch (err: any) {
      setError(err.message || t('form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t('form.title')}</h2>
        <p className="mt-1 text-sm text-gray-500">{courseName}</p>
      </div>

      {/* 별점 */}
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-600 mb-3">{t('form.ratingLabel')}</p>
        <div className="flex justify-center">
          <StarRating
            rating={formData.rating}
            size="lg"
            interactive
            onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
            showLabel
          />
        </div>
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('form.titleLabel')}
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder={t('form.titlePlaceholder')}
          maxLength={100}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm"
        />
        <p className="mt-1 text-xs text-gray-400 text-right">{formData.title.length}/100</p>
      </div>

      {/* 내용 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('form.contentLabel')}
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder={t('form.contentPlaceholder')}
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm resize-none"
        />
        <p className="mt-1 text-xs text-gray-400 text-right">{formData.content.length}/2000</p>
      </div>

      {/* 사진 업로드 */}
      <ReviewPhotoUpload
        photos={formData.photos}
        onChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
      />

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        className={`w-full py-4 rounded-2xl font-semibold text-white transition-all ${
          isValid && !submitting
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-200'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('form.submitting')}
          </span>
        ) : (
          t('form.submit')
        )}
      </button>
    </div>
  );
}
