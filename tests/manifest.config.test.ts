import { describe, expect, it } from 'vitest';

import manifest from '../manifest.config';

describe('manifest commands', () => {
  it('declares quote command for configurable keyboard shortcut', () => {
    expect(manifest.commands).toMatchObject({
      'quote-selection': {
        description: expect.any(String)
      }
    });
  });

  it('does not declare popup', () => {
    expect(manifest.action?.default_popup).toBeUndefined();
  });

  it('contains metadata required for publication readiness', () => {
    expect(manifest.minimum_chrome_version).toBeTypeOf('string');
    expect(manifest.homepage_url).toMatch(/^https:\/\//u);
  });

  it('explains both shortcut and context-menu usage in description', () => {
    expect(manifest.description).toContain('shortcut');
    expect(manifest.description).toContain('context menu');
  });

  it('uses icon.png from public/icons for all required sizes', () => {
    expect(manifest.icons).toEqual({
      16: 'icons/icon.png',
      32: 'icons/icon.png',
      48: 'icons/icon.png',
      128: 'icons/icon.png'
    });
  });
});
