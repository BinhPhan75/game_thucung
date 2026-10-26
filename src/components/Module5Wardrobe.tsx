/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Coins, 
  Check, 
  Shirt, 
  Star, 
  Lock, 
  Crown,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { PetState, CostumeItem } from '../types/game';
import { PetAvatar } from './PetAvatar';
import { COSTUME_LIST } from '../data/costumes';
import { playPopSound, playChimeSound } from '../utils/audio';

interface Module5WardrobeProps {
  pet: PetState;
  onUpdatePet: (updatedPet: PetState) => void;
  onClose: () => void;
  onTriggerCostumeQuest: (costumeId: string) => void;
  onEarnCoinsQuest?: () => void;
}

export const Module5Wardrobe: React.FC<Module5WardrobeProps> = ({
  pet,
  onUpdatePet,
  onClose,
  onTriggerCostumeQuest,
  onEarnCoinsQuest,
}) => {
  const [notEnoughCoinsItem, setNotEnoughCoinsItem] = useState<CostumeItem | null>(null);

  // Equip or un-equip costume
  const handleEquip = (costumeId: string) => {
    playChimeSound();
    const isCurrentlyEquipped = pet.equippedHat === costumeId;
    const updated: PetState = {
      ...pet,
      equippedHat: isCurrentlyEquipped ? undefined : costumeId,
    };
    onUpdatePet(updated);
  };

  // When clicking on a locked costume item
  const handleSelectLockedItem = (item: CostumeItem) => {
    playPopSound();
    if (pet.coins >= item.price) {
      // Bé có đủ Xu -> Mở Thử Thách Thời Trang (giải toán để mở khóa)
      onTriggerCostumeQuest(item.id);
    } else {
      // Bé chưa đủ Xu -> Bật popup hướng dẫn giải toán tích lũy Xu
      setNotEnoughCoinsItem(item);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-purple-50 via-white to-pink-50 rounded-3xl md:rounded-[36px] shadow-2xl border-4 border-purple-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 px-5 py-3.5 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner font-black">
              👗
            </div>
            <div>
              <h2 className="font-black text-base md:text-lg leading-tight flex items-center gap-2">
                <span>TỦ ĐỒ & CỬA HÀNG THỜI TRANG</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  Bé 4-5 tuổi
                </span>
              </h2>
              <p className="text-xs text-purple-100 font-semibold">
                Giải toán thử thách thời trang để mở khóa trang phục cho bạn {pet.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Coins Balance */}
            <div className="flex items-center gap-1.5 bg-white/25 backdrop-blur-xs px-3 py-1 rounded-xl font-black text-xs md:text-sm shadow-inner">
              <Coins className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{pet.coins} Xu</span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="p-1.5 bg-black/10 hover:bg-black/20 rounded-xl transition-all cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Pet Preview, Right Item Grid */}
        <div className="p-4 md:p-6 flex-1 flex flex-col md:flex-row items-center gap-6 overflow-y-auto">
          
          {/* Left Column: Pet Fitting Room */}
          <div className="w-full md:w-5/12 flex flex-col items-center bg-purple-100/60 rounded-3xl p-4 border-2 border-purple-200 shadow-inner">
            <div className="text-xs font-black text-purple-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>PHÒNG THỬ ĐỒ CỦA {pet.name.toUpperCase()}</span>
            </div>
            
            {/* Avatar Preview with Equipped Hat */}
            <div className="relative my-2 w-44 h-44 flex items-center justify-center">
              <PetAvatar
                type={pet.type}
                stage={pet.stage}
                size="lg"
                equippedHat={pet.equippedHat}
              />
            </div>

            {/* Current Equipped Status */}
            <div className="text-center mt-2">
              {pet.equippedHat ? (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    Đang diện: <span className="text-purple-700 font-black">{COSTUME_LIST.find((c) => c.id === pet.equippedHat)?.name}</span>
                  </span>
                  <button
                    onClick={() => handleEquip(pet.equippedHat!)}
                    className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100 cursor-pointer shadow-xs transition-colors"
                  >
                    Tháo ra cất tủ
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-500">
                  Chưa đội nón hoặc phụ kiện nào
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Wardrobe & Shop Grid */}
          <div className="w-full md:w-7/12 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-purple-600" />
                <span>Bộ Sưu Tập Phụ Kiện ({pet.unlockedCostumes.length}/{COSTUME_LIST.length})</span>
              </span>
              <span className="text-[11px] font-bold text-purple-700">
                ⭐ Bắt buộc giải toán để mở khóa
              </span>
            </div>

            {/* Grid of Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {COSTUME_LIST.map((item) => {
                const isUnlocked = pet.unlockedCostumes.includes(item.id);
                const isEquipped = pet.equippedHat === item.id;
                const canAfford = pet.coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-300 shadow-sm'
                        : isUnlocked
                        ? 'bg-white border-slate-200 hover:border-purple-300 shadow-xs'
                        : 'bg-slate-50/90 border-slate-200'
                    }`}
                  >
                    {/* Item Icon & Details */}
                    <div 
                      onClick={() => !isUnlocked && handleSelectLockedItem(item)}
                      className={`flex items-center gap-2.5 min-w-0 ${!isUnlocked ? 'cursor-pointer' : ''}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0 relative ${
                        isUnlocked ? 'bg-purple-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {item.icon}
                        {!isUnlocked && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-xs">
                            <Lock className="w-3 h-3 text-amber-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-800 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {item.description}
                        </p>
                        {!isUnlocked && (
                          <div className="flex items-center gap-1 text-[11px] font-black text-amber-700 mt-0.5">
                            <Coins className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{item.price} Xu</span>
                            {canAfford ? (
                              <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded font-bold">
                                Đủ Xu
                              </span>
                            ) : (
                              <span className="text-[9px] text-rose-600 bg-rose-50 px-1 rounded font-bold">
                                Thiếu {item.price - pet.coins}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button: BẮT BUỘC GIẢI TOÁN ĐỂ MỞ KHÓA */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {isUnlocked ? (
                        <button
                          onClick={() => handleEquip(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                            isEquipped
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-900'
                          }`}
                        >
                          {isEquipped ? 'Đang Mặc' : 'Mặc Vào'}
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          {canAfford ? (
                            /* Bé có đủ Xu: Bấm nút để bật THỬ THÁCH THỜI TRANG (GIẢI TOÁN) */
                            <button
                              onClick={() => {
                                playPopSound();
                                onTriggerCostumeQuest(item.id);
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-[11px] font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 shadow-[0_2px_0_#b45309] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 cursor-pointer animate-pulse"
                              title="Giải đúng toán để mở khóa trang phục"
                            >
                              <Crown className="w-3.5 h-3.5 fill-amber-900 text-amber-950" />
                              <span>Thử Thách</span>
                            </button>
                          ) : (
                            /* Bé chưa đủ Xu: Nút khóa, hướng dẫn giải toán kiếm xu */
                            <button
                              onClick={() => {
                                playPopSound();
                                setNotEnoughCoinsItem(item);
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-[11px] font-black bg-slate-200 hover:bg-slate-300 text-slate-600 transition-all flex items-center gap-1 cursor-pointer"
                              title="Chưa đủ Xu, bấm để xem cách kiếm thêm Xu"
                            >
                              <Lock className="w-3 h-3 text-slate-500" />
                              <span>Cần {item.price} Xu</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              playPopSound();
                              if (canAfford) {
                                onTriggerCostumeQuest(item.id);
                              } else {
                                setNotEnoughCoinsItem(item);
                              }
                            }}
                            className="text-[9px] font-bold text-purple-700 hover:underline cursor-pointer"
                          >
                            {canAfford ? '📝 Cần giải đúng toán' : '💡 Học toán kiếm Xu'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-purple-50/80 border-t border-purple-200 flex items-center justify-between text-xs font-bold text-purple-900">
          <span className="flex items-center gap-1.5">
            <span>👑 Tủ đồ thời trang: Mọi trang phục đều cần bé thể hiện tài năng giải toán để mở khóa!</span>
          </span>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl cursor-pointer shadow-xs"
          >
            Đóng Tủ Đồ
          </button>
        </div>
      </div>

      {/* POPUP HƯỚNG DẪN KHI BÉ CHƯA ĐỦ XU */}
      {notEnoughCoinsItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-4 border-amber-400 text-center relative">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner border border-amber-300 mb-2">
              🪙
            </div>
            
            <h3 className="text-lg font-black text-amber-950">
              BÉ CẦN THÊM XU VÀNG!
            </h3>
            
            <p className="text-xs font-semibold text-slate-600 mt-2 leading-relaxed">
              Trang phục <span className="font-black text-purple-700">{notEnoughCoinsItem.name}</span> cần{' '}
              <span className="font-black text-amber-700">{notEnoughCoinsItem.price} Xu</span> để tham gia Thử Thách Thời Trang.
            </p>

            <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 my-3">
              Hiện tại bé đang có: <span className="font-black text-amber-600">{pet.coins} Xu</span><br/>
              Bé cần thêm: <span className="font-black text-rose-600">{notEnoughCoinsItem.price - pet.coins} Xu</span> nữa!
            </div>

            <p className="text-[11px] text-slate-500 font-medium mb-3">
              💡 Hãy giải toán kiếm thức ăn hoặc nước uống ở Sân Vườn để nhận +10 Xu mỗi câu đúng nhé!
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playPopSound();
                  setNotEnoughCoinsItem(null);
                  if (onEarnCoinsQuest) {
                    onEarnCoinsQuest();
                  } else {
                    onClose();
                  }
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs rounded-xl shadow-[0_3px_0_#15803d] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-1"
              >
                <span>HỌC TOÁN KIẾM XU 🍎</span>
              </button>

              <button
                onClick={() => {
                  playPopSound();
                  setNotEnoughCoinsItem(null);
                }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Để Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
