// src/components/review/ReviewSection.tsx
// S7-07: 코스 상세 페이지용 리뷰 통합 섹션
// 사용법: <ReviewSection courseId={course.id} courseName={course.name} />

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useReviews } from '../../hooks/useReviews';
import ReviewSummary from './ReviewSummary';
import ReviewList from './ReviewList';

interface ReviewSectionProps {
  courseId: string;
  courseName: string;
}

export default function ReviewSection({ courseId, courseName }: ReviewSectionProps) {
  const { t } = useTranslation('review');
  const navigate = useNavigate();
  const {
    reviews,
    courseRating,
    total,
    page,
    totalPages,
    sort,
    filter,
    loading,
    helpfulSet,
    setPage,
    setSort,
    setFilter,
    toggleHelpful
  } = useReviews(courseId);

  return (
    <section className="space-y-5">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          {t('section.title')}
          {courseRating && courseRating.review_count > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({courseRating.review_count})
            </span>
          )}
        </h3>
        <button
          onClick={() => navigate(`/review/write?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`)}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
        >
          {t('section.writeReview')}
        </button>
      </div>

      {/* 평점 요약 */}
      {courseRating && courseRating.review_count > 0 && (
        <ReviewSummary rating={courseRating} />
      )}

      {/* 리뷰 목록 */}
      <ReviewList
        reviews={reviews}
        total={total}
        page={page}
        totalPages={totalPages}
        sort={sort}
        filter={filter}
        loading={loading}
        helpfulSet={helpfulSet}
        onSortChange={setSort}
        onFilterChange={setFilter}
        onPageChange={setPage}
        onToggleHelpful={toggleHelpful}
      />
    </section>
  );
}
