/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Coins, 
  Star, 
  RotateCcw,
  Gift,
  Volume2,
  VolumeX
} from 'lucide-react';
import { PetState, QuestTarget } from '../types/game';
import { COSTUME_LIST } from '../data/costumes';
import { 
  playPopSound, 
  playChimeSound, 
  playCelebrationSound, 
  playEncouragingSound, 
  speakGameEvent,
  speakVietnamese,
  setSpeechMuted,
  isSpeechMuted,
  stopSpeech,
  VOICE_MUTED_EVENT
} from '../utils/audio';

interface Module3MathQuestProps {
  pet: PetState;
  onUpdatePet: (updatedPet: PetState) => void;
  onClose: () => void;
  onFinishAndFeed: (target: QuestTarget) => void;
  questTarget?: QuestTarget; // 'food' | 'water' | 'costume'
  targetCostumeId?: string;
}

type QuestionType = 'counting' | 'comparison' | 'addition';

interface MathQuestion {
  id: string;
  level: number;
  type: QuestionType;
  prompt: string;
  itemEmoji: string;
  itemName: string;
  containerLabel: string;
  containerTitle: string;
  // For counting
  count?: number;
  // For comparison
  plateA?: { count: number; items: string[] };
  plateB?: { count: number; items: string[] };
  targetComparison?: 'more' | 'less';
  correctPlate?: 'A' | 'B';
  // For addition
  addendA?: number;
  addendB?: number;
  sum?: number;
  // Multiple choice options
  options?: number[];
  correctAnswer?: number;
}

// Pool of food items (Dành cho Giải Toán Kiếm Thức Ăn)
const FOOD_POOL = [
  { emoji: '🍎', name: 'quả táo đỏ', containerTitle: 'Rổ táo đỏ', plateLabel: 'ĐĨA' },
  { emoji: '🥕', name: 'củ cà rốt', containerTitle: 'Rổ cà rốt', plateLabel: 'ĐĨA' },
  { emoji: '🐟', name: 'chú cá nhỏ', containerTitle: 'Đĩa cá nhỏ', plateLabel: 'ĐĨA' },
  { emoji: '🍓', name: 'quả dâu tây', containerTitle: 'Đĩa dâu tây', plateLabel: 'ĐĨA' },
  { emoji: '🍌', name: 'quả chuối vàng', containerTitle: 'Nải chuối vàng', plateLabel: 'ĐĨA' },
];

// Pool of water / drink items (ĐỒNG BỘ 100% GIỮA HÌNH ẢNH VÀ CHỮ DÀNH CHO BÉ)
const WATER_POOL = [
  { emoji: '🥛', name: 'ly sữa tươi', containerTitle: 'Khay sữa tươi', plateLabel: 'KHAY' },
  { emoji: '🧃', name: 'hộp sữa tươi', containerTitle: 'Khay hộp sữa', plateLabel: 'KHAY' },
  { emoji: '💧', name: 'giọt nước mát', containerTitle: 'Khay nước mát', plateLabel: 'KHAY' },
  { emoji: '🥤', name: 'ly nước mát', containerTitle: 'Khay nước mát', plateLabel: 'KHAY' },
  { emoji: '🥥', name: 'trái dừa ngọt', containerTitle: 'Khay dừa ngọt', plateLabel: 'KHAY' },
];

// Pool of costume quest items (Dành cho Thử Thách Thời Trang)
const COSTUME_QUEST_ITEMS = [
  { emoji: '👑', name: 'vương miện vàng', containerTitle: 'Hộp vương miện', plateLabel: 'HỘP' },
  { emoji: '⭐', name: 'ngôi sao may mắn', containerTitle: 'Hộp ngôi sao', plateLabel: 'HỘP' },
  { emoji: '💎', name: 'viên ngọc quý', containerTitle: 'Hộp ngọc quý', plateLabel: 'HỘP' },
  { emoji: '🎀', name: 'chiếc nơ xinh', containerTitle: 'Hộp nơ hồng', plateLabel: 'HỘP' },
  { emoji: '🕶️', name: 'kính mát siêu ngầu', containerTitle: 'Hộp kính mát', plateLabel: 'HỘP' },
];

export const Module3MathQuest: React.FC<Module3MathQuestProps> = ({
  pet,
  onUpdatePet,
  onClose,
  onFinishAndFeed,
  questTarget = 'food',
  targetCostumeId,
}) => {
  // Allow switching target dynamically when one stat reaches 100%
  const [activeTarget, setActiveTarget] = useState<QuestTarget>(questTarget);

  // For costume quest, start at an elevated challenge (e.g. Level 4-8), otherwise match pet level
  const initialLvl = questTarget === 'costume'
    ? Math.max(4, Math.min(8, pet.level + 1))
    : Math.min(10, Math.max(1, pet.level));
  const [level, setLevel] = useState<number>(initialLvl);
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | 'A' | 'B' | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [countedIndices, setCountedIndices] = useState<number[]>([]);

  // Voice mute state (persisted across questions and sessions)
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(() => isSpeechMuted());

  // Keep mute state in sync if changed elsewhere (e.g. top-right AudioControls)
  useEffect(() => {
    const handleMuteChange = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setIsVoiceMuted(custom.detail);
    };
    window.addEventListener(VOICE_MUTED_EVENT, handleMuteChange);
    return () => window.removeEventListener(VOICE_MUTED_EVENT, handleMuteChange);
  }, []);

  // Stop any active speech when quest modal is closed/unmounted
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // TỰ ĐỘNG ĐỌC CÂU HỎI:
  // Ngay khi popup bài toán hiện lên (hoặc chuyển sang câu hỏi mới), tự động đọc to rõ câu hỏi nếu không tắt tiếng
  useEffect(() => {
    if (!question || feedbackState !== 'idle') return;

    if (!isSpeechMuted()) {
      // Đợi 250ms cho modal/hiệu ứng chuyển cảnh ổn định rồi đọc
      const timer = window.setTimeout(() => {
        speakVietnamese(question.prompt);
      }, 250);
      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [question?.id]);

  const handleToggleVoiceMute = () => {
    playPopSound();
    const next = !isVoiceMuted;
    setIsVoiceMuted(next);
    setSpeechMuted(next);
    if (!next && question && feedbackState === 'idle') {
      // Khi bật âm thanh trở lại, đọc ngay câu hỏi hiện tại cho bé nghe!
      speakVietnamese(question.prompt);
    }
  };

  // Find target costume info if costume quest
  const costumeInfo = targetCostumeId ? COSTUME_LIST.find((c) => c.id === targetCostumeId) : null;

  // Generator for math questions based on target and level, guaranteed to be DIFFERENT from prevQ
  const generateQuestion = (currentLvl: number, prevQ?: MathQuestion | null, targetOverride?: QuestTarget): MathQuestion => {
    const target = targetOverride || activeTarget;
    // Select appropriate item pool based on quest target
    const pool = target === 'water' 
      ? WATER_POOL 
      : target === 'costume' 
      ? COSTUME_QUEST_ITEMS 
      : FOOD_POOL;

    const availableItems = pool.filter((item) => item.emoji !== prevQ?.itemEmoji);
    const chosenItem = availableItems[Math.floor(Math.random() * availableItems.length)] || pool[0];
    const { emoji: itemEmoji, name: itemName, containerTitle, plateLabel } = chosenItem;

    const childGreeting = pet.childName ? `Bé ${pet.childName}` : 'Bé';

    if (currentLvl <= 3) {
      // LEVEL 1 - 3: Đếm số trực quan (1 đến 5)
      const allCounts = [1, 2, 3, 4, 5].filter((n) => n !== prevQ?.count);
      const count = allCounts[Math.floor(Math.random() * allCounts.length)] || ((prevQ?.count || 1) % 5) + 1;
      
      const otherChoices = [1, 2, 3, 4, 5].filter((n) => n !== count);
      otherChoices.sort(() => Math.random() - 0.5);
      const options = [count, otherChoices[0], otherChoices[1]].sort(() => Math.random() - 0.5);

      return {
        id: `cnt-${Date.now()}-${Math.random()}`,
        level: currentLvl,
        type: 'counting',
        prompt: `${childGreeting} hãy đếm xem có bao nhiêu ${itemName}?`,
        itemEmoji,
        itemName,
        containerLabel: plateLabel,
        containerTitle,
        count,
        options,
        correctAnswer: count,
      };
    } else if (currentLvl <= 6) {
      // LEVEL 4 - 6: So sánh Nhiều hơn / Ít hơn
      let countA = Math.floor(Math.random() * 4) + 1; // 1 to 4
      let countB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      if (countA === countB) {
        countB = countA === 4 ? 2 : countA + 1;
      }
      const targetComparison: 'more' | 'less' = prevQ?.targetComparison === 'more' ? 'less' : 'more';
      const correctPlate: 'A' | 'B' = targetComparison === 'more' 
        ? (countA > countB ? 'A' : 'B')
        : (countA < countB ? 'A' : 'B');

      const comparisonText = targetComparison === 'more' ? 'NHIỀU HƠN' : 'ÍT HƠN';
      const containerQuestionWord = plateLabel === 'KHAY' ? 'Khay nào' : plateLabel === 'HỘP' ? 'Hộp nào' : 'Đĩa nào';

      return {
        id: `cmp-${Date.now()}-${Math.random()}`,
        level: currentLvl,
        type: 'comparison',
        prompt: `${childGreeting} hãy tìm xem ${containerQuestionWord.toLowerCase()} có ${comparisonText} ${itemName} hơn nhé?`,
        itemEmoji,
        itemName,
        containerLabel: plateLabel,
        containerTitle,
        targetComparison,
        correctPlate,
        plateA: { count: countA, items: Array(countA).fill(itemEmoji) },
        plateB: { count: countB, items: Array(countB).fill(itemEmoji) },
      };
    } else {
      // LEVEL 7 - 10+: Phép cộng trực quan trong phạm vi 5 hoặc 10
      let addendA = Math.floor(Math.random() * 3) + 1;
      const maxB = currentLvl >= 9 ? 4 : 5 - addendA;
      let addendB = Math.floor(Math.random() * maxB) + 1;
      
      if (prevQ && prevQ.type === 'addition') {
        if (addendA === prevQ.addendA && addendB === prevQ.addendB) {
          addendA = addendA === 1 ? 2 : 1;
          addendB = 3;
        }
      }

      const sum = addendA + addendB;
      const otherChoices = [sum - 1, sum + 1, sum + 2].filter((n) => n > 0 && n !== sum);
      const options = [sum, otherChoices[0] || sum - 2, otherChoices[1] || sum + 3].sort(() => Math.random() - 0.5);

      return {
        id: `add-${Date.now()}-${Math.random()}`,
        level: currentLvl,
        type: 'addition',
        prompt: `${childGreeting} ơi, có ${addendA} ${itemName} thêm ${addendB} ${itemName}. Có tất cả mấy ${itemName}?`,
        itemEmoji,
        itemName,
        containerLabel: plateLabel,
        containerTitle,
        addendA,
        addendB,
        sum,
        options,
        correctAnswer: sum,
      };
    }
  };

  // Initialize first question on mount or target change
  useEffect(() => {
    setActiveTarget(questTarget);
    const startLvl = questTarget === 'costume'
      ? Math.max(4, Math.min(8, pet.level + 1))
      : Math.min(10, Math.max(1, pet.level));
    setLevel(startLvl);
    const q = generateQuestion(startLvl, null, questTarget);
    setQuestion(q);
    setCountedIndices([]);
    setFeedbackState('idle');
    setSelectedOption(null);
  }, [questTarget, targetCostumeId]);

  // Switch quest target dynamically
  const handleSwitchTarget = (newTarget: QuestTarget) => {
    playPopSound();
    setActiveTarget(newTarget);
    const newQ = generateQuestion(level, null, newTarget);
    setQuestion(newQ);
    setCountedIndices([]);
    setFeedbackState('idle');
    setSelectedOption(null);
  };

  // Handle touching individual items to count along
  const handleTouchItem = (index: number) => {
    playPopSound();
    if (!countedIndices.includes(index)) {
      setCountedIndices([...countedIndices, index]);
    }
  };

  // Check Answer Handler
  const handleAnswer = (choice: number | 'A' | 'B') => {
    if (!question || feedbackState !== 'idle') return;

    setSelectedOption(choice);

    let isCorrect = false;
    if (question.type === 'comparison') {
      isCorrect = choice === question.correctPlate;
    } else {
      isCorrect = choice === question.correctAnswer;
    }

    if (isCorrect) {
      // CORRECT ANSWER!
      playCelebrationSound();
      setFeedbackState('correct');
      speakGameEvent('correct', pet);

      // Trigger colorful confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#EC4899', '#3B82F6'],
      });

      // STRICT INDEX CALCULATION:
      // Food ONLY increases hunger (+30%)
      // Water ONLY increases thirst (+30%)
      // Costume ONLY unlocks costume
      let newHunger = pet.hunger;
      let newThirst = pet.thirst;
      let newCostumes = [...pet.unlockedCostumes];
      let newEquipped = pet.equippedHat;
      let newCoins = pet.coins;

      if (activeTarget === 'food') {
        newHunger = Math.min(100, pet.hunger + 30);
        newCoins += 10;
      } else if (activeTarget === 'water') {
        newThirst = Math.min(100, pet.thirst + 30);
        newCoins += 10;
      } else if (activeTarget === 'costume' && targetCostumeId) {
        if (!newCostumes.includes(targetCostumeId)) {
          newCostumes.push(targetCostumeId);
        }
        newEquipped = targetCostumeId;

        // Deduct costume price if pet has enough coins
        if (costumeInfo && costumeInfo.price > 0 && pet.coins >= costumeInfo.price) {
          newCoins = Math.max(0, pet.coins - costumeInfo.price);
        }
        newCoins += 10; // Bonus quest reward
      }

      const newExp = pet.exp + 25;
      let newLevel = pet.level;
      let newMaxExp = pet.maxExp;
      if (newExp >= pet.maxExp) {
        newLevel += 1;
        newMaxExp = pet.maxExp + 50;
      }

      const updatedPet: PetState = {
        ...pet,
        hunger: newHunger,
        thirst: newThirst,
        happiness: 100,
        coins: newCoins,
        stars: pet.stars + 1,
        exp: newExp >= pet.maxExp ? newExp - pet.maxExp : newExp,
        level: newLevel,
        stage: newLevel >= 8 ? 'master' : newLevel >= 4 ? 'junior' : 'baby',
        maxExp: newMaxExp,
        unlockedCostumes: newCostumes,
        equippedHat: newEquipped,
      };

      // Immediately persist update
      onUpdatePet(updatedPet);
    } else {
      // WRONG ANSWER: NO PENALTY! Gentle encouraging response
      playEncouragingSound();
      setFeedbackState('wrong');
      speakGameEvent('wrong', pet);

      setTimeout(() => {
        setFeedbackState('idle');
        setSelectedOption(null);
      }, 1400);
    }
  };

  // Next Question: ADVANCE TO A STRICTLY DIFFERENT QUESTION OR NEXT LEVEL
  const handleNextQuestion = () => {
    playPopSound();
    
    // Auto advance level to increase difficulty
    const nextLvl = (level % 10) + 1;
    setLevel(nextLvl);

    // Generate a strictly different question
    const newQ = generateQuestion(nextLvl, question, activeTarget);
    setQuestion(newQ);
    setCountedIndices([]);
    setFeedbackState('idle');
    setSelectedOption(null);
  };

  // Return to garden & trigger feeding/drinking animation
  const handleClaimAndReturn = () => {
    playPopSound();
    stopSpeech();
    onFinishAndFeed(activeTarget);
  };

  // Quest title and badge based on target
  const questTitle = activeTarget === 'water'
    ? 'GIẢI TOÁN KIẾM NƯỚC UỐNG'
    : activeTarget === 'costume'
    ? 'THỬ THÁCH MỞ KHÓA TRANG PHỤC'
    : 'GIẢI TOÁN KIẾM THỨC ĂN';

  const questIcon = activeTarget === 'water' ? '🥛' : activeTarget === 'costume' ? '👑' : '🍎';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 via-white to-emerald-50 rounded-3xl md:rounded-[36px] shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className={`px-4 py-3 flex items-center justify-between text-white shadow-md ${
          activeTarget === 'water'
            ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500'
            : activeTarget === 'costume'
            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500'
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500'
        }`}>
          {/* Header Title */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl shadow-inner font-black">
              {questIcon}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm md:text-base leading-tight">
                <span>{questTitle}</span>
                <span className="bg-white/30 text-white px-2 py-0.5 rounded-full text-xs font-black">
                  Cấp {level} / 10
                </span>
              </div>
              <div className="text-[11px] font-bold text-white/90">
                {questTarget === 'water' 
                  ? 'Chỉ tăng Khát Nước khi đúng 💧' 
                  : questTarget === 'costume' 
                  ? `Mở khóa: ${costumeInfo?.name || 'Phụ kiện mới'} 🎁`
                  : 'Chỉ tăng Độ Đói khi đúng 🍎'}
              </div>
            </div>
          </div>

          {/* Right Header Stats & Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1.5 rounded-xl text-xs font-black text-white shadow-xs">
              <Coins className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{pet.coins}</span>
            </div>

            {/* Bật / Tắt âm thanh giọng đọc (Mute / Unmute) */}
            <button
              type="button"
              onClick={handleToggleVoiceMute}
              title={isVoiceMuted ? 'Bật âm thanh giọng đọc' : 'Tắt âm thanh giọng đọc'}
              aria-label={isVoiceMuted ? 'Bật âm thanh giọng đọc' : 'Tắt âm thanh giọng đọc'}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold text-xs ${
                isVoiceMuted
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md ring-2 ring-white/70'
                  : 'bg-white/20 hover:bg-white/30 text-white shadow-xs active:scale-95'
              }`}
            >
              {isVoiceMuted ? (
                <>
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="hidden sm:inline text-[11px] font-black">Tắt tiếng</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="hidden sm:inline text-[11px] font-black">Bật tiếng</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                playPopSound();
                stopSpeech();
                onClose();
              }}
              title="Đóng bài toán"
              aria-label="Đóng bài toán"
              className="p-1.5 sm:p-2 bg-black/15 hover:bg-black/25 text-white rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level Selector Pills */}
        <div className="px-4 py-2 bg-amber-100/70 border-b border-amber-200 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-xs font-bold text-amber-900 whitespace-nowrap mr-1">
            Cấp bài:
          </span>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
            <button
              key={lvl}
              disabled={activeTarget === 'costume' && feedbackState === 'correct'}
              onClick={() => {
                playPopSound();
                setLevel(lvl);
                const q = generateQuestion(lvl, question, activeTarget);
                setQuestion(q);
                setCountedIndices([]);
                setFeedbackState('idle');
                setSelectedOption(null);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                level === lvl
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'bg-white hover:bg-amber-200 text-amber-900 border border-amber-200'
              }`}
            >
              {lvl <= 3 ? `Bài ${lvl} 🍎` : lvl <= 6 ? `Bài ${lvl} ⚖️` : `Bài ${lvl} ➕`}
            </button>
          ))}
        </div>

        {/* Question Area */}
        <div className="p-4 md:p-6 flex-1 flex flex-col items-center justify-between overflow-y-auto">
          {question && (
            <div className="w-full flex flex-col items-center">
              
              {/* Question Banner */}
              <div className="relative mb-4 bg-white px-5 py-3 rounded-2xl border-3 border-amber-300 shadow-sm text-center max-w-lg flex items-center justify-center gap-2.5">
                <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800">
                  {question.prompt}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    if (isVoiceMuted) {
                      handleToggleVoiceMute();
                    } else {
                      speakVietnamese(question.prompt);
                    }
                  }}
                  title={isVoiceMuted ? 'Đang tắt tiếng - Bấm để bật và nghe câu hỏi' : 'Bé bấm để nghe đọc lại câu hỏi'}
                  aria-label={isVoiceMuted ? 'Đang tắt tiếng - Bấm để bật và nghe câu hỏi' : 'Bé bấm để nghe đọc lại câu hỏi'}
                  className={`p-2 rounded-xl active:scale-90 transition-transform flex-shrink-0 cursor-pointer shadow-xs border flex items-center gap-1.5 ${
                    isVoiceMuted
                      ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-300'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200/80'
                  }`}
                >
                  {isVoiceMuted ? (
                    <>
                      <VolumeX className="w-5 h-5 text-rose-600" />
                      <span className="text-[11px] font-black hidden sm:inline">Bật đọc</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 text-amber-700" />
                      <span className="text-[11px] font-black hidden sm:inline">Đọc lại</span>
                    </>
                  )}
                </button>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-3 border-amber-300 rotate-45" />
              </div>

              {/* QUESTION VISUAL 1: COUNTING */}
              {question.type === 'counting' && (
                <div className="w-full max-w-md my-2 flex flex-col items-center">
                  <div className="relative w-full bg-gradient-to-b from-amber-100 to-amber-200 rounded-3xl p-5 border-4 border-amber-400 shadow-inner flex flex-wrap items-center justify-center gap-4 min-h-[140px]">
                    <div className="absolute top-2 left-3 text-[11px] font-bold text-amber-800">
                      {activeTarget === 'water' ? '🥤' : activeTarget === 'costume' ? '🎁' : '🧺'}{' '}
                      {question.containerTitle} của bạn {pet.name} (Chạm vào từng món để đếm):
                    </div>

                    {Array.from({ length: question.count || 1 }).map((_, idx) => {
                      const isCounted = countedIndices.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleTouchItem(idx)}
                          className={`relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 ${
                            isCounted ? 'scale-105' : ''
                          }`}
                        >
                          <span className="text-5xl sm:text-6xl filter drop-shadow-md select-none">
                            {question.itemEmoji}
                          </span>
                          {isCounted && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-md animate-bounce">
                              {countedIndices.indexOf(idx) + 1}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION VISUAL 2: COMPARISON */}
              {question.type === 'comparison' && (
                <div className="w-full max-w-lg my-2 grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Plate / Tray A */}
                  <button
                    onClick={() => handleAnswer('A')}
                    disabled={feedbackState === 'correct'}
                    className={`relative p-4 rounded-3xl border-4 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                      selectedOption === 'A' && feedbackState === 'correct'
                        ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300 scale-105 shadow-xl'
                        : selectedOption === 'A' && feedbackState === 'wrong'
                        ? 'bg-rose-50 border-rose-400 animate-wiggle'
                        : 'bg-white hover:bg-amber-50/60 border-amber-300 hover:border-amber-400 shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="text-xs font-black text-amber-900 mb-2 px-2.5 py-0.5 rounded-full bg-amber-200/60">
                      {question.containerLabel || 'ĐĨA'} A
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 min-h-[90px]">
                      {question.plateA?.items.map((emoji, i) => (
                        <span key={i} className="text-4xl sm:text-5xl filter drop-shadow-xs">
                          {emoji}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-2">
                      ({question.plateA?.count} {question.itemName})
                    </div>
                  </button>

                  {/* Plate / Tray B */}
                  <button
                    onClick={() => handleAnswer('B')}
                    disabled={feedbackState === 'correct'}
                    className={`relative p-4 rounded-3xl border-4 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                      selectedOption === 'B' && feedbackState === 'correct'
                        ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300 scale-105 shadow-xl'
                        : selectedOption === 'B' && feedbackState === 'wrong'
                        ? 'bg-rose-50 border-rose-400 animate-wiggle'
                        : 'bg-white hover:bg-amber-50/60 border-amber-300 hover:border-amber-400 shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="text-xs font-black text-amber-900 mb-2 px-2.5 py-0.5 rounded-full bg-amber-200/60">
                      {question.containerLabel || 'ĐĨA'} B
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 min-h-[90px]">
                      {question.plateB?.items.map((emoji, i) => (
                        <span key={i} className="text-4xl sm:text-5xl filter drop-shadow-xs">
                          {emoji}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-2">
                      ({question.plateB?.count} {question.itemName})
                    </div>
                  </button>
                </div>
              )}

              {/* QUESTION VISUAL 3: ADDITION */}
              {question.type === 'addition' && (
                <div className="w-full max-w-lg my-2 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-3xl p-4 border-3 border-amber-300 shadow-sm flex items-center justify-around gap-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 min-h-[50px]">
                        {Array.from({ length: question.addendA || 1 }).map((_, i) => (
                          <span key={i} className="text-3xl sm:text-4xl">{question.itemEmoji}</span>
                        ))}
                      </div>
                      <span className="text-xl font-black text-amber-900 mt-1">{question.addendA}</span>
                    </div>

                    <div className="text-3xl font-black text-amber-500">+</div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 min-h-[50px]">
                        {Array.from({ length: question.addendB || 1 }).map((_, i) => (
                          <span key={i} className="text-3xl sm:text-4xl">{question.itemEmoji}</span>
                        ))}
                      </div>
                      <span className="text-xl font-black text-amber-900 mt-1">{question.addendB}</span>
                    </div>

                    <div className="text-3xl font-black text-amber-500">=</div>

                    <div className="w-14 h-14 rounded-2xl bg-amber-200 border-3 border-dashed border-amber-400 flex items-center justify-center text-2xl font-black text-amber-800 shadow-inner animate-pulse">
                      ?
                    </div>
                  </div>
                </div>
              )}

              {/* CHOICES */}
              {question.options && question.type !== 'comparison' && (
                <div className="w-full max-w-md my-4">
                  <div className="text-center text-xs font-bold text-slate-500 mb-2">
                    Bé chọn đáp án đúng nhé:
                  </div>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {question.options.map((num) => {
                      const isSelected = selectedOption === num;
                      const isCorrect = isSelected && feedbackState === 'correct';
                      const isWrong = isSelected && feedbackState === 'wrong';

                      return (
                        <button
                          key={num}
                          onClick={() => handleAnswer(num)}
                          disabled={feedbackState === 'correct'}
                          className={`py-4 sm:py-5 rounded-2xl md:rounded-3xl font-black text-3xl sm:text-4xl transition-all duration-200 cursor-pointer shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-none ${
                            isCorrect
                              ? 'bg-emerald-500 text-white shadow-[0_6px_0_#15803d] scale-105'
                              : isWrong
                              ? 'bg-rose-400 text-white shadow-[0_6px_0_#be123c] animate-wiggle'
                              : 'bg-amber-400 hover:bg-amber-300 text-amber-950 hover:-translate-y-1'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FEEDBACK STATUS DRAWER */}
          {feedbackState === 'correct' && (
            <div className="w-full max-w-md bg-emerald-100/90 border-3 border-emerald-400 rounded-3xl p-4 my-2 text-center animate-fade-in shadow-md">
              <div className="flex items-center justify-center gap-2 text-emerald-900 font-black text-lg md:text-xl">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 fill-emerald-100" />
                <span>CHÍNH XÁC RỒI! {pet.childName ? `BÉ ${pet.childName.toUpperCase()}` : 'BÉ'} GIỎI QUÁ! ⭐</span>
              </div>
              
              {/* Rewards Claimed specifically for target */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 my-2.5 text-xs sm:text-sm font-bold text-emerald-950">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl shadow-xs">
                  {activeTarget === 'water' && <span>💧 +30% Khát Nước</span>}
                  {activeTarget === 'food' && <span>🍲 +30% Độ No Bụng</span>}
                  {activeTarget === 'costume' && <span>👑 Đã mở khóa vào Tủ Đồ!</span>}
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl shadow-xs">
                  <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>+10 Xu</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl shadow-xs text-amber-700">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                  <span>+25 EXP</span>
                </div>
              </div>

              {activeTarget === 'costume' && costumeInfo && (
                <div className="bg-purple-100/90 border-2 border-purple-300 rounded-2xl p-2.5 my-2 text-center text-xs sm:text-sm font-black text-purple-900 flex items-center justify-center gap-2">
                  <span className="text-2xl">{costumeInfo.icon}</span>
                  <span>
                    🎉 XUẤT SẮC! ĐÃ MỞ KHÓA THÀNH CÔNG:{' '}
                    <span className="text-purple-700">{costumeInfo.name.toUpperCase()}</span>!
                    {costumeInfo.price > 0 && ` (Đã dùng ${costumeInfo.price} Xu)`}
                  </span>
                </div>
              )}

              {/* Special Stat completion notices */}
              {pet.hunger >= 100 && pet.thirst >= 100 ? (
                <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-2 border-amber-400 rounded-2xl p-3 my-2 text-xs sm:text-sm font-black text-amber-950 text-center animate-bounce shadow-xs">
                  👑 CẢ 2 CHỈ SỐ ĐỀU ĐÃ ĐẠT 100%! {pet.childName ? `BÉ ${pet.childName.toUpperCase()}` : 'BÉ'} ĐÃ CHĂM SÓC BẠN {pet.name.toUpperCase()} LỚN KHÔN RỒI!
                </div>
              ) : activeTarget === 'food' && pet.hunger >= 100 && pet.thirst < 100 ? (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-2.5 my-2 text-xs font-bold text-amber-900 text-center shadow-xs">
                  😋 "{pet.childName ? `Bé ${pet.childName}` : 'Bé'} ơi, <span className="font-black text-amber-700">{pet.name}</span> đã ăn no (100%) rồi! Giờ hãy cho bạn ấy uống nước nhé (Khát nước hiện tại: <span className="font-black text-sky-700">{pet.thirst}%</span>)!"
                </div>
              ) : activeTarget === 'water' && pet.thirst >= 100 && pet.hunger < 100 ? (
                <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-2.5 my-2 text-xs font-bold text-sky-900 text-center shadow-xs">
                  🥤 "{pet.childName ? `Bé ${pet.childName}` : 'Bé'} ơi, <span className="font-black text-sky-700">{pet.name}</span> đã uống no nước (100%) rồi! Giờ hãy cho bạn ấy ăn thức ăn nhé (Độ no hiện tại: <span className="font-black text-amber-700">{pet.hunger}%</span>)!"
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-2">
                {activeTarget === 'costume' ? (
                  <button onClick={handleClaimAndReturn} className="w-full py-4 px-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-base rounded-2xl shadow-md">
                    🏡 VỀ SÂN VƯỜN NGẮM THÚ CƯNG
                  </button>
                ) : pet.hunger >= 100 && pet.thirst >= 100 ? (
                  <button
                    onClick={handleClaimAndReturn}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-purple-500 to-pink-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    <span>👑 VỀ SÂN VƯỜN TIẾN HÓA NGAY!</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : activeTarget === 'food' && pet.hunger >= 100 && pet.thirst < 100 ? (
                  <>
                    <button
                      onClick={() => handleSwitchTarget('water')}
                      className="w-full sm:w-auto flex-1 py-3 px-4 bg-sky-500 hover:bg-sky-400 text-white font-black text-sm md:text-base rounded-2xl shadow-[0_4px_0_#0284c7] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <span className="text-xl">🥛</span>
                      <span>GIẢI TOÁN KIẾM NƯỚC</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleClaimAndReturn}
                      className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl cursor-pointer"
                    >
                      🏡 Về Sân Vườn
                    </button>
                  </>
                ) : activeTarget === 'water' && pet.thirst >= 100 && pet.hunger < 100 ? (
                  <>
                    <button
                      onClick={() => handleSwitchTarget('food')}
                      className="w-full sm:w-auto flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-white font-black text-sm md:text-base rounded-2xl shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <span className="text-xl">🍎</span>
                      <span>GIẢI TOÁN KIẾM TÁO</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleClaimAndReturn}
                      className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl cursor-pointer"
                    >
                      🏡 Về Sân Vườn
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleNextQuestion}
                      className="w-full sm:w-auto flex-1 py-3 px-4 bg-sky-500 hover:bg-sky-400 text-white font-black text-sm md:text-base rounded-2xl shadow-[0_4px_0_#0369a1] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>CÂU TIẾP THEO</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleClaimAndReturn}
                      className="w-full sm:w-auto flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm md:text-base rounded-2xl shadow-[0_4px_0_#15803d] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🏡 VỀ SÂN VƯỜN</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* WRONG ENCOURAGEMENT */}
          {feedbackState === 'wrong' && (
            <div className="w-full max-w-md bg-amber-100/90 border-2 border-amber-300 rounded-2xl p-3 my-2 text-center animate-wiggle">
              <div className="text-amber-900 font-black text-sm md:text-base flex items-center justify-center gap-2">
                <span className="text-xl">🐾</span>
                <span>{pet.childName ? `Bé ${pet.childName}` : 'Bé'} thử đếm lại xem nào! ({pet.name} tin bạn làm được!)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-amber-50/80 px-4 py-2 border-t border-amber-200 text-center text-[11px] font-bold text-emerald-950 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
          <span>🐾 Nuôi Thú Học Toán · Rèn luyện tư duy số học</span>
          <span className="font-extrabold text-emerald-900">Bản quyền thuộc về HoangMy@2026</span>
        </div>
      </div>
    </div>
  );
};
