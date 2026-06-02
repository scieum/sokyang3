import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ko from './locales/ko.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';

import { RTL_LANGUAGES } from '@/lib/constants';
import type { LanguageCode } from '@/types';

export const resources = {
  ko: { translation: ko },
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    supportedLngs: ['ko', 'en', 'zh', 'ja', 'ar', 'fr', 'de', 'it'],
    interpolation: { escapeValue: false },
    detection: {
      // localStorage 영속화 → 재방문 시 언어 유지
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'tot-lang',
    },
  });

/** 언어 전환 시 <html> 의 lang / dir 속성을 동기화한다. */
export function applyDocumentDirection(lang: string): void {
  const isRtl = RTL_LANGUAGES.includes(lang as LanguageCode);
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
}

// 초기 로드 및 언어 변경 시 방향 적용
applyDocumentDirection(i18n.language);
i18n.on('languageChanged', applyDocumentDirection);

export default i18n;
