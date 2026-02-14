import { beforeEach, describe, expect, it, vi } from 'vitest';

import { INSERT_QUOTE_MESSAGE_TYPE } from '../../src/shared/messages';

type CommandListener = (command: string) => void;

const flushMicrotasks = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('background shortcut command', () => {
  let commandListener: CommandListener | undefined;

  const tabsQuery = vi.fn();
  const tabsSendMessage = vi.fn();
  const scriptingExecuteScript = vi.fn();

  beforeEach(async () => {
    commandListener = undefined;
    vi.resetModules();
    vi.clearAllMocks();

    const chromeMock = {
      contextMenus: {
        removeAll: vi.fn((callback: () => void) => callback()),
        create: vi.fn(),
        onClicked: {
          addListener: vi.fn()
        }
      },
      runtime: {
        onInstalled: {
          addListener: vi.fn()
        },
        onStartup: {
          addListener: vi.fn()
        }
      },
      commands: {
        onCommand: {
          addListener: vi.fn((listener: CommandListener) => {
            commandListener = listener;
          })
        }
      },
      tabs: {
        query: tabsQuery,
        sendMessage: tabsSendMessage
      },
      scripting: {
        executeScript: scriptingExecuteScript
      }
    };

    tabsQuery.mockResolvedValue([{ id: 101, url: 'https://chatgpt.com/c/abc' }]);
    tabsSendMessage.mockResolvedValue({ ok: true });
    scriptingExecuteScript.mockResolvedValue([{ result: '  selected from shortcut  ' }]);

    vi.stubGlobal('chrome', chromeMock);

    await import('../../src/background/index');
  });

  it('runs quote flow when quote shortcut command is triggered', async () => {
    commandListener?.('quote-selection');
    await flushMicrotasks();

    expect(tabsQuery).toHaveBeenCalledWith({ active: true, lastFocusedWindow: true });
    expect(scriptingExecuteScript).toHaveBeenCalled();
    expect(tabsSendMessage).toHaveBeenCalledWith(101, {
      type: INSERT_QUOTE_MESSAGE_TYPE,
      payload: { selectionText: 'selected from shortcut' }
    });
  });

  it('ignores unknown command names', async () => {
    commandListener?.('unknown-command');
    await flushMicrotasks();

    expect(tabsQuery).not.toHaveBeenCalled();
  });
});
