/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, ArrowRight, Dices, Check, Play, UserCheck, Star } from 'lucide-react';
import { PetAvatar } from './PetAvatar';
import { PET_PRESETS } from '../data/petPresets';
import { PetType, PetState } from '../types/game';
import {
  playPopSound,
  playChimeSound,
  playCelebrationSound,
  playPetVoice,
} from '../utils/audio';

interface Module1WelcomeProps {
  existingPet: PetState | null;
  onConfirmPet: (pet: PetState) => void;
  onContinueExisting: () => void;
}

export const Module1Welcome: React.FC<Module1WelcomeProps> = ({
  existingPet,
  onConfirmPet,
  onContinueExisting,
}) => {
  // Screen sub-state: 'title' or 'select'
  const [stage, setStage] = useState<'title' | 'select'>(existingPet ? 'title' : 'select');
  const [selectedType, setSelectedType] = useState<PetType>('dog');
  const [petName, setPetName] = useState<string>('Lu Lu');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const selectedPreset = PET_PRESETS.find((p) => p.id === selectedType) || PET_PRESETS[0];

  // When pet type changes, update the default name if user hasn't typed a custom one
  const handleSelectPet = (type: PetType) => {
    setSelectedType(type);
    const preset = PET_PRESETS.find((p) => p.id === type);
    if (preset) {
      setPetName(preset.defaultName);
    }
    playPopSound();
    playPetVoice(type);
  };

  const handleRandomName = () => {
    playPopSound();
    const names = selectedPreset.sampleNames;
    const filtered = names.filter((n) => n !== petName);
    const random = filtered[Math.floor(Math.random() * filtered.length)] || names[0];
    setPetName(random);
  };

  const handleStartAdventure = () => {
    playCelebrationSound();

    // Trigger colorful confetti shower
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#EC4899', '#6366F1', '#3B82F6'],
    });

    const newPet: PetState = {
      type: selectedType,
      name: petName.trim() || selectedPreset.defaultName,
      stage: 'baby',
      level: 1,
      exp: 0,
      maxExp: 100,
      hunger: 30, // Starts at level needing care as requested
      thirst: 30, // Starts at level needing care as requested
      happiness: 80,
      coins: 20, // Starter coins
      stars: 1,
      createdAt: Date.now(),
      equippedHat: undefined,
      equippedOutfit: undefined,
      inventory: {
        apple: 0,
        milk: 0,
        carrot: 0,
      },
      unlockedCostumes: ['party_hat'],
    };

    setTimeout(() => {
      onConfirmPet(newPet);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200 text-slate-800">
      {/* Cartoon Background Elements: Animated Clouds, Sun, Rainbow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sun with rotating rays */}
        <div className="absolute top-4 left-6 md:top-8 md:left-12 flex items-center justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-amber-300 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.6)] animate-pulse" />
          <div className="absolute w-28 h-28 md:w-36 md:h-36 border-4 border-dashed border-amber-300/40 rounded-full animate-[spin_20s_linear_infinite]" />
        </div>

        {/* Rainbow Arc */}
        <div className="absolute -top-16 right-[-10%] md:right-4 w-72 md:w-96 h-72 md:h-96 rounded-full border-[18px] border-t-rose-400 border-r-amber-300 border-b-transparent border-l-sky-300 opacity-40 blur-[1px] rotate-45" />

        {/* Floating Clouds */}
        <div className="absolute top-12 left-[15%] w-36 h-12 bg-white/90 rounded-full blur-[1px] animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute top-20 right-[15%] w-48 h-16 bg-white/95 rounded-full blur-[1px] animate-[float_7s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-36 left-[65%] w-28 h-10 bg-white/80 rounded-full blur-[1px] animate-[float_8s_ease-in-out_infinite]" />

        {/* Rolling Hills at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 md:h-52 bg-emerald-400 rounded-[50%_50%_0_0/20%_20%_0_0] scale-x-125 translate-y-12" />
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-44 bg-emerald-500 rounded-[50%_50%_0_0/25%_25%_0_0] scale-x-110 translate-y-8" />
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-emerald-600 rounded-[50%_50%_0_0/30%_30%_0_0]" />

        {/* Little decorative cartoon flowers & mushrooms in the grass */}
        <div className="absolute bottom-6 left-8 text-2xl select-none">🌸</div>
        <div className="absolute bottom-4 left-24 text-2xl select-none">🌼</div>
        <div className="absolute bottom-8 left-[35%] text-2xl select-none">🍄</div>
        <div className="absolute bottom-5 right-[30%] text-2xl select-none">🌷</div>
        <div className="absolute bottom-8 right-20 text-2xl select-none">🌻</div>
        <div className="absolute bottom-4 right-8 text-2xl select-none">🌼</div>
      </div>

      {/* Top Banner Navigation */}
      <div className="relative z-10 w-full max-w-5xl px-4 pt-4 md:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏡</span>
          <span className="font-black text-emerald-950 text-sm md:text-base">Nông Trại Học Toán</span>
        </div>

        {/* Small Module 1 Badge */}
        <div className="px-3.5 py-1.5 bg-amber-100/90 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs md:text-sm shadow-sm flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>Module 1: Chọn Thú Cưng</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-4xl px-4 py-4 flex-1 flex flex-col items-center justify-center">
        {stage === 'title' ? (
          /* ========================================================= */
          /* STAGE 1: TITLE & WELCOME SCREEN                           */
          /* ========================================================= */
          <div className="w-full flex flex-col items-center text-center max-w-2xl animate-fade-in">
            {/* Wooden Farm Sign Title Header */}
            <div className="relative mb-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Wooden Signboard Shape */}
              <div className="relative px-8 py-5 md:px-12 md:py-6 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-3xl border-4 border-amber-950 shadow-[0_12px_0_#451a03,0_20px_25px_rgba(0,0,0,0.3)]">
                {/* Nails / Screws in corners */}
                <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-amber-300 border border-amber-950" />
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-amber-300 border border-amber-950" />
                <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-amber-300 border border-amber-950" />
                <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-amber-300 border border-amber-950" />

                {/* Subtitle Badge */}
                <div className="inline-block px-3 py-0.5 mb-1 bg-amber-400 text-amber-950 font-extrabold text-xs md:text-sm rounded-full tracking-wide shadow-sm">
                  🐾 GAME TOÁN MẦM NON 5 TUỔI
                </div>

                {/* Main 3D Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-100 tracking-wide drop-shadow-[0_4px_3px_rgba(0,0,0,0.7)]">
                  NUÔI THÚ HỌC TOÁN
                </h1>
                <p className="text-amber-200 text-xs sm:text-sm md:text-base font-semibold mt-1">
                  Pet Math Farm · Cùng Thú Cưng Học Vui Vào Lớp 1
                </p>
              </div>

              {/* Little cute paw icons hanging */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                <span className="text-2xl filter drop-shadow">🐶</span>
                <span className="text-2xl filter drop-shadow">🐱</span>
                <span className="text-2xl filter drop-shadow">🐰</span>
              </div>
            </div>

            {/* Mascot Showcase Interactive Trio */}
            <div className="flex items-end justify-center gap-2 sm:gap-6 my-4">
              {/* Dog Preview */}
              <div
                onClick={() => {
                  playPopSound();
                  playPetVoice('dog');
                }}
                className="group flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-2 active:scale-90"
              >
                <div className="relative">
                  <PetAvatar type="dog" size="md" />
                  <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    Gâu gâu!
                  </div>
                </div>
                <span className="mt-1 font-bold text-sm text-amber-900 group-hover:text-amber-700">Cún Vàng</span>
              </div>

              {/* Bunny Center Star */}
              <div
                onClick={() => {
                  playPopSound();
                  playPetVoice('bunny');
                }}
                className="group flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-3 active:scale-90 -translate-y-2"
              >
                <div className="relative">
                  <PetAvatar type="bunny" size="lg" />
                  <div className="absolute -top-1 -right-2 bg-pink-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow animate-pulse">
                    Nhí nhảnh ⭐
                  </div>
                </div>
                <span className="mt-1 font-extrabold text-base text-purple-900 group-hover:text-purple-700">Thỏ Bông</span>
              </div>

              {/* Cat Preview */}
              <div
                onClick={() => {
                  playPopSound();
                  playPetVoice('cat');
                }}
                className="group flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-2 active:scale-90"
              >
                <div className="relative">
                  <PetAvatar type="cat" size="md" />
                  <div className="absolute -top-1 -right-1 bg-rose-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    Meo meo!
                  </div>
                </div>
                <span className="mt-1 font-bold text-sm text-rose-900 group-hover:text-rose-700">Mèo Miu</span>
              </div>
            </div>

            {/* Features Highlights for Kids */}
            <div className="bg-white/85 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-emerald-300 shadow-sm max-w-lg mx-auto my-3">
              <div className="flex items-center justify-around gap-4 text-xs md:text-sm font-bold text-emerald-900">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🥕</span>
                  <span>Đếm Số & So Sánh</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🦴</span>
                  <span>Cộng Trừ 5 & 10</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🎀</span>
                  <span>Nuôi Thú Lớn Khôn</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full max-w-md">
              {/* Start Adventure Button */}
              <button
                onClick={() => {
                  playChimeSound();
                  setStage('select');
                }}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xl md:text-2xl rounded-3xl shadow-[0_8px_0_#15803d,0_15px_20px_rgba(21,128,61,0.4)] hover:shadow-[0_6px_0_#15803d] active:translate-y-2 active:shadow-[0_0px_0_#15803d] transition-all cursor-pointer group"
              >
                <Play className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
                <span>BẮT ĐẦU CHƠI</span>
              </button>

              {/* If existing pet save exists, show quick continue */}
              {existingPet && (
                <button
                  onClick={() => {
                    playChimeSound();
                    onContinueExisting();
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 font-black text-base md:text-lg rounded-3xl shadow-[0_6px_0_#c2410c] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Vào Nông Trại ({existingPet.name})</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* STAGE 2: PET SELECTION & NAMING SCREEN                    */
          /* ========================================================= */
          <div className="w-full flex flex-col items-center animate-fade-in">
            {/* Header / Prompt */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 rounded-full border border-sky-300 shadow-sm text-sky-800 font-bold text-sm md:text-base mb-1">
                <span>✨ BƯỚC 1: BÉ HÃY CHỌN 1 BẠN THÚ CƯNG ✨</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 drop-shadow-sm">
                Ai sẽ là bạn đồng hành cùng bé?
              </h2>
            </div>

            {/* 3 Pet Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 w-full max-w-3xl mb-6">
              {PET_PRESETS.map((preset) => {
                const isSelected = selectedType === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPet(preset.id)}
                    className={`relative flex flex-col items-center p-4 md:p-5 rounded-3xl cursor-pointer transition-all duration-300 transform ${
                      isSelected
                        ? 'bg-white ring-4 ring-amber-400 shadow-[0_10px_25px_rgba(245,158,11,0.35)] -translate-y-2 scale-105'
                        : 'bg-white/80 hover:bg-white hover:-translate-y-1 shadow-md border-2 border-white/60 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute -top-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-bounce">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>ĐÃ CHỌN</span>
                      </div>
                    )}

                    {/* Pet Avatar Display */}
                    <div className="w-32 h-32 md:w-36 md:h-36 flex items-center justify-center my-1">
                      <PetAvatar type={preset.id} size="md" />
                    </div>

                    {/* Pet Name & Species */}
                    <div className="text-center mt-2 w-full">
                      <h3 className="text-lg md:text-xl font-black text-slate-800">
                        {preset.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {preset.speciesName}
                      </p>

                      {/* Trait Pill */}
                      <div className="mt-2 text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                        {preset.tagline}
                      </div>

                      {/* Favorite Food Icon */}
                      <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1">
                        <span>Khoái khẩu:</span>
                        <span className="font-semibold text-slate-700">{preset.favoriteFood}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Naming Section */}
            <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-3 border-amber-200 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 text-amber-900 font-extrabold text-sm md:text-base">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>BƯỚC 2: ĐẶT TÊN CHO BẠN {selectedPreset.name.toUpperCase()}</span>
              </div>

              {/* Name Input Box */}
              <div className="flex items-center gap-2 w-full max-w-md my-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={petName}
                    maxLength={15}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Nhập tên đáng yêu..."
                    className="w-full px-5 py-3 text-xl md:text-2xl font-black text-center text-amber-950 bg-amber-50/70 border-3 border-amber-300 focus:border-amber-500 focus:bg-white rounded-2xl outline-none shadow-inner transition-all placeholder:text-slate-400 placeholder:text-base placeholder:font-normal"
                  />
                </div>

                {/* Randomize Cute Name Button */}
                <button
                  onClick={handleRandomName}
                  title="Đổi tên ngẫu nhiên"
                  className="px-4 py-3 bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-bold rounded-2xl shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Dices className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Đổi Tên</span>
                </button>
              </div>

              {/* Quick-Pick Cute Name Suggestions for 5-Year-Olds */}
              <div className="w-full mt-2">
                <div className="text-xs text-slate-500 font-bold mb-1.5 text-center">
                  Gợi ý tên hay cho bé (Bấm để chọn ngay):
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                  {selectedPreset.sampleNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        playPopSound();
                        setPetName(name);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                        petName === name
                          ? 'bg-amber-500 text-white shadow-sm scale-105'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm & Enter Farm CTA Button */}
              <div className="flex items-center gap-3 mt-6 w-full max-w-md">
                {/* Back to Title Button */}
                <button
                  onClick={() => {
                    playPopSound();
                    setStage('title');
                  }}
                  className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all cursor-pointer text-sm"
                >
                  Quay Lại
                </button>

                {/* Primary Confirm Button */}
                <button
                  onClick={handleStartAdventure}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg md:text-xl rounded-2xl shadow-[0_8px_0_#15803d,0_15px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_0_#15803d] active:translate-y-2 active:shadow-none transition-all cursor-pointer group"
                >
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>XÁC NHẬN & VÀO NÔNG TRẠI</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Peaceful Bottom Grass / Footer Notice */}
      <div className="relative z-10 w-full text-center py-3 text-emerald-950 font-bold text-xs bg-emerald-700/10 backdrop-blur-xs">
        Nuôi Thú Học Toán · Thiết kế thân thiện cho trẻ 5 tuổi chuẩn bị vào lớp 1 🍀 Không áp lực, vui học mỗi ngày!
      </div>
    </div>
  );
};
