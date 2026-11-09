import { describe, expect, it } from 'vitest';
import { detectPlatform } from './platform';

const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const IPAD_AS_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15';
const WINDOWS = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

describe('detectPlatform', () => {
  it('recognises an Android phone', () => {
    expect(detectPlatform({ userAgent: ANDROID, maxTouchPoints: 5 })).toBe('android');
  });

  it('recognises an iPhone', () => {
    expect(detectPlatform({ userAgent: IPHONE, maxTouchPoints: 5 })).toBe('iphone');
  });

  it('treats an iPad that reports itself as a Mac as an iPhone-like device', () => {
    expect(detectPlatform({ userAgent: IPAD_AS_MAC, maxTouchPoints: 5 })).toBe('iphone');
  });

  it('does not mistake a real Mac for an iPad', () => {
    expect(detectPlatform({ userAgent: IPAD_AS_MAC, maxTouchPoints: 0 })).toBe('unknown');
  });

  it('returns unknown on a computer', () => {
    expect(detectPlatform({ userAgent: WINDOWS, maxTouchPoints: 0 })).toBe('unknown');
  });
});
