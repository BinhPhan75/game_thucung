import { test } from 'node:test';
import assert from 'node:assert/strict';

function makeGoogleTtsUrl(text, lang = 'vi') {
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(text.trim())}`;
}

test('Google Translate TTS endpoint URL generates properly with Vietnamese encoding', () => {
  const phrase = 'Chính xác rồi! Bé giỏi quá!';
  const url = makeGoogleTtsUrl(phrase);
  assert.ok(url.startsWith('https://translate.google.com/translate_tts?'));
  assert.ok(url.includes('tl=vi'));
  assert.ok(url.includes('client=tw-ob'));
  assert.ok(url.includes('ie=UTF-8'));
  assert.ok(url.includes(encodeURIComponent(phrase)));
});

test('Google Translate TTS endpoint responds with 200 and audio/mpeg when fetched without referer', async () => {
  const phrase = 'Bé giỏi quá!';
  const url = makeGoogleTtsUrl(phrase);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      'Accept': '*/*',
    },
  });

  assert.equal(response.status, 200);
  assert.ok(response.headers.get('content-type')?.includes('audio'));
  const buf = await response.arrayBuffer();
  assert.ok(buf.byteLength > 1000, `Expected MP3 byte length > 1000, got ${buf.byteLength}`);
});
