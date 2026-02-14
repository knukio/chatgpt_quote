# ChatGPT Quote

ChatGPT入力欄へ、選択テキストをMarkdown引用形式（`> `）で素早く挿入するChrome拡張です。  
右クリックメニューとショートカットキーの両方に対応しています。

## 機能

- 選択文字列をChatGPTの入力欄へ挿入
- 複数行を自然なMarkdown引用に変換（各行へ `> ` を付与）
- 入力欄に既存テキストがある場合は改行してから追記
- 右クリックメニューとキーボードショートカット（初期値: `Alt + Shift + Q`）で実行

## 要件

- Node.js 20+
- pnpm 10+
- Google Chrome 114+

## インストール

```bash
pnpm install
pnpm build
```

1. Chromeで `chrome://extensions` を開く
2. 右上の「Developer mode」を有効化
3. 「Load unpacked」を選択
4. このプロジェクトの `dist` ディレクトリを指定

## 使い方

1. 任意ページでテキストを選択
2. ChatGPT（`https://chatgpt.com/*` または `https://chat.openai.com/*`）を開く
3. 以下どちらかで引用挿入を実行
- `Alt + Shift + Q`
- 右クリックメニュー「Quote selected text into ChatGPT」

## 設定

- ショートカット変更: `chrome://extensions/shortcuts` で `ChatGPT Quote` のキー割り当てを変更
- 対応サイト: `manifest.config.ts` の `host_permissions` で管理

## 権限

- `contextMenus`: 右クリックメニュー項目の追加
- `tabs`: 実行対象タブの取得
- `scripting`: 対象タブでの処理実行
- `host_permissions` (`https://chatgpt.com/*`, `https://chat.openai.com/*`): ChatGPTページへの限定アクセス

## 開発

```bash
pnpm install
pnpm build
```

ビルド出力は `dist` に生成されます。

## テスト

```bash
pnpm test
pnpm lint
pnpm typecheck
```

## リリース

```bash
pnpm package:zip
```

`chatgpt-quote.zip` が生成され、Chrome Web Store Developer Dashboardへアップロードできます。
