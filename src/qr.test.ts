import { describe, expect, it } from 'vitest';
import { qrSvg } from './qr';

describe('qrSvg', () => {
  const svg = qrSvg('https://vmit-rgb.github.io/phys-activity-tracking-app/');

  it('draws a square SVG with a white quiet zone and black modules', () => {
    expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 (\d+) \1"/);
    expect(svg).toContain('fill="#ffffff"');
    expect(svg).toContain('fill="#000000"');
  });

  it('is labelled for screen readers with the address it opens', () => {
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="QR-код: vmit-rgb.github.io/phys-activity-tracking-app"');
  });

  it('changes when the address changes', () => {
    expect(qrSvg('https://example.org/')).not.toBe(svg);
  });
});
