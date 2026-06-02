import { useTranslation } from 'react-i18next';
import { LANGUAGE_LABELS } from '@/lib/constants';
import type { LanguageCode } from '@/types';

/** 헤더 상시 노출 언어 스위처. 선택값은 i18next LanguageDetector 가 localStorage 에 영속화. */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language.split('-')[0] as LanguageCode;

  return (
    <label className="lang-switcher">
      <span className="sr-only">{t('header.language')}</span>
      <select
        value={current in LANGUAGE_LABELS ? current : 'ko'}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
