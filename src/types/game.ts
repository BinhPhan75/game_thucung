/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PetType = 'dog' | 'cat' | 'bunny';

export type PetStage = 'baby' | 'junior' | 'master'; // Bé nhỏ (Cấp 1-3), Bé lớn (Cấp 4-7), Thú cưng siêu sao (Cấp 8+)

export type QuestTarget = 'food' | 'water' | 'costume';

export interface CostumeItem {
  visual?: 'cap' | 'wizard' | 'scarf' | 'medal' | 'glasses' | 'cape' | 'bow' | 'helmet';
  color?: string;
  id: string;
  name: string;
  category: 'hat' | 'accessory' | 'cape';
  icon: string;
  price: number;
  description: string;
}

export interface PetState {
  childName?: string;
  type: PetType;
  name: string;
  stage: PetStage;
  level: number;
  exp: number;
  maxExp: number;
  hunger: number; // 0 - 100
  thirst: number; // 0 - 100
  happiness: number; // 0 - 100
  coins: number;
  stars: number;
  createdAt: number;
  equippedHat?: string;
  equippedOutfit?: string;
  inventory: { [itemId: string]: number };
  unlockedCostumes: string[];
}

export type GameScreen = 
  | 'welcome'        // Màn hình bắt đầu (Module 1)
  | 'pet_selection'  // Màn hình chọn thú cưng & đặt tên (Module 1)
  | 'garden';        // Sân vườn chính (Module 2) + Tủ đồ (Module 5) + Toán (Module 3)

export interface PetPreset {
  id: PetType;
  name: string;
  speciesName: string;
  defaultName: string;
  tagline: string;
  personality: string;
  favoriteFood: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    bgGradient: string;
    border: string;
  };
  sampleNames: string[];
}
