import React from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useMusic } from '../contexts/MusicContext';
import { useNebulaOverride } from '../contexts/NebulaOverrideContext';
import Window from './Window';
import Visualizer from './Visualizer';
import Dock from './Dock';
import TopBar from './TopBar';
import NebulaOverride from './NebulaOverride';

import AboutApp from './apps/AboutApp';
import ProjectsApp from './apps/ProjectsApp';
import TerminalApp from './apps/TerminalApp';
import MusicApp from './apps/MusicApp';
import ResumeApp from './apps/ResumeApp';
import ContactApp from './apps/ContactApp';
import BrowserApp from './apps/BrowserApp';
import VSCodeApp from './apps/VSCodeApp';

const APP_COMPONENTS: Record<string, React.FC> = {
  about: AboutApp,
  projects: ProjectsApp,
  terminal: TerminalApp,
  music: MusicApp,
  resume: ResumeApp,
  contact: ContactApp,
  browser: BrowserApp,
  vscode: VSCodeApp,
};

const Desktop: React.FC = () => {
  const { windows } = useWindows();
  const { musicState } = useMusic();
  const { gameState } = useNebulaOverride();

  const isGameActive = gameState !== 'idle';

  // If music isn't playing, fallback to standard neutral aurora colors
  const primaryColor = musicState.isPlaying ? musicState.trackColor : '#ff003c';
  const secondaryColor = musicState.isPlaying ? musicState.trackColor : '#00f0ff';

  return (
    <div className={`nebula-container fixed inset-0 bg-os-desktop overflow-hidden font-inter text-os-main select-none transition-colors duration-[2000ms] ${isGameActive ? 'nebula-active' : ''}`}>
      <style>{`
        @keyframes eq-bounce {
          0% { height: 15%; }
          100% { height: 100%; }
        }
      `}</style>

      {/* Grid background - Fades in first */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" 
      />

      {/* Aurora blobs - Fades in with the grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: musicState.isPlaying ? 0.15 : 0.07, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute pointer-events-none animate-aurora transition-all duration-1000 ease-in-out"
        style={{
          top: '-30%', left: '-20%', width: '70%', height: '70%',
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: musicState.isPlaying ? 0.12 : 0.05, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute pointer-events-none transition-all duration-[1500ms] ease-in-out"
        style={{
          bottom: '-20%', right: '-15%', width: '60%', height: '60%',
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          animation: 'aurora 20s linear infinite reverse',
        }}
      />

      {/* Vignette & Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, var(--vignette) 100%)' }} />
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />

      {/* UI Elements - Slide in from Top & Bottom */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-[10001]"
      >
        <TopBar />
      </motion.div>

      {/* Windows - Smooth middle fade */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute inset-0"
      >
        {windows.map(window => {
          const AppComponent = APP_COMPONENTS[window.id];
          return (
            <Window key={window.id} windowState={window}>
              {AppComponent ? <AppComponent /> : <div className="p-4 text-white/40">App not found</div>}
            </Window>
          );
        })}
      </motion.div>

      <Visualizer />

      <motion.div 
        className="fixed bottom-5 left-0 right-0 z-[10000] flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto">
          <Dock />
        </div>
      </motion.div>

      <NebulaOverride />
    </div>
  );
};

export default Desktop;
