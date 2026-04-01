import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';

type GameState = 'idle' | 'activating' | 'playing' | 'deactivating';

interface NebulaOverrideContextType {
  gameState: GameState;
  score: number;
  highScore: number;
  lives: number;
  wave: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setWave: React.Dispatch<React.SetStateAction<number>>;
  registerBatterySaverClick: () => void;
  activateNebula: () => void;
  deactivateNebula: () => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const NebulaOverrideContext = createContext<NebulaOverrideContextType | undefined>(undefined);

const CLICK_THRESHOLD = 5;
const CLICK_WINDOW_MS = 2000;

export const NebulaOverrideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('nebulaHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const clickTimestamps = useRef<number[]>([]);

  // Persist high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('nebulaHighScore', String(score));
    }
  }, [score, highScore]);

  const activateNebula = useCallback(() => {
    if (gameState !== 'idle') return;
    setScore(0);
    setLives(3);
    setWave(1);
    setGameState('activating');

    // After activation animation, transition to playing
    setTimeout(() => {
      setGameState('playing');
    }, 2500);
  }, [gameState]);

  const deactivateNebula = useCallback(() => {
    if (gameState !== 'playing') return;
    setGameState('deactivating');

    setTimeout(() => {
      setGameState('idle');
    }, 800);
  }, [gameState]);

  const registerBatterySaverClick = useCallback(() => {
    if (gameState !== 'idle') return;

    const now = Date.now();
    clickTimestamps.current.push(now);

    // Keep only clicks within the time window
    clickTimestamps.current = clickTimestamps.current.filter(
      ts => now - ts < CLICK_WINDOW_MS
    );

    if (clickTimestamps.current.length >= CLICK_THRESHOLD) {
      clickTimestamps.current = [];
      activateNebula();
    }
  }, [gameState, activateNebula]);

  return (
    <NebulaOverrideContext.Provider value={{
      gameState,
      score,
      highScore,
      lives,
      wave,
      setScore,
      setLives,
      setWave,
      registerBatterySaverClick,
      activateNebula,
      deactivateNebula,
      setGameState,
    }}>
      {children}
    </NebulaOverrideContext.Provider>
  );
};

export const useNebulaOverride = () => {
  const context = useContext(NebulaOverrideContext);
  if (!context) {
    throw new Error('useNebulaOverride must be used within NebulaOverrideProvider');
  }
  return context;
};
