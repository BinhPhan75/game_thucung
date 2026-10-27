import { getGoogleSpeechPlayer } from './googleSpeech';
import { pickVoiceLine, type VoiceEvent, type VoiceContext } from './voicePool';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Sound Synthesizer & Speech Helper for Pet Math Farm
let audioCtx: AudioContext | null = null;
let bgmGain: GainNode | null = null;
let bgmInterval: number | null = null;
let isBgmPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playPopSound = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    console.debug('Audio error:', e);
  }
};

export const playChimeSound = () => {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + index * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
};

export const playCelebrationSound = () => {
  try {
    const ctx = getAudioContext();
    // Cheerful arpeggio fanfare
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
};

export const playGentleTapSound = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.debug('Audio error:', e);
  }
};

export const playEncouragingSound = () => {
  try {
    const ctx = getAudioContext();
    // Warm gentle musical tone (no harsh buzz!)
    const notes = [440, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
};

// Playful animal sounds synthesized
export const playPetVoice = (type: 'dog' | 'cat' | 'bunny') => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'dog') {
      // Happy energetic "woof woof"
      [0, 0.14].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + delay;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(420, t + 0.04);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.12);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.13);
      });
    } else if (type === 'cat') {
      // Sweet playful "meow" pitch glide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } else {
      // Bunny bouncy cute spring "boing!"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.debug('Pet audio error:', e);
  }
};

// Playful background music loop (Soft pentatonic music box)
export const startBackgroundMusic = () => {
  if (isBgmPlaying) return;
  try {
    const ctx = getAudioContext();
    bgmGain = ctx.createGain();
    bgmGain.gain.setValueAtTime(0.04, ctx.currentTime); // gentle ambient volume
    bgmGain.connect(ctx.destination);

    isBgmPlaying = true;
    const pentatonicNotes = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99]; // G4, A4, C5, D5, E5, G5
    let step = 0;

    const playNextNote = () => {
      if (!isBgmPlaying || !bgmGain) return;
      try {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const now = ctx.currentTime;

        const freq = pentatonicNotes[step % pentatonicNotes.length];
        step = (step + 1 + Math.floor(Math.random() * 2)) % pentatonicNotes.length;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.08, now);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(noteGain);
        noteGain.connect(bgmGain);

        osc.start(now);
        osc.stop(now + 0.65);
      } catch (err) {
        console.debug('BGM note error:', err);
      }
    };

    bgmInterval = window.setInterval(playNextNote, 600);
  } catch (e) {
    console.debug('BGM start error:', e);
  }
};

export const stopBackgroundMusic = () => {
  isBgmPlaying = false;
  if (bgmInterval !== null) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (bgmGain) {
    try {
      bgmGain.disconnect();
    } catch {
      // ignore
    }
    bgmGain = null;
  }
};

export const isMusicPlaying = () => isBgmPlaying;

// One Google voice source across devices, with persisted mute preference.
export const VOICE_MUTED_STORAGE_KEY = 'PET_MATH_VOICE_MUTED';
export const VOICE_MUTED_EVENT = 'pet-math-speech-mute-change';
let speechMuted = (() => { try { return typeof window !== 'undefined' && localStorage.getItem(VOICE_MUTED_STORAGE_KEY) === 'true'; } catch { return false; } })();
export const isSpeechMuted = () => speechMuted;
export const setSpeechMuted = (muted: boolean) => {
  speechMuted = muted;
  if (typeof window !== 'undefined') {
    getGoogleSpeechPlayer().setMuted(muted);
    try { localStorage.setItem(VOICE_MUTED_STORAGE_KEY, String(muted)); } catch { /* Storage can be disabled. */ }
    window.dispatchEvent(new CustomEvent(VOICE_MUTED_EVENT, { detail: muted }));
  }
};
export const speakVietnamese = (text: string) => {
  if (speechMuted || typeof window === 'undefined') return;
  getGoogleSpeechPlayer().speak(text);
};
export const stopSpeech = () => { if (typeof window !== 'undefined') getGoogleSpeechPlayer().stop(); };

// Cute crunchy munching sound for feeding
export const playEatingSound = () => {
  try {
    const ctx = getAudioContext();
    [0, 0.1, 0.2].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + idx * 40, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    });
  } catch (e) {
    console.debug('Eating sound error:', e);
  }
};

// Cute bubbling water sound for drinking
export const playDrinkingSound = () => {
  try {
    const ctx = getAudioContext();
    [0, 0.12, 0.24].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + delay;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + idx * 80, t);
      osc.frequency.exponentialRampToValueAtTime(650 + idx * 80, t + 0.09);

      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
    });
  } catch (e) {
    console.debug('Drinking sound error:', e);
  }
};


export const speakGameEvent = (
  event: VoiceEvent, 
  context: VoiceContext = {}
) => {
  if (speechMuted) return;
  speakVietnamese(pickVoiceLine(event, context));
};
