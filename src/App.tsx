import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WindowProvider } from './contexts/WindowContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MusicProvider } from './contexts/MusicContext';
import { NebulaOverrideProvider } from './contexts/NebulaOverrideContext';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import './index.css';

const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);

  React.useEffect(() => {
    if (bootComplete) {
      const seo = document.getElementById('seo-content');
      if (seo) seo.style.display = 'block';
    }
  }, [bootComplete]);

  return (
    <ThemeProvider>
      <MusicProvider>
        <NebulaOverrideProvider>
          <WindowProvider>
            <AnimatePresence>
              {!bootComplete ? (
                <BootScreen key="boot" onComplete={() => setBootComplete(true)} />
              ) : (
                <Desktop key="desktop" />
              )}
            </AnimatePresence>
          </WindowProvider>
        </NebulaOverrideProvider>
      </MusicProvider>
    </ThemeProvider>
  );
};

export default App;
