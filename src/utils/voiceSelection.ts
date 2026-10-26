type VoiceInfo = Pick<SpeechSynthesisVoice, 'lang' | 'name' | 'voiceURI' | 'default'>;

// Web Speech exposes no gender/accent fields. These are preferences inferred
// from explicit voice labels, not guarantees of a Southern accent.
export function selectVietnameseVoice<T extends VoiceInfo>(voices: readonly T[]): T | undefined {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const score = (voice: T) => {
    const label = normalize(`${voice.name} ${voice.voiceURI}`);
    const female = /\b(female|woman|nu)\b|hoai\s*my/.test(label);
    const male = /\bmale\b|nam\s*minh|giong nam\b/.test(label);
    const southern = /mien nam|southern|south vietnam|sai\s*gon|saigon|ho chi minh/.test(label);
    return (female ? 100 : 0) + (female && southern ? 100 : 0)
      - (male && !female ? 100 : 0) + (voice.default ? 1 : 0);
  };
  return voices.filter(voice => /^vi(?:[-_]|$)/i.test(voice.lang))
    .reduce<T | undefined>((best, voice) => !best || score(voice) > score(best) ? voice : best, undefined);
}
