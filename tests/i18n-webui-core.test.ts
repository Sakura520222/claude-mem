import { describe, it, expect } from 'bun:test';
import { normalizeLocale, t } from '../src/ui/viewer/i18n/core';

describe('normalizeLocale (viewer)', () => {
  it('maps zh variants', () => {
    expect(normalizeLocale('zh')).toBe('zh');
    expect(normalizeLocale('zh-CN')).toBe('zh');
  });
  it('maps en variants', () => {
    expect(normalizeLocale('en-US')).toBe('en');
  });
  it('returns null for unsupported', () => {
    expect(normalizeLocale('ja')).toBeNull();
    expect(normalizeLocale(undefined)).toBeNull();
  });
});

describe('t (viewer)', () => {
  const dict = {
    en: { hello: 'Hello', hi: 'Hi {name}' },
    zh: { hello: '你好', hi: '你好 {name}' },
  };
  it('translates by locale', () => {
    expect(t('zh', 'hello', dict)).toBe('你好');
    expect(t('en', 'hello', dict)).toBe('Hello');
  });
  it('interpolates vars', () => {
    expect(t('zh', 'hi', dict, { name: '世界' })).toBe('你好 世界');
  });
  it('falls back to en then key', () => {
    expect(t('zh', 'hello', { en: { hello: 'Hi' }, zh: {} })).toBe('Hi');
    expect(t('zh', 'missing', dict)).toBe('missing');
  });
  it('replaces missing placeholders with empty string even without vars', () => {
    expect(t('zh', 'hi', dict)).toBe('你好 ');
    expect(t('zh', 'hi', dict, {})).toBe('你好 ');
    expect(t('zh', 'hi', dict, { other: 'x' })).toBe('你好 ');
  });
});
