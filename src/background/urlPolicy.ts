const CHATGPT_HOSTS = new Set(['chatgpt.com', 'chat.openai.com']);

export const isChatGptPageUrl = (value: string | undefined): boolean => {
  if (typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    return CHATGPT_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
};
