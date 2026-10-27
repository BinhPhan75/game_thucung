export type SpeechStatus = 'idle' | 'loading' | 'playing' | 'blocked' | 'error';

// Keep requests short, splitting at punctuation/words instead of cutting Vietnamese text.
export function splitSpeech(text: string, limit = 180): string[] {
  const chunks: string[] = [];
  let current = '';
  for (const sentence of text.trim().match(/[^.!?]+[.!?]*|[.!?]+/gu) ?? []) {
    for (const word of sentence.trim().split(/\s+/u)) {
      if (!word) continue;
      const candidate = current ? `${current} ${word}` : word;
      if (Array.from(candidate).length <= limit) {
        current = candidate;
      } else {
        if (current) chunks.push(current);
        const chars = Array.from(word);
        while (chars.length > limit) chunks.push(chars.splice(0, limit).join(''));
        current = chars.join('');
      }
    }
    if (current) chunks.push(current);
    current = '';
  }
  return chunks;
}

export function googleSpeechUrl(text: string): string {
  return `https://translate.google.com/translate_tts?${new URLSearchParams({ ie: 'UTF-8', q: text, tl: 'vi', client: 'tw-ob' })}`;
}

export class GoogleSpeechPlayer {
  private queue: string[][] = [];
  private current: string[] = [];
  private muted = false;
  private generation = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private listeners = new Set<() => void>();
  private status: SpeechStatus = 'idle';

  private audio: HTMLAudioElement;
  constructor(audio: HTMLAudioElement) {
    this.audio = audio;
    audio.preload = 'auto';
    audio.volume = 0.9;
    audio.playbackRate = 0.95;
    audio.preservesPitch = true;
  }

  getStatus = () => this.status;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  private update(status: SpeechStatus) {
    this.status = status;
    this.listeners.forEach(listener => listener());
  }
  private clearTimer() { clearTimeout(this.timer); }

  speak(text: string) {
    if (this.muted) return;
    const chunks = splitSpeech(text);
    if (!chunks.length) return;
    // Avoid a long backlog of old praise if a child answers faster than the voice.
    if (this.queue.length >= 3) this.queue.shift();
    this.queue.push(chunks);
    if (this.status === 'idle') this.next();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) this.stop();
  }

  stop() {
      this.generation++;
      this.clearTimer();
      this.audio.onended = this.audio.onerror = this.audio.onplaying = null;
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.current = [];
      this.queue = [];
      this.update('idle');
  }

  // Call directly from the retry button's click handler for mobile autoplay rules.
  retry = () => {
    if (!this.muted && (this.status === 'blocked' || this.status === 'error')) this.playCurrent();
  };

  private next() {
    if (!this.current.length) this.current = this.queue.shift() ?? [];
    if (!this.current.length) { this.update('idle'); return; }
    this.playCurrent();
  }

  private playCurrent(useProxy = false) {
    if (!this.current.length || this.muted) return;
    const generation = ++this.generation;
    this.clearTimer();
    const active = () => generation === this.generation && !this.muted;
    const failed = (status: 'blocked' | 'error') => {
      if (!active()) return;
      // Some browsers/hosts reject cross-origin Google media. Keep the same
      // Google voice via our endpoint, without falling back to a device voice.
      if (status === 'error' && !useProxy) {
        this.audio.pause();
        this.playCurrent(true);
        return;
      }
      this.generation++;
      this.clearTimer();
      this.audio.pause();
      this.update(status);
    };
    this.audio.onended = () => {
      if (!active()) return;
      this.clearTimer();
      this.current.shift();
      this.next();
    };
    this.audio.onerror = () => failed('error');
    this.audio.onplaying = () => {
      if (!active()) return;
      this.clearTimer();
      this.timer = setTimeout(() => failed('error'), 45000);
      this.update('playing');
    };
    this.update('loading');
    this.audio.src = useProxy
      ? `/api/tts?${new URLSearchParams({ q: this.current[0] })}`
      : googleSpeechUrl(this.current[0]);
    this.timer = setTimeout(() => failed('error'), 12000);
    try {
      void this.audio.play().catch((error: unknown) => {
        failed(error instanceof DOMException && error.name === 'NotAllowedError' ? 'blocked' : 'error');
      });
    } catch { failed('error'); }
  }
}

let player: GoogleSpeechPlayer | undefined;
export const getGoogleSpeechPlayer = () => player ??= new GoogleSpeechPlayer(new Audio());
