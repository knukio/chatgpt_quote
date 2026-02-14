import { INSERT_QUOTE_MESSAGE_TYPE, type InsertQuoteMessage } from '../shared/messages';
import { resolveChatGptPageUrl } from './menuAction';
import { buildQuoteBlock } from '../shared/quoteFormatting';
import { resolveSelectionText } from '../shared/selectionText';

const CONTEXT_MENU_ID = 'quote-selection';
const CONTEXT_MENU_TITLE = 'quote';
const QUOTE_COMMAND = 'quote-selection';
const PROMPT_SELECTOR =
  '#prompt-textarea[contenteditable="true"], [data-testid="prompt-textarea"][contenteditable="true"]';

const createQuoteContextMenu = (): void => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: CONTEXT_MENU_TITLE,
      contexts: ['selection']
    });
  });
};

createQuoteContextMenu();

chrome.runtime.onInstalled.addListener(() => {
  createQuoteContextMenu();
});

chrome.runtime.onStartup.addListener(() => {
  createQuoteContextMenu();
});

const insertQuoteViaScripting = async (
  tabId: number,
  fallbackSelectionText: string
): Promise<void> => {
  await chrome.scripting.executeScript({
    target: { tabId },
    args: [PROMPT_SELECTOR, fallbackSelectionText],
    func: (selector: string, selectionTextFromMessage: string) => {
      const prompt = document.querySelector(selector);
      if (!(prompt instanceof HTMLElement)) return false;

      const liveSelectionText = window.getSelection()?.toString() ?? '';
      const selectionText = liveSelectionText.trim().length > 0
        ? liveSelectionText.trim()
        : selectionTextFromMessage.trim();
      if (selectionText.length === 0) return false;

      prompt.focus();

      const selection = window.getSelection();
      if (!selection) return false;

      const range = document.createRange();
      range.selectNodeContents(prompt);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      const promptText = prompt.textContent ?? '';
      const separator = promptText.length === 0 || promptText.endsWith('\n') ? '' : '\n';
      const quoteBlock = buildQuoteBlock(selectionText);
      const textToInsert = `${separator}${quoteBlock}`;

      const inserted = document.execCommand('insertText', false, textToInsert);
      if (!inserted) return false;

      prompt.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          inputType: 'insertText',
          data: textToInsert
        })
      );
      return true;
    }
  });
};

const insertQuoteViaMessage = (tabId: number, selectionText: string): Promise<void> => {
  const message: InsertQuoteMessage = {
    type: INSERT_QUOTE_MESSAGE_TYPE,
    payload: { selectionText }
  };

  return chrome.tabs
    .sendMessage(tabId, message)
    .then((response: { ok?: boolean } | undefined) => {
      if (response?.ok) return;
      return insertQuoteViaScripting(tabId, selectionText);
    })
    .catch(() => {
      return insertQuoteViaScripting(tabId, selectionText);
    });
};

const readSelectionTextFromTab = async (tabId: number): Promise<string> => {
  const [selectionResult] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => window.getSelection()?.toString() ?? ''
  });
  return typeof selectionResult?.result === 'string' ? selectionResult.result : '';
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;
  if (!tab?.id) return;
  const tabId = tab.id;

  const chatGptUrl = resolveChatGptPageUrl(tab.url, info.pageUrl);
  if (!chatGptUrl) return;

  const selectionText = info.selectionText?.trim() ?? '';
  if (selectionText.length === 0) return;
  const normalizedSelectionText = resolveSelectionText('', selectionText);
  if (normalizedSelectionText.length === 0) return;

  void insertQuoteViaMessage(tabId, normalizedSelectionText);
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== QUOTE_COMMAND) return;

  void chrome.tabs
    .query({ active: true, lastFocusedWindow: true })
    .then(async ([tab]) => {
      if (!tab?.id) return;
      if (!resolveChatGptPageUrl(tab.url, undefined)) return;

      const selectionText = await readSelectionTextFromTab(tab.id);
      const normalizedSelectionText = resolveSelectionText('', selectionText);
      if (normalizedSelectionText.length === 0) return;

      return insertQuoteViaMessage(tab.id, normalizedSelectionText);
    });
});

export {};
