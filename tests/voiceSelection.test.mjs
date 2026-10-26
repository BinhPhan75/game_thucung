import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const source = stripTypeScriptTypes(readFileSync(new URL('../src/utils/voiceSelection.ts', import.meta.url), 'utf8'));
const { selectVietnameseVoice: select } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const voice = (name, lang = 'vi-VN', isDefault = false) => ({ name, lang, default: isDefault, voiceURI: name });

test('prefers explicit Southern female labels over generic female and male voices', () => {
  const southern = voice('Giọng nữ miền Nam');
  assert.equal(select([voice('Microsoft NamMinh'), voice('Microsoft HoaiMy'), southern]), southern);
});
test('female Vietnamese fallback beats male or unknown accent labels', () => {
  const female = voice('Microsoft HoaiMy');
  assert.equal(select([voice('Giọng nam miền Nam'), voice('Vietnamese', 'vi-VN', true), female]), female);
});
test('does not mistake female for male and ignores non-Vietnamese voices', () => {
  const female = voice('Vietnamese Female');
  assert.equal(select([voice('Southern Female', 'en-US'), voice('Vietnamese Male'), female]), female);
  assert.equal(select([voice('English Female', 'en-US')]), undefined);
  assert.equal(select([]), undefined);
});
test('refresh can select a better voice when the browser loads more voices', () => {
  const fallback = voice('Vietnamese');
  const preferred = voice('Female Saigon');
  assert.equal(select([fallback]), fallback);
  assert.equal(select([fallback, preferred]), preferred);
});
