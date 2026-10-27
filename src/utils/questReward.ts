import type { PetState, QuestTarget, CostumeItem } from '../types/game';

export function questReward(pet: PetState, target: QuestTarget, costume?: CostumeItem): PetState {
  const totalExp = pet.exp + 25;
  const level = pet.level + (totalExp >= pet.maxExp ? 1 : 0);
  const newCostume = target === 'costume' && costume && !pet.unlockedCostumes.includes(costume.id);
  return {
    ...pet,
    hunger: target === 'food' ? Math.min(100, pet.hunger + 30) : pet.hunger,
    thirst: target === 'water' ? Math.min(100, pet.thirst + 30) : pet.thirst,
    coins: pet.coins + 10 - (newCostume ? Math.min(pet.coins, costume.price) : 0),
    happiness: 100, stars: pet.stars + 1,
    exp: totalExp >= pet.maxExp ? totalExp - pet.maxExp : totalExp,
    maxExp: pet.maxExp + (level > pet.level ? 50 : 0), level,
    stage: level >= 8 ? 'master' : level >= 4 ? 'junior' : 'baby',
    unlockedCostumes: newCostume ? [...pet.unlockedCostumes, costume.id] : pet.unlockedCostumes,
    equippedHat: target === 'costume' && costume ? costume.id : pet.equippedHat,
  };
}
