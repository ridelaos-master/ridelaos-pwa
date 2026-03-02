import { Map } from 'lucide-react'

export function AdminCourses() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Map className="h-6 w-6 text-[#1A3A2A]" />
        <h1 className="text-xl font-bold text-[#1A3A2A]">코스 관리</h1>
      </div>
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">S5-04에서 구현 예정</p>
      </div>
    </div>
  )
}

export default AdminCourses
