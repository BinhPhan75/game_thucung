import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ttsMiddleware } from './server/ttsMiddleware.ts';
export default defineConfig({
  plugins: [react(), tailwindcss(), { name: 'google-tts-proxy',
    configureServer(server) { server.middlewares.use(ttsMiddleware); },
    configurePreviewServer(server) { server.middlewares.use(ttsMiddleware); },
  }],
  resolve: { alias: { '@': import.meta.dirname } },
  server: { port: 3000, host: '0.0.0.0', hmr: process.env.DISABLE_HMR !== 'true', watch: process.env.DISABLE_HMR === 'true' ? null : {} },
});
