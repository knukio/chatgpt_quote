import { describe, expect, it, vi } from 'vitest';

import { attachHotReload, type ViteHotContext } from '../../src/shared/hotReload';

const createHotContext = () => {
  const listeners = new Map<string, Array<() => void>>();

  const hot: ViteHotContext = {
    accept(callback?: () => void) {
      if (!callback) return;
      const existing = listeners.get('accept') ?? [];
      listeners.set('accept', [...existing, callback]);
    },
    on(event, callback) {
      const existing = listeners.get(event) ?? [];
      listeners.set(event, [...existing, callback]);
    }
  };

  const emit = (event: string): void => {
    const callbacks = listeners.get(event) ?? [];
    callbacks.forEach((callback) => callback());
  };

  return { hot, emit };
};

describe('attachHotReload', () => {
  it('returns false when Vite HMR is unavailable', () => {
    const reload = vi.fn();

    expect(attachHotReload(undefined, reload)).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('registers reload handlers for accept and beforeUpdate events', () => {
    const reload = vi.fn();
    const { hot, emit } = createHotContext();

    expect(attachHotReload(hot, reload)).toBe(true);

    emit('accept');
    emit('vite:beforeUpdate');

    expect(reload).toHaveBeenCalledTimes(2);
  });

  it('works even when hot context does not expose event API', () => {
    const reload = vi.fn();
    const hot = {
      accept(callback?: () => void) {
        callback?.();
      }
    };

    expect(attachHotReload(hot, reload)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
