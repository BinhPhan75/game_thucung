import { selectVietnameseVoice } from './voiceSelection';
import { pickVoiceLine, type VoiceEvent } from './voicePool';

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

// Speech state management
export const VOICE_MUTED_STORAGE_KEY = 'PET_MATH_VOICE_MUTED';
export const VOICE_MUTED_EVENT = 'pet-math-speech-mute-change';

let speechMuted = (() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem(VOICE_MUTED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }
  return false;
})();
let currentSpeechId = 0;
let currentAudio: HTMLAudioElement | null = null;
const ttsBlobCache = new Map<string, string>(); // cleanText -> blobUrl

// Web Speech fallback voice cache
let vietnameseVoice: SpeechSynthesisVoice | undefined;
const refreshVoice = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    vietnameseVoice = selectVietnameseVoice(window.speechSynthesis.getVoices());
  }
};
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoice();
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoice);
}

/**
 * Stop any ongoing speech playback immediately
 */
export const stopSpeech = () => {
  currentSpeechId++;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
};

/**
 * Toggle or set speech muting (persists to localStorage and notifies listeners)
 */
export const setSpeechMuted = (muted: boolean) => {
  speechMuted = muted;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(VOICE_MUTED_STORAGE_KEY, String(muted));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(VOICE_MUTED_EVENT, { detail: muted }));
  }
  if (muted) {
    stopSpeech();
  }
};

export const isSpeechMuted = () => speechMuted;

/**
 * Play audio via Google Translate TTS:
 * 1. Checks memory cache
 * 2. Tries local proxy endpoint (/api/tts)
 * 3. Tries direct Google Translate TTS endpoint with no-referrer
 * 4. Resolves true if playback started successfully, false otherwise
 */
async function playGoogleTranslateTTS(text: string, speechId: number): Promise<boolean> {
  const cleanText = text.trim();
  if (!cleanText) return false;

  const playAudioUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (speechMuted || currentSpeechId !== speechId) {
        resolve(false);
        return;
      }

      const audio = new Audio();
      audio.setAttribute('referrerpolicy', 'no-referrer');
      audio.preload = 'auto';

      let settled = false;
      const cleanup = () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      const handleEnded = () => {
        cleanup();
        if (currentAudio === audio) {
          currentAudio = null;
        }
      };

      const handleError = () => {
        cleanup();
        if (currentAudio === audio) {
          currentAudio = null;
        }
        if (!settled) {
          settled = true;
          resolve(false);
        }
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      audio.src = url;
      currentAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!settled) {
              settled = true;
              resolve(true);
            }
          })
          .catch(() => {
            handleError();
          });
      } else {
        settled = true;
        resolve(true);
      }
    });
  };

  // 1. Check in-memory cached Blob URL
  if (ttsBlobCache.has(cleanText)) {
    const cachedUrl = ttsBlobCache.get(cleanText)!;
    const played = await playAudioUrl(cachedUrl);
    if (played) return true;
    ttsBlobCache.delete(cleanText);
  }

  if (speechMuted || currentSpeechId !== speechId) return false;

  // 2. Try proxy endpoint /api/tts?text=...
  try {
    const proxyUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
    const res = await fetch(proxyUrl);
    if (res.ok && res.headers.get('content-type')?.includes('audio')) {
      const blob = await res.blob();
      if (speechMuted || currentSpeechId !== speechId) return false;
      const blobUrl = URL.createObjectURL(blob);
      ttsBlobCache.set(cleanText, blobUrl);
      const played = await playAudioUrl(blobUrl);
      if (played) return true;
    }
  } catch (err) {
    console.debug('TTS Proxy fetch failed, attempting direct endpoint:', err);
  }

  if (speechMuted || currentSpeechId !== speechId) return false;

  // 3. Try direct Google Translate TTS endpoint
  try {
    const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    const playedDirect = await playAudioUrl(directUrl);
    if (playedDirect) return true;
  } catch (err) {
    console.debug('Direct TTS failed, falling back to Web Speech API:', err);
  }

  return false;
}

/**
 * Fallback to browser's native Web Speech API if network TTS is unavailable
 */
function playWebSpeechFallback(text: string) {
  if (speechMuted || typeof window === 'undefined' || !('speechSynthesis' in window)
      || !('SpeechSynthesisUtterance' in window)) return;
  try {
    refreshVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    if (vietnameseVoice) utterance.voice = vietnameseVoice;
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.debug('WebSpeech fallback error:', error);
  }
}

/**
 * Main Vietnamese Speech Synthesis function:
 * Uses Google Translate TTS (free via proxy / public endpoint) with Web Speech fallback
 */
export const speakVietnamese = (text: string) => {
  if (speechMuted || !text || typeof window === 'undefined') return;

  // Stop previous speech to prevent overlapping sounds
  stopSpeech();

  const speechId = ++currentSpeechId;

  // Play natural Google Translate TTS
  playGoogleTranslateTTS(text, speechId).then((success) => {
    // If network TTS failed and wasn't cancelled or muted, fall back to native speech
    if (!success && !speechMuted && currentSpeechId === speechId) {
      playWebSpeechFallback(text);
    }
  });
};

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
