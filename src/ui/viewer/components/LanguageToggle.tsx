import React from 'react';
import { type Locale } from '../i18n/core';
import { useI18n } from '../i18n/I18nProvider';

interface LanguageToggleProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LanguageToggle({ locale, onLocaleChange }: LanguageToggleProps) {
  const { t } = useI18n();

  const cycle = () => {
    const next: Locale = locale === 'en' ? 'zh' : 'en';
    onLocaleChange(next);
  };

  const label = locale === 'zh' ? '中' : 'EN';
  const title = t('language.current', { lang: locale === 'zh' ? '中文' : 'English' });

  return (
    <button
      className="language-toggle-btn"
      onClick={cycle}
      title={title}
      aria-label={t('language.toggle')}
    >
      <span className="language-toggle-label">{label}</span>
    </button>
  );
}
