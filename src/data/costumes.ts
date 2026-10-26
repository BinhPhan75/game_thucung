/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CostumeItem } from '../types/game';

export const COSTUME_LIST: CostumeItem[] = [
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
