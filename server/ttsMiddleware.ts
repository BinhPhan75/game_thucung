import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleTts } from './tts';

export async function ttsMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname !== '/api/tts') { next(); return; }
  const response = await handleTts(new Request(url, { method: req.method ?? 'GET' }));
  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}
