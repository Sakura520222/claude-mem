import { type Locale, DEFAULT_LOCALE, normalizeLocale } from './core';

/**
 * Resolve the WebUI display locale.
 *
 * Priority: localStorage (user's explicit WebUI choice) > settings locale
 * (CLAUDE_MEM_LOCALE, written by the installer, read via GET /api/settings)
 * > browser language > default (en).
 *
 * Pure function so the priority chain is unit-testable without RTL.
 */
export function resolveWebLocale(
  stored: string | null,
  settingsLocale: string | null | undefined,
  browserLocale: string,
): Locale {
  return (
    normalizeLocale(stored)
    ?? normalizeLocale(settingsLocale)
    ?? normalizeLocale(browserLocale)
    ?? DEFAULT_LOCALE
  );
}
