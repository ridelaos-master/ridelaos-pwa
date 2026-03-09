import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'
import { CATEGORY_META, TRAVEL_DATA, TRAVEL_DATA_EN } from '../data/travelData'

export function TravelInfoDetail() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const meta = categoryId ? CATEGORY_META[categoryId] : null
  const dataSource = i18n.language === 'en' ? TRAVEL_DATA_EN : TRAVEL_DATA
  const data = categoryId ? dataSource[categoryId] : null

  if (!meta || !data) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center bg-rl-bg p-8 text-center">
        <p className="text-lg text-gray-500">{t('common.error')}</p>
        <button
          onClick={() => navigate('/travel-info')}
          className="mt-4 rounded-btn bg-rl-green px-6 py-2 text-white"
        >
          {t('common.back')}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-rl-bg font-sans text-rl-green">
      {/* 헤더 */}
      <header className="flex h-14 shrink-0 items-center bg-rl-green px-4">
        <button
          type="button"
          onClick={() => navigate('/travel-info')}
          className="flex items-center justify-center rounded-full p-2 text-white transition hover:opacity-90"
          aria-label={t('common.back')}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">
          {meta.icon} {t(`travelInfo.categories.${categoryId}`)}
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      <main className="flex-1 px-4 pb-8">
        {/* 요약 */}
        <section className="mt-4 rounded-card bg-white p-4 shadow-card">
          <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
        </section>

        {/* 섹션별 콘텐츠 */}
        {data.sections.map((section, idx) => (
          <section key={idx} className="mt-4 rounded-card bg-white p-4 shadow-card">
            <h3 className="text-base font-bold text-rl-green">{section.title}</h3>
            <ul className="mt-3 space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-600">
                  <span className="mt-1 shrink-0 text-rl-orange">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Ride Laos 팁 */}
        <section className="mt-4 rounded-card border border-rl-orange/30 bg-rl-orange/5 p-4 shadow-card">
          <h3 className="text-sm font-bold text-rl-orange">{t('travelInfo.rideLaosTip')}</h3>
          <p className="mt-2 text-sm leading-relaxed text-rl-green">{data.tip}</p>
        </section>
      </main>
    </div>
  )
}
