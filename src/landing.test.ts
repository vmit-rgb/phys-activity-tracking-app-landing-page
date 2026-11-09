import { beforeEach, describe, expect, it } from 'vitest';
import html from '../index.html?raw';
import { initLanding } from './landing';

function load(platform: 'android' | 'iphone' | 'unknown') {
  document.documentElement.innerHTML = html.replace(/<script[\s\S]*?<\/script>/g, '');
  initLanding(document, platform);
}

const tab = (name: string) => document.querySelector<HTMLButtonElement>(`[data-tab="${name}"]`)!;
const panel = (name: string) => document.querySelector<HTMLElement>(`#steps-${name}`)!;
const toast = () => document.querySelector<HTMLElement>('.toast')!;

describe('install tabs', () => {
  it('opens the steps for the detected iPhone', () => {
    load('iphone');
    expect(tab('iphone').getAttribute('aria-selected')).toBe('true');
    expect(panel('iphone').hidden).toBe(false);
    expect(panel('android').hidden).toBe(true);
  });

  it('opens the Android steps on a computer', () => {
    load('unknown');
    expect(tab('android').getAttribute('aria-selected')).toBe('true');
    expect(panel('android').hidden).toBe(false);
  });

  it('switches steps when the other tab is tapped', () => {
    load('android');
    tab('iphone').click();
    expect(panel('iphone').hidden).toBe(false);
    expect(panel('android').hidden).toBe(true);
    expect(tab('android').getAttribute('aria-selected')).toBe('false');
    expect(tab('iphone').tabIndex).toBe(0);
    expect(tab('android').tabIndex).toBe(-1);
  });

  it('moves between tabs with the arrow keys', () => {
    load('android');
    tab('android').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(panel('iphone').hidden).toBe(false);
    expect(document.activeElement).toBe(tab('iphone'));
  });

  it('moves back with the left arrow', () => {
    load('iphone');
    tab('iphone').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(panel('android').hidden).toBe(false);
    expect(document.activeElement).toBe(tab('android'));
  });

  it('ignores other keys', () => {
    load('android');
    tab('android').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(panel('android').hidden).toBe(false);
  });

  it('refuses to start on markup without the install tabs', () => {
    document.body.innerHTML = '<main></main>';
    expect(() => initLanding(document, 'android')).toThrow('[data-tab="android"]');
  });
});

describe('copy prompt', () => {
  beforeEach(() => load('android'));

  it('says the prompt is still being written, and stays until closed', () => {
    document.querySelector<HTMLButtonElement>('[data-copy-prompt]')!.click();
    expect(toast().hidden).toBe(false);
    expect(toast().textContent).toContain('промпт ще пишемо');
    document.querySelector<HTMLButtonElement>('.toast__close')!.click();
    expect(toast().hidden).toBe(true);
  });
});

describe('links', () => {
  beforeEach(() => load('android'));

  it('sends every install link to the app', () => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-app-link]')];
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const link of links) expect(link.getAttribute('href')).toBe('%VITE_APP_URL%');
  });

  it('opens the author profiles in a new tab without sending the referrer', () => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-author-link]')];
    expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['linkedin', 'https://www.linkedin.com/in/kishtanovao/'],
      ['behance', 'https://www.behance.net/7c29d01a'],
    ]);
    for (const link of links) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener noreferrer');
    }
  });

  it('keeps buttons that lead nowhere yet inert', () => {
    const inert = [...document.querySelectorAll<HTMLButtonElement>('[aria-disabled="true"]')];
    expect(inert.map((b) => b.textContent)).toEqual(['eng', 'залишити фідбек']);
    for (const button of inert) {
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      button.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    expect(toast().hidden).toBe(true);
  });
});
