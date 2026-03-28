import React from 'react';
import { useWindows } from '../contexts/WindowContext';
import Window from './Window';
import Dock from './Dock';
import TopBar from './TopBar';

import AboutApp from './apps/AboutApp';
import ProjectsApp from './apps/ProjectsApp';
import TerminalApp from './apps/TerminalApp';
import MusicApp from './apps/MusicApp';
import ResumeApp from './apps/ResumeApp';
import ContactApp from './apps/ContactApp';
import BrowserApp from './apps/BrowserApp';

const APP_COMPONENTS: Record<string, React.FC> = {
  about: AboutApp,
  projects: ProjectsApp,
  terminal: TerminalApp,
  music: MusicApp,
  resume: ResumeApp,
  contact: ContactApp,
  browser: BrowserApp,
};

const Desktop: React.FC = () => {
  const { windows } = useWindows();

  return (
    <div className="fixed inset-0 bg-[#020204] overflow-hidden font-inter text-white select-none">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

      {/* Aurora blobs */}
      <div
        className="absolute pointer-events-none opacity-[0.07] animate-aurora"
        style={{
          top: '-30%', left: '-20%', width: '70%', height: '70%',
          background: 'radial-gradient(circle, #ff003c 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute pointer-events-none opacity-[0.05]"
        style={{
          bottom: '-20%', right: '-15%', width: '60%', height: '60%',
          background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora 20s linear infinite reverse',
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

      <Dock />
    </div>
  );
};

export default Desktop;
