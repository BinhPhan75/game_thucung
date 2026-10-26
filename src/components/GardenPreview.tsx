/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  RotateCcw, 
  Coins, 
  Utensils, 
  Calculator, 
  Shirt, 
  Volume2, 
  Smile, 
  Droplet,
  Award
} from 'lucide-react';
import { PetAvatar } from './PetAvatar';
import { PetState, PetStage } from '../types/game';
import { 
  playPopSound, 
  playChimeSound, 
  playPetVoice, 
  playCelebrationSound, 
  speakVietnamese 
} from '../utils/audio';

interface GardenPreviewProps {
  pet: PetState;
  onUpdatePet: (pet: PetState) => void;
  onChangePet: () => void;
}

export const GardenPreview: React.FC<GardenPreviewProps> = ({
  pet,
  onUpdatePet,
  onChangePet,
}) => {
  const [petMood, setPetMood] = useState<'happy' | 'excited' | 'idle'>('happy');
  const [floatingHeart, setFloatingHeart] = useState(false);
  const [activeTab, setActiveTab] = useState<'garden' | 'roadmap'>('garden');

  const handlePetClick = () => {
    playPetVoice(pet.type);
    setPetMood('excited');
    setFloatingHeart(true);
    setTimeout(() => setFloatingHeart(false), 1200);
    setTimeout(() => setPetMood('happy'), 800);

    const compliments = [
      `${pet.name} yêu bé nhiều lắm!`,
      `Gâu gâu, ${pet.name} rất vui được học toán cùng bé!`,
      `Meo meo, bé giỏi quá!`,
      `${pet.name} đang tràn đầy năng lượng!`,
    ];
    const phrase = compliments[Math.floor(Math.random() * compliments.length)];
    speakVietnamese(phrase);
  };

  const handleQuickFeed = () => {
    playPopSound();
    playChimeSound();
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#10B981', '#EC4899'],
    });

    const updated: PetState = {
      ...pet,
      hunger: Math.min(100, pet.hunger + 10),
      happiness: Math.min(100, pet.happiness + 5),
      exp: pet.exp + 15,
    };
    onUpdatePet(updated);
    speakVietnamese(`Ngon quá! ${pet.name} đã no bụng hơn rồi!`);
  };

  const handleQuickWater = () => {
    playPopSound();
    playChimeSound();
    const updated: PetState = {
      ...pet,
      thirst: Math.min(100, pet.thirst + 10),
      happiness: Math.min(100, pet.happiness + 5),
      exp: pet.exp + 10,
    };
    onUpdatePet(updated);
    speakVietnamese(`Nước mát quá! ${pet.name} đã đỡ khát rồi!`);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-sky-300 via-emerald-100 to-emerald-200 text-slate-800">
      {/* Decorative Sky & Sun */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-4 left-6 w-24 h-24 bg-amber-300 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.6)] animate-pulse" />
        <div className="absolute top-12 left-1/4 w-36 h-12 bg-white/90 rounded-full blur-[1px] animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute top-16 right-1/4 w-44 h-14 bg-white/90 rounded-full blur-[1px] animate-[float_8s_ease-in-out_infinite_reverse]" />

        {/* Rolling Green Hills & Garden Fences */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-emerald-400 rounded-[50%_50%_0_0/20%_20%_0_0] scale-x-125 translate-y-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-emerald-500 rounded-[50%_50%_0_0/25%_25%_0_0] scale-x-110 translate-y-6" />

        {/* Little wooden fences */}
        <div className="absolute bottom-24 left-6 flex gap-2 opacity-80">
          <div className="w-2.5 h-10 bg-amber-700 rounded-t" />
          <div className="w-2.5 h-10 bg-amber-700 rounded-t" />
          <div className="w-2.5 h-10 bg-amber-700 rounded-t" />
          <div className="w-2.5 h-10 bg-amber-700 rounded-t" />
        </div>
        <div className="absolute bottom-24 right-6 flex gap-2 opacity-80">
          <div className="w-2.5 h-10 bg-amber-700 rounded-t" />
          <div className="w-2.5 h-10 bg-amber-700 rounded-t" />
          <div className="w-2.5 h-10 bg-amber-700 rounded-t" />
        </div>
      </div>

      {/* Top HUD (Status & Coins) */}
      <div className="relative z-10 w-full max-w-4xl px-4 pt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Pet Name & Level Card */}
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center font-black text-amber-800 text-lg shadow-inner">
            {pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐰'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base md:text-lg text-slate-800">{pet.name}</span>
              <span className="text-xs bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded-full">
                Cấp {pet.level}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Giai đoạn: {pet.stage === 'baby' ? 'Bé Nhỏ' : pet.stage === 'junior' ? 'Bé Lớn' : 'Siêu Sao'}
            </div>
          </div>
        </div>

        {/* Currency & Stars */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-amber-300 shadow-sm font-black text-amber-700 text-sm md:text-base">
            <Coins className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>{pet.coins}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-yellow-300 shadow-sm font-black text-yellow-700 text-sm md:text-base">
            <Award className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            <span>{pet.stars} Sao</span>
          </div>

          {/* Switch Pet / Change Button */}
          <button
            onClick={() => {
              playPopSound();
              onChangePet();
            }}
            title="Chọn lại thú cưng hoặc tạo mới"
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-2xl border border-purple-300 text-xs md:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đổi Thú Cưng</span>
          </button>
        </div>
      </div>

      {/* Main Garden Center */}
      <div className="relative z-10 w-full max-w-4xl px-4 py-4 flex-1 flex flex-col items-center justify-center">
        {/* Pet Welcome Speech Bubble */}
        <div className="relative mb-3 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-3xl border-3 border-amber-300 shadow-md text-center max-w-md animate-bounce-soft">
          <div className="text-sm md:text-base font-extrabold text-amber-950 flex items-center justify-center gap-2">
            <span>Xin chào bạn nhỏ! Mình là {pet.name}!</span>
            <button
              onClick={() => speakVietnamese(`Xin chào bạn nhỏ! Mình là ${pet.name}, cùng học toán với mình nhé!`)}
              title="Nghe giọng nói"
              className="text-sky-600 hover:text-sky-800 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          {/* Bubble tail */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-3 border-amber-300 rotate-45" />
        </div>

        {/* Giant Interactive Pet in the Garden */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Floating Heart Effect */}
          {floatingHeart && (
            <div className="absolute -top-12 z-20 flex items-center gap-1 text-rose-500 animate-[float_1s_ease-out_forwards]">
              <Heart className="w-8 h-8 fill-rose-500" />
              <span className="font-black text-rose-600 text-sm">Yêu bé!</span>
            </div>
          )}

          <div
            onClick={handlePetClick}
            title="Chạm vào mình đi!"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <PetAvatar
              type={pet.type}
              stage={pet.stage}
              size="xl"
              mood={petMood}
              equippedHat={pet.equippedHat}
            />
          </div>
        </div>

        {/* Pet Stats Quick Cluster (Module 2 preview in action) */}
        <div className="w-full max-w-md grid grid-cols-3 gap-2.5 my-3">
          {/* Hunger Meter */}
          <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 mb-1">
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>Đói: {pet.hunger}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${pet.hunger}%` }}
              />
            </div>
          </div>

          {/* Thirst Meter */}
          <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border-2 border-sky-200 shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-sky-800 mb-1">
              <Droplet className="w-3.5 h-3.5 text-sky-600" />
              <span>Khát: {pet.thirst}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${pet.thirst}%` }}
              />
            </div>
          </div>

          {/* Happiness Meter */}
          <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border-2 border-rose-200 shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-rose-800 mb-1">
              <Smile className="w-3.5 h-3.5 text-rose-600" />
              <span>Vui: {pet.happiness}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${pet.happiness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Interaction Buttons (Feed & Water) */}
        <div className="flex items-center gap-3 my-2">
          <button
            onClick={handleQuickFeed}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-black text-sm md:text-base rounded-2xl shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span>🍎 Cho Ăn</span>
          </button>
          <button
            onClick={handleQuickWater}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-black text-sm md:text-base rounded-2xl shadow-[0_4px_0_#0369a1] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span>🥛 Cho Uống</span>
          </button>
          <button
            onClick={handlePetClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-400 text-white font-black text-sm md:text-base rounded-2xl shadow-[0_4px_0_#be185d] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span>💖 Xoa Đầu</span>
          </button>
        </div>

        {/* Roadmap Preview of Next Modules */}
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-5 border-3 border-emerald-300 shadow-md mt-4">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-slate-800 text-base md:text-lg">
                Các Module Tiếp Theo Của Game
              </h3>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full">
              Module 1 Đã Hoàn Thành ✅
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* Module 2 */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🏡</span>
              <span className="text-xs font-black text-amber-900">Module 2</span>
              <span className="text-[11px] font-semibold text-slate-600">Sân Vườn & Chỉ Số</span>
              <span className="text-[10px] text-amber-600 font-bold mt-1">Sẵn sàng xây dựng</span>
            </div>

            {/* Module 3 */}
            <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🔢</span>
              <span className="text-xs font-black text-blue-900">Module 3</span>
              <span className="text-[11px] font-semibold text-slate-600">Bài Toán 1 Đến 10</span>
              <span className="text-[10px] text-blue-600 font-bold mt-1">Sẵn sàng xây dựng</span>
            </div>

            {/* Module 4 */}
            <div className="p-3 rounded-2xl bg-pink-50/80 border border-pink-200 flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🍔</span>
              <span className="text-xs font-black text-pink-900">Module 4</span>
              <span className="text-[11px] font-semibold text-slate-600">Kéo Thả & Tiến Hóa</span>
              <span className="text-[10px] text-pink-600 font-bold mt-1">Sẵn sàng xây dựng</span>
            </div>

            {/* Module 5 */}
            <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200 flex flex-col items-center text-center">
              <span className="text-2xl mb-1">👒</span>
              <span className="text-xs font-black text-purple-900">Module 5</span>
              <span className="text-[11px] font-semibold text-slate-600">Tủ Đồ & Thời Trang</span>
              <span className="text-[10px] text-purple-600 font-bold mt-1">Sẵn sàng xây dựng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 w-full text-center py-2.5 text-emerald-950 font-bold text-xs bg-emerald-700/10">
        Nuôi Thú Học Toán · Module 1: Màn hình Chào mừng & Chọn Thú cưng đã sẵn sàng hoạt động!
      </div>
    </div>
  );
};
