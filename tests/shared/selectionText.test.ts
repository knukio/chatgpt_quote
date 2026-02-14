import { describe, expect, it } from 'vitest';

import { resolveSelectionText } from '../../src/shared/selectionText';

describe('resolveSelectionText', () => {
  it('prefers live selection text when available', () => {
    expect(resolveSelectionText('line one\nline two', 'line one line two')).toBe('line one\nline two');
  });

  it('falls back to message selection text when live selection is empty', () => {
    expect(resolveSelectionText('   ', 'line one line two')).toBe('line one line two');
  });
});
