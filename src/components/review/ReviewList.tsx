// src/components/review/ReviewList.tsx
// S7-07: 리뷰 목록 (필터 칩 + 정렬 + 스켈레톤 + 페이지네이션)

import { useTranslation } from 'react-i18next';
import ReviewCard from './ReviewCard';
import type { Review, ReviewSortOption, ReviewFilterOption } from '../../types/review';

interface ReviewListProps {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
  sort: ReviewSortOption;
  filter: ReviewFilterOption;
  loading: boolean;
  helpfulSet: Set<string>;
  onSortChange: (sort: ReviewSortOption) => void;
  onFilterChange: (filter: ReviewFilterOption) => void;
  onPageChange: (page: number) => void;
  onToggleHelpful: (reviewId: string) => void;
  currentUserId?: string;
}

const SORT_OPTIONS: { value: ReviewSortOption; labelKey: string }[] = [
  { value: 'latest', labelKey: 'sort.latest' },
  { value: 'highest', labelKey: 'sort.highest' },
  { value: 'lowest', labelKey: 'sort.lowest' },
  { value: 'helpful', labelKey: 'sort.helpful' },
];

const FILTER_OPTIONS: { value: ReviewFilterOption; labelKey: string }[] = [
  { value: 'all', labelKey: 'filter.all' },
  { value: '5', labelKey: 'filter.5star' },
  { value: '4', labelKey: 'filter.4star' },
  { value: '3', labelKey: 'filter.3star' },
  { value: '2', labelKey: 'filter.2star' },
  { value: '1', labelKey: 'filter.1star' },
  { value: 'with_photos', labelKey: 'filter.withPhotos' },
];

export default function ReviewList({
  reviews,
  total,
  page,
  totalPages,
  sort,
  filter,
  loading,
  helpfulSet,
  onSortChange,
  onFilterChange,
  onPageChange,
  onToggleHelpful,
  currentUserId
}: ReviewListProps) {
  const { t } = useTranslation('review');

  return (
    <div className="space-y-4">
      {/* 필터 & 정렬 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* 필터 칩 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === opt.value
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>

        {/* 정렬 드롭다운 */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as ReviewSortOption)}
          className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-600 focus:border-orange-400 outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {/* 리뷰 수 */}
      <p className="text-sm text-gray-500">
        {t('list.total', { count: total })}
      </p>

      {/* 리뷰 목록 */}
      {loading ? (
        // 스켈레톤 로딩
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-32 bg-gray-100 rounded mb-2" />
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-2/3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        // 빈 상태
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">{t('list.empty')}</p>
        </div>
      ) : (
        // 리뷰 카드 목록
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isHelpful={helpfulSet.has(review.id)}
              onToggleHelpful={onToggleHelpful}
              isOwn={review.user_id === currentUserId}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-2 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-100 transition-colors"
          >
            ‹
          </button>
          {getPageNumbers(page, totalPages).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                page === pageNum
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-2 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-100 transition-colors"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 페이지 번호 계산 유틸 ───
function getPageNumbers(current: number, total: number): number[] {
  const maxVisible = 5;
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, 5];
  }
  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total];
  }
  return [current - 2, current - 1, current, current + 1, current + 2];
}
