export const INSERT_QUOTE_MESSAGE_TYPE = 'INSERT_QUOTE' as const;

export type InsertQuoteMessage = {
  readonly type: typeof INSERT_QUOTE_MESSAGE_TYPE;
  readonly payload: {
    readonly selectionText: string;
  };
};

export const isInsertQuoteMessage = (value: unknown): value is InsertQuoteMessage => {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as {
    type?: unknown;
    payload?: { selectionText?: unknown };
  };

  return (
    candidate.type === INSERT_QUOTE_MESSAGE_TYPE &&
    typeof candidate.payload?.selectionText === 'string'
  );
};
