import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { projectService } from '../../services/projectService';

const APPS_METADATA: Record<string, { title: string; icon: string }> = {
  about: { title: 'About Me', icon: 'about' },
  projects: { title: 'Projects', icon: 'projects' },
  music: { title: 'Music Player', icon: 'music' },
  resume: { title: 'Resume', icon: 'resume' },
  contact: { title: 'Contact', icon: 'contact' },
  browser: { title: 'Web Browser', icon: 'browser' },
  vscode: { title: 'VS Code', icon: 'vscode' },
  terminal: { title: 'Terminal', icon: 'terminal' },
};

const FILESYSTEM: Record<string, string[]> = {
  '~': ['about/', 'projects/', 'apps/', 'contact/', 'resume/', 'README.md', 'secret.txt'],
  '~/apps': ['browser.app', 'music.app', 'vscode.app', 'terminal.app'],
  '~/projects': ['MTCodes01.github.io', 'Portfolio-V1', 'Music-Visualizer', 'Checkpoint-OS'],
};

const COMMANDS: Record<string, (args: string[], extra?: any) => string | void> = {
  whoami: () => `Sreedev S S — Developer · Designer · Editor
Location  : Thiruvananthapuram, Kerala, India
Education : B.Tech CSE — College of Engineering, Attingal
Status    : Open to opportunities`,

  skills: () => `Technical Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design    : Figma, Photoshop
Frontend  : HTML, CSS, JavaScript, React, TypeScript
Backend   : Python, Django, Flask
Editing   : After Effects, DaVinci
Database  : MySQL, PostgreSQL, SQLite`,

  projects: () => `Featured Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hosted on GitHub with the "portfolio" topic.
Visit: github.com/MTCodes01

Open the Projects app for visual cards.`,

  contact: () => `Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email     : sreedevss05@gmail.com
GitHub    : github.com/MTCodes01
LinkedIn  : linkedin.com/in/sreedevss
Instagram : @_mt_yt_
YouTube   : @MT_yt`,

  date: () => new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' }),

  ls: (_args, { currentPath }) => {
    if (currentPath === '~/projects') {
      const cached = projectService.getCachedProjects();
      if (cached && cached.length > 0) {
        return cached.map(p => p.name + '/').join('    ');
      }
    }
    const contents = FILESYSTEM[currentPath] || [];
    if (contents.length === 0) return 'Directory is empty.';
    return contents.join('    ');
  },

  pwd: (_args, { currentPath }) => currentPath,

  neofetch: () => `    ██████████    Sreedev S S
   ██  ██  ████   ─────────────────────
  ████████████    OS      : Checkpoint OS v1.0.0
   ██  ██  ████   Shell   : CheckTerm
    ██████████    Stack   : React · TypeScript · Tailwind
                  Role    : Developer · Designer · Editor
                  Loc     : Kerala, India`,

  help: () => `Available Commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
whoami    — About me
skills    — Technical skills
projects  — Featured projects
contact   — Contact information
open <app>— Open an application
cd <dir>  — Change directory
ls        — List files
pwd       — Current path
neofetch  — System info
socials   — My social links
clear     — Clear terminal
exit      — Close terminal`,

  socials: () => `Connect with me:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GitHub    : https://github.com/MTCodes01
LinkedIn  : https://linkedin.com/in/sreedevss
Instagram : https://instagram.com/_mt_yt_
YouTube   : https://youtube.com/@MT_yt`,

  sudo: () => "Nice try, but you don't have root privileges. This incident will be reported... to no one.",

  coffee: () => `
       (      (
        )  (   )
       (   )  (
     .───────────.
     |           |──.
     |  COFFEE   |  |
     |           |──'
     '───────────'
      '─────────'`,

  beer: () => `
     .─────────.
     |         |
     |         |──.
     |  BEER   |  |
     |         |  |
     |         |──'
     '─────────'`,

  matrix: () => `Scanning for anomalies...
System override initiated.
Follow the white rabbit.
Wake up, Neo...
Knock, knock.`,

  cat: (args) => {
    if (args.length === 0) return "cat: missing operand";
    const file = args[0];
    if (file === 'README.md') return "Checkpoint OS - A high-fidelity portfolio operating system.";
    if (file === 'secret.txt') return "Easter egg found! Use 'matrix' for more.";
    return `cat: ${file}: No such file or directory`;
  },
};

interface HistoryEntry {
  type: 'input' | 'output' | 'error';
  text: string;
}

const TerminalApp: React.FC = () => {
  const { openWindow, closeWindow } = useWindows();
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: 'CheckTerm v1.0.0 — Checkpoint OS' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const historyIdxRef = useRef(-1);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const runCommand = useCallback((cmdLine: string) => {
    const trimmed = cmdLine.trim();
    setHistory(prev => [...prev, { type: 'input', text: `${currentPath} $ ${cmdLine}` }]);
    if (!trimmed) return;

    setCmdHistory(prev => [cmdLine, ...prev]);
    historyIdxRef.current = -1;

    const [cmd, ...args] = trimmed.split(' ');

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'exit') {
      closeWindow('terminal');
      return;
    }

    if (cmd === 'cd') {
      const target = args[0];
      if (!target || target === '~' || target === '/') {
        setCurrentPath('~');
        setHistory(prev => [...prev, { type: 'output', text: '\n' }]);
      } else if (target === '..') {
        const parts = currentPath.split('/');
        if (parts.length > 1) {
          setCurrentPath(parts.slice(0, -1).join('/'));
        }
        setHistory(prev => [...prev, { type: 'output', text: '\n' }]);
      } else {
        const potential = `${currentPath}/${target.replace(/\/$/, '')}`;
        if (FILESYSTEM[potential]) {
          setCurrentPath(potential);
          setHistory(prev => [...prev, { type: 'output', text: '\n' }]);
        } else {
          setHistory(prev => [...prev, { type: 'error', text: `cd: no such directory: ${target}\n` }]);
        }
      }
      return;
    }

    if (cmd === 'open') {
      const target = args[0];
      if (!target) {
        setHistory(prev => [...prev, { type: 'error', text: "Usage: open <appName|projectName>\n" }]);
        return;
      }

      // Check for projects if in projects folder
      if (currentPath === '~/projects') {
        const cached = projectService.getCachedProjects();
        const normalizedTarget = target.toLowerCase().replace(/\/$/, '');
        
        // Try to find in cache first
        const project = cached?.find(p => p.name.toLowerCase() === normalizedTarget);
        if (project) {
          window.open(project.html_url, '_blank');
          setHistory(prev => [...prev, { type: 'output', text: `Opening ${project.name} on GitHub...\n` }]);
          return;
        }

        // Fallback: Check if it's one of the dummy projects in FILESYSTEM
        const fallbackProjects = FILESYSTEM['~/projects'];
        const fallback = fallbackProjects.find(p => p.toLowerCase().replace(/\/$/, '') === normalizedTarget);
        if (fallback) {
          const repoName = fallback.replace(/\/$/, '');
          const url = `https://github.com/mtcodes01/${repoName}`;
          window.open(url, '_blank');
          setHistory(prev => [...prev, { type: 'output', text: `Opening ${repoName} on GitHub...\n` }]);
          return;
        }
      }

      const metadata = APPS_METADATA[target];
      if (metadata) {
        openWindow(target, metadata.title, metadata.icon);
        setHistory(prev => [...prev, { type: 'output', text: `Launching ${metadata.title}...\n` }]);
      } else {
        setHistory(prev => [...prev, { type: 'error', text: `open: target not found: ${target}\n` }]);
      }
      return;
    }

    const fn = COMMANDS[cmd];
    if (fn) {
      const result = fn(args, { currentPath });
      if (result) {
        setHistory(prev => [...prev, { type: 'output', text: result + '\n' }]);
      }
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        text: `Command not found: "${cmd}"\nType "help" for available commands.\n`,
      }]);
    }
  }, [currentPath, openWindow, closeWindow]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      runCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdxRef.current + 1, cmdHistory.length - 1);
      historyIdxRef.current = next;
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdxRef.current - 1, -1);
      historyIdxRef.current = next;
      setInput(next === -1 ? '' : cmdHistory[next] ?? '');
    }
  };

  const colorMap: Record<HistoryEntry['type'], string> = {
    input: 'text-white',
    output: 'text-[#33ff00]',
    error: 'text-[#ff003c]',
  };

  return (
    <div className="h-full bg-[#050508] text-[#33ff00] font-jetbrains text-sm flex flex-col overflow-hidden">
      {/* CRT scanline */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)' }}
      />

      {/* Output area */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto px-5 py-4 space-y-0.5 scrollbar-hide relative z-0"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, i) => (
          <div key={i} className={`${colorMap[entry.type]} leading-relaxed`}
            style={{ textShadow: entry.type === 'output' ? '0 0 4px rgba(51,255,0,0.4)' : undefined }}
          >
            <pre className="whitespace-pre-wrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {entry.text}
            </pre>
          </div>
        ))}
      </div>

      {/* Quick-command buttons */}
      <div className="border-t border-[#33ff00]/10 px-4 py-2 flex flex-wrap gap-1.5 bg-black/40">
        {['whoami', 'skills', 'projects', 'ls', 'neofetch', 'help'].map(cmd => (
          <button
            key={cmd}
            onClick={() => runCommand(cmd)}
            className="px-2 py-0.5 bg-[#33ff00]/5 hover:bg-[#33ff00]/15 border border-[#33ff00]/20 hover:border-[#33ff00]/50 text-[#33ff00]/60 hover:text-[#33ff00] text-[10px] transition-all uppercase tracking-wider"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-[#33ff00]/15 px-4 py-3 relative z-20 bg-black/20">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[#33ff00] font-bold shrink-0">guest@checkpoint:</span>
            <span className="text-[#ffaa00] font-mono shrink-0">{currentPath}</span>
            <span className="text-[#33ff00] font-bold shrink-0">$</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white placeholder-[#33ff00]/10 caret-[#33ff00]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          <span className="w-[7px] h-[1em] bg-[#33ff00] animate-blink opacity-80" />
        </form>
      </div>
    </div>
  );
};

export default TerminalApp;
