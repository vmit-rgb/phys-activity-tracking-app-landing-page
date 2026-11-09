export type Platform = 'android' | 'iphone' | 'unknown';

export interface DeviceHints {
  userAgent: string;
  maxTouchPoints: number;
}

/**
 * Guesses the phone from what the browser reports. iPads on iPadOS 13+
 * say they are a Mac; the touch screen gives them away. Install steps
 * for an iPad are the same as for an iPhone.
 */
export function detectPlatform({ userAgent, maxTouchPoints }: DeviceHints): Platform {
  if (/Android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iphone';
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return 'iphone';
  return 'unknown';
}
