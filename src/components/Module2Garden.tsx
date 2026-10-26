/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  RotateCcw, 
  Coins, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  Shirt,
  Award,
  Crown,
  Volume2
} from 'lucide-react';
import { PetAvatar } from './PetAvatar';
import { Module3MathQuest } from './Module3MathQuest';
import { Module5Wardrobe } from './Module5Wardrobe';
import { PetState, QuestTarget, PetStage } from '../types/game';
import { COSTUME_LIST } from '../data/costumes';
import { 
  playPopSound, 
  playChimeSound, 
  playCelebrationSound, 
  playPetVoice, 
  playEatingSound, 
  playDrinkingSound, 
  speakGameEvent,
  speakVietnamese
} from '../utils/audio';

interface Module2GardenProps {
  pet: PetState;
  onUpdatePet: (pet: PetState) => void;
  onBackToModule1: () => void;
}

export const Module2Garden: React.FC<Module2GardenProps> = ({
  pet,
  onUpdatePet,
  onBackToModule1,
}) => {
  const [petMood, setPetMood] = useState<'happy' | 'excited' | 'idle' | 'hungry'>('happy');
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isMathQuestOpen, setIsMathQuestOpen] = useState(false);
  const [questTarget, setQuestTarget] = useState<QuestTarget>('food');
  const [targetCostumeId, setTargetCostumeId] = useState<string | undefined>(undefined);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [evolutionUnlockedCostume, setEvolutionUnlockedCostume] = useState<string | null>(null);
  
  // Popup thông báo yêu thương từ thú cưng khi 1 chỉ số đã đạt 100%
  const [statFullModal, setStatFullModal] = useState<{
    type: 'food' | 'water';
    currentOtherValue: number;
  } | null>(null);

  const isHungry = pet.hunger < 50;
  const isThirsty = pet.thirst < 50;

  // Gentle natural decay of hunger & thirst over time to keep gameplay loop active
  // Tuyệt đối không giảm nếu 1 trong 2 chỉ số đã đạt 100% để giữ nguyên thành quả của bé
  useEffect(() => {
    const timer = setInterval(() => {
      if (pet.hunger < 100 && pet.thirst < 100) {
        onUpdatePet({
          ...pet,
          hunger: Math.max(20, pet.hunger - 2),
          thirst: Math.max(20, pet.thirst - 2),
        });
      }
    }, 45000); // Every 45s decrease by 2%
    return () => clearInterval(timer);
  }, [pet, onUpdatePet]);

  useEffect(() => {
    if (pet.hunger >= 100 && pet.thirst < 100) {
      speakGameEvent('foodFull', pet);
    } else if (pet.thirst >= 100 && pet.hunger < 100) {
      speakGameEvent('waterFull', pet);
    }
  }, [pet.hunger >= 100, pet.thirst >= 100]);

  // Check for 100% hunger & thirst EVOLUTION TRIGGER
  useEffect(() => {
    if (pet.hunger >= 100 && pet.thirst >= 100 && !showEvolutionModal) {
      triggerEvolution();
    }
  }, [pet.hunger, pet.thirst]);

  // Trigger Evolution and Level Up
  const triggerEvolution = () => {
    playCelebrationSound();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#10B981', '#EC4899', '#6366F1', '#3B82F6'],
    });

    const nextLevel = pet.level + 1;
    speakGameEvent('levelUp', { name: pet.name, level: nextLevel });
    let nextStage: PetStage = pet.stage;

    // Stage progression: Cấp 1-3 -> baby, Cấp 4-7 -> junior, Cấp 8+ -> master
    if (nextLevel >= 8) {
      nextStage = 'master';
    } else if (nextLevel >= 4) {
      nextStage = 'junior';
    }

    // Unlock a free surprise costume reward if available
    const lockedCostumes = COSTUME_LIST.filter((c) => !pet.unlockedCostumes.includes(c.id));
    const bonusCostume = lockedCostumes.length > 0 ? lockedCostumes[0].id : null;
    setEvolutionUnlockedCostume(bonusCostume);

    const newUnlocked = bonusCostume 
      ? [...pet.unlockedCostumes, bonusCostume]
      : pet.unlockedCostumes;

    const updatedPet: PetState = {
      ...pet,
      level: nextLevel,
      stage: nextStage,
      hunger: 45, // Reset to 45% for next growth cycle
      thirst: 45, // Reset to 45% for next growth cycle
      coins: pet.coins + 30, // Big coin bonus for evolving!
      stars: pet.stars + 3,
      unlockedCostumes: newUnlocked,
      equippedHat: bonusCostume || pet.equippedHat,
    };

    onUpdatePet(updatedPet);
    setShowEvolutionModal(true);
  };

  // Open math quest with specific target ('food' | 'water' | 'costume')
  const handleOpenQuest = (target: QuestTarget, costumeId?: string) => {
    playPopSound();

    // 1. Nếu Độ No Bụng đã đạt 100% khi bé bấm kiếm thức ăn
    if (target === 'food') {
      if (pet.hunger >= 100) {
        if (pet.thirst < 100) {
          playChimeSound();
          setStatFullModal({ type: 'food', currentOtherValue: pet.thirst });
          speakGameEvent('foodFull', { name: pet.name, level: pet.level });
          return;
        } else {
          triggerEvolution();
          return;
        }
      }
    }

    // 2. Nếu Khát Nước đã đạt 100% khi bé bấm kiếm nước uống
    if (target === 'water') {
      if (pet.thirst >= 100) {
        if (pet.hunger < 100) {
          playChimeSound();
          setStatFullModal({ type: 'water', currentOtherValue: pet.hunger });
          speakGameEvent('waterFull', { name: pet.name, level: pet.level });
          return;
        } else {
          triggerEvolution();
          return;
        }
      }
    }

    setQuestTarget(target);
    setTargetCostumeId(costumeId);
    setIsMathQuestOpen(true);
  };

  // Handle clicking on pet
  const handlePetClick = () => {
    playPetVoice(pet.type);
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 1200);

    // Xử lý các trạng thái khi bấm vào thú cưng
    if (pet.hunger >= 100 && pet.thirst >= 100) {
      triggerEvolution();
    } else if (pet.hunger >= 100 && pet.thirst < 100) {
      setStatFullModal({ type: 'food', currentOtherValue: pet.thirst });
      speakGameEvent('foodFull', { name: pet.name, level: pet.level });
    } else if (pet.thirst >= 100 && pet.hunger < 100) {
      setStatFullModal({ type: 'water', currentOtherValue: pet.hunger });
      speakGameEvent('waterFull', { name: pet.name, level: pet.level });
    } else if (isHungry) {
      handleOpenQuest('food');
    } else if (isThirsty) {
      handleOpenQuest('water');
    } else {
      setPetMood('excited');
      setTimeout(() => setPetMood('happy'), 800);
    }
  };

  // When child solves math and returns to garden
  const handleFinishAndFeedPet = (target: QuestTarget) => {
    setIsMathQuestOpen(false);

    if (target === 'water') {
      playDrinkingSound();
    } else if (target === 'food') {
      playEatingSound();
    }

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#F59E0B', '#10B981', '#38BDF8'],
    });

    setPetMood('excited');
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-300 text-slate-800 select-none">
      
      {/* Cartoon Sky & Garden Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Smiling Sun with animated rays */}
        <div className="absolute top-4 left-6 md:top-8 md:left-12 flex items-center justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-amber-300 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.7)] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex gap-4">
                <div className="w-2.5 h-2.5 bg-amber-900 rounded-full" />
                <div className="w-2.5 h-2.5 bg-amber-900 rounded-full" />
              </div>
              <div className="w-6 h-3 border-b-3 border-amber-900 rounded-full mt-1" />
            </div>
          </div>
          <div className="absolute w-32 h-32 md:w-40 md:h-40 border-4 border-dashed border-amber-300/50 rounded-full animate-[spin_30s_linear_infinite]" />
        </div>

        {/* Floating Clouds */}
        <div className="absolute top-10 left-[22%] w-40 h-14 bg-white/95 rounded-full blur-[1px] animate-[float_7s_ease-in-out_infinite]" />
        <div className="absolute top-16 right-[18%] w-48 h-16 bg-white/90 rounded-full blur-[1px] animate-[float_9s_ease-in-out_infinite_reverse]" />

        {/* Lush Apple Tree */}
        <div className="absolute bottom-24 -left-6 md:left-4 z-0 pointer-events-auto">
          <div className="w-10 md:w-14 h-36 bg-amber-800 rounded-lg mx-auto shadow-inner" />
          <div className="absolute -top-20 -left-12 md:-left-10 w-44 md:w-56 h-44 md:h-56 bg-emerald-500 rounded-full shadow-[0_10px_20px_rgba(5,150,105,0.3)] border-4 border-emerald-600 flex items-center justify-center">
            <button
              onClick={() => handleOpenQuest('food')}
              title="Quả táo đỏ - Bấm để giải toán"
              className="absolute top-8 left-10 text-2xl hover:scale-125 active:scale-95 transition-transform cursor-pointer"
            >
              🍎
            </button>
            <button
              onClick={() => handleOpenQuest('food')}
              title="Quả táo đỏ - Bấm để giải toán"
              className="absolute top-16 right-10 text-2xl hover:scale-125 active:scale-95 transition-transform cursor-pointer"
            >
              🍎
            </button>
            <button
              onClick={() => handleOpenQuest('food')}
              title="Quả táo đỏ - Bấm để giải toán"
              className="absolute bottom-10 left-16 text-2xl hover:scale-125 active:scale-95 transition-transform cursor-pointer"
            >
              🍎
            </button>
          </div>
        </div>

        {/* Rolling Grass Hills */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-emerald-400 rounded-[50%_50%_0_0/20%_20%_0_0] scale-x-125 translate-y-12" />
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-emerald-500 rounded-[50%_50%_0_0/25%_25%_0_0] scale-x-110 translate-y-6" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-emerald-600 rounded-[50%_50%_0_0/30%_30%_0_0]" />

        {/* Flowers & Butterflies */}
        <div className="absolute bottom-8 left-[30%] text-2xl animate-[float_4s_ease-in-out_infinite]">🦋</div>
        <div className="absolute bottom-6 left-[45%] text-2xl">🌼</div>
        <div className="absolute bottom-10 right-[35%] text-2xl">🌻</div>
        <div className="absolute bottom-5 right-[10%] text-2xl">🌸</div>
      </div>

      {/* TOP HEADER: Pet Status & Navigation & Wardrobe Button */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-4 pt-3 md:pt-4 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Pet Info & Evolution Stage */}
        <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-amber-300 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shadow-inner border border-amber-200">
            {pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐰'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-800 text-sm md:text-base">{pet.name}</span>
              <span className="text-[10px] md:text-xs bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full">
                Cấp {pet.level} · {pet.stage === 'baby' ? 'Bé Nhỏ' : pet.stage === 'junior' ? 'Bé Lớn' : 'Siêu Sao'}
              </span>
            </div>
            <div className="text-[10px] md:text-[11px] font-bold text-emerald-700">
              {pet.stage === 'baby' ? '🌱 Giai đoạn 1' : pet.stage === 'junior' ? '⭐ Giai đoạn 2' : '👑 Giai đoạn 3'}
            </div>
          </div>
        </div>

        {/* Right: Currency & Wardrobe & Change Pet */}
        <div className="flex items-center gap-2">
          {/* Coins */}
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-amber-300 shadow-sm font-black text-amber-800 text-xs md:text-sm">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{pet.coins}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-yellow-300 shadow-sm font-black text-yellow-800 text-xs md:text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span>{pet.stars}</span>
          </div>

          {/* TỦ ĐỒ THỜI TRANG (MODULE 5) */}
          <button
            onClick={() => {
              playPopSound();
              setIsWardrobeOpen(true);
            }}
            title="Mở tủ đồ để thay nón và phụ kiện"
            className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 hover:bg-pink-400 text-white font-black rounded-2xl border border-pink-600 text-xs md:text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Shirt className="w-4 h-4" />
            <span>Tủ Đồ</span>
          </button>

          {/* Return / Change Pet (Module 1 Link) */}
          <button
            onClick={() => {
              playPopSound();
              onBackToModule1();
            }}
            title="Đổi tên hoặc chọn bạn thú cưng khác"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-2xl border border-purple-300 text-xs md:text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đổi Thú</span>
          </button>
        </div>
      </header>

      {/* CENTER STAGE: Pet in Garden + Status Bars */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-2 flex-1 flex flex-col items-center justify-center">
        
        {/* Visual Cue Thought Bubble: Clicking opens specific Math Quest */}
        <div className="relative mb-2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-3xl border-3 border-amber-300 shadow-lg text-center max-w-sm md:max-w-md animate-bounce-soft">
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-extrabold text-amber-950">
            {pet.hunger >= 100 && pet.thirst >= 100 ? (
              <span className="text-lg">👑</span>
            ) : pet.hunger >= 100 ? (
              <span className="text-lg">🥛</span>
            ) : pet.thirst >= 100 ? (
              <span className="text-lg">🍎</span>
            ) : isHungry ? (
              <span className="text-lg">🍲</span>
            ) : isThirsty ? (
              <span className="text-lg">💧</span>
            ) : (
              <span className="text-lg">💖</span>
            )}
            <span>
              {pet.hunger >= 100 && pet.thirst >= 100
                ? `Cả 2 chỉ số đã 100%! Bạn ${pet.name} đã sẵn sàng tiến hóa! 👑`
                : pet.hunger >= 100
                ? `${pet.name} đã ăn no (100%) rồi! Giờ hãy cho bạn ấy uống nước nhé! 🥛`
                : pet.thirst >= 100
                ? `${pet.name} đã uống no nước (100%) rồi! Giờ hãy cho bạn ấy ăn nhé! 🍎`
                : isHungry && isThirsty
                ? `Bụng ${pet.name} đang đói và khát! Cùng giải toán chăm sóc nhé!`
                : isHungry
                ? `Bé ơi, ${pet.name} đang đói bụng! Giải toán kiếm táo thơm nào! 🍎`
                : isThirsty
                ? `Bé ơi, ${pet.name} đang khát nước! Giải toán kiếm sữa mát nào! 🥛`
                : `${pet.name} đang tràn đầy năng lượng! Đạt 100% để tiến hóa nhé! ⭐`}
            </span>
          </div>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-3 border-amber-300 rotate-45" />
        </div>

        {/* Center Pet Stage */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Thought Bubble over Pet Head */}
          {pet.hunger >= 100 && pet.thirst >= 100 ? (
            <button
              onClick={triggerEvolution}
              className="absolute -top-10 -right-4 z-20 flex items-center gap-1.5 bg-gradient-to-r from-amber-300 to-yellow-400 px-3.5 py-1.5 rounded-full border-2 border-amber-500 shadow-md animate-bounce cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Bấm để tiến hóa!"
            >
              <span className="text-xs font-black text-amber-950">Tiến Hóa</span>
              <span className="text-lg">👑</span>
            </button>
          ) : pet.hunger >= 100 && pet.thirst < 100 ? (
            <button
              onClick={() => handleOpenQuest('water')}
              className="absolute -top-10 -right-4 z-20 flex items-center gap-1.5 bg-sky-100 px-3.5 py-1.5 rounded-full border-2 border-sky-400 shadow-md animate-bounce cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Bấm để giải toán kiếm nước uống!"
            >
              <span className="text-xs font-black text-sky-800">Cần Nước</span>
              <span className="text-lg">🥛</span>
              <span className="text-[10px] bg-sky-400 text-white font-black px-1.5 py-0.5 rounded-full">Toán 📝</span>
            </button>
          ) : pet.thirst >= 100 && pet.hunger < 100 ? (
            <button
              onClick={() => handleOpenQuest('food')}
              className="absolute -top-10 -right-4 z-20 flex items-center gap-1.5 bg-amber-100 px-3.5 py-1.5 rounded-full border-2 border-amber-400 shadow-md animate-bounce cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Bấm để giải toán kiếm thức ăn!"
            >
              <span className="text-xs font-black text-amber-800">Cần Ăn</span>
              <span className="text-lg">🍎</span>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full">Toán 📝</span>
            </button>
          ) : (isHungry || isThirsty) ? (
            <button
              onClick={() => handleOpenQuest(isHungry ? 'food' : 'water')}
              className="absolute -top-10 -right-4 z-20 flex items-center gap-1.5 bg-white/95 px-3.5 py-1.5 rounded-full border-2 border-rose-400 shadow-md animate-bounce cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Bấm để vào bếp giải toán kiếm đồ ăn cho thú cưng!"
            >
              <span className="text-xs font-black text-rose-600">Thèm</span>
              <span className="text-lg">{isHungry ? '🍎' : '🥛'}</span>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full">Học Toán 📝</span>
            </button>
          ) : null}

          {/* Heart Pop */}
          {showHeartBurst && (
            <div className="absolute -top-12 z-30 flex items-center gap-1.5 text-rose-500 animate-[float_1s_ease-out_forwards]">
              <Heart className="w-8 h-8 fill-rose-500 animate-ping" />
              <span className="font-black text-rose-600 text-sm bg-white/90 px-2 py-0.5 rounded-full shadow">Yêu bé!</span>
            </div>
          )}

          {/* Glowing Aura if ready to evolve */}
          {pet.hunger >= 90 && pet.thirst >= 90 && (
            <div className="absolute inset-0 bg-amber-300/40 rounded-full blur-xl animate-pulse" />
          )}

          {/* Grass patch */}
          <div className="absolute -bottom-4 w-52 md:w-64 h-12 bg-emerald-600/30 rounded-full blur-[2px]" />

          {/* Pet Avatar with Stage scaling and equipped costume */}
          <div
            onClick={handlePetClick}
            title="Chạm vào mình để chăm sóc nhé!"
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

        {/* STATUS BARS CONTAINER */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-3.5 md:p-4 rounded-3xl border-3 border-amber-300 shadow-lg mt-2">
          
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-amber-100">
            <span className="text-xs md:text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
              <span>📊 CHỈ SỐ NUÔI DƯỠNG CỦA {pet.name.toUpperCase()}</span>
            </span>

            {pet.hunger >= 100 && pet.thirst >= 100 ? (
              <span className="text-[11px] font-black bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full animate-bounce border border-amber-500 flex items-center gap-1 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-300" />
                <span>Đã Đầy 100% · Tiến Hóa!</span>
              </span>
            ) : pet.hunger >= 100 ? (
              <span className="text-[11px] font-black bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-300 flex items-center gap-1">
                <span>💧 Cho uống nước để đủ 100%</span>
              </span>
            ) : pet.thirst >= 100 ? (
              <span className="text-[11px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <span>🍎 Cho ăn thức ăn để đủ 100%</span>
              </span>
            ) : isHungry || isThirsty ? (
              <span className="text-[11px] font-black bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full animate-pulse border border-rose-300 flex items-center gap-1">
                <span>🥺 Cần được chăm sóc!</span>
              </span>
            ) : (
              <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Rất Khỏe Mạnh!</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            {/* 1. THANH ĐỘ ĐÓI (FOOD) */}
            <div 
              onClick={() => handleOpenQuest('food')}
              className={`p-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                pet.hunger >= 100
                  ? 'bg-emerald-50 border-2 border-emerald-400 shadow-xs'
                  : isHungry 
                  ? 'bg-rose-50 border-2 border-rose-400 ring-2 ring-rose-300/40 animate-pulse' 
                  : 'bg-amber-50/70 border border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">🍲</span>
                  <span className="text-xs md:text-sm font-black text-amber-950">
                    Độ No Bụng (Thức Ăn)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {pet.hunger >= 100 ? (
                    <span className="text-xs text-emerald-700 font-black">
                      No 100% rồi! 😋
                    </span>
                  ) : isHungry ? (
                    <span className="text-xs text-rose-600 font-black">
                      Đói rồi! 🥺
                    </span>
                  ) : null}
                  <span className="text-xs md:text-sm font-black text-amber-800 tabular-nums">
                    {pet.hunger}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-white rounded-full h-3.5 overflow-hidden p-0.5 border border-amber-200 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pet.hunger >= 100
                      ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                      : isHungry 
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500' 
                      : 'bg-gradient-to-r from-amber-400 to-orange-500'
                  }`}
                  style={{ width: `${Math.max(5, pet.hunger)}%` }}
                />
              </div>
            </div>

            {/* 2. THANH KHÁT NƯỚC (WATER) */}
            <div 
              onClick={() => handleOpenQuest('water')}
              className={`p-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                pet.thirst >= 100
                  ? 'bg-sky-50 border-2 border-sky-400 shadow-xs'
                  : isThirsty 
                  ? 'bg-sky-50 border-2 border-sky-400 ring-2 ring-sky-300/40 animate-pulse' 
                  : 'bg-sky-50/70 border border-sky-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">💧</span>
                  <span className="text-xs md:text-sm font-black text-sky-950">
                    Khát Nước (Nước Uống)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {pet.thirst >= 100 ? (
                    <span className="text-xs text-sky-700 font-black">
                      No nước 100%! 🥤
                    </span>
                  ) : isThirsty ? (
                    <span className="text-xs text-sky-600 font-black">
                      Khát rồi! 🥺
                    </span>
                  ) : null}
                  <span className="text-xs md:text-sm font-black text-sky-800 tabular-nums">
                    {pet.thirst}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-white rounded-full h-3.5 overflow-hidden p-0.5 border border-sky-200 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pet.thirst >= 100
                      ? 'bg-gradient-to-r from-sky-400 to-cyan-500'
                      : isThirsty 
                      ? 'bg-gradient-to-r from-sky-400 to-blue-500' 
                      : 'bg-gradient-to-r from-sky-400 to-cyan-500'
                  }`}
                  style={{ width: `${Math.max(5, pet.thirst)}%` }}
                />
              </div>
            </div>
          </div>

          {/* CÁC NÚT BẮT BUỘC GIẢI TOÁN */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-amber-100">
            {/* Button 1: Solve Math for Food Only */}
            <button
              onClick={() => handleOpenQuest('food')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                pet.hunger >= 100
                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 active:scale-95 text-amber-950 shadow-[0_3px_0_#b45309] active:translate-y-1 active:shadow-none'
              }`}
            >
              <span className="text-base">{pet.hunger >= 100 ? '😋' : '🍎'}</span>
              <span>{pet.hunger >= 100 ? 'Đã No (100%)' : 'Giải Toán Kiếm Táo'}</span>
            </button>

            {/* Button 2: Solve Math for Water Only */}
            <button
              onClick={() => handleOpenQuest('water')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                pet.thirst >= 100
                  ? 'bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300'
                  : 'bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-300 hover:to-blue-300 active:scale-95 text-sky-950 shadow-[0_3px_0_#0284c7] active:translate-y-1 active:shadow-none'
              }`}
            >
              <span className="text-base">{pet.thirst >= 100 ? '🥤' : '🥛'}</span>
              <span>{pet.thirst >= 100 ? 'Đã No Nước (100%)' : 'Giải Toán Kiếm Nước'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* BOTTOM ACTION BAR */}
      <footer className="relative z-20 w-full max-w-4xl mx-auto px-4 pb-4 pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => {
            if (pet.hunger >= 100 && pet.thirst >= 100) {
              triggerEvolution();
            } else if (pet.hunger >= 100) {
              handleOpenQuest('water');
            } else if (pet.thirst >= 100) {
              handleOpenQuest('food');
            } else {
              handleOpenQuest(pet.hunger <= pet.thirst ? 'food' : 'water');
            }
          }}
          className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4.5 rounded-3xl font-black text-lg sm:text-xl md:text-2xl text-white shadow-[0_8px_0_#b45309,0_15px_25px_rgba(245,158,11,0.45)] hover:shadow-[0_6px_0_#b45309] active:translate-y-2 active:shadow-none transition-all cursor-pointer group ${
            pet.hunger >= 100 && pet.thirst >= 100
              ? 'bg-gradient-to-r from-amber-500 via-purple-500 to-pink-500 animate-pulse'
              : pet.hunger >= 100
              ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 animate-pulse'
              : pet.thirst >= 100
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 animate-pulse'
              : isHungry || isThirsty
              ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 animate-pulse'
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform text-2xl">
            {pet.hunger >= 100 && pet.thirst >= 100
              ? '👑'
              : pet.hunger >= 100
              ? '🥛'
              : pet.thirst >= 100
              ? '🍎'
              : isHungry
              ? '🍎'
              : '🥛'}
          </div>
          <div className="text-left">
            <div className="leading-tight flex items-center gap-2">
              <span>
                {pet.hunger >= 100 && pet.thirst >= 100
                  ? `TIẾN HÓA CHO BẠN ${pet.name.toUpperCase()}!`
                  : pet.hunger >= 100
                  ? 'VÀO BẾP KIẾM NƯỚC UỐNG'
                  : pet.thirst >= 100
                  ? 'VÀO BẾP KIẾM THỨC ĂN'
                  : 'VÀO BẾP KIẾM THỨC ĂN & NƯỚC'}
              </span>
              <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-bold">
                {pet.hunger >= 100 && pet.thirst >= 100 ? 'Thăng Cấp 👑' : 'Học Toán 📝'}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white/90">
              {pet.hunger >= 100 && pet.thirst >= 100
                ? 'Cả 2 chỉ số đã đạt 100%! Bấm để thăng cấp ngay ⭐'
                : pet.hunger >= 100
                ? `Đã no 100%! Uống thêm nước mát (Khát: ${pet.thirst}%) 🥛`
                : pet.thirst >= 100
                ? `Đã no nước 100%! Ăn thêm món ngon (Độ no: ${pet.hunger}%) 🍎`
                : 'Giải toán đúng để nuôi thú cưng tiến hóa! ⭐'}
            </div>
          </div>
          <ArrowRight className="w-7 h-7 ml-1 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </footer>

      {/* Footer Copyright Notice */}
      <div className="relative z-20 w-full text-center pb-2.5 pt-1 text-[11px] sm:text-xs font-bold text-emerald-950/80 drop-shadow-xs">
        Bản quyền thuộc về HoangMy@2026
      </div>

      {/* MODULE 3: MATH QUEST POPUP */}
      {isMathQuestOpen && (
        <Module3MathQuest
          pet={pet}
          onUpdatePet={onUpdatePet}
          onClose={() => setIsMathQuestOpen(false)}
          onFinishAndFeed={handleFinishAndFeedPet}
          questTarget={questTarget}
          targetCostumeId={targetCostumeId}
        />
      )}

      {/* MODULE 5: WARDROBE & COSTUME SHOP */}
      {isWardrobeOpen && (
        <Module5Wardrobe
          pet={pet}
          onUpdatePet={onUpdatePet}
          onClose={() => setIsWardrobeOpen(false)}
          onTriggerCostumeQuest={(costumeId) => {
            setIsWardrobeOpen(false);
            handleOpenQuest('costume', costumeId);
          }}
          onEarnCoinsQuest={() => {
            setIsWardrobeOpen(false);
            handleOpenQuest('food');
          }}
        />
      )}

      {/* POPUP THÔNG BÁO TỪ THÚ CƯNG KHI 1 CHỈ SỐ ĐẠT 100% */}
      {statFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-gradient-to-b from-amber-50 via-white to-pink-50 rounded-3xl md:rounded-[36px] max-w-md w-full p-6 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden">
            
            {/* Header Icon */}
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner border-2 mb-3 animate-bounce ${
              statFullModal.type === 'food'
                ? 'bg-amber-100 border-amber-300'
                : 'bg-sky-100 border-sky-300'
            }`}>
              {statFullModal.type === 'food' ? '🍲' : '🥛'}
            </div>

            {/* Badge */}
            <div className={`inline-block px-3.5 py-1 text-white font-black text-xs rounded-full uppercase mb-2 shadow-xs ${
              statFullModal.type === 'food' ? 'bg-amber-500' : 'bg-sky-500'
            }`}>
              {statFullModal.type === 'food' ? '😋 ĐÃ ĂN NO 100% RỒI!' : '🥤 ĐÃ NO NƯỚC 100% RỒI!'}
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
              {statFullModal.type === 'food'
                ? `BẠN ${pet.name.toUpperCase()} ĐÃ NO CĂNG BỤNG!`
                : `BẠN ${pet.name.toUpperCase()} ĐÃ ĐỦ NƯỚC MÁT!`}
            </h3>

            {/* Friendly Pet Message (Bong bóng yêu thương từ thú cưng) */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs my-3 text-sm font-bold text-slate-700 leading-relaxed relative text-left">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-2xl shrink-0">🐾</span>
                  <div>
                    {statFullModal.type === 'food' ? (
                      <span>
                        "Bé ơi, <span className="text-amber-600 font-black">{pet.name}</span> đã ăn no <span className="text-emerald-600 font-black">(100%)</span> rồi! Giờ hãy cho <span className="text-amber-600 font-black">{pet.name}</span> uống nước nhé (Khát nước hiện tại: <span className="text-sky-600 font-black">{statFullModal.currentOtherValue}%</span>)!"
                      </span>
                    ) : (
                      <span>
                        "Bé ơi, <span className="text-sky-600 font-black">{pet.name}</span> đã uống no nước <span className="text-emerald-600 font-black">(100%)</span> rồi! Giờ hãy cho <span className="text-sky-600 font-black">{pet.name}</span> ăn thức ăn nhé (Độ no hiện tại: <span className="text-amber-600 font-black">{statFullModal.currentOtherValue}%</span>)!"
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    speakGameEvent(
                      statFullModal.type === 'food' ? 'foodFull' : 'waterFull',
                      { name: pet.name, level: pet.level }
                    );
                  }}
                  title="Nghe giọng nói của thú cưng"
                  className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 shrink-0 cursor-pointer transition-transform active:scale-90 shadow-xs border border-amber-200"
                >
                  <Volume2 className="w-4 h-4 text-amber-700" />
                </button>
              </div>
            </div>

            {/* Status bars preview in modal */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-bold space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span>🍲 Độ No Bụng:</span>
                <span className={`font-black ${statFullModal.type === 'food' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {statFullModal.type === 'food' ? '100% (Đầy Đủ ✓)' : `${statFullModal.currentOtherValue}%`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>💧 Khát Nước:</span>
                <span className={`font-black ${statFullModal.type === 'water' ? 'text-emerald-600' : 'text-sky-600'}`}>
                  {statFullModal.type === 'water' ? '100% (Đầy Đủ ✓)' : `${statFullModal.currentOtherValue}%`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {statFullModal.type === 'food' ? (
                <button
                  onClick={() => {
                    playPopSound();
                    setStatFullModal(null);
                    setQuestTarget('water');
                    setIsMathQuestOpen(true);
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-[0_4px_0_#0284c7] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                >
                  <span className="text-xl">🥛</span>
                  <span>GIẢI TOÁN KIẾM NƯỚC NGAY</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    playPopSound();
                    setStatFullModal(null);
                    setQuestTarget('food');
                    setIsMathQuestOpen(true);
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm sm:text-base rounded-2xl shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                >
                  <span className="text-xl">🍎</span>
                  <span>GIẢI TOÁN KIẾM TÁO NGAY</span>
                </button>
              )}

              <button
                onClick={() => {
                  playPopSound();
                  setStatFullModal(null);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                🐾 ĐÃ HIỂU RỒI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: EVOLUTION & LEVEL UP CELEBRATION MODAL */}
      {showEvolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-gradient-to-b from-amber-50 via-white to-purple-50 rounded-3xl md:rounded-[36px] max-w-lg w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden">
            
            {/* Top Confetti / Trophy Icon */}
            <div className="w-20 h-20 bg-gradient-to-b from-amber-200 to-amber-300 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner border-2 border-amber-400 mb-2 animate-bounce">
              👑
            </div>

            <div className="inline-block px-3.5 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full uppercase mb-2 shadow-xs">
              🎉 TIẾN HÓA THÀNH CÔNG!
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 leading-tight">
              BÉ ĐÃ CHĂM SÓC BẠN {pet.name.toUpperCase()} LỚN KHÔN VÀ ĐẦY ĐỦ RỒI!
            </h3>
            
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2">
              Cả hai chỉ số <span className="font-black text-emerald-700">Độ No Bụng (100%)</span> &{' '}
              <span className="font-black text-sky-700">Khát Nước (100%)</span> đều đã chạm mốc tối đa! Bạn {pet.name} đã thăng lên{' '}
              <span className="font-black text-purple-700">Cấp {pet.level}</span> ({pet.stage === 'baby' ? 'Bé Nhỏ' : pet.stage === 'junior' ? 'Bé Lớn' : 'Siêu Sao'})!
            </p>

            {/* Pet Preview in Growth */}
            <div className="my-3 flex items-center justify-center">
              <div className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-sm">
                <PetAvatar type={pet.type} stage={pet.stage} size="md" equippedHat={pet.equippedHat} />
              </div>
            </div>

            {/* Unlocked Costume Gift */}
            {evolutionUnlockedCostume && (
              <div className="bg-pink-50 rounded-2xl p-2.5 border border-pink-200 text-xs font-bold text-pink-900 mb-3 flex items-center justify-center gap-2">
                <span className="text-xl">🎁</span>
                <span>
                  Quà thăng cấp: Đã tặng bạn{' '}
                  <span className="font-black text-pink-700">
                    {COSTUME_LIST.find((c) => c.id === evolutionUnlockedCostume)?.name}
                  </span>!
                </span>
              </div>
            )}

            {/* Interactive Question Dialog for Child */}
            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 p-4 rounded-3xl border-2 border-purple-300 shadow-sm my-3 text-left">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-inner shrink-0">
                    👗
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-purple-950 leading-snug">
                      "Cảm ơn bé đã cho {pet.name} ăn uống đầy đủ! Giờ bé có muốn chuyển sang mua quần áo/phụ kiện mới cho thú không?"
                    </h4>
                    <p className="text-[11px] text-purple-800 font-semibold mt-1">
                      Bé có thể chọn trang phục yêu thích và giải bài toán đặc biệt để nhận vật phẩm nhé!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => speakGameEvent('levelUp', { name: pet.name, level: pet.level })}
                  title="Nghe giọng chúc mừng"
                  className="p-2 rounded-xl bg-white hover:bg-purple-200 text-purple-800 shrink-0 cursor-pointer transition-transform active:scale-90 shadow-xs border border-purple-300"
                >
                  <Volume2 className="w-4 h-4 text-purple-900" />
                </button>
              </div>
            </div>

            {/* TWO ACTION BUTTONS: [CÓ] and [KHÔNG] */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              {/* Button [Có]: Open Wardrobe */}
              <button
                onClick={() => {
                  playPopSound();
                  setShowEvolutionModal(false);
                  setIsWardrobeOpen(true);
                }}
                className="py-3.5 px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 hover:from-purple-500 hover:to-pink-400 text-white font-black text-sm sm:text-base rounded-2xl shadow-[0_5px_0_#7e22ce] active:translate-y-1 active:shadow-none transition-all flex flex-col items-center justify-center cursor-pointer animate-pulse"
              >
                <div className="flex items-center gap-1.5">
                  <span>👗 CÓ, VÀO TỦ ĐỒ NGAY!</span>
                </div>
                <span className="text-[10px] text-purple-100 font-bold">
                  Khám phá & Giải toán thử thách
                </span>
              </button>

              {/* Button [Không]: Stay in Garden */}
              <button
                onClick={() => {
                  playPopSound();
                  setShowEvolutionModal(false);
                }}
                className="py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-[0_5px_0_#15803d] active:translate-y-1 active:shadow-none transition-all flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span>🏡 KHÔNG, Ở LẠI SÂN VƯỜN</span>
                </div>
                <span className="text-[10px] text-emerald-100 font-bold">
                  Tiếp tục chơi & Lưu cấp độ mới
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
