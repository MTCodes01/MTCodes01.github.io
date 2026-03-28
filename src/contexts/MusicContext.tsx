import React, { createContext, useContext, useState } from 'react';

interface MusicState {
  isPlaying: boolean;
  trackColor: string;
  analyserNode: AnalyserNode | null;
}

interface MusicContextProps {
  musicState: MusicState;
  setMusicState: React.Dispatch<React.SetStateAction<MusicState>>;
}

const MusicContext = createContext<MusicContextProps | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [musicState, setMusicState] = useState<MusicState>({
    isPlaying: false,
    trackColor: '#ff003c', // default red
    analyserNode: null,
  });

  return (
    <MusicContext.Provider value={{ musicState, setMusicState }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
