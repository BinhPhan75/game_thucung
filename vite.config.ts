import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function googleTranslateTtsProxyPlugin(): Plugin {
  const handler = async (req: any, res: any, next: () => void) => {
    if (!req.url || !req.url.startsWith('/api/tts')) {
      return next();
    }
    try {
      const url = new URL(req.url, 'http://localhost:3000');
      const text = url.searchParams.get('text') || url.searchParams.get('q') || '';
      if (!text.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Missing text query parameter');
        return;
      }

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text.trim())}`;
      const response = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        res.statusCode = response.status;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(`Google Translate TTS error: ${response.status}`);
        return;
      }

      const buffer = await response.arrayBuffer();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(Buffer.from(buffer));
    } catch (err: any) {
      console.error('TTS Proxy Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('TTS Proxy internal error');
    }
  };

  return {
    name: 'google-translate-tts-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), googleTranslateTtsProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
