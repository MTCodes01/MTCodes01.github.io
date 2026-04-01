import React from 'react';
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
    <div className={`nebula-container fixed inset-0 bg-[#020204] overflow-hidden font-inter text-white select-none transition-colors duration-[2000ms] ${isGameActive ? 'nebula-active' : ''}`}>
      <style>{`
        @keyframes eq-bounce {
          0% { height: 15%; }
          100% { height: 100%; }
        }
      `}</style>

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

      {/* Aurora blobs - OPTION A (VISUALIZER) */}
      <div
        className="absolute pointer-events-none animate-aurora transition-all duration-1000 ease-in-out"
        style={{
          top: '-30%', left: '-20%', width: '70%', height: '70%',
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          opacity: musicState.isPlaying ? 0.15 : 0.07,
          transform: musicState.isPlaying ? 'scale(1.1)' : 'scale(1)'
        }}
      />
      <div
        className="absolute pointer-events-none transition-all duration-[1500ms] ease-in-out"
        style={{
          bottom: '-20%', right: '-15%', width: '60%', height: '60%',
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          opacity: musicState.isPlaying ? 0.12 : 0.05,
          animation: 'aurora 20s linear infinite reverse',
          transform: musicState.isPlaying ? 'scale(1.15)' : 'scale(1)'
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)' }}
      />

      {/* Scanlines — very subtle */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />

      <TopBar />

      {/* Windows */}
      <div className="absolute inset-0">
        {windows.map(window => {
          const AppComponent = APP_COMPONENTS[window.id];
          return (
            <Window key={window.id} windowState={window}>
              {AppComponent ? <AppComponent /> : <div className="p-4 text-white/40">App not found</div>}
            </Window>
          );
        })}
      </div>

      {/* HTML5 Canvas Visualizer Component */}
      <Visualizer />

      <Dock />

      {/* Nebula Override — Hidden Game Overlay */}
      <NebulaOverride />
    </div>
  );
};

export default Desktop;
