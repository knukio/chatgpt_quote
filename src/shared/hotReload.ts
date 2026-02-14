export type ViteHotContext = {
  accept: (callback?: () => void) => void;
  on?: (event: 'vite:beforeUpdate', callback: () => void) => void;
};

export const attachHotReload = (
  hot: ViteHotContext | undefined,
  reload: () => void
): boolean => {
  if (!hot) return false;

  hot.accept(() => {
    reload();
  });
  hot.on?.('vite:beforeUpdate', () => {
    reload();
  });

  return true;
};
