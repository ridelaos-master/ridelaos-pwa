// src/hooks/useReviews.ts
// S7-07: 리뷰 목록 관리 커스텀 훅

import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services/reviewService';
import type {
  Review,
  CourseRating,
  ReviewSortOption,
  ReviewFilterOption
} from '../types/review';

export function useReviews(courseId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [courseRating, setCourseRating] = useState<CourseRating | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ReviewSortOption>('latest');
  const [filter, setFilter] = useState<ReviewFilterOption>('all');
  const [loading, setLoading] = useState(true);
  const [helpfulSet, setHelpfulSet] = useState<Set<string>>(new Set());

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const [reviewResult, ratingResult] = await Promise.all([
        reviewService.getReviews(courseId, page, sort, filter),
        page === 1 ? reviewService.getCourseRating(courseId) : Promise.resolve(null)
      ]);

      setReviews(reviewResult.reviews);
      setTotal(reviewResult.total);

      if (ratingResult !== null) {
        setCourseRating(ratingResult);
      }

      // 도움됨 상태 조회
      const ids = reviewResult.reviews.map(r => r.id);
      const helpfuls = await reviewService.getUserHelpfuls(ids);
      setHelpfulSet(helpfuls);
    } catch (err) {
      console.error('리뷰 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, page, sort, filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 필터/정렬 변경 시 1페이지로 리셋
  const handleSortChange = (newSort: ReviewSortOption) => {
    setSort(newSort);
    setPage(1);
  };

  const handleFilterChange = (newFilter: ReviewFilterOption) => {
    setFilter(newFilter);
    setPage(1);
  };

  // 도움됨 토글
  const toggleHelpful = async (reviewId: string) => {
    try {
      const isHelpful = await reviewService.toggleHelpful(reviewId);
      setHelpfulSet(prev => {
        const next = new Set(prev);
        if (isHelpful) next.add(reviewId);
        else next.delete(reviewId);
        return next;
      });
      // UI 즉시 반영
      setReviews(prev =>
        prev.map(r =>
          r.id === reviewId
            ? { ...r, helpful_count: r.helpful_count + (isHelpful ? 1 : -1) }
            : r
        )
      );
    } catch (err) {
      console.error('도움됨 토글 실패:', err);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return {
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
    setSort: handleSortChange,
    setFilter: handleFilterChange,
    toggleHelpful,
    refetch: fetchReviews
  };
}
