// src/components/review/ReviewSummary.tsx
// S7-07: 코스 평점 요약 (평균 점수 + 별점 분포 바 차트)

import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import type { CourseRating } from '../../types/review';

interface ReviewSummaryProps {
  rating: CourseRating;
}

export default function ReviewSummary({ rating }: ReviewSummaryProps) {
  const { t } = useTranslation('review');

  const bars = [
    { label: '5', count: rating.five_star },
    { label: '4', count: rating.four_star },
    { label: '3', count: rating.three_star },
    { label: '2', count: rating.two_star },
    { label: '1', count: rating.one_star },
  ];

  const maxCount = Math.max(...bars.map(b => b.count), 1);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6">
      <div className="flex items-center gap-6">
        {/* 왼쪽: 평균 점수 */}
        <div className="text-center flex-shrink-0">
          <div className="text-5xl font-extrabold text-gray-900">
            {rating.avg_rating}
          </div>
          <StarRating rating={Math.round(rating.avg_rating)} size="sm" />
          <p className="mt-1 text-xs text-gray-500">
            {t('summary.totalReviews', { count: rating.review_count })}
          </p>
        </div>

        {/* 오른쪽: 분포 바 */}
        <div className="flex-1 space-y-1.5">
          {bars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3 text-right">{bar.label}</span>
              <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
                  style={{ width: `${(bar.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">{bar.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
