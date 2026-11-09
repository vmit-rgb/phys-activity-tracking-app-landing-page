import { defineConfig, loadEnv, type Plugin } from 'vite';
import { qrSvg, readableAddress } from './src/qr';

/** Puts the app address and its QR code into index.html at build time. */
function appLinks(appUrl: string): Plugin {
  return {
    name: 'app-links',
    transformIndexHtml: (html) =>
      html
        .replace('<!--app-qr-->', qrSvg(appUrl))
        .replaceAll('%APP_ADDRESS%', readableAddress(appUrl)),
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.');
  const appUrl = env.VITE_APP_URL;
  if (!appUrl) throw new Error('VITE_APP_URL is missing in .env');
  return {
    // GitHub Pages serves the landing from /<repo-name>/.
    base: '/phys-activity-tracking-app-landing-page/',
    plugins: [appLinks(appUrl)],
    build: { target: 'es2022', sourcemap: false },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/main.ts'],
      },
    },
  };
});
