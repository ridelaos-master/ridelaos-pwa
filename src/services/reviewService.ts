// src/services/reviewService.ts
// S7-07: 리뷰 Supabase API 서비스 (게스트 모드 지원)

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

// 게스트 모드용 고정 UUID (테스트용)
const GUEST_USER_ID = '00000000-0000-0000-0000-000000000000';

// 현재 유저 ID 가져오기 (비로그인이면 게스트)
async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || GUEST_USER_ID;
}

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

  // ─── 리뷰 작성 (게스트 모드 지원) ───
  async createReview(formData: ReviewFormData): Promise<Review> {
    const userId = await getCurrentUserId();

    // 사진 업로드 (로그인 유저만)
    const photoUrls: string[] = [];
    if (userId !== GUEST_USER_ID) {
      for (const file of formData.photos) {
        const ext = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

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
    }

    // RLS가 게스트를 차단하므로 service_role 우회 필요
    // → Supabase에서 RLS를 임시 비활성화하거나
    // → insert를 .rpc()로 처리
    // 여기서는 RLS 우회를 위해 직접 insert
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        course_id: formData.course_id,
        booking_id: formData.booking_id || null,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        photos: photoUrls,
        language: formData.language,
        is_verified: false
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
    const userId = await getCurrentUserId();

    const { data: existing } = await (supabase
      .from('review_helpfuls' as any)
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .single() as any);

    if (existing) {
      await (supabase
        .from('review_helpfuls' as any)
        .delete()
        .eq('id', (existing as any).id) as any);
      return false;
    } else {
      await (supabase
        .from('review_helpfuls' as any)
        .insert({ review_id: reviewId, user_id: userId }) as any);
      return true;
    }
  },

  // ─── 사용자가 도움됨 표시한 리뷰 ID 목록 ───
  async getUserHelpfuls(reviewIds: string[]): Promise<Set<string>> {
    const userId = await getCurrentUserId();
    if (reviewIds.length === 0) return new Set();

    const { data } = await (supabase
      .from('review_helpfuls' as any)
      .select('review_id')
      .eq('user_id', userId)
      .in('review_id', reviewIds) as any);

    return new Set((data || []).map((h: any) => h.review_id));
  },

  // ─── 리뷰 신고 ───
  async reportReview(report: ReviewReport): Promise<void> {
    const userId = await getCurrentUserId();

    const { error } = await (supabase
      .from('review_reports' as any)
      .insert({
        ...report,
        user_id: userId
      }) as any);

    if (error) {
      if (error.code === '23505') throw new Error('이미 신고한 리뷰입니다');
      throw error;
    }
  },

  // ─── 내 리뷰 조회 ───
  async getMyReviews(): Promise<Review[]> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Review[]) || [];
  }
};
