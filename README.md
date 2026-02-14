# ChatGPT Quote

[日本語版README](./README.ja.md)

Chrome extension to insert selected text into the ChatGPT prompt as Markdown blockquotes (`>`), via shortcut or context menu.

## Features

- Insert selected text into the ChatGPT composer
- Format multiline selections as natural Markdown quotes (`>` per line)
- Add a newline first when the composer already has content
- Trigger from keyboard shortcut (default: `Alt + Shift + Q`) or right-click context menu

## Requirements

- Node.js 20+
- pnpm 10+
- Google Chrome 114+

## Installation

```bash
pnpm install
pnpm build
```

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click Load unpacked
4. Select the `dist` directory from this project

## Install From GitHub

1. Download this repository from GitHub (`Code` -> `Download ZIP`) or clone it:

```bash
git clone https://github.com/<your-account>/<your-repo>.git
cd <your-repo>
```

1. Install dependencies and build:

```bash
pnpm install
pnpm build
```

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click Load unpacked
4. Select this project's `dist` directory

## Usage

1. Select text on any webpage
2. Open ChatGPT (`https://chatgpt.com/*` or `https://chat.openai.com/*`)
3. Run either action:
    - `Alt + Shift + Q`
    - Right click and choose Quote selected text into ChatGPT

## Configuration

- Shortcut key: change from `chrome://extensions/shortcuts`
- Supported host permissions are managed in `manifest.config.ts`

## Permissions

- `contextMenus`: add the right-click action
- `tabs`: resolve target tabs
- `scripting`: execute quote insertion logic
- `host_permissions` (`https://chatgpt.com/*`, `https://chat.openai.com/*`): limit access to ChatGPT pages

## Development

```bash
pnpm install
pnpm build
```

Build output is generated in `dist`.

## Testing

```bash
pnpm test
pnpm lint
pnpm typecheck
```

## Release

```bash
pnpm package:zip
```

This creates `chatgpt-quote.zip` for Chrome Web Store upload.
