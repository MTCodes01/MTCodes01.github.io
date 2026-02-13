import React, { useState } from 'react';
import { WindowProvider } from './contexts/WindowContext';
import { ThemeProvider } from './contexts/ThemeContext';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import './index.css';

const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <ThemeProvider>
      <WindowProvider>
        {!bootComplete ? (
          <BootScreen onComplete={() => setBootComplete(true)} />
        ) : (
          <Desktop />
        )}
      </WindowProvider>
    </ThemeProvider>
  );
};

export default App;
