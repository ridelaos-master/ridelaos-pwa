import { useEffect, useState } from 'react'
import {
  FileText,
  Save,
  Loader2,
  AlertCircle,
  Megaphone,
  ShieldCheck,
  RefreshCw,
  CheckCircle,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ── 타입 ──
interface ContentItem {
  id: string
  key: string
  title: string
  content: string
  updated_at: string
}

// 기본 콘텐츠 (테이블이 없거나 데이터가 없을 때)
const DEFAULT_CONTENTS: { key: string; title: string; icon: typeof Megaphone; content: string }[] = [
  {
    key: 'home_notice',
    title: '홈 공지사항',
    icon: Megaphone,
    content: '라오스 오토바이 투어 예약 서비스 Ride Laos에 오신 것을 환영합니다!',
  },
  {
    key: 'safety_guide',
    title: '안전 가이드',
    icon: ShieldCheck,
    content:
      '투어 참가 전 반드시 안전 장비를 착용하세요.\n헬멧, 장갑, 보호대는 필수입니다.\n현지 교통법규를 준수해주세요.\n음주 후 라이딩은 절대 금지입니다.',
  },
]

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ── 메인 컴포넌트 ──
export function AdminContent() {
  const [contents, setContents] = useState<
    { key: string; title: string; content: string; updatedAt: string | null; id: string | null }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedKey, setSavedKey] = useState<string | null>(null)

  useEffect(() => {
    fetchContents()
  }, [])

  async function fetchContents() {
    try {
      setLoading(true)
      setError(null)

      // site_contents 테이블 조회 시도
      const { data, error: fetchError } = await supabase
        .from('site_contents')
        .select('*')

      if (fetchError) {
        // 테이블이 없는 경우 기본값 사용
        if (
          fetchError.code === '42P01' ||
          fetchError.message?.includes('does not exist') ||
          fetchError.code === 'PGRST116'
        ) {
          setTableExists(false)
          setContents(
            DEFAULT_CONTENTS.map((dc) => ({
              key: dc.key,
              title: dc.title,
              content: dc.content,
              updatedAt: null,
              id: null,
            }))
          )
          return
        }
        throw fetchError
      }

      // 데이터가 있으면 매핑, 없으면 기본값
      const dataMap: Record<string, ContentItem> = {}
      ;(data || []).forEach((item: ContentItem) => {
        dataMap[item.key] = item
      })

      setContents(
        DEFAULT_CONTENTS.map((dc) => {
          const existing = dataMap[dc.key]
          return {
            key: dc.key,
            title: dc.title,
            content: existing?.content || dc.content,
            updatedAt: existing?.updated_at || null,
            id: existing?.id || null,
          }
        })
      )
    } catch (err) {
      console.error('Contents fetch error:', err)
      // 테이블이 없어도 기본 콘텐츠 표시
      setContents(
        DEFAULT_CONTENTS.map((dc) => ({
          key: dc.key,
          title: dc.title,
          content: dc.content,
          updatedAt: null,
          id: null,
        }))
      )
      setTableExists(false)
    } finally {
      setLoading(false)
    }
  }

  // 콘텐츠 수정
  function updateContent(key: string, newContent: string) {
    setContents((prev) =>
      prev.map((c) => (c.key === key ? { ...c, content: newContent } : c))
    )
  }

  // 저장
  async function handleSave(key: string) {
    const item = contents.find((c) => c.key === key)
    if (!item) return

    try {
      setSavingKey(key)

      if (!tableExists) {
        // 테이블이 없으면 생성 시도
        // RLS 때문에 실패할 수 있으므로 안내만 표시
        alert(
          'site_contents 테이블이 아직 없습니다.\n' +
            'Supabase 대시보드에서 아래 SQL을 실행해주세요:\n\n' +
            'CREATE TABLE site_contents (\n' +
            '  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n' +
            '  key text UNIQUE NOT NULL,\n' +
            '  title text NOT NULL,\n' +
            '  content text NOT NULL,\n' +
            '  updated_at timestamptz DEFAULT now()\n' +
            ');\n\n' +
            '-- RLS 비활성화 (관리자 전용)\n' +
            'ALTER TABLE site_contents ENABLE ROW LEVEL SECURITY;\n' +
            'CREATE POLICY "Allow all" ON site_contents FOR ALL USING (true);'
        )
        return
      }

      if (item.id) {
        // 기존 업데이트
        const { error: updateError } = await supabase
          .from('site_contents')
          .update({ content: item.content, updated_at: new Date().toISOString() })
          .eq('id', item.id)

        if (updateError) throw updateError
      } else {
        // 새로 삽입
        const { data, error: insertError } = await supabase
          .from('site_contents')
          .insert({
            key: item.key,
            title: item.title,
            content: item.content,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) throw insertError
        if (data) {
          setContents((prev) =>
            prev.map((c) =>
              c.key === key
                ? { ...c, id: (data as ContentItem).id, updatedAt: (data as ContentItem).updated_at }
                : c
            )
          )
        }
      }

      setSavedKey(key)
      setTimeout(() => setSavedKey(null), 2000)
    } catch (err) {
      console.error('Content save error:', err)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSavingKey(null)
    }
  }

  // ── 로딩 ──
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1A3A2A]" />
          <p className="text-sm text-gray-400">콘텐츠 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-[#1A3A2A]" />
          <h1 className="text-xl font-bold text-[#1A3A2A]">콘텐츠 관리</h1>
        </div>
        <button
          onClick={fetchContents}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          새로고침
        </button>
      </div>

      {!tableExists && (
        <div className="mb-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          site_contents 테이블이 아직 없습니다. 아래 내용을 수정 후 저장하면 테이블 생성 안내가
          표시됩니다.
        </div>
      )}

      {/* 콘텐츠 편집 카드 */}
      <div className="space-y-4">
        {contents.map((item) => {
          const defaultItem = DEFAULT_CONTENTS.find((dc) => dc.key === item.key)
          const Icon = defaultItem?.icon || FileText

          return (
            <div key={item.key} className="rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A3A2A]/5">
                    <Icon className="h-4 w-4 text-[#1A3A2A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A3A2A]">{item.title}</h3>
                    {item.updatedAt && (
                      <p className="text-xs text-gray-400">
                        마지막 수정: {formatDateTime(item.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSave(item.key)}
                  disabled={savingKey === item.key}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    savedKey === item.key
                      ? 'bg-green-50 text-green-600'
                      : 'bg-[#1A3A2A] text-white hover:opacity-90'
                  } disabled:opacity-50`}
                >
                  {savedKey === item.key ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      저장됨
                    </>
                  ) : savingKey === item.key ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      저장
                    </>
                  )}
                </button>
              </div>

              <div className="px-5 py-4">
                <textarea
                  value={item.content}
                  onChange={(e) => updateContent(item.key, e.target.value)}
                  rows={item.key === 'safety_guide' ? 8 : 4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm leading-relaxed outline-none focus:border-[#1A3A2A] focus:ring-1 focus:ring-[#1A3A2A]"
                  placeholder="콘텐츠를 입력하세요..."
                />
                <p className="mt-2 text-xs text-gray-400">
                  키: {item.key} · 줄바꿈은 Enter로 구분됩니다.
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminContent
