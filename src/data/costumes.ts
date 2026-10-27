/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CostumeItem } from '../types/game';

export const COSTUME_LIST: CostumeItem[] = [
  { id: 'wizard_hat', name: 'Mũ Phù Thủy Tí Hon', category: 'hat', icon: '🧙', price: 45, description: 'Chiếc mũ tím đầy sao', visual: 'wizard', color: '#8b5cf6' },
  { id: 'ocean_hat', name: 'Mũ Biển Xanh', category: 'hat', icon: '🧢', price: 25, description: 'Mũ xanh đi chơi biển', visual: 'cap', color: '#0ea5e9' },
  { id: 'explorer_hat', name: 'Mũ Thám Hiểm', category: 'hat', icon: '👒', price: 35, description: 'Cùng khám phá khu vườn', visual: 'cap', color: '#d97706' },
  { id: 'strawberry_hat', name: 'Mũ Dâu Ngọt', category: 'hat', icon: '🍓', price: 30, description: 'Sắc đỏ dâu tây đáng yêu', visual: 'cap', color: '#f43f5e' },
  { id: 'space_helmet', name: 'Mũ Phi Hành Gia', category: 'hat', icon: '🚀', price: 75, description: 'Khám phá những vì sao', visual: 'helmet', color: '#38bdf8' },
  { id: 'winter_scarf', name: 'Khăn Mùa Đông', category: 'accessory', icon: '🧣', price: 25, description: 'Khăn đỏ ấm áp', visual: 'scarf', color: '#ef4444' },
  { id: 'mint_scarf', name: 'Khăn Bạc Hà', category: 'accessory', icon: '🧣', price: 25, description: 'Khăn xanh mềm mại', visual: 'scarf', color: '#10b981' },
  { id: 'star_medal', name: 'Huy Chương Chăm Ngoan', category: 'accessory', icon: '🏅', price: 40, description: 'Phần thưởng cho sự cố gắng', visual: 'medal', color: '#fbbf24' },
  { id: 'purple_glasses', name: 'Kính Tím Mộng Mơ', category: 'accessory', icon: '👓', price: 30, description: 'Đôi kính tròn xinh', visual: 'glasses', color: '#a855f7' },
  { id: 'sunny_bow', name: 'Nơ Nắng Vàng', category: 'accessory', icon: '🎀', price: 20, description: 'Nơ vàng như nắng', visual: 'bow', color: '#facc15' },
  { id: 'ocean_cape', name: 'Áo Choàng Đại Dương', category: 'cape', icon: '🌊', price: 55, description: 'Sắc xanh của biển', visual: 'cape', color: '#0284c7' },
  { id: 'fairy_cape', name: 'Áo Choàng Cổ Tích', category: 'cape', icon: '🧚', price: 60, description: 'Áo hồng lấp lánh', visual: 'cape', color: '#ec4899' },
  { id: 'forest_cape', name: 'Áo Choàng Rừng Xanh', category: 'cape', icon: '🌿', price: 50, description: 'Người bạn của khu rừng', visual: 'cape', color: '#16a34a' },
  { id: 'moon_hat', name: 'Mũ Trăng Sao', category: 'hat', icon: '🌙', price: 50, description: 'Mũ xanh đêm đầy sao', visual: 'wizard', color: '#4338ca' },
  {
    id: 'party_hat',
    name: 'Nón Sinh Nhật',
    category: 'hat',
    icon: '🎩',
    price: 0, // Mặc định mở khóa
    description: 'Nón sinh nhật sắc màu rực rỡ',
  },
  {
    id: 'flower_crown',
    name: 'Vòng Hoa Mùa Xuân',
    category: 'hat',
    icon: '🌸',
    price: 30,
    description: 'Vòng hoa thơm ngát cho ngày tươi đẹp',
  },
  {
    id: 'chef_hat',
    name: 'Mũ Đầu Bếp Nhí',
    category: 'hat',
    icon: '👨‍🍳',
    price: 40,
    description: 'Mũ đầu bếp làm bánh và nấu ăn tài ba',
  },
  {
    id: 'cool_glasses',
    name: 'Kính Mát Siêu Ngầu',
    category: 'accessory',
    icon: '🕶️',
    price: 50,
    description: 'Kính râm sành điệu đi dạo mát',
  },
  {
    id: 'pink_bow',
    name: 'Nơ Hồng Điệu Đà',
    category: 'accessory',
    icon: '🎀',
    price: 35,
    description: 'Nơ hồng công chúa đáng yêu',
  },
  {
    id: 'royal_crown',
    name: 'Vương Miện Hoàng Gia',
    category: 'hat',
    icon: '👑',
    price: 80,
    description: 'Vương miện vàng lấp lánh như vua và hoàng hậu',
  },
  {
    id: 'superhero_cape',
    name: 'Áo Choàng Siêu Nhân',
    category: 'cape',
    icon: '🦸',
    price: 70,
    description: 'Áo choàng đỏ siêu anh hùng dũng cảm',
  },
];
