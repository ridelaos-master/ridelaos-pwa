// src/services/reviewService.ts
// S7-07: 리뷰 Supabase API 서비스

import { supabase } from '../lib/supabase';
import type {
  Review,
  CourseRating,
  ReviewFormData,
  ReviewReport,
  ReviewSortOption,
  ReviewFilterOption
} from '../types/review';

const PAGE_SIZE = 10;

export const reviewService = {
  // ─── 코스별 리뷰 목록 조회 ───
  async getReviews(
    courseId: string,
    page: number = 1,
    sort: ReviewSortOption = 'latest',
    filter: ReviewFilterOption = 'all'
  ): Promise<{ reviews: Review[]; total: number }> {
    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('course_id', courseId)
      .eq('is_visible', true);

    // 필터
    if (filter === 'with_photos') {
      query = query.not('photos', 'eq', '{}');
    } else if (filter !== 'all') {
      query = query.eq('rating', parseInt(filter));
    }

    // 정렬
    switch (sort) {
      case 'latest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'highest':
        query = query.order('rating', { ascending: false }).order('created_at', { ascending: false });
        break;
      case 'lowest':
        query = query.order('rating', { ascending: true }).order('created_at', { ascending: false });
        break;
      case 'helpful':
        query = query.order('helpful_count', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    // 페이지네이션
    const from = (page - 1) * PAGE_SIZE;
    query = query.range(from, from + PAGE_SIZE - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      reviews: (data as Review[]) || [],
      total: count || 0
    };
  },

  // ─── 코스 평점 요약 조회 ───
  async getCourseRating(courseId: string): Promise<CourseRating | null> {
    const { data, error } = await supabase
      .from('course_ratings')
      .select('*')
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as CourseRating | null;
  },

  // ─── 리뷰 작성 ───
  async createReview(formData: ReviewFormData): Promise<Review> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    // 중복 리뷰 체크
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', formData.course_id)
      .single();

    if (existing) throw new Error('이미 이 코스에 리뷰를 작성하셨습니다');

    // 사진 업로드
    const photoUrls: string[] = [];
    for (const file of formData.photos) {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('review-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('review-photos')
        .getPublicUrl(fileName);

      photoUrls.push(publicUrl);
    }

    // 예약 확인 → is_verified
    let isVerified = false;
    if (formData.booking_id) {
      const { data: booking } = await supabase
        .from('bookings')
        .select('id')
        .eq('id', formData.booking_id)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .single();

      isVerified = !!booking;
    }

    // 리뷰 저장
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        course_id: formData.course_id,
        booking_id: formData.booking_id || null,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        photos: photoUrls,
        language: formData.language,
        is_verified: isVerified
      })
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  // ─── 리뷰 수정 ───
  async updateReview(
    reviewId: string,
    updates: Partial<Pick<Review, 'rating' | 'title' | 'content' | 'photos'>>
  ): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  // ─── 리뷰 삭제 ───
  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  },

  // ─── 도움됨 토글 ───
  async toggleHelpful(reviewId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    const { data: existing } = await (supabase
      .from('review_helpfuls' as any)
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .single() as any);

    if (existing) {
      await (supabase
        .from('review_helpfuls' as any)
        .delete()
        .eq('id', existing.id) as any);
      return false; // 도움됨 해제
    } else {
      await (supabase
        .from('review_helpfuls' as any)
        .insert({ review_id: reviewId, user_id: user.id }) as any);
      return true; // 도움됨 추가
    }
  },

  // ─── 사용자가 도움됨 표시한 리뷰 ID 목록 ───
  async getUserHelpfuls(reviewIds: string[]): Promise<Set<string>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || reviewIds.length === 0) return new Set();

    const { data } = await (supabase
      .from('review_helpfuls' as any)
      .select('review_id')
      .eq('user_id', user.id)
      .in('review_id', reviewIds) as any);

    return new Set((data || []).map((h: any) => h.review_id));
  },

  // ─── 리뷰 신고 ───
  async reportReview(report: ReviewReport): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    const { error } = await (supabase
      .from('review_reports' as any)
      .insert({
        ...report,
        user_id: user.id
      }) as any);

    if (error) {
      if (error.code === '23505') throw new Error('이미 신고한 리뷰입니다');
      throw error;
    }
  },

  // ─── 내 리뷰 조회 ───
  async getMyReviews(): Promise<Review[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Review[]) || [];
  }
};
