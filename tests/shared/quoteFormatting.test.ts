import { describe, expect, it } from 'vitest';

import { buildQuoteBlock } from '../../src/shared/quoteFormatting';

describe('buildQuoteBlock', () => {
  it('formats dragged text as block quote', () => {
    expect(buildQuoteBlock('hello')).toBe('> hello\n\n');
  });

  it('adds quote marker to each selected line for multiline text', () => {
    expect(buildQuoteBlock('line one\nline two')).toBe('> line one\n> line two\n\n');
  });

  it('removes completely blank lines inside multiline selection', () => {
    expect(buildQuoteBlock('line one\n\nline two')).toBe('> line one\n> line two\n\n');
  });

  it('trims surrounding whitespace before formatting', () => {
    expect(buildQuoteBlock('  hello world  ')).toBe('> hello world\n\n');
  });
});
