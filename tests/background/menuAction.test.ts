import { describe, expect, it } from 'vitest';

import { resolveChatGptPageUrl } from '../../src/background/menuAction';

describe('resolveChatGptPageUrl', () => {
  it('uses tab URL when it is a ChatGPT URL', () => {
    expect(resolveChatGptPageUrl('https://chatgpt.com/c/1', 'https://example.com')).toBe(
      'https://chatgpt.com/c/1'
    );
  });

  it('falls back to page URL when tab URL is missing', () => {
    expect(resolveChatGptPageUrl(undefined, 'https://chatgpt.com/c/2')).toBe(
      'https://chatgpt.com/c/2'
    );
  });

  it('returns undefined when neither URL is ChatGPT', () => {
    expect(resolveChatGptPageUrl('https://example.com', 'https://example.org')).toBeUndefined();
  });
});
