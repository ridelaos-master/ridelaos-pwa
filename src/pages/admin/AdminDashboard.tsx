import { LayoutDashboard } from 'lucide-react'

export function AdminDashboard() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-[#1A3A2A]" />
        <h1 className="text-xl font-bold text-[#1A3A2A]">대시보드</h1>
      </div>

      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">S5-02에서 구현 예정</p>
        <p className="mt-1 text-sm text-gray-400">
          예약 현황, 매출, 출발 예정 투어 등
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard
