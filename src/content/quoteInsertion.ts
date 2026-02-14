import { buildQuoteBlock } from '../shared/quoteFormatting';
export { buildQuoteBlock } from '../shared/quoteFormatting';

export type TextInsertionState = {
  readonly value: string;
  readonly selectionStart: number;
  readonly selectionEnd: number;
};

export const buildAppendQuoteText = (currentValue: string, selectionText: string): string => {
  const quoteBlock = buildQuoteBlock(selectionText);
  if (currentValue.length === 0 || currentValue.endsWith('\n')) {
    return quoteBlock;
  }
  return `\n${quoteBlock}`;
};

export const appendQuoteAtEnd = (
  state: TextInsertionState,
  selectionText: string
): TextInsertionState => {
  const value = `${state.value}${buildAppendQuoteText(state.value, selectionText)}`;
  const nextCaretPosition = value.length;

  return {
    value,
    selectionStart: nextCaretPosition,
    selectionEnd: nextCaretPosition
  };
};
