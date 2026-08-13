import { useState, useEffect } from 'react';
import { type Locale, normalizeLocale } from '../i18n/core';
import { resolveWebLocale } from '../i18n/resolveWebLocale';

const STORAGE_KEY = 'claude-mem-locale';

function getStoredLocale(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e: unknown) {
    console.warn('Failed to read locale from localStorage:', e instanceof Error ? e.message : String(e));
    return null;
  }
}

function getBrowserLocale(): string {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language;
}

/**
 * Manage the WebUI display locale.
 *
 * `settingsLocale` = settings.CLAUDE_MEM_LOCALE (from useSettings), written by
 * the installer. On first visit (no localStorage), the settings value takes
 * effect; once the user toggles language in the UI, localStorage wins.
 *
 * Mirrors useTheme's structure for consistency.
 */
export function useLocale(settingsLocale?: string) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    resolveWebLocale(getStoredLocale(), settingsLocale, getBrowserLocale()),
  );

  // When settings arrive asynchronously, if the user has not chosen in the UI,
  // adopt the settings value.
  useEffect(() => {
    if (getStoredLocale()) return; // user already chose explicitly
    const fromSettings = normalizeLocale(settingsLocale);
    if (fromSettings && fromSettings !== locale) {
      setLocaleState(fromSettings);
    }
  }, [settingsLocale, locale]);

  // Keep <html lang> in sync for accessibility + SEO.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e: unknown) {
      console.warn('Failed to save locale to localStorage:', e instanceof Error ? e.message : String(e));
    }
    setLocaleState(next);
  };

  return { locale, setLocale };
}
