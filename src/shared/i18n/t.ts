import { type Locale, type LocaleDictionary, DEFAULT_LOCALE } from './types.js';

/**
 * Look up a translated string for the given locale.
 *
 * Fallback chain: active locale → DEFAULT_LOCALE (en) → the raw key.
 * This guarantees a missing key never crashes — the worst case is an
 * English string or the key itself showing in the UI.
 *
 * `{placeholder}` tokens in the string are replaced with values from `vars`.
 */
export function t(
  locale: Locale,
  key: string,
  dict: LocaleDictionary,
  vars?: Record<string, string | number>,
): string {
  const raw = dict[locale]?.[key] ?? dict[DEFAULT_LOCALE]?.[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, name: string) => {
    const v = vars?.[name];
    return v === undefined ? '' : String(v);
  });
}
