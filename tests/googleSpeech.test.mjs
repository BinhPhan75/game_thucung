import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const source = stripTypeScriptTypes(readFileSync(new URL('../src/utils/googleSpeech.ts', import.meta.url), 'utf8'));
const { GoogleSpeechPlayer, splitSpeech, googleSpeechUrl } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
class FakeAudio {
  plays = [];
  play() { this.plays.push(this.src); return this.result ?? Promise.resolve(); }
  pause() { this.paused = true; }
  removeAttribute() { this.src = ''; }
  load() {}
}
test('Vietnamese text is safely encoded and split without dropping characters', () => {
  const text = 'Bé ơi! ' + 'Thỏ đã ăn no rồi nhé. '.repeat(20) + '😀'.repeat(200);
  const chunks = splitSpeech(text);
  assert.ok(chunks.every(c => [...c].length <= 180));
  assert.equal(chunks.join('').replace(/\s/g, ''), text.replace(/\s/g, ''));
  const url = new URL(googleSpeechUrl('Bé & Miu? #1'), 'https://game.example');
  assert.equal(url.searchParams.get('q'), 'Bé & Miu? #1');
  assert.equal(url.pathname, '/api/tts');
  assert.equal(url.hostname, 'game.example');
  assert.deepEqual(splitSpeech('   '), []);
});
test('praise and guidance play sequentially; mute cancels queued speech', () => {
  const audio = new FakeAudio();
  const player = new GoogleSpeechPlayer(audio);
  player.speak('Giỏi quá!');
  player.speak('Mình uống nước nhé.');
  assert.equal(audio.plays.length, 1);
  audio.onplaying();
  assert.equal(player.getStatus(), 'playing');
  audio.onended();
  assert.equal(audio.plays.length, 2);
  const staleEnd = audio.onended;
  player.setMuted(true);
  staleEnd();
  player.speak('Không phát khi tắt tiếng');
  assert.equal(audio.plays.length, 2);
  assert.equal(player.getStatus(), 'idle');
});
test('mobile autoplay rejection can be retried without changing the voice source', async () => {
  const audio = new FakeAudio();
  audio.result = Promise.reject(new DOMException('Gesture required', 'NotAllowedError'));
  const player = new GoogleSpeechPlayer(audio);
  player.speak('Xin chào bé.');
  await Promise.resolve();
  assert.equal(player.getStatus(), 'blocked');
  audio.result = Promise.resolve();
  player.retry();
  assert.equal(audio.plays[0], audio.plays[1]);
  audio.onended();
  assert.equal(player.getStatus(), 'idle');
});
test('network errors stop playback and retry the failed segment', () => {
  const audio = new FakeAudio();
  const player = new GoogleSpeechPlayer(audio);
  player.speak('Xin chào bé! Bé giỏi lắm!');
  audio.onended();
  audio.onerror();
  assert.equal(player.getStatus(), 'error');
  player.retry();
  assert.equal(audio.plays[1], audio.plays[2]);
  player.setMuted(true);
});
test('late play rejection cannot stop a newer playback after mute/unmute', async () => {
  const audio = new FakeAudio();
  let reject;
  audio.result = new Promise((_, fail) => { reject = fail; });
  const player = new GoogleSpeechPlayer(audio);
  player.speak('Câu cũ');
  player.setMuted(true);
  player.setMuted(false);
  audio.result = Promise.resolve();
  player.speak('Câu mới');
  reject(new DOMException('Interrupted', 'AbortError'));
  await Promise.resolve();
  assert.equal(player.getStatus(), 'loading');
  player.setMuted(true);
});
