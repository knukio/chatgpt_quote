export const buildQuoteBlock = (selectionText: string): string => {
  const trimmed = selectionText.trim();
  const quotedLines = trimmed
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => `> ${line}`)
    .join('\n');
  return `${quotedLines}\n\n`;
};
