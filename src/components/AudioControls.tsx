/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useSyncExternalStore } from 'react';
import { getGoogleSpeechPlayer } from '../utils/googleSpeech';
import { Volume2, VolumeX, Music, RotateCcw } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface AudioControlsProps {
  isMuted: boolean;
  isBgmActive: boolean;
  onToggleSound: () => void;
  onToggleBgm: () => void;
  onResetGame?: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isMuted,
  isBgmActive,
  onToggleSound,
  onToggleBgm,
  onResetGame,
}) => {
  const speech = getGoogleSpeechPlayer();
  const status = useSyncExternalStore(speech.subscribe, speech.getStatus);
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-amber-200/60 z-30">
      {!isMuted && (status === 'blocked' || status === 'error') && <button onClick={speech.retry} className="text-xs font-bold px-2">🔊 Chạm để nghe lời nhắn</button>}
      {/* Sound FX Toggle */}
      <button
        onClick={() => {
          playPopSound();
          onToggleSound();
        }}
        title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        aria-label="Bật hoặc tắt âm thanh hiệu ứng"
        className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
          isMuted
            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
            : 'bg-amber-100 text-amber-800 hover:bg-amber-200 active:scale-90'
        }`}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Background Music Toggle */}
      <button
        onClick={() => {
          playPopSound();
          onToggleBgm();
        }}
        title={isBgmActive ? 'Tắt nhạc nền vui vẻ' : 'Bật nhạc nền vui vẻ'}
        aria-label="Bật hoặc tắt nhạc nền"
        className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center relative ${
          isBgmActive
            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 active:scale-90 ring-2 ring-emerald-400/50'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
        }`}
      >
        <Music className="w-5 h-5" />
        {isBgmActive && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        )}
      </button>

      {/* Reset / Change Pet Button */}
      {onResetGame && (
        <button
          onClick={() => {
            playPopSound();
            onResetGame();
          }}
          title="Chọn lại thú cưng mới"
          aria-label="Chọn lại thú cưng hoặc bắt đầu mới"
          className="p-2.5 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-90 transition-all flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
