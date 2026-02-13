import React from 'react';
import { useWindows } from '../contexts/WindowContext';
import Window from './Window';
import Dock from './Dock';
import TopBar from './TopBar';

// Import app components
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
    <div className="fixed inset-0 bg-[#020202] overflow-hidden font-inter text-white selection:bg-[#ff003c] selection:text-white">
      {/* Checkpoint Matrix Background */}
      <div className="absolute inset-0 bg-matrix-pattern opacity-30 pointer-events-none" />
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/90 pointer-events-none" />
      
      {/* Scanlines Overlay - subtle */}
      <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
      
      <TopBar />

      {/* Windows */}
      <div className="absolute inset-0">
        {windows.map(window => {
          const AppComponent = APP_COMPONENTS[window.id];
          return (
            <Window key={window.id} windowState={window}>
              {AppComponent ? <AppComponent /> : <div>App not found</div>}
            </Window>
          );
        })}
      </div>

      <Dock />
    </div>
  );
};

export default Desktop;
