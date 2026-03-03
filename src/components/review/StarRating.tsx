// src/components/review/StarRating.tsx
// S7-07: 별점 입력/표시 컴포넌트

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showLabel?: boolean;
}

const LABELS: Record<number, { ko: string; en: string }> = {
  1: { ko: '별로예요', en: 'Poor' },
  2: { ko: '그저 그래요', en: 'Fair' },
  3: { ko: '보통이에요', en: 'Average' },
  4: { ko: '좋아요', en: 'Good' },
  5: { ko: '최고예요!', en: 'Excellent!' }
};

export default function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  showLabel = false
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  const displayRating = hovered || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            aria-label={`${star}점`}
          >
            <svg
              className={`${sizeMap[size]} transition-colors duration-150`}
              viewBox="0 0 24 24"
              fill={star <= displayRating ? '#F59E0B' : 'none'}
              stroke={star <= displayRating ? '#F59E0B' : '#D1D5DB'}
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        ))}
      </div>
      {showLabel && displayRating > 0 && (
        <span className="ml-2 text-sm font-medium text-amber-600">
          {LABELS[displayRating]?.ko}
        </span>
      )}
    </div>
  );
}
