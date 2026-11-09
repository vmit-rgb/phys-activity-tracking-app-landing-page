import { describe, expect, it } from 'vitest';
import { initialTab } from './install';

describe('initialTab', () => {
  it('opens the tab of the detected phone', () => {
    expect(initialTab('iphone')).toBe('iphone');
    expect(initialTab('android')).toBe('android');
  });

  it('opens android when the phone is unknown', () => {
    expect(initialTab('unknown')).toBe('android');
  });
});
