import { describe, it, expect } from 'bun:test';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { SettingsDefaultsManager } from '../src/shared/SettingsDefaultsManager';

function tmpSettingsPath(content: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'cm-settings-'));
  const p = join(dir, 'settings.json');
  writeFileSync(p, content, 'utf-8');
  return p;
}

describe('SettingsDefaultsManager CLAUDE_MEM_LOCALE', () => {
  it('defaults to en', () => {
    const p = tmpSettingsPath('{}');
    try {
      const settings = SettingsDefaultsManager.loadFromFile(p, false);
      expect(settings.CLAUDE_MEM_LOCALE).toBe('en');
    } finally {
      rmSync(join(p, '..'), { recursive: true, force: true });
    }
  });

  it('reads persisted zh value', () => {
    const p = tmpSettingsPath(JSON.stringify({ CLAUDE_MEM_LOCALE: 'zh' }));
    try {
      const settings = SettingsDefaultsManager.loadFromFile(p, false);
      expect(settings.CLAUDE_MEM_LOCALE).toBe('zh');
    } finally {
      rmSync(join(p, '..'), { recursive: true, force: true });
    }
  });
});
