import { useEffect, useState, useMemo } from 'react'
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Save,
  Users,
  Filter,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ── 타입 ──
interface TourDate {
  id: string
  course_id: string
  departure_date: string
  available_seats: number
  current_pax: number
  // 클라이언트 조합
  course_name?: string
}

interface CourseOption {
  id: string
  name_ko: string
}

interface TourDateFormData {
  course_id: string
  departure_date: string
  available_seats: number
  current_pax: number
}

const EMPTY_FORM: TourDateFormData = {
  course_id: '',
  departure_date: '',
  available_seats: 8,
  current_pax: 0,
}

// ── 편집 모달 ──
function TourDateFormModal({
  tourDate,
  courses,
  onClose,
  onSave,
  saving,
}: {
  tourDate: TourDate | null
  courses: CourseOption[]
  onClose: () => void
  onSave: (data: TourDateFormData, id?: string) => void
  saving: boolean
}) {
  const [form, setForm] = useState<TourDateFormData>(
    tourDate
      ? {
          course_id: tourDate.course_id,
          departure_date: tourDate.departure_date,
          available_seats: tourDate.available_seats,
          current_pax: tourDate.current_pax,
        }
      : { ...EMPTY_FORM }
  )

  const handleSubmit = () => {
    if (!form.course_id) {
      alert('코스를 선택해주세요.')
      return
    }
    if (!form.departure_date) {
      alert('출발일을 입력해주세요.')
      return
    }
    onSave(form, tourDate?.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-bold text-[#1A3A2A]">
            {tourDate ? '투어 날짜 수정' : '새 투어 날짜 추가'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          {/* 코스 선택 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">코스 *</label>
            <select
              value={form.course_id}
              onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
            >
              <option value="">코스를 선택하세요</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_ko}
                </option>
              ))}
            </select>
          </div>

          {/* 출발일 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">출발일 *</label>
            <input
              type="date"
              value={form.departure_date}
              onChange={(e) => setForm((f) => ({ ...f, departure_date: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
            />
          </div>

          {/* 좌석 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">총 좌석수</label>
              <input
                type="number"
                value={form.available_seats}
                onChange={(e) =>
                  setForm((f) => ({ ...f, available_seats: Number(e.target.value) }))
                }
                min={1}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">현재 예약</label>
              <input
                type="number"
                value={form.current_pax}
                onChange={(e) =>
                  setForm((f) => ({ ...f, current_pax: Number(e.target.value) }))
                }
                min={0}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A3A2A]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A3A2A] py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? '저장 중...' : tourDate ? '수정 저장' : '날짜 추가'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 삭제 확인 모달 ──
function DeleteConfirmModal({
  info,
  onConfirm,
  onCancel,
  deleting,
}: {
  info: string
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-base font-bold text-[#1A3A2A]">투어 날짜 삭제</h3>
        <p className="mb-4 text-sm text-gray-600">
          <strong>{info}</strong>을(를) 삭제하시겠습니까?
          <br />
          <span className="text-xs text-red-500">연결된 예약이 있으면 삭제할 수 없습니다.</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ──
export function AdminTourDates() {
  const [tourDates, setTourDates] = useState<TourDate[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 필터
  const [courseFilter, setCourseFilter] = useState<string>('all')

  // 모달
  const [editingTourDate, setEditingTourDate] = useState<TourDate | null | 'new'>(null)
  const [deletingTourDate, setDeletingTourDate] = useState<TourDate | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      // 별도 쿼리 (조인 없이)
      const [tourDatesRes, coursesRes] = await Promise.all([
        supabase
          .from('tour_dates')
          .select('id, course_id, departure_date, available_seats, current_pax')
          .order('departure_date', { ascending: true }),
        supabase
          .from('courses')
          .select('id, name_ko')
          .order('name_ko', { ascending: true }),
      ])

      if (tourDatesRes.error) throw tourDatesRes.error
      if (coursesRes.error) throw coursesRes.error

      const coursesData = (coursesRes.data || []) as CourseOption[]
      setCourses(coursesData)

      // 클라이언트 조합
      const coursesMap: Record<string, string> = {}
      coursesData.forEach((c) => {
        coursesMap[c.id] = c.name_ko
      })

      const combined: TourDate[] = (tourDatesRes.data || []).map((td) => ({
        ...td,
        course_name: coursesMap[td.course_id] || '미지정',
      }))

      setTourDates(combined)
    } catch (err) {
      console.error('TourDates fetch error:', err)
      setError('투어 날짜 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 필터링
  const filteredTourDates = useMemo(() => {
    if (courseFilter === 'all') return tourDates
    return tourDates.filter((td) => td.course_id === courseFilter)
  }, [tourDates, courseFilter])

  // 저장
  async function handleSave(formData: TourDateFormData, id?: string) {
    try {
      setSaving(true)

      if (id) {
        const { error: updateError } = await supabase
          .from('tour_dates')
          .update(formData)
          .eq('id', id)

        if (updateError) throw updateError

        const courseName = courses.find((c) => c.id === formData.course_id)?.name_ko || '미지정'
        setTourDates((prev) =>
          prev.map((td) =>
            td.id === id ? { ...td, ...formData, course_name: courseName } : td
          )
        )
      } else {
        const { data, error: insertError } = await supabase
          .from('tour_dates')
          .insert(formData)
          .select()
          .single()

        if (insertError) throw insertError
        if (data) {
          const courseName = courses.find((c) => c.id === formData.course_id)?.name_ko || '미지정'
          setTourDates((prev) =>
            [...prev, { ...data, course_name: courseName } as TourDate].sort(
              (a, b) => a.departure_date.localeCompare(b.departure_date)
            )
          )
        }
      }

      setEditingTourDate(null)
    } catch (err) {
      console.error('TourDate save error:', err)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // 삭제
  async function handleDelete() {
    if (!deletingTourDate) return
    try {
      setDeleting(true)

      const { error: deleteError } = await supabase
        .from('tour_dates')
        .delete()
        .eq('id', deletingTourDate.id)

      if (deleteError) throw deleteError

      setTourDates((prev) => prev.filter((td) => td.id !== deletingTourDate.id))
      setDeletingTourDate(null)
    } catch (err) {
      console.error('TourDate delete error:', err)
      alert('삭제 중 오류가 발생했습니다. 연결된 예약이 있을 수 있습니다.')
    } finally {
      setDeleting(false)
    }
  }

  // ── 로딩 ──
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1A3A2A]" />
          <p className="text-sm text-gray-400">투어 날짜 로딩 중...</p>
        </div>
      </div>
    )
  }

  // ── 에러 ──
  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchData}
            className="rounded-lg bg-[#1A3A2A] px-4 py-2 text-sm text-white hover:opacity-90"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-[#1A3A2A]" />
          <h1 className="text-xl font-bold text-[#1A3A2A]">투어 날짜 관리</h1>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {filteredTourDates.length}개
          </span>
        </div>
        <button
          onClick={() => setEditingTourDate('new')}
          className="flex items-center gap-1.5 rounded-lg bg-[#1A3A2A] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          날짜 추가
        </button>
      </div>

      {/* 코스 필터 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <button
          onClick={() => setCourseFilter('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            courseFilter === 'all'
              ? 'bg-[#1A3A2A] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setCourseFilter(c.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              courseFilter === c.id
                ? 'bg-[#1A3A2A] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.name_ko}
          </button>
        ))}
      </div>

      {/* ── 테이블 (데스크톱) ── */}
      <div className="hidden rounded-xl bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">코스</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">출발일</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">D-Day</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">좌석 현황</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">예약률</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTourDates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    투어 날짜가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredTourDates.map((td) => {
                  const daysUntil = Math.ceil(
                    (new Date(td.departure_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )
                  const fillRate =
                    td.available_seats > 0
                      ? Math.round((td.current_pax / td.available_seats) * 100)
                      : 0
                  const isPast = daysUntil < 0

                  return (
                    <tr key={td.id} className={`hover:bg-gray-50/50 ${isPast ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 font-medium text-[#1A3A2A]">{td.course_name}</td>
                      <td className="px-4 py-3 text-gray-600">{td.departure_date}</td>
                      <td className="px-4 py-3">
                        {isPast ? (
                          <span className="text-xs text-gray-400">지남</span>
                        ) : daysUntil === 0 ? (
                          <span className="text-xs font-medium text-red-500">오늘</span>
                        ) : (
                          <span className="text-xs font-medium text-[#1A3A2A]">D-{daysUntil}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-gray-600">
                            {td.current_pax}/{td.available_seats}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full ${
                                fillRate >= 80
                                  ? 'bg-red-400'
                                  : fillRate >= 50
                                  ? 'bg-yellow-400'
                                  : 'bg-green-400'
                              }`}
                              style={{ width: `${Math.min(fillRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{fillRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingTourDate(td)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#1A3A2A]"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTourDate(td)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 카드 리스트 (모바일) ── */}
      <div className="space-y-3 lg:hidden">
        {filteredTourDates.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">투어 날짜가 없습니다.</p>
          </div>
        ) : (
          filteredTourDates.map((td) => {
            const daysUntil = Math.ceil(
              (new Date(td.departure_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
            const fillRate =
              td.available_seats > 0
                ? Math.round((td.current_pax / td.available_seats) * 100)
                : 0
            const isPast = daysUntil < 0

            return (
              <div
                key={td.id}
                className={`rounded-xl bg-white p-4 shadow-sm ${isPast ? 'opacity-50' : ''}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1A3A2A]">{td.course_name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingTourDate(td)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingTourDate(td)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
                  <span>{td.departure_date}</span>
                  {isPast ? (
                    <span className="text-gray-400">지남</span>
                  ) : daysUntil === 0 ? (
                    <span className="font-medium text-red-500">오늘</span>
                  ) : (
                    <span className="font-medium text-[#1A3A2A]">D-{daysUntil}</span>
                  )}
                  <span>
                    <Users className="mr-0.5 inline h-3 w-3" />
                    {td.current_pax}/{td.available_seats}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      fillRate >= 80
                        ? 'bg-red-400'
                        : fillRate >= 50
                        ? 'bg-yellow-400'
                        : 'bg-green-400'
                    }`}
                    style={{ width: `${Math.min(fillRate, 100)}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── 편집 모달 ── */}
      {editingTourDate && (
        <TourDateFormModal
          tourDate={editingTourDate === 'new' ? null : editingTourDate}
          courses={courses}
          onClose={() => setEditingTourDate(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {/* ── 삭제 확인 모달 ── */}
      {deletingTourDate && (
        <DeleteConfirmModal
          info={`${deletingTourDate.course_name} - ${deletingTourDate.departure_date}`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingTourDate(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}

export default AdminTourDates
