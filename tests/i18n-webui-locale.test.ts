import { describe, it, expect } from 'bun:test';
import { resolveWebLocale } from '../src/ui/viewer/i18n/resolveWebLocale';

describe('resolveWebLocale', () => {
  it('prefers localStorage value when present', () => {
    expect(resolveWebLocale('zh', 'en', 'en-US')).toBe('zh');
    expect(resolveWebLocale('en', 'zh', 'zh-CN')).toBe('en');
  });

  it('falls back to settings locale when no localStorage value', () => {
    expect(resolveWebLocale(null, 'zh', 'en-US')).toBe('zh');
  });

  it('falls back to browser locale when no localStorage or settings', () => {
    expect(resolveWebLocale(null, null, 'zh-CN')).toBe('zh');
    expect(resolveWebLocale(null, null, 'en-US')).toBe('en');
  });

  it('defaults to en when nothing maps', () => {
    expect(resolveWebLocale(null, null, 'ja-JP')).toBe('en');
    expect(resolveWebLocale(null, null, '')).toBe('en');
  });

  it('ignores unsupported localStorage values', () => {
    expect(resolveWebLocale('fr', 'zh', 'en-US')).toBe('zh');
  });
});
