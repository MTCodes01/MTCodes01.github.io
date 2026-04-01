import React, { useState } from 'react';
import { WindowProvider } from './contexts/WindowContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MusicProvider } from './contexts/MusicContext';
import { NebulaOverrideProvider } from './contexts/NebulaOverrideContext';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import './index.css';

const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <ThemeProvider>
      <MusicProvider>
        <NebulaOverrideProvider>
          <WindowProvider>
            {!bootComplete ? (
              <BootScreen onComplete={() => setBootComplete(true)} />
            ) : (
              <Desktop />
            )}
          </WindowProvider>
        </NebulaOverrideProvider>
      </MusicProvider>
    </ThemeProvider>
  );
};

export default App;
