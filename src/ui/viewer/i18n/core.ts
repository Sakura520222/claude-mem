/**
 * Self-contained i18n core for the viewer.
 *
 * The viewer has its own tsconfig (rootDir: src/ui/viewer) and cannot import
 * from src/shared/. This file mirrors src/shared/i18n/ (types + t + normalize)
 * so the CLI and WebUI share the same i18n *pattern* while staying
 * physically isolated. The settings-based locale handshake
 * (CLAUDE_MEM_LOCALE) is the runtime bridge between the two.
 */

export const SUPPORTED_LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type Dictionary = Record<string, string>;
export type LocaleDictionary = Record<Locale, Dictionary>;

export const DEFAULT_LOCALE: Locale = 'en';

/** Normalize an arbitrary locale string to a supported Locale, or null. */
export function normalizeLocale(input?: string | null): Locale | null {
  if (!input) return null;
  const lower = input.toLowerCase();
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('en')) return 'en';
  return null;
}

/**
 * Look up a translated string. Fallback: active locale → DEFAULT_LOCALE → key.
 * `{placeholder}` tokens are replaced from `vars`; missing placeholders
 * become the empty string even when `vars` is omitted.
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
