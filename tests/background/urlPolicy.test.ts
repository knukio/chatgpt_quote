import { describe, expect, it } from 'vitest';

import { isChatGptPageUrl } from '../../src/background/urlPolicy';

describe('isChatGptPageUrl', () => {
  it('returns true for chatgpt.com pages', () => {
    expect(isChatGptPageUrl('https://chatgpt.com/c/abc')).toBe(true);
  });

  it('returns true for chat.openai.com pages', () => {
    expect(isChatGptPageUrl('https://chat.openai.com/')).toBe(true);
  });

  it('returns false for non-chatgpt pages', () => {
    expect(isChatGptPageUrl('https://example.com')).toBe(false);
  });

  it('returns false for invalid URL', () => {
    expect(isChatGptPageUrl('not-a-url')).toBe(false);
  });
});
