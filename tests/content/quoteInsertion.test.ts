import { describe, expect, it } from 'vitest';

import {
  appendQuoteAtEnd,
  buildAppendQuoteText,
  buildQuoteBlock,
  type TextInsertionState
} from '../../src/content/quoteInsertion';

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

describe('appendQuoteAtEnd', () => {
  it('inserts a newline before quote when current input is not empty', () => {
    const state: TextInsertionState = {
      value: 'Current draft',
      selectionStart: 0,
      selectionEnd: 0
    };

    expect(appendQuoteAtEnd(state, 'quoted text')).toEqual({
      value: 'Current draft\n> quoted text\n\n',
      selectionStart: 29,
      selectionEnd: 29
    });
  });

  it('does not prepend newline when current input is empty', () => {
    const state: TextInsertionState = {
      value: '',
      selectionStart: 0,
      selectionEnd: 0
    };

    expect(appendQuoteAtEnd(state, 'quoted text')).toEqual({
      value: '> quoted text\n\n',
      selectionStart: 15,
      selectionEnd: 15
    });
  });
});

describe('buildAppendQuoteText', () => {
  it('prepends newline when current input is not empty', () => {
    expect(buildAppendQuoteText('Current draft', 'quoted text')).toBe('\n> quoted text\n\n');
  });

  it('does not prepend newline when current input is empty', () => {
    expect(buildAppendQuoteText('', 'quoted text')).toBe('> quoted text\n\n');
  });

  it('does not prepend extra newline when current input already ends with newline', () => {
    expect(buildAppendQuoteText('Current draft\n', 'quoted text')).toBe('> quoted text\n\n');
  });
});
