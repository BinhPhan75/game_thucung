// Fixed Google upstream: this endpoint cannot proxy arbitrary URLs.
export function createTtsHandler(fetchAudio: typeof fetch = fetch) {
  const cache = new Map<string, { bytes: Uint8Array; expires: number }>();
  let active = 0;
  const error = (status: number, message: string) => new Response(message, {
    status, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
  });
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'GET') return error(405, 'Method not allowed');
    const url = new URL(request.url);
    const text = (url.searchParams.get('q') ?? url.searchParams.get('text'))?.trim() ?? '';
    if (!text || [...text].length > 180 || /[\u0000-\u001f]/u.test(text)) return error(400, 'Invalid text');
    const language = url.searchParams.get('tl') ?? 'vi';
    if (language !== 'vi' && language !== 'en') return error(400, 'Invalid language');
    const cacheKey = language + ':' + text;
    const cached = cache.get(cacheKey);
    const headers = { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff' };
    if (cached && cached.expires > Date.now()) return new Response(cached.bytes as BodyInit, { headers });
    if (active >= 4) return error(503, 'Please retry shortly');
    active++;
    try {
      const upstream = new URL('https://translate.google.com/translate_tts');
      upstream.search = new URLSearchParams({ ie: 'UTF-8', client: 'tw-ob', tl: language, q: text }).toString();
      const response = await fetchAudio(upstream, {
        signal: AbortSignal.timeout(8000), redirect: 'error',
        headers: { Accept: 'audio/mpeg' },
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('audio/')) {
        await response.body?.cancel();
        return error(502, 'Voice service unavailable');
      }
      const reader = response.body?.getReader();
      if (!reader) return error(502, 'Empty voice response');
      const parts: Uint8Array[] = [];
      let length = 0;
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        length += part.value.byteLength;
        if (length > 256 * 1024) {
          await reader.cancel();
          return error(502, 'Voice response too large');
        }
        parts.push(part.value);
      }
      if (!length) return error(502, 'Empty voice response');
      const bytes = new Uint8Array(length);
      let offset = 0;
      for (const part of parts) { bytes.set(part, offset); offset += part.byteLength; }
      // Best-effort per-process cache; correctness does not depend on warm instances.
      if (cache.size >= 64) cache.delete(cache.keys().next().value!);
      cache.set(cacheKey, { bytes, expires: Date.now() + 3600000 });
      return new Response(bytes, { headers });
    } catch {
      return error(502, 'Voice service unavailable');
    } finally { active--; }
  };
}

export const handleTts = createTtsHandler();
