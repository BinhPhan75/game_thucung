import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const source = stripTypeScriptTypes(readFileSync(new URL('../server/tts.ts', import.meta.url), 'utf8'));
const { createTtsHandler } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const request = (text) => new Request(`http://local/api/tts?q=${encodeURIComponent(text)}`);
test('proxy accepts short Vietnamese text, uses fixed Google host and caches audio', async () => {
  let calls=0;
  const handler=createTtsHandler(async url => {
    calls++; assert.equal(url.hostname,'translate.google.com'); assert.equal(url.searchParams.get('tl'),'vi');
    return new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'audio/mpeg'}});
  });
  const response=await handler(request('Bé giỏi quá!'));
  assert.equal(response.status,200); assert.equal(response.headers.get('content-type'),'audio/mpeg');
  assert.equal((await response.arrayBuffer()).byteLength,3);
  await handler(request('Bé giỏi quá!')); assert.equal(calls,1);
});
test('invalid input and wrong methods never reach Google', async () => {
  const handler=createTtsHandler(()=>{ throw Error('Must not fetch'); });
  for(const text of ['', 'a'.repeat(181),'abc\u0000']) assert.equal((await handler(request(text))).status,400);
  assert.equal((await handler(new Request('http://local/api/tts',{method:'POST'}))).status,405);
});
test('upstream errors, HTML and oversized audio are not served as speech', async () => {
  for(const response of [new Response('blocked',{status:429}),new Response('<html>captcha</html>'),new Response(new Uint8Array(300000),{headers:{'content-type':'audio/mpeg'}})]) {
    const handler=createTtsHandler(async()=>response);
    const result=await handler(request('Xin chào'));
    assert.equal(result.status,502); assert.equal(result.headers.get('cache-control'),'no-store');
  }
});
