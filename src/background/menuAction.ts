import { isChatGptPageUrl } from './urlPolicy';

export const resolveChatGptPageUrl = (
  tabUrl: string | undefined,
  pageUrl: string | undefined
): string | undefined => {
  if (isChatGptPageUrl(tabUrl)) return tabUrl;
  if (isChatGptPageUrl(pageUrl)) return pageUrl;
  return undefined;
};
