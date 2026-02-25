import { Link } from 'react-router-dom';
import type { CourseWithRegion } from '../types/course';

interface CourseCardProps {
  course: CourseWithRegion;
}

function formatPrice(krw: number | null): string {
  if (krw == null) return '문의';
  if (krw >= 10000) return `${(krw / 10000).toFixed(0)}만원~`;
  return `${krw.toLocaleString()}원~`;
}

export default function CourseCard({ course }: CourseCardProps) {
  const regionName = course.region_name ?? '-';
  const duration = course.duration_days != null ? `${course.duration_days}박 ${(course.duration_days + 1)}일` : null;
  const priceText = formatPrice(course.price_krw);
  const photoUrl = Array.isArray(course.photos) && course.photos[0] ? course.photos[0] : null;

  return (
    <Link
      to={`/courses/${course.id}`}
      className="block rounded-card bg-white shadow-card overflow-hidden transition-all duration-200 hover:shadow-[0_4px_20px_rgba(26,58,42,0.12)] active:scale-[0.99]"
    >
      {/* 썸네일 영역 */}
      <div className="aspect-[16/10] bg-rl-green/10 relative overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-rl-green/40">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        )}
        {duration && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-btn bg-rl-green/90 text-white text-xs font-medium">
            {duration}
          </span>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4">
        <p className="text-xs text-rl-green-mid font-medium mb-0.5">{regionName}</p>
        <h3 className="text-rl-green font-semibold text-lg leading-tight mb-2 line-clamp-2">
          {course.name_ko}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-rl-green font-semibold">{priceText}</span>
          {course.min_pax != null && (
            <span className="text-neutral-500 text-sm">최소 {course.min_pax}명</span>
          )}
        </div>
      </div>
    </Link>
  );
}
