import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'

const CATEGORIES = [
  { id: 'weather', icon: '🌤️' },
  { id: 'rider-routes', icon: '🗺️' },
  { id: 'money', icon: '💰' },
  { id: 'telecom', icon: '📱' },
  { id: 'bike', icon: '🏍️' },
  { id: 'riding', icon: '⛽' },
  { id: 'medical', icon: '🏥' },
  { id: 'food', icon: '🍜' },
  { id: 'history', icon: '🏛️' },
  { id: 'language', icon: '🗣️' },
  { id: 'visa', icon: '🛂' },
  { id: 'packing', icon: '🎒' },
]

export function TravelInfo() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-rl-bg font-sans text-rl-green">
      <header className="flex h-14 shrink-0 items-center bg-rl-green px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full p-2 text-white transition hover:opacity-90"
          aria-label={t('common.back')}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">
          {t('travelInfo.title')}
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      <main className="flex-1 px-4 pb-8">
        {/* 안내 섹션 */}
        <section className="mt-4 rounded-card bg-white p-4 shadow-card">
          <h2 className="font-bold text-rl-green">📖 {t('travelInfo.title')}</h2>
          <p className="mt-2 text-sm text-gray-500">
            {t('travelInfo.subtitle')}
          </p>
        </section>

        {/* 카테고리 그리드 */}
        <section className="mt-4">
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/travel-info/${cat.id}`)}
                className="flex flex-col items-center gap-2 rounded-card bg-white py-5 shadow-card transition active:scale-95"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rl-green/10 text-2xl">
                  {cat.icon}
                </span>
                <span className="text-xs font-medium text-rl-green">{t(`travelInfo.categories.${cat.id}`)}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
