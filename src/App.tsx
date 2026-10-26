/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PetState, GameScreen } from './types/game';
import { Module1Welcome } from './components/Module1Welcome';
import { Module2Garden } from './components/Module2Garden';
import { AudioControls } from './components/AudioControls';
import { 
  startBackgroundMusic, 
  stopBackgroundMusic, 
  playPopSound 
} from './utils/audio';

const STORAGE_KEY = 'PET_MATH_FARM_DATA';

export default function App() {
  const [pet, setPet] = useState<PetState | null>(null);
  const [screen, setScreen] = useState<GameScreen>('welcome');
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved pet from localStorage on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.type) {
          setPet(parsed);
          // If pet exists, screen remains on 'welcome' so user can choose to continue or pick a new pet
        }
      }
    } catch (e) {
      console.warn('Could not read pet state from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save pet to localStorage whenever pet state updates
  const handleSavePet = (newPet: PetState) => {
    setPet(newPet);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPet));
    } catch (e) {
      console.warn('Could not save pet state:', e);
    }
    setScreen('garden');
  };

  const handleUpdatePet = (updatedPet: PetState) => {
    setPet(updatedPet);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPet));
    } catch (e) {
      console.warn('Could not save pet state:', e);
    }
  };

  // Toggle Background Music
  const handleToggleBgm = () => {
    if (isBgmActive) {
      stopBackgroundMusic();
      setIsBgmActive(false);
    } else {
      startBackgroundMusic();
      setIsBgmActive(true);
    }
  };

  // Toggle Sound Effects
  const handleToggleSound = () => {
    setIsMuted(!isMuted);
  };

  const handleResetOrChangePet = () => {
    playPopSound();
    setScreen('welcome');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-sky-200">
        <div className="text-xl font-bold text-sky-800 animate-pulse">
          Đang tải Nông Trại Học Toán...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full font-['Fredoka',sans-serif] select-none">
      {/* Floating Audio Controls in Top-Right Corner */}
      <div className="fixed top-3 right-3 z-50">
        <AudioControls
          isMuted={isMuted}
          isBgmActive={isBgmActive}
          onToggleSound={handleToggleSound}
          onToggleBgm={handleToggleBgm}
          onResetGame={screen === 'garden' ? handleResetOrChangePet : undefined}
        />
      </div>

      {/* Screen Routing */}
      {screen === 'welcome' && (
        <Module1Welcome
          existingPet={pet}
          onConfirmPet={handleSavePet}
          onContinueExisting={() => setScreen('garden')}
        />
      )}

      {screen === 'garden' && pet && (
        <Module2Garden
          pet={pet}
          onUpdatePet={handleUpdatePet}
          onBackToModule1={handleResetOrChangePet}
        />
      )}
    </div>
  );
}
