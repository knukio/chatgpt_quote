import { describe, expect, it } from 'vitest';

import config from '../vite.config';

describe('vite dev watch settings', () => {
  it('ignores pnpm store directory to avoid symlink loop crashes', () => {
    const ignored = config.server?.watch?.ignored;

    expect(ignored).toBeDefined();
    const values = Array.isArray(ignored) ? ignored : [ignored];
    expect(values).toContain('**/.pnpm-store/**');
  });

  it('enables CORS for extension-origin HMR requests', () => {
    expect(config.server?.cors).toBe(true);
  });
});
