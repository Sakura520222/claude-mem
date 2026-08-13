import { describe, it, expect } from 'bun:test';
import { t } from '../src/shared/i18n/t';
import type { LocaleDictionary } from '../src/shared/i18n/types';

const dict: LocaleDictionary = {
  en: {
    'greeting': 'Hello',
    'welcome': 'Welcome, {name}!',
    'count': '{n} items',
  },
  zh: {
    'greeting': '你好',
    'welcome': '欢迎，{name}！',
    'count': '{n} 个项目',
  },
};

describe('t()', () => {
  it('returns the translation for the active locale', () => {
    expect(t('zh', 'greeting', dict)).toBe('你好');
    expect(t('en', 'greeting', dict)).toBe('Hello');
  });

  it('interpolates {placeholder} vars', () => {
    expect(t('zh', 'welcome', dict, { name: '世界' })).toBe('欢迎，世界！');
    expect(t('en', 'count', dict, { n: 42 })).toBe('42 items');
  });

  it('falls back to English when key missing from active locale', () => {
    expect(t('zh', 'greeting', { en: { greeting: 'Hi' }, zh: {} })).toBe('Hi');
  });

  it('falls back to the key string when missing from both locales', () => {
    expect(t('zh', 'nonexistent', dict)).toBe('nonexistent');
  });

  it('leaves unmatched placeholders empty', () => {
    expect(t('en', 'welcome', dict)).toBe('Welcome, !');
  });
});
