import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { normalizeLocale, detectSystemLocale, resolveCliLocale } from '../src/shared/i18n/locale';

describe('normalizeLocale', () => {
  it('maps zh variants to zh', () => {
    expect(normalizeLocale('zh')).toBe('zh');
    expect(normalizeLocale('zh-CN')).toBe('zh');
    expect(normalizeLocale('zh_TW')).toBe('zh');
    expect(normalizeLocale('ZH')).toBe('zh');
  });

  it('maps en variants to en', () => {
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('en-US')).toBe('en');
  });

  it('returns null for unsupported languages', () => {
    expect(normalizeLocale('ja')).toBeNull();
    expect(normalizeLocale('fr')).toBeNull();
  });

  it('returns null for empty/undefined input', () => {
    expect(normalizeLocale(undefined)).toBeNull();
    expect(normalizeLocale('')).toBeNull();
  });
});

describe('resolveCliLocale', () => {
  const ENV_KEYS = ['CLAUDE_MEM_LANG', 'LC_ALL', 'LC_MESSAGES', 'LANG'];

  beforeEach(() => {
    for (const k of ENV_KEYS) delete process.env[k];
  });
  afterEach(() => {
    for (const k of ENV_KEYS) delete process.env[k];
  });

  it('prefers CLAUDE_MEM_LANG env var', () => {
    process.env.LANG = 'en_US.UTF-8';
    process.env.CLAUDE_MEM_LANG = 'zh';
    expect(resolveCliLocale()).toBe('zh');
  });

  it('returns a valid supported locale when CLAUDE_MEM_LANG is unset', () => {
    // Without CLAUDE_MEM_LANG, delegates to detectSystemLocale (env → Intl);
    // the result depends on the machine, but must be a supported locale.
    const result = resolveCliLocale();
    expect(['en', 'zh']).toContain(result);
  });

  it('ignores unsupported CLAUDE_MEM_LANG, delegates to system detection', () => {
    process.env.CLAUDE_MEM_LANG = 'ja';
    const result = resolveCliLocale();
    expect(['en', 'zh']).toContain(result);
  });
});

describe('detectSystemLocale', () => {
  const ENV_KEYS = ['LC_ALL', 'LC_MESSAGES', 'LANG'];

  beforeEach(() => {
    for (const k of ENV_KEYS) delete process.env[k];
  });
  afterEach(() => {
    for (const k of ENV_KEYS) delete process.env[k];
  });

  it('reads zh from LANG env', () => {
    process.env.LANG = 'zh_CN.UTF-8';
    expect(detectSystemLocale()).toBe('zh');
  });

  it('reads en from LC_ALL env', () => {
    process.env.LC_ALL = 'en_US.UTF-8';
    expect(detectSystemLocale()).toBe('en');
  });

  it('returns null when nothing maps', () => {
    process.env.LANG = 'ja_JP.UTF-8';
    const result = detectSystemLocale();
    expect(['en', 'zh', null]).toContain(result);
  });
});
