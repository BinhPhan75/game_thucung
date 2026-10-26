import { PetState } from '../types/game';

// Keep existing saves compatible and reject malformed identities.
export function restorePet(value: unknown): PetState | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  if (typeof data.name !== 'string' || !data.name.trim()
    || !['dog', 'cat', 'bunny'].includes(String(data.type))) return null;
  const number = (key: string, fallback: number, min = 0, max = Number.MAX_SAFE_INTEGER) =>
    typeof data[key] === 'number' && Number.isFinite(data[key])
      ? Math.min(max, Math.max(min, data[key] as number)) : fallback;
  const level = Math.floor(number('level', 1, 1));
  const unlockedCostumes = Array.isArray(data.unlockedCostumes)
    ? [...new Set(data.unlockedCostumes.filter((id): id is string => typeof id === 'string'))] : [];
  const equipment = (key: string) => typeof data[key] === 'string' && unlockedCostumes.includes(data[key] as string)
    ? data[key] as string : undefined;
  return {
    type: data.type as PetState['type'], name: data.name,
    childName: typeof data.childName === 'string' ? data.childName : '',
    level, stage: level >= 8 ? 'master' : level >= 4 ? 'junior' : 'baby',
    exp: number('exp', 0), maxExp: number('maxExp', 100, 1),
    hunger: number('hunger', 30, 0, 100), thirst: number('thirst', 30, 0, 100),
    happiness: number('happiness', 80, 0, 100), coins: number('coins', 20),
    stars: number('stars', 1), createdAt: number('createdAt', Date.now()),
    unlockedCostumes, equippedHat: equipment('equippedHat'), equippedOutfit: equipment('equippedOutfit'),
    inventory: data.inventory && typeof data.inventory === 'object' && !Array.isArray(data.inventory)
      ? Object.fromEntries(Object.entries(data.inventory).filter(([, count]) => typeof count === 'number' && Number.isFinite(count) && count >= 0)) : {},
  };
}
