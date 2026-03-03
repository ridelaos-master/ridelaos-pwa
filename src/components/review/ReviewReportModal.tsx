// src/components/review/ReviewReportModal.tsx
// S7-07: 리뷰 신고 모달 (5가지 사유 + 기타 설명)

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reviewService } from '../../services/reviewService';

interface ReviewReportModalProps {
  reviewId: string;
  onClose: () => void;
}

const REASONS = ['spam', 'inappropriate', 'fake', 'offensive', 'other'] as const;

export default function ReviewReportModal({ reviewId, onClose }: ReviewReportModalProps) {
  const { t } = useTranslation('review');
  const [reason, setReason] = useState<typeof REASONS[number] | ''>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!reason || submitting) return;

    setSubmitting(true);
    try {
      await reviewService.reportReview({
        review_id: reviewId,
        reason,
        description: description || undefined
      });
      setDone(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">{t('report.success')}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{t('report.title')}</h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    reason === r
                      ? 'bg-orange-50 border-2 border-orange-400 text-orange-700 font-medium'
                      : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t(`report.reasons.${r}`)}
                </button>
              ))}
            </div>

            {reason === 'other' && (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('report.descriptionPlaceholder')}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={!reason || submitting}
              className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                reason && !submitting
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitting ? t('report.submitting') : t('report.submit')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
