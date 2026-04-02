import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

const INITIAL_FS: Record<string, string[]> = {
  '~': ['about/', 'projects/', 'apps/', 'contact/', 'resume/', 'README.md', 'secret.txt'],
  '~/apps': ['browser.app', 'music.app', 'vscode.app', 'terminal.app'],
  '~/projects': ['MTCodes01.github.io', 'Portfolio-V1', 'Music-Visualizer', 'Checkpoint-OS'],
};

const FORTUNES = [
  "True wisdom comes to each of us when we realize how little we understand about life, ourselves, and the world around us.",
  "The only way to do great work is to love what you do.",
  "The best way to predict the future is to invent it.",
  "Your time is limited, don't waste it living someone else's life.",
  "Stay hungry, stay foolish.",
  "The only thing we have to fear is fear itself.",
  "In the middle of every difficulty lies opportunity.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
];

interface HistoryEntry {
  type: 'input' | 'output' | 'error';
  text: string;
}

const TerminalApp: React.FC = () => {
  const { openWindow, closeWindow } = useWindows();
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: 'CheckTerm v1.1.0 - Checkpoint OS' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [filesystem, setFilesystem] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('checkpoint_terminal_fs');
    return saved ? JSON.parse(saved) : INITIAL_FS;
  });

  const historyIdxRef = useRef(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('checkpoint_terminal_fs', JSON.stringify(filesystem));
  }, [filesystem]);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const COMMANDS: Record<string, (args: string[]) => Promise<string | void> | string | void> = useMemo(() => ({
    whoami: () => `Sreedev S S - Developer · Designer · Editor
Location  : Thiruvananthapuram, Kerala, India
Education : B.Tech CSE - College of Engineering, Attingal
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

    ls: () => {
      if (currentPath === '~/projects') {
        const cached = projectService.getCachedProjects();
        if (cached && cached.length > 0) {
          return cached.map(p => p.name + '/').join('    ');
        }
      }
      const contents = filesystem[currentPath] || [];
      if (contents.length === 0) return 'Directory is empty.';
      return contents.join('    ');
    },

    pwd: () => currentPath,

    neofetch: () => `    ██████████    Sreedev S S
   ██  ██  ████   ─────────────────────
  ████████████    OS      : Checkpoint OS v1.1.0
   ██  ██  ████   Shell   : CheckTerm
    ██████████    Stack   : React · TypeScript · Tailwind
                  Role    : Developer · Designer · Editor
                  Loc     : Kerala, India`,

    help: () => `Available Commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
whoami    - About me
skills    - Technical skills
projects  - Featured projects
contact   - Contact info
socials   - Social links
neofetch  - System info
date      - Current time
fortune   - Get wisdom
cowsay    - Moo!
rickroll  - ???
ls        - List files
pwd       - Current path
cd <dir>  - Change directory
mkdir     - Create directory
touch     - Create file
rm <file> - Remove file
rmdir     - Remove directory
open <ap> - Open application
echo      - Print text
clear     - Clear screen
exit      - Close terminal`,

    socials: () => `Connect with me:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GitHub    : https://github.com/MTCodes01
LinkedIn  : https://linkedin.com/in/sreedevss
Instagram : https://instagram.com/_mt_yt_
YouTube   : https://youtube.com/@MT_yt`,

    echo: (args) => args.join(' ').replace('$USER', 'guest'),

    uname: () => "Linux checkpoint-os 5.15.0-v1-generic #1 SMP x86_64 GNU/Linux",

    hostname: () => "checkpoint-os",

    mkdir: (args) => {
      const name = args[0];
      if (!name) return "mkdir: missing operand";
      const dirName = name.endsWith('/') ? name : name + '/';
      const newPath = currentPath === '~' ? `~/${dirName.slice(0,-1)}` : `${currentPath}/${dirName.slice(0,-1)}`;
      
      setFilesystem(prev => ({
        ...prev,
        [currentPath]: [...(prev[currentPath] || []), dirName],
        [newPath]: []
      }));
    },

    touch: (args) => {
      const name = args[0];
      if (!name) return "touch: missing operand";
      setFilesystem(prev => ({
        ...prev,
        [currentPath]: [...(prev[currentPath] || []), name]
      }));
    },

    rm: (args) => {
      const name = args[0];
      if (!name) return "rm: missing operand";
      setFilesystem(prev => {
        const filtered = (prev[currentPath] || []).filter(item => 
          item !== name && item !== name + '/'
        );
        return { ...prev, [currentPath]: filtered };
      });
    },

    rmdir: (args) => {
      const name = args[0];
      if (!name) return "rmdir: missing operand";
      const dirName = name.endsWith('/') ? name : name + '/';
      
      setFilesystem(prev => {
        const currentFiles = prev[currentPath] || [];
        if (!currentFiles.includes(dirName)) {
          return prev; // Or return an error in the UI
        }
        const filtered = currentFiles.filter(item => item !== dirName);
        const newState = { ...prev, [currentPath]: filtered };
        // Potentially delete the path key from filesystem too
        const targetPath = currentPath === '~' ? `~/${dirName.slice(0,-1)}` : `${currentPath}/${dirName.slice(0,-1)}`;
        delete newState[targetPath];
        return newState;
      });
    },

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

    matrix: async () => {
      setIsProcessing(true);
      const lines = [
        "Scanning for anomalies...",
        "System override initiated.",
        "Follow the white rabbit.",
        "Wake up, Neo...",
        "Knock, knock.",
      ];
      for (const line of lines) {
        setHistory(prev => [...prev, { type: 'output', text: line + '\n' }]);
        await delay(600);
      }
      setIsProcessing(false);
    },

    cowsay: (args) => {
      const msg = args.join(' ') || "Moo!";
      const border = "-".repeat(msg.length + 2);
      return `
  ${border}
< ${msg} >
  ${border}
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||
      `;
    },

    fortune: () => {
      const idx = Math.floor(Math.random() * FORTUNES.length);
      return FORTUNES[idx];
    },

    rickroll: () => {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
      return "Never gonna give you up, never gonna let you down...";
    },

    cat: (args) => {
      if (args.length === 0) return "cat: missing operand";
      const file = args[0];
      if (file === 'README.md') return "Checkpoint OS - A high-fidelity portfolio operating system.";
      if (file === 'secret.txt') return "Easter egg found! Use 'matrix' for more.";
      return `cat: ${file}: No such file or directory`;
    },
  }), [currentPath, filesystem]);

  const runCommand = useCallback(async (cmdLine: string) => {
    const trimmed = cmdLine.trim();
    if (!trimmed) {
      setHistory(prev => [...prev, { type: 'input', text: `${currentPath} $ ` }]);
      return;
    }

    setHistory(prev => [...prev, { type: 'input', text: `${currentPath} $ ${cmdLine}` }]);
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
        const potential = currentPath === '~' ? `~/${target.replace(/\/$/, '')}` : `${currentPath}/${target.replace(/\/$/, '')}`;
        if (filesystem[potential]) {
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

      if (currentPath === '~/projects') {
        const cached = projectService.getCachedProjects();
        const normalizedTarget = target.toLowerCase().replace(/\/$/, '');
        const project = cached?.find(p => p.name.toLowerCase() === normalizedTarget);
        if (project) {
          window.open(project.html_url, '_blank');
          setHistory(prev => [...prev, { type: 'output', text: `Opening ${project.name} on GitHub...\n` }]);
          return;
        }

        const fallbackProjects = filesystem['~/projects'];
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
      const result = await fn(args);
      if (result) {
        setHistory(prev => [...prev, { type: 'output', text: result + '\n' }]);
      }
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        text: `Command not found: "${cmd}"\nType "help" for available commands.\n`,
      }]);
    }
  }, [currentPath, filesystem, openWindow, closeWindow, COMMANDS]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      runCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isProcessing) {
      e.preventDefault();
      return;
    }

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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.trim().split(' ');
      const last = parts[parts.length - 1];

      if (parts.length === 1 && last) {
        // Complete commands
        const matches = Object.keys(COMMANDS).filter(c => c.startsWith(last));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          setHistory(prev => [...prev, 
            { type: 'input', text: `${currentPath} $ ${input}` },
            { type: 'output', text: matches.join('    ') + '\n' }
          ]);
        }
      } else if (parts.length > 1) {
        // Complete files/dirs
        const contents = filesystem[currentPath] || [];
        const matches = contents.filter(f => f.toLowerCase().startsWith(last.toLowerCase()));
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          setInput(parts.join(' '));
        } else if (matches.length > 1) {
          setHistory(prev => [...prev, 
            { type: 'input', text: `${currentPath} $ ${input}` },
            { type: 'output', text: matches.join('    ') + '\n' }
          ]);
        }
      }
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
            disabled={isProcessing}
            onClick={() => runCommand(cmd)}
            className="px-2 py-0.5 bg-[#33ff00]/5 hover:bg-[#33ff00]/15 border border-[#33ff00]/20 hover:border-[#33ff00]/50 text-[#33ff00]/60 hover:text-[#33ff00] text-[10px] transition-all uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
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
            disabled={isProcessing}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white placeholder-[#33ff00]/10 caret-[#33ff00] disabled:opacity-50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          {!isProcessing && <span className="w-[7px] h-[1em] bg-[#33ff00] animate-blink opacity-80" />}
        </form>
      </div>
    </div>
  );
};

export default TerminalApp;
