import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('release readiness documents', () => {
  it('provides detailed user and developer documentation', () => {
    const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

    expect(readme).toContain('English README');
    expect(readme).toContain('[日本語版README](./README.ja.md)');
    expect(readme).toContain('## Features');
    expect(readme).toContain('## Requirements');
    expect(readme).toContain('## Installation');
    expect(readme).toContain('## Development');
    expect(readme).toContain('## Testing');
    expect(readme).toContain('## Configuration');
    expect(readme).toContain('## Permissions');
    expect(readme).toContain('chrome://extensions');
    expect(readme).toContain('Alt + Shift + Q');
  });

  it('provides a Japanese README linked from the English README', () => {
    const readmeJa = readFileSync(new URL('../README.ja.md', import.meta.url), 'utf8');

    expect(readmeJa).toContain('# ChatGPT Quote');
    expect(readmeJa).toContain('## 機能');
    expect(readmeJa).toContain('## インストール');
    expect(readmeJa).toContain('## リリース');
  });

  it('documents release flow in README', () => {
    const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

    expect(readme).toContain('## Release');
    expect(readme).toContain('pnpm package:zip');
  });

  it('provides a distributable packaging script', () => {
    const packageJsonRaw = readFileSync(new URL('../package.json', import.meta.url), 'utf8');
    const packageJson = JSON.parse(packageJsonRaw) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.['package:zip']).toBe('pnpm build && cd dist && zip -r ../chatgpt-quote.zip .');
  });
});
