/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PetPreset } from '../types/game';

export const PET_PRESETS: PetPreset[] = [
  {
    id: 'dog',
    name: 'Cún Vàng',
    speciesName: 'Chó Con Vui Vẻ',
    defaultName: 'Lu Lu',
    tagline: 'Thông minh & Trung thành',
    personality: 'Thích chạy nhảy, gặm xương và rất giỏi đếm số!',
    favoriteFood: 'Xương giòn & Xúc xích',
    colorTheme: {
      primary: 'amber',
      secondary: 'orange',
      accent: '#F59E0B',
      bgGradient: 'from-amber-100 via-orange-50 to-yellow-100',
      border: 'border-amber-400',
    },
    sampleNames: ['Lu Lu', 'Cún Con', 'Vàng Ơi', 'Mực Mực', 'Bông', 'Gấu Nhỏ', 'Bánh Mì'],
  },
  {
    id: 'cat',
    name: 'Mèo Miu',
    speciesName: 'Mèo Con Điệu Đà',
    defaultName: 'Miu Miu',
    tagline: 'Dịu dàng & Ngọt ngào',
    personality: 'Thích nằm sưởi nắng, ăn cá và đố vui so sánh lớn nhỏ!',
    favoriteFood: 'Cá hồi tươi & Sữa thơm',
    colorTheme: {
      primary: 'rose',
      secondary: 'pink',
      accent: '#F43F5E',
      bgGradient: 'from-rose-100 via-pink-50 to-amber-50',
      border: 'border-rose-400',
    },
    sampleNames: ['Miu Miu', 'Mimi', 'Bé Miu', 'Kẹo Ngọt', 'Mochi', 'Hạt Dẻ', 'Cam Cam'],
  },
  {
    id: 'bunny',
    name: 'Thỏ Bông',
    speciesName: 'Thỏ Bông Nhí Nhảnh',
    defaultName: 'Bông Bông',
    tagline: 'Nhanh nhẹn & Đáng yêu',
    personality: 'Đôi tai dài lắng nghe giỏi, thích nhảy tung tăng và tính nhẩm siêu nhanh!',
    favoriteFood: 'Cà rốt giòn & Rau củ quả',
    colorTheme: {
      primary: 'indigo',
      secondary: 'purple',
      accent: '#6366F1',
      bgGradient: 'from-purple-100 via-indigo-50 to-pink-50',
      border: 'border-purple-400',
    },
    sampleNames: ['Bông Bông', 'Cà Rốt', 'Thỏ Trắng', 'Tuyết Nhi', 'Đậu Đậu', 'Bắp Bắp', 'Mây Trắng'],
  },
];
