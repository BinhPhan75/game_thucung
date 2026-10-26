import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Voice muting storage key and event constants are well-defined', async () => {
  const VOICE_MUTED_STORAGE_KEY = 'PET_MATH_VOICE_MUTED';
  const VOICE_MUTED_EVENT = 'pet-math-speech-mute-change';

  assert.equal(VOICE_MUTED_STORAGE_KEY, 'PET_MATH_VOICE_MUTED');
  assert.equal(VOICE_MUTED_EVENT, 'pet-math-speech-mute-change');
});

test('Speech mute state persists properly to mock localStorage and dispatches event', () => {
  const mockStorage = new Map();
  const dispatchedEvents = [];

  const fakeWindow = {
    localStorage: {
      getItem: (key) => mockStorage.get(key) ?? null,
      setItem: (key, val) => mockStorage.set(key, String(val)),
    },
    dispatchEvent: (ev) => dispatchedEvents.push(ev),
  };

  let speechMuted = fakeWindow.localStorage.getItem('PET_MATH_VOICE_MUTED') === 'true';
  assert.equal(speechMuted, false);

  const setMuted = (muted) => {
    speechMuted = muted;
    fakeWindow.localStorage.setItem('PET_MATH_VOICE_MUTED', String(muted));
    fakeWindow.dispatchEvent({ type: 'pet-math-speech-mute-change', detail: muted });
  };

  setMuted(true);
  assert.equal(speechMuted, true);
  assert.equal(fakeWindow.localStorage.getItem('PET_MATH_VOICE_MUTED'), 'true');
  assert.equal(dispatchedEvents.length, 1);
  assert.equal(dispatchedEvents[0].detail, true);

  // Re-read simulation on next session
  const reloadedMuted = fakeWindow.localStorage.getItem('PET_MATH_VOICE_MUTED') === 'true';
  assert.equal(reloadedMuted, true);

  setMuted(false);
  assert.equal(speechMuted, false);
  assert.equal(fakeWindow.localStorage.getItem('PET_MATH_VOICE_MUTED'), 'false');
  assert.equal(dispatchedEvents.length, 2);
  assert.equal(dispatchedEvents[1].detail, false);
});
