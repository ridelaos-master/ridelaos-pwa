import { Star } from 'lucide-react'

export function AdminReviews() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Star className="h-6 w-6 text-[#1A3A2A]" />
        <h1 className="text-xl font-bold text-[#1A3A2A]">리뷰 관리</h1>
      </div>
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">S5-06에서 구현 예정</p>
      </div>
    </div>
  )
}

export default AdminReviews
