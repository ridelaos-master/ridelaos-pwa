export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  booking_id?: string;
  rating: number;
  title: string;
  content: string;
  photos: string[];
  language: 'ko' | 'en' | 'lo';
  is_verified: boolean;
  is_visible: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    raw_user_meta_data?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface CourseRating {
  course_id: string;
  review_count: number;
  avg_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export interface ReviewFormData {
  course_id: string;
  booking_id?: string;
  rating: number;
  title: string;
  content: string;
  photos: File[];
  language: 'ko' | 'en' | 'lo';
}

export interface ReviewReport {
  review_id: string;
  reason: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'other';
  description?: string;
}

export type ReviewSortOption = 'latest' | 'highest' | 'lowest' | 'helpful';
export type ReviewFilterOption = 'all' | '5' | '4' | '3' | '2' | '1' | 'with_photos';
