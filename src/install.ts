import type { Platform } from './platform';

export type InstallTab = Exclude<Platform, 'unknown'>;

/** The install tab shown first; a computer gets the Android steps. */
export function initialTab(platform: Platform): InstallTab {
  return platform === 'unknown' ? 'android' : platform;
}
