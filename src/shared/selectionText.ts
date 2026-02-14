export const resolveSelectionText = (
  liveSelectionText: string,
  fallbackSelectionText: string
): string => {
  const live = liveSelectionText.trim();
  if (live.length > 0) {
    return live;
  }
  return fallbackSelectionText.trim();
};
