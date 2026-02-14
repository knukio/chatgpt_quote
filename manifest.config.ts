import { defineManifest } from '@crxjs/vite-plugin';

const CHATGPT_MATCHES = ['https://chatgpt.com/*', 'https://chat.openai.com/*'];
const EXTENSION_ICONS = {
  16: 'icons/icon.png',
  32: 'icons/icon.png',
  48: 'icons/icon.png',
  128: 'icons/icon.png'
} as const;

export default defineManifest({
  manifest_version: 3,
  name: 'ChatGPT Quote',
  version: '0.1.0',
  description: 'Insert selected quotes into ChatGPT prompt by shortcut or context menu.',
  minimum_chrome_version: '114',
  homepage_url: 'https://github.com/knukio/chatgpt_quote',
  icons: EXTENSION_ICONS,
  permissions: ['contextMenus', 'tabs', 'scripting'],
  host_permissions: CHATGPT_MATCHES,
  action: {
    default_title: 'ChatGPT Quote'
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module'
  },
  commands: {
    'quote-selection': {
      suggested_key: {
        default: 'Alt+Shift+Q'
      },
      description: 'Quote selected text into ChatGPT prompt'
    }
  },
  content_scripts: [
    {
      matches: CHATGPT_MATCHES,
      js: ['src/content/index.ts'],
      run_at: 'document_idle'
    }
  ]
});
