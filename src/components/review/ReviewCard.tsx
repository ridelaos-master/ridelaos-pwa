// src/components/review/ReviewCard.tsx
// S7-07: 개별 리뷰 카드 (유저정보, 별점, 내용, 사진, 도움됨, 신고)

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import ReviewReportModal from './ReviewReportModal';
import type { Review } from '../../types/review';

interface ReviewCardProps {
  review: Review;
  isHelpful: boolean;
  onToggleHelpful: (reviewId: string) => void;
  isOwn?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  isHelpful,
  onToggleHelpful,
  isOwn = false,
  onEdit,
  onDelete
}: ReviewCardProps) {
  const { t } = useTranslation('review');
  const [showPhotos, setShowPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const userName = review.user?.raw_user_meta_data?.full_name
    || review.user?.email?.split('@')[0]
    || t('card.anonymous');

  const timeAgo = getTimeAgo(review.created_at);

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
        {/* 상단: 사용자 정보 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 아바타 */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-orange-600 font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900">{userName}</span>
                {/* 예약 인증 배지 */}
                {review.is_verified && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {t('card.verified')}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>
          </div>

          {/* 더보기 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
            {showMenu && (
              <>
                {/* 배경 클릭으로 닫기 */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  {isOwn ? (
                    <>
                      <button
                        onClick={() => { onEdit?.(review); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t('card.edit')}
                      </button>
                      <button
                        onClick={() => { onDelete?.(review.id); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                      >
                        {t('card.delete')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setShowReport(true); setShowMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {t('card.report')}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 별점 */}
        <div className="mb-2">
          <StarRating rating={review.rating} size="sm" />
        </div>

        {/* 리뷰 제목 + 내용 */}
        <h4 className="font-semibold text-gray-900 text-sm mb-1">{review.title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{review.content}</p>

        {/* 사진 썸네일 */}
        {review.photos && review.photos.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {review.photos.map((url, i) => (
              <button
                key={i}
                onClick={() => { setSelectedPhoto(url); setShowPhotos(true); }}
                className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden"
              >
                <img src={url} alt="" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
              </button>
            ))}
          </div>
        )}

        {/* 하단: 도움됨 버튼 */}
        <div className="flex items-center mt-4 pt-3 border-t border-gray-50">
          <button
            onClick={() => onToggleHelpful(review.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isHelpful
                ? 'bg-orange-50 text-orange-600'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={isHelpful ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
            </svg>
            {t('card.helpful')} {review.helpful_count > 0 && `(${review.helpful_count})`}
          </button>
        </div>
      </div>

      {/* 사진 풀스크린 뷰어 */}
      {showPhotos && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPhotos(false)}
        >
          <button className="absolute top-4 right-4 text-white p-2" onClick={() => setShowPhotos(false)}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={selectedPhoto} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}

      {/* 신고 모달 */}
      {showReport && (
        <ReviewReportModal
          reviewId={review.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
}

// ─── 시간 표시 유틸 ───
function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}
