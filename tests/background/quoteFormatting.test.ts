import { describe, expect, it } from 'vitest';

import { buildQuoteBlock } from '../../src/background/quoteFormatting';

describe('buildQuoteBlock', () => {
  it('adds quote marker to each selected line for multiline text', () => {
    expect(buildQuoteBlock('line one\nline two')).toBe('> line one\n> line two\n\n');
  });

  it('removes completely blank lines inside multiline selection', () => {
    expect(buildQuoteBlock('line one\n\nline two')).toBe('> line one\n> line two\n\n');
  });
});
