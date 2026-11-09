import { initialTab, type InstallTab } from './install';
import type { Platform } from './platform';

const TABS: readonly InstallTab[] = ['android', 'iphone'];
const ARROW_KEYS = new Set(['ArrowRight', 'ArrowLeft']);

/** Finds an element the page markup must have; a missing one is a markup bug. */
function required<T extends Element>(doc: Document, selector: string): T {
  const element = doc.querySelector<T>(selector);
  if (!element) throw new Error(`landing markup is missing ${selector}`);
  return element;
}

interface TabParts {
  tab: HTMLButtonElement;
  panel: HTMLElement;
}

function tabParts(doc: Document): Record<InstallTab, TabParts> {
  const parts = (name: InstallTab): TabParts => ({
    tab: required(doc, `[data-tab="${name}"]`),
    panel: required(doc, `#steps-${name}`),
  });
  return { android: parts('android'), iphone: parts('iphone') };
}

function otherTab(current: InstallTab): InstallTab {
  return current === 'android' ? 'iphone' : 'android';
}

function wireTabs(doc: Document, platform: Platform): void {
  const parts = tabParts(doc);
  const select = (selected: InstallTab): void => {
    for (const name of TABS) {
      const isSelected = name === selected;
      parts[name].tab.setAttribute('aria-selected', String(isSelected));
      parts[name].tab.tabIndex = isSelected ? 0 : -1;
      parts[name].panel.hidden = !isSelected;
    }
  };
  select(initialTab(platform));
  for (const name of TABS) {
    parts[name].tab.addEventListener('click', () => select(name));
    parts[name].tab.addEventListener('keydown', (event) => {
      if (!ARROW_KEYS.has(event.key)) return;
      const next = otherTab(name);
      select(next);
      parts[next].tab.focus();
    });
  }
}

type ShowToast = (text: string, emoticon: string) => void;

/** Toast stays until closed with ×: no timer (accessibility decision, 2026-11-08). */
function wireToast(doc: Document): ShowToast {
  const toast = required<HTMLElement>(doc, '.toast');
  const body = required<HTMLElement>(doc, '.toast__text');
  required(doc, '.toast__close').addEventListener('click', () => {
    toast.hidden = true;
  });
  return (text, emoticon) => {
    const smile = doc.createElement('span');
    smile.className = 'accent';
    smile.textContent = emoticon;
    body.replaceChildren(`${text} `, smile);
    toast.hidden = false;
  };
}

function wirePrompt(doc: Document, showToast: ShowToast): void {
  required(doc, '[data-copy-prompt]').addEventListener('click', () => {
    showToast('промпт ще пишемо, скоро буде', ':)');
  });
}

/** Buttons that lead nowhere yet (feedback form, author links, English). */
function wireInert(doc: Document): void {
  doc.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[aria-disabled="true"]')) {
      event.preventDefault();
    }
  });
}

export function initLanding(doc: Document, platform: Platform): void {
  wireTabs(doc, platform);
  wirePrompt(doc, wireToast(doc));
  wireInert(doc);
}
