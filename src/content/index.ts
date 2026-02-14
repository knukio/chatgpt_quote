import { appendQuoteAtEnd, buildAppendQuoteText } from './quoteInsertion';
import { attachHotReload } from '../shared/hotReload';
import { isInsertQuoteMessage } from '../shared/messages';
import { resolveSelectionText } from '../shared/selectionText';

const TEXTAREA_SELECTOR =
  'textarea#prompt-textarea, textarea[data-testid="prompt-textarea"], textarea[name="prompt-textarea"]';
const CONTENT_EDITABLE_SELECTOR =
  '#prompt-textarea[contenteditable="true"], [data-testid="prompt-textarea"][contenteditable="true"]';

const isEditableTextAreaVisible = (element: HTMLTextAreaElement): boolean => {
  if (element.disabled || element.readOnly) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  if (element.style.display === 'none' || element.style.visibility === 'hidden') return false;
  return element.getClientRects().length > 0;
};

const setNativeTextAreaValue = (element: HTMLTextAreaElement, value: string): void => {
  const prototype = Object.getPrototypeOf(element) as HTMLTextAreaElement;
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

  if (valueSetter) {
    valueSetter.call(element, value);
    return;
  }

  element.value = value;
};

const applyToTextArea = (element: HTMLTextAreaElement, selectionText: string): void => {
  const next = appendQuoteAtEnd(
    {
      value: element.value,
      selectionStart: element.selectionStart ?? 0,
      selectionEnd: element.selectionEnd ?? 0
    },
    selectionText
  );

  element.focus();
  setNativeTextAreaValue(element, next.value);
  element.setSelectionRange(next.selectionStart, next.selectionEnd);
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

const applyToContentEditable = (element: HTMLElement, selectionText: string): void => {
  const quoteText = buildAppendQuoteText(element.textContent ?? '', selectionText);

  element.focus();

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);

  const clipboardData = new DataTransfer();
  clipboardData.setData('text/plain', quoteText);
  const pasteEvent = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    clipboardData
  });
  const pasteHandled = !element.dispatchEvent(pasteEvent);
  const inserted = pasteHandled || document.execCommand('insertText', false, quoteText);
  if (!inserted) {
    range.insertNode(document.createTextNode(quoteText));
  }

  element.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText',
      data: quoteText
    })
  );
};

const insertSelectionIntoPrompt = (selectionText: string): boolean => {
  const trimmed = selectionText.trim();
  if (trimmed.length === 0) return false;

  const contentEditable = document.querySelector(CONTENT_EDITABLE_SELECTOR);
  if (contentEditable instanceof HTMLElement) {
    applyToContentEditable(contentEditable, trimmed);
    return true;
  }

  const textArea = document.querySelector(TEXTAREA_SELECTOR);
  if (textArea instanceof HTMLTextAreaElement && isEditableTextAreaVisible(textArea)) {
    applyToTextArea(textArea, trimmed);
    return true;
  }

  return false;
};

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  if (!isInsertQuoteMessage(message)) return;

  const liveSelectionText = window.getSelection()?.toString() ?? '';
  const selectionText = resolveSelectionText(liveSelectionText, message.payload.selectionText);
  const ok = insertSelectionIntoPrompt(selectionText);
  sendResponse({ ok });
});

attachHotReload(import.meta.hot, () => {
  window.location.reload();
});

export {};
