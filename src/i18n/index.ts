import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ko from './locales/ko.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import lo from './locales/lo.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko, review: (ko as any).review },
      en: { translation: en, review: (en as any).review },
      ja: { translation: ja },
      lo: { translation: lo, review: (lo as any).review },
    },
    supportedLngs: ['ko', 'en', 'ja', 'lo'],
    fallbackLng: 'ko',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
