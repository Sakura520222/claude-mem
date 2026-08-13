import { type Locale, DEFAULT_LOCALE } from './types.js';

/**
 * Normalize an arbitrary locale string (from env, Intl, navigator, settings)
 * to one of the supported locales, or null if it doesn't map.
 */
export function normalizeLocale(input?: string | null): Locale | null {
  if (!input) return null;
  const lower = input.toLowerCase();
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('en')) return 'en';
  return null;
}

/**
 * Best-effort system locale detection. Tries POSIX env vars first
 * (LC_ALL / LC_MESSAGES / LANG), then falls back to the Intl API.
 * Returns null if nothing maps to a supported locale.
 */
export function detectSystemLocale(): Locale | null {
  const candidates = [process.env.LC_ALL, process.env.LC_MESSAGES, process.env.LANG];
  for (const c of candidates) {
    const hit = normalizeLocale(c);
    if (hit) return hit;
  }

  try {
    const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    const hit = normalizeLocale(intlLocale);
    if (hit) return hit;
  } catch {
    // ICU unavailable.
  }

  return null;
}

/**
 * Resolve the locale for a non-interactive CLI run.
 * Priority: CLAUDE_MEM_LANG env → system detection → default (en).
 */
export function resolveCliLocale(): Locale {
  const fromEnv = normalizeLocale(process.env.CLAUDE_MEM_LANG);
  if (fromEnv) return fromEnv;
  const fromSystem = detectSystemLocale();
  if (fromSystem) return fromSystem;
  return DEFAULT_LOCALE;
}
