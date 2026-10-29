/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { COSTUME_LIST } from '../data/costumes';
import { PetType, PetStage } from '../types/game';

interface PetAvatarProps {
  type: PetType;
  stage?: PetStage;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  mood?: 'happy' | 'excited' | 'idle' | 'hungry' | 'sleepy';
  equippedHat?: string;
  equippedOutfit?: string;
  className?: string;
  onClick?: () => void;
}

export const PetAvatar: React.FC<PetAvatarProps> = ({
  type,
  stage = 'baby',
  size = 'lg',
  animate = true,
  mood = 'happy',
  equippedHat,
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64 md:w-72 md:h-72',
  }[size];

  // Scale factor based on evolution stage (Module 4 readiness)
  const stageScale = stage === 'baby' ? 'scale-90' : stage === 'junior' ? 'scale-100' : 'scale-110';

  const handleClick = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer transition-transform duration-300 ${sizeClasses} ${className} ${
        animate ? 'hover:scale-105 active:scale-95' : ''
      } ${isTapped ? 'animate-bounce' : ''}`}
    >
      <div className={`w-full h-full relative transition-all duration-300 ${stageScale}`}>
        {/* Shadow underneath */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-amber-900/15 rounded-full blur-[2px]" />

        {type === 'dog' && (
          <DogIllustration
            mood={mood}
            isHovered={isHovered}
            isTapped={isTapped}
            equippedHat={equippedHat}
          />
        )}

        {type === 'cat' && (
          <CatIllustration
            mood={mood}
            isHovered={isHovered}
            isTapped={isTapped}
            equippedHat={equippedHat}
          />
        )}

        {type === 'bunny' && (
          <BunnyIllustration
            mood={mood}
            isHovered={isHovered}
            isTapped={isTapped}
            equippedHat={equippedHat}
          />
        )}
      </div>
    </div>
  );
};

// DOG SVG ILLUSTRATION (Cún Vàng Vui Vẻ)
const DogIllustration: React.FC<{
  mood: string;
  isHovered: boolean;
  isTapped: boolean;
  equippedHat?: string;
}> = ({ isHovered, isTapped, equippedHat }) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Dog Tail Wag */}
      <g className={isHovered || isTapped ? 'origin-[155px_135px] animate-[wiggle_0.4s_ease-in-out_infinite]' : 'origin-[155px_135px]'}>
        <path
          d="M 140 135 C 165 125, 180 100, 175 80 C 170 85, 155 105, 138 125 Z"
          fill="#E59834"
          stroke="#B46E1B"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Tail tip white spot */}
        <path
          d="M 175 80 C 173 85, 168 95, 160 105 C 168 95, 172 88, 175 80 Z"
          fill="#FFF4E0"
        />
      </g>

      {/* Floppy Left Ear */}
      <g className={isHovered ? 'origin-[45px_60px] animate-[wiggle_0.6s_ease-in-out_infinite]' : ''}>
        <path
          d="M 52 65 C 30 70, 20 105, 35 125 C 45 135, 60 120, 58 95 Z"
          fill="#C47318"
          stroke="#944F07"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 46 80 C 35 90, 32 105, 42 115 C 48 118, 52 110, 50 95 Z"
          fill="#DE8C33"
        />
      </g>

      {/* Floppy Right Ear */}
      <g className={isHovered ? 'origin-[155px_60px] animate-[wiggle_0.6s_ease-in-out_infinite_reverse]' : ''}>
        <path
          d="M 148 65 C 170 70, 180 105, 165 125 C 155 135, 140 120, 142 95 Z"
          fill="#C47318"
          stroke="#944F07"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 154 80 C 165 90, 168 105, 158 115 C 152 118, 148 110, 150 95 Z"
          fill="#DE8C33"
        />
      </g>

      {/* Dog Chubby Body */}
      <ellipse
        cx="100"
        cy="142"
        rx="46"
        ry="42"
        fill="#F6B853"
        stroke="#B46E1B"
        strokeWidth="3.5"
      />
      {/* Dog Chest Belly White Fur */}
      <ellipse cx="100" cy="145" rx="26" ry="26" fill="#FFF8EB" />

      {/* Dog Back Paws */}
      <ellipse cx="64" cy="172" rx="15" ry="9" fill="#F6B853" stroke="#B46E1B" strokeWidth="3" />
      <ellipse cx="136" cy="172" rx="15" ry="9" fill="#F6B853" stroke="#B46E1B" strokeWidth="3" />

      {/* Dog Front Paws */}
      <ellipse cx="84" cy="174" rx="14" ry="10" fill="#FFF8EB" stroke="#B46E1B" strokeWidth="3" />
      <ellipse cx="116" cy="174" rx="14" ry="10" fill="#FFF8EB" stroke="#B46E1B" strokeWidth="3" />
      {/* Toe lines */}
      <line x1="80" y1="172" x2="80" y2="180" stroke="#B46E1B" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="172" x2="88" y2="180" stroke="#B46E1B" strokeWidth="2" strokeLinecap="round" />
      <line x1="112" y1="172" x2="112" y2="180" stroke="#B46E1B" strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="172" x2="120" y2="180" stroke="#B46E1B" strokeWidth="2" strokeLinecap="round" />

      {/* Red Collar with Golden Bell */}
      <path
        d="M 68 122 Q 100 134 132 122 Q 100 140 68 122 Z"
        fill="#EF4444"
        stroke="#B91C1C"
        strokeWidth="2.5"
      />
      {/* Golden Bell / Star */}
      <circle cx="100" cy="133" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
      <circle cx="100" cy="133" r="2.5" fill="#78350F" />

      {/* Dog Head */}
      <ellipse
        cx="100"
        cy="86"
        rx="48"
        ry="42"
        fill="#F6B853"
        stroke="#B46E1B"
        strokeWidth="3.5"
      />

      {/* Dog Eye Patch (Cute unique spot on left eye) */}
      <path
        d="M 66 68 C 60 78, 62 94, 76 96 C 88 98, 92 82, 86 70 C 80 58, 68 60, 66 68 Z"
        fill="#E59834"
      />

      {/* Snout White Background */}
      <ellipse cx="100" cy="98" rx="25" ry="18" fill="#FFF8EB" stroke="#B46E1B" strokeWidth="2" />

      {/* Big Sparkling Cartoon Eyes */}
      <g className="fairy-pet-eyes">
      {/* Left Eye */}
      <ellipse cx="76" cy="80" rx="9" ry="11" fill="#2E1B0F" />
      <circle cx="73" cy="76" r="3.5" fill="#FFFFFF" />
      <circle cx="78" cy="84" r="1.5" fill="#FFFFFF" />

      {/* Right Eye */}
      <ellipse cx="124" cy="80" rx="9" ry="11" fill="#2E1B0F" />
      <circle cx="121" cy="76" r="3.5" fill="#FFFFFF" />
      <circle cx="126" cy="84" r="1.5" fill="#FFFFFF" />

      </g>
      {/* Rosy Cheeks Blush */}
      <ellipse cx="62" cy="96" rx="8" ry="5" fill="#FDA4AF" opacity="0.8" />
      <ellipse cx="138" cy="96" rx="8" ry="5" fill="#FDA4AF" opacity="0.8" />

      {/* Cute Black Button Nose */}
      <path
        d="M 94 92 C 94 90, 106 90, 106 92 C 107 96, 103 100, 100 100 C 97 100, 93 96, 94 92 Z"
        fill="#1F2937"
      />
      <ellipse cx="98" cy="93" rx="2" ry="1" fill="#FFFFFF" opacity="0.6" />

      {/* Happy Smile & Tongue */}
      <path
        d="M 92 101 Q 100 107 108 101"
        fill="none"
        stroke="#2E1B0F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Little Pink Tongue */}
      <path
        d="M 97 103 Q 100 114 103 103 Z"
        fill="#F472B6"
        stroke="#DB2777"
        strokeWidth="1.5"
      />

      {/* Eyebrows */}
      <path d="M 68 66 Q 76 62 82 66" fill="none" stroke="#8A4A0A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 118 66 Q 124 62 132 66" fill="none" stroke="#8A4A0A" strokeWidth="2.5" strokeLinecap="round" />

      {/* Hat Overlay if equipped */}
      {equippedHat && <HatOverlay hatId={equippedHat} />}
    </svg>
  );
};

// CAT SVG ILLUSTRATION (Miu Miu Điệu Đà)
const CatIllustration: React.FC<{
  mood: string;
  isHovered: boolean;
  isTapped: boolean;
  equippedHat?: string;
}> = ({ isHovered, isTapped, equippedHat }) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Cat Tail with Ribbon/Wiggle */}
      <g className={isHovered || isTapped ? 'origin-[155px_135px] animate-[wiggle_0.5s_ease-in-out_infinite]' : 'origin-[155px_135px]'}>
        <path
          d="M 142 140 C 170 145, 190 120, 180 85 C 175 75, 165 80, 170 95 C 175 115, 155 130, 138 132 Z"
          fill="#FB923C"
          stroke="#C2410C"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Tail stripes */}
        <path d="M 172 105 C 177 107, 178 112, 170 116" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Cat Pointy Ears */}
      {/* Left Ear */}
      <g className={isHovered ? 'origin-[50px_60px] animate-[wiggle_0.5s_ease-in-out_infinite]' : ''}>
        <polygon
          points="52,70 40,24 82,48"
          fill="#FB923C"
          stroke="#C2410C"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <polygon points="54,64 47,35 74,50" fill="#FBCFE8" />
      </g>

      {/* Right Ear */}
      <g className={isHovered ? 'origin-[150px_60px] animate-[wiggle_0.5s_ease-in-out_infinite_reverse]' : ''}>
        <polygon
          points="148,70 160,24 118,48"
          fill="#FB923C"
          stroke="#C2410C"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <polygon points="146,64 153,35 126,50" fill="#FBCFE8" />
      </g>

      {/* Cat Body */}
      <ellipse
        cx="100"
        cy="142"
        rx="44"
        ry="40"
        fill="#FDBA74"
        stroke="#C2410C"
        strokeWidth="3.5"
      />
      {/* White Chest */}
      <ellipse cx="100" cy="144" rx="25" ry="25" fill="#FFF7ED" />

      {/* Back Paws */}
      <ellipse cx="65" cy="172" rx="14" ry="9" fill="#FDBA74" stroke="#C2410C" strokeWidth="3" />
      <ellipse cx="135" cy="172" rx="14" ry="9" fill="#FDBA74" stroke="#C2410C" strokeWidth="3" />

      {/* Front Paws White Socks */}
      <ellipse cx="85" cy="174" rx="13" ry="9" fill="#FFF7ED" stroke="#C2410C" strokeWidth="3" />
      <ellipse cx="115" cy="174" rx="13" ry="9" fill="#FFF7ED" stroke="#C2410C" strokeWidth="3" />

      {/* Cute Pink Ribbon / Bowtie Collar */}
      <path
        d="M 68 122 Q 100 134 132 122 Q 100 140 68 122 Z"
        fill="#EC4899"
        stroke="#BE185D"
        strokeWidth="2.5"
      />
      {/* Bowtie Center */}
      <circle cx="100" cy="131" r="5" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
      <path d="M 95 131 L 86 126 L 86 136 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
      <path d="M 105 131 L 114 126 L 114 136 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />

      {/* Cat Head */}
      <ellipse
        cx="100"
        cy="86"
        rx="47"
        ry="40"
        fill="#FDBA74"
        stroke="#C2410C"
        strokeWidth="3.5"
      />

      {/* Forehead Stripes */}
      <path d="M 94 52 L 94 62" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
      <path d="M 100 50 L 100 64" stroke="#C2410C" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 106 52 L 106 62" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />

      {/* Cat Huge Sparkling Emerald Eyes */}
      <g className="fairy-pet-eyes">
      <ellipse cx="77" cy="82" rx="9.5" ry="12" fill="#047857" />
      <ellipse cx="77" cy="82" rx="6" ry="11" fill="#064E3B" />
      <circle cx="74" cy="78" r="4" fill="#FFFFFF" />
      <circle cx="79" cy="86" r="1.8" fill="#FFFFFF" />

      <ellipse cx="123" cy="82" rx="9.5" ry="12" fill="#047857" />
      <ellipse cx="123" cy="82" rx="6" ry="11" fill="#064E3B" />
      <circle cx="120" cy="78" r="4" fill="#FFFFFF" />
      <circle cx="125" cy="86" r="1.8" fill="#FFFFFF" />

      </g>
      {/* Rosy Cheeks */}
      <ellipse cx="63" cy="98" rx="8" ry="5" fill="#FDA4AF" opacity="0.85" />
      <ellipse cx="137" cy="98" rx="8" ry="5" fill="#FDA4AF" opacity="0.85" />

      {/* Tiny Pink Triangular Nose */}
      <polygon points="96,93 104,93 100,98" fill="#F43F5E" />

      {/* Sweet Cat Smile (:3) */}
      <path
        d="M 93 101 Q 97 106 100 101 Q 103 106 107 101"
        fill="none"
        stroke="#431407"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Whiskers */}
      <line x1="42" y1="92" x2="68" y2="94" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="102" x2="66" y2="100" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
      <line x1="158" y1="92" x2="132" y2="94" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
      <line x1="160" y1="102" x2="134" y2="100" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />

      {/* Hat Overlay */}
      {equippedHat && <HatOverlay hatId={equippedHat} />}
    </svg>
  );
};

// BUNNY SVG ILLUSTRATION (Thỏ Bông Nhí Nhảnh)
const BunnyIllustration: React.FC<{
  mood: string;
  isHovered: boolean;
  isTapped: boolean;
  equippedHat?: string;
}> = ({ isHovered, isTapped, equippedHat }) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Fluffy Bunny Round Tail */}
      <ellipse
        cx="148"
        cy="145"
        rx="14"
        ry="13"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="3"
        className={isHovered || isTapped ? 'origin-[148px_145px] animate-[wiggle_0.4s_ease-in-out_infinite]' : ''}
      />

      {/* Long Bunny Ears */}
      {/* Left Long Ear */}
      <g className={isHovered ? 'origin-[70px_60px] animate-[wiggle_0.7s_ease-in-out_infinite]' : ''}>
        <path
          d="M 64 68 C 45 40, 48 -2, 70 2 C 86 4, 88 40, 80 68 Z"
          fill="#FFFFFF"
          stroke="#94A3B8"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 66 55 C 56 36, 58 12, 70 12 C 78 12, 80 36, 76 55 Z"
          fill="#FBCFE8"
        />
      </g>

      {/* Right Long Ear (Playfully tilted) */}
      <g className={isHovered ? 'origin-[130px_60px] animate-[wiggle_0.7s_ease-in-out_infinite_reverse]' : ''}>
        <path
          d="M 120 68 C 112 40, 120 4, 138 2 C 156 -2, 155 40, 136 68 Z"
          fill="#FFFFFF"
          stroke="#94A3B8"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 124 55 C 120 36, 126 12, 136 12 C 146 12, 145 36, 134 55 Z"
          fill="#FBCFE8"
        />
      </g>

      {/* Bunny Plump Body */}
      <ellipse
        cx="100"
        cy="142"
        rx="45"
        ry="42"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="3.5"
      />
      {/* Soft Pink Tummy */}
      <ellipse cx="100" cy="144" rx="26" ry="24" fill="#FDF2F8" />

      {/* Back Paws */}
      <ellipse cx="62" cy="172" rx="16" ry="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
      <ellipse cx="138" cy="172" rx="16" ry="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />

      {/* Front Paws holding chest */}
      <ellipse cx="86" cy="146" rx="11" ry="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" />
      <ellipse cx="114" cy="146" rx="11" ry="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" />

      {/* Little Carrot Pendant Collar */}
      <path
        d="M 72 118 Q 100 128 128 118 Q 100 134 72 118 Z"
        fill="#34D399"
        stroke="#059669"
        strokeWidth="2.5"
      />
      {/* Tiny Carrot Icon on collar */}
      <polygon points="98,124 102,124 100,133" fill="#F97316" stroke="#C2410C" strokeWidth="1" />
      <path d="M 98 123 L 97 120 M 102 123 L 103 120" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />

      {/* Bunny Head */}
      <ellipse
        cx="100"
        cy="86"
        rx="48"
        ry="41"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="3.5"
      />

      {/* Big Sparkling Purple/Blue Anime Eyes */}
      <g className="fairy-pet-eyes">
      <ellipse cx="76" cy="80" rx="9" ry="11.5" fill="#6366F1" />
      <ellipse cx="76" cy="80" rx="6" ry="10.5" fill="#312E81" />
      <circle cx="73" cy="76" r="3.8" fill="#FFFFFF" />
      <circle cx="78" cy="84" r="1.8" fill="#FFFFFF" />

      <ellipse cx="124" cy="80" rx="9" ry="11.5" fill="#6366F1" />
      <ellipse cx="124" cy="80" rx="6" ry="10.5" fill="#312E81" />
      <circle cx="121" cy="76" r="3.8" fill="#FFFFFF" />
      <circle cx="126" cy="84" r="1.8" fill="#FFFFFF" />

      </g>
      {/* Very Rosy Cheeks */}
      <ellipse cx="61" cy="95" rx="9" ry="6" fill="#F472B6" opacity="0.8" />
      <ellipse cx="139" cy="95" rx="9" ry="6" fill="#F472B6" opacity="0.8" />

      {/* Bunny Heart-shaped Pink Nose */}
      <path
        d="M 97 91 C 97 89, 99 88, 100 89 C 101 88, 103 89, 103 91 C 103 93, 100 96, 100 96 C 100 96, 97 93, 97 91 Z"
        fill="#EC4899"
      />

      {/* Bunny Buck Teeth Smile */}
      <path
        d="M 93 98 Q 97 102 100 98 Q 103 102 107 98"
        fill="none"
        stroke="#475569"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Front Bunny Tooth */}
      <rect x="98" y="99" width="4" height="4.5" rx="1" fill="#FFFFFF" stroke="#475569" strokeWidth="1.2" />

      {/* Bunny Whiskers */}
      <line x1="44" y1="92" x2="68" y2="93" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="46" y1="99" x2="67" y2="97" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="156" y1="92" x2="132" y2="93" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="154" y1="99" x2="133" y2="97" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />

      {/* Hat Overlay */}
      {equippedHat && <HatOverlay hatId={equippedHat} />}
    </svg>
  );
};

// Hat Overlay for dress up (Module 4 & 5 readiness)
const HatOverlay: React.FC<{ hatId: string }> = ({ hatId }) => {
  const item = COSTUME_LIST.find(item => item.id === hatId);
  const color = item?.color ?? '#8b5cf6';
  if (item?.visual) return <g strokeLinejoin="round">
    {item.visual === 'wizard' && <g><path d="M65 45 L100 0 L130 45Z" fill={color} stroke="#312e81" strokeWidth="2"/><ellipse cx="100" cy="45" rx="42" ry="9" fill={color}/><text x="93" y="30" fill="#fde047" fontSize="18">★</text></g>}
    {item.visual === 'cap' && <g><path d="M65 45 Q65 8 100 8 Q133 8 135 45Z" fill={color}/><ellipse cx="110" cy="45" rx="48" ry="8" fill={color} stroke="#ffffff" strokeWidth="2"/></g>}
    {item.visual === 'helmet' && <g><ellipse cx="100" cy="73" rx="66" ry="65" fill="#bae6fd" fillOpacity=".15" stroke={color} strokeWidth="8"/><path d="M53 51 Q64 27 81 24" fill="none" stroke="white" strokeWidth="5"/></g>}
    {item.visual === 'scarf' && <g fill={color}><rect x="62" y="118" width="76" height="15" rx="7"/><path d="M116 128 L132 127 L140 163 L121 160Z"/></g>}
    {item.visual === 'medal' && <g><path d="M75 119 L100 151 L125 119" fill="none" stroke="#ef4444" strokeWidth="8"/><circle cx="100" cy="151" r="17" fill={color} stroke="#d97706" strokeWidth="2"/><text x="91" y="157" fill="white" fontSize="20">★</text></g>}
    {item.visual === 'glasses' && <g stroke={color} strokeWidth="5" fill="#c4b5fd" fillOpacity=".4"><circle cx="77" cy="76" r="17"/><circle cx="123" cy="76" r="17"/><path d="M94 76H106"/></g>}
    {item.visual === 'bow' && <g fill={color} stroke="#a16207" strokeWidth="2"><path d="M70 125L70 100L100 113L130 100L130 125L100 113Z"/><circle cx="100" cy="113" r="7"/></g>}
    {item.visual === 'cape' && <g><path d="M65 120 Q48 150 37 179 Q100 165 163 179 Q152 150 135 120 L100 136Z" fill={color} stroke="white" strokeWidth="2"/><text x="90" y="161" fill="#fde047" fontSize="23">★</text></g>}
  </g>;
  if (hatId === 'party_hat') {
    return (
      <g transform="translate(100, 36) rotate(-10)">
        <polygon points="0,-36 -18,12 18,12" fill="#EC4899" stroke="#BE185D" strokeWidth="2.5" />
        <circle cx="0" cy="-38" r="5" fill="#FBBF24" />
        <line x1="-12" y1="-5" x2="12" y2="-5" stroke="#FBBF24" strokeWidth="3" />
        <line x1="-7" y1="-20" x2="7" y2="-20" stroke="#60A5FA" strokeWidth="3" />
      </g>
    );
  }
  if (hatId === 'flower_crown') {
    return (
      <g transform="translate(100, 48)">
        <path d="M -35 0 Q 0 -10 35 0" stroke="#10B981" strokeWidth="4" fill="none" />
        <circle cx="-25" cy="-2" r="6" fill="#F43F5E" />
        <circle cx="-25" cy="-2" r="2" fill="#FDE047" />
        <circle cx="0" cy="-8" r="7" fill="#FBBF24" />
        <circle cx="0" cy="-8" r="2.5" fill="#FFFFFF" />
        <circle cx="25" cy="-2" r="6" fill="#A855F7" />
        <circle cx="25" cy="-2" r="2" fill="#FDE047" />
      </g>
    );
  }
  if (hatId === 'chef_hat') {
    return (
      <g transform="translate(100, 38)">
        <ellipse cx="0" cy="-14" rx="28" ry="16" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" />
        <ellipse cx="-16" cy="-18" rx="14" ry="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
        <ellipse cx="16" cy="-18" rx="14" ry="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
        <rect x="-20" y="-4" width="40" height="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" rx="2" />
      </g>
    );
  }
  if (hatId === 'cool_glasses') {
    return (
      <g transform="translate(100, 80)">
        <ellipse cx="-23" cy="0" rx="14" ry="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
        <ellipse cx="23" cy="0" rx="14" ry="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
        <line x1="-9" y1="0" x2="9" y2="0" stroke="#38BDF8" strokeWidth="3" />
        <line x1="-37" y1="-2" x2="-47" y2="-4" stroke="#38BDF8" strokeWidth="2.5" />
        <line x1="37" y1="-2" x2="47" y2="-4" stroke="#38BDF8" strokeWidth="2.5" />
        <ellipse cx="-25" cy="-3" rx="4" ry="2" fill="#FFFFFF" opacity="0.6" />
        <ellipse cx="21" cy="-3" rx="4" ry="2" fill="#FFFFFF" opacity="0.6" />
      </g>
    );
  }
  if (hatId === 'royal_crown') {
    return (
      <g transform="translate(100, 36)">
        <polygon points="-24,8 -28,-14 -10,-4 0,-20 10,-4 28,-14 24,8" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
        <circle cx="0" cy="-20" r="3.5" fill="#EF4444" />
        <circle cx="-28" cy="-14" r="2.5" fill="#3B82F6" />
        <circle cx="28" cy="-14" r="2.5" fill="#3B82F6" />
        <circle cx="0" cy="0" r="3" fill="#EC4899" />
        <rect x="-22" y="5" width="44" height="4" fill="#F59E0B" rx="1" />
      </g>
    );
  }
  if (hatId === 'pink_bow') {
    return (
      <g transform="translate(100, 42)">
        <circle cx="0" cy="0" r="5" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />
        <polygon points="0,0 -18,-10 -16,10" fill="#FB7185" stroke="#BE123C" strokeWidth="1.5" />
        <polygon points="0,0 18,-10 16,10" fill="#FB7185" stroke="#BE123C" strokeWidth="1.5" />
      </g>
    );
  }
  if (hatId === 'superhero_cape') {
    return (
      <g transform="translate(100, 130)">
        <path d="M -35 -10 C -55 20, -45 50, -40 60 C -10 50, 10 50, 40 60 C 45 50, 55 20, 35 -10 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" opacity="0.85" />
        <polygon points="0,15 10,25 -10,25" fill="#FBBF24" />
      </g>
    );
  }
  return null;
};
