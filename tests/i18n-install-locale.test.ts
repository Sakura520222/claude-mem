import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';

const installSource = readFileSync(
  join(__dirname, '..', 'src', 'npx-cli', 'commands', 'install.ts'),
  'utf-8',
);

describe('install.ts locale integration', () => {
  it('imports resolveCliLocale', () => {
    expect(installSource).toContain("from '../../shared/i18n/locale.js'");
  });

  it('defines resolveInstallLocale function', () => {
    expect(installSource).toContain('async function resolveInstallLocale');
  });

  it('persists locale via mergeSettings', () => {
    expect(installSource).toContain('CLAUDE_MEM_LOCALE: locale');
  });

  it('uses a bilingual language-select prompt label', () => {
    expect(installSource).toContain('请选择语言 / Select language');
  });

  it('offers zh and en options', () => {
    expect(installSource).toMatch(/{ value: 'zh', label: '中文' }/);
    expect(installSource).toMatch(/{ value: 'en', label: 'English' }/);
  });
});
