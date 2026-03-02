import { CalendarDays } from 'lucide-react'

export function AdminTourDates() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <CalendarDays className="h-6 w-6 text-[#1A3A2A]" />
        <h1 className="text-xl font-bold text-[#1A3A2A]">투어 날짜 관리</h1>
      </div>
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">S5-05에서 구현 예정</p>
      </div>
    </div>
  )
}

export default AdminTourDates
