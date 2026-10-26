/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PetType } from '../types/game';

export interface PetItemPoolEntry {
  emoji: string;
  name: string;
  containerTitle: string;
  plateLabel: string;
}

export interface PetItemConfig {
  type: PetType;
  // Food properties
  foodName: string;          // Dùng trong câu nói TTS: "cà rốt và táo", "xương và thịt", "cá tươi"
  foodShortName: string;     // Hiển thị ngắn: "Cà rốt", "Xương", "Cá tươi"
  foodDisplayName: string;   // "Cà rốt / Táo", "Xương / Thịt", "Cá tươi"
  foodEmoji: string;         // "🥕", "🦴", "🐟"
  foodAltEmoji: string;      // "🍎", "🥩", "🍣"
  foodStatusLabel: string;   // "Độ no (Cà rốt / Táo)", "Độ no (Xương / Thịt)", "Độ no (Cá tươi)"
  foodQuestTitle: string;    // "GIẢI TOÁN KIẾM CÀ RỐT & TÁO", "GIẢI TOÁN KIẾM XƯƠNG & THỊT", "GIẢI TOÁN KIẾM CÁ TƯƠI"
  foodButtonLabel: string;   // "Kiếm Cà Rốt & Táo", "Kiếm Xương & Thịt", "Kiếm Cá Tươi"
  foodPool: PetItemPoolEntry[];

  // Drink properties
  drinkName: string;         // Dùng trong câu nói TTS: "nước lọc", "sữa tươi", "sữa tươi"
  drinkShortName: string;    // "Nước lọc", "Sữa tươi"
  drinkDisplayName: string;  // "Nước lọc", "Sữa tươi"
  drinkEmoji: string;        // "💧", "🥛", "🥛"
  drinkStatusLabel: string;  // "Nước lọc (Độ khát)", "Sữa tươi (Độ khát)"
  drinkQuestTitle: string;   // "GIẢI TOÁN KIẾM NƯỚC LỌC", "GIẢI TOÁN KIẾM SỮA TƯƠI"
  drinkButtonLabel: string;  // "Kiếm Nước Lọc", "Kiếm Sữa Tươi"
  drinkPool: PetItemPoolEntry[];
}

export const PET_ITEM_CONFIGS: Record<PetType, PetItemConfig> = {
  bunny: {
    type: 'bunny',
    foodName: 'cà rốt và táo',
    foodShortName: 'Cà rốt',
    foodDisplayName: 'Cà rốt / Táo',
    foodEmoji: '🥕',
    foodAltEmoji: '🍎',
    foodStatusLabel: 'Độ no (Cà rốt / Táo)',
    foodQuestTitle: 'GIẢI TOÁN KIẾM CÀ RỐT & TÁO',
    foodButtonLabel: 'Kiếm Cà Rốt & Táo',
    foodPool: [
      { emoji: '🥕', name: 'củ cà rốt', containerTitle: 'Rổ cà rốt', plateLabel: 'ĐĨA' },
      { emoji: '🍎', name: 'quả táo đỏ', containerTitle: 'Rổ táo đỏ', plateLabel: 'ĐĨA' },
      { emoji: '🥬', name: 'búp xà lách', containerTitle: 'Đĩa rau tươi', plateLabel: 'ĐĨA' },
      { emoji: '🍓', name: 'quả dâu tây', containerTitle: 'Đĩa dâu tây', plateLabel: 'ĐĨA' },
      { emoji: '🌽', name: 'bắp ngô ngọt', containerTitle: 'Rổ ngô ngọt', plateLabel: 'ĐĨA' },
    ],
    drinkName: 'nước lọc',
    drinkShortName: 'Nước lọc',
    drinkDisplayName: 'Nước lọc',
    drinkEmoji: '💧',
    drinkStatusLabel: 'Nước lọc (Độ khát)',
    drinkQuestTitle: 'GIẢI TOÁN KIẾM NƯỚC LỌC',
    drinkButtonLabel: 'Kiếm Nước Lọc',
    drinkPool: [
      { emoji: '💧', name: 'ly nước lọc', containerTitle: 'Khay nước lọc', plateLabel: 'KHAY' },
      { emoji: '🥤', name: 'ly nước mát', containerTitle: 'Khay nước mát', plateLabel: 'KHAY' },
      { emoji: '🚰', name: 'bình nước lọc', containerTitle: 'Bình nước lọc', plateLabel: 'KHAY' },
      { emoji: '🥥', name: 'trái dừa ngọt', containerTitle: 'Khay dừa ngọt', plateLabel: 'KHAY' },
    ],
  },
  dog: {
    type: 'dog',
    foodName: 'xương và thịt',
    foodShortName: 'Xương & Thịt',
    foodDisplayName: 'Xương / Thịt',
    foodEmoji: '🦴',
    foodAltEmoji: '🥩',
    foodStatusLabel: 'Độ no (Xương / Thịt)',
    foodQuestTitle: 'GIẢI TOÁN KIẾM XƯƠNG & THỊT',
    foodButtonLabel: 'Kiếm Xương & Thịt',
    foodPool: [
      { emoji: '🦴', name: 'khúc xương giòn', containerTitle: 'Đĩa xương giòn', plateLabel: 'ĐĨA' },
      { emoji: '🥩', name: 'miếng thịt tươi', containerTitle: 'Đĩa thịt tươi', plateLabel: 'ĐĨA' },
      { emoji: '🍗', name: 'đùi gà thơm', containerTitle: 'Đĩa đùi gà', plateLabel: 'ĐĨA' },
      { emoji: '🌭', name: 'cây xúc xích', containerTitle: 'Đĩa xúc xích', plateLabel: 'ĐĨA' },
    ],
    drinkName: 'sữa tươi',
    drinkShortName: 'Sữa tươi',
    drinkDisplayName: 'Sữa tươi',
    drinkEmoji: '🥛',
    drinkStatusLabel: 'Sữa tươi (Độ khát)',
    drinkQuestTitle: 'GIẢI TOÁN KIẾM SỮA TƯƠI',
    drinkButtonLabel: 'Kiếm Sữa Tươi',
    drinkPool: [
      { emoji: '🥛', name: 'ly sữa tươi', containerTitle: 'Khay sữa tươi', plateLabel: 'KHAY' },
      { emoji: '🧃', name: 'hộp sữa tươi', containerTitle: 'Khay sữa tươi', plateLabel: 'KHAY' },
      { emoji: '🍼', name: 'bình sữa thơm', containerTitle: 'Khay sữa thơm', plateLabel: 'KHAY' },
    ],
  },
  cat: {
    type: 'cat',
    foodName: 'cá tươi',
    foodShortName: 'Cá tươi',
    foodDisplayName: 'Cá tươi',
    foodEmoji: '🐟',
    foodAltEmoji: '🍣',
    foodStatusLabel: 'Độ no (Cá tươi)',
    foodQuestTitle: 'GIẢI TOÁN KIẾM CÁ TƯƠI',
    foodButtonLabel: 'Kiếm Cá Tươi',
    foodPool: [
      { emoji: '🐟', name: 'chú cá tươi', containerTitle: 'Đĩa cá tươi', plateLabel: 'ĐĨA' },
      { emoji: '🍣', name: 'miếng cá hồi', containerTitle: 'Đĩa cá hồi', plateLabel: 'ĐĨA' },
      { emoji: '🍤', name: 'chú tôm nõn', containerTitle: 'Đĩa tôm tươi', plateLabel: 'ĐĨA' },
    ],
    drinkName: 'sữa tươi',
    drinkShortName: 'Sữa tươi',
    drinkDisplayName: 'Sữa tươi',
    drinkEmoji: '🥛',
    drinkStatusLabel: 'Sữa tươi (Độ khát)',
    drinkQuestTitle: 'GIẢI TOÁN KIẾM SỮA TƯƠI',
    drinkButtonLabel: 'Kiếm Sữa Tươi',
    drinkPool: [
      { emoji: '🥛', name: 'ly sữa tươi', containerTitle: 'Khay sữa tươi', plateLabel: 'KHAY' },
      { emoji: '🧃', name: 'hộp sữa tươi', containerTitle: 'Khay sữa tươi', plateLabel: 'KHAY' },
      { emoji: '🍼', name: 'bát sữa ấm', containerTitle: 'Khay sữa ấm', plateLabel: 'KHAY' },
    ],
  },
};

export function getPetItemConfig(type?: PetType): PetItemConfig {
  if (type && PET_ITEM_CONFIGS[type]) {
    return PET_ITEM_CONFIGS[type];
  }
  return PET_ITEM_CONFIGS.bunny;
}
