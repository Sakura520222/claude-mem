/**
 * Supported locales for claude-mem's UI and install CLI.
 * Add a value here + a dictionary file to support a new language.
 */
export const SUPPORTED_LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** A flat key → translated-string map. */
export type Dictionary = Record<string, string>;

/** Per-locale dictionaries, keyed by Locale. */
export type LocaleDictionary = Record<Locale, Dictionary>;

/** Default/fallback locale when a key is missing from the active locale. */
export const DEFAULT_LOCALE: Locale = 'en';
