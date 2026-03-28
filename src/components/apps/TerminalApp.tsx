import React, { useState, useRef, useEffect, useCallback } from 'react';

const COMMANDS: Record<string, () => string> = {
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

  ls: () => `Applications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
about/       projects/    terminal/
music/       resume/      contact/
browser/`,

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
date      — Current date & time
ls        — List applications
neofetch  — System info
clear     — Clear terminal`,

  clear: () => 'CLEAR',
};

interface HistoryEntry {
  type: 'input' | 'output' | 'error';
  text: string;
}

const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: 'CheckTerm v1.0.0 — Checkpoint OS' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const historyIdxRef = useRef(-1);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const runCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setHistory(prev => [...prev, { type: 'input', text: `$ ${cmd}` }]);
    if (!trimmed) return;

    setCmdHistory(prev => [cmd, ...prev]);
    historyIdxRef.current = -1;

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    const fn = COMMANDS[trimmed];
    if (fn) {
      setHistory(prev => [...prev, { type: 'output', text: fn() + '\n' }]);
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        text: `Command not found: "${trimmed}"\nType "help" for available commands.\n`,
      }]);
    }
  }, []);

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
      <div className="border-t border-[#33ff00]/10 px-4 py-2 flex flex-wrap gap-1.5">
        {Object.keys(COMMANDS).filter(c => c !== 'clear').map(cmd => (
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
      <div className="border-t border-[#33ff00]/15 px-4 py-3 relative z-20">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-[#33ff00] opacity-60 font-bold shrink-0">›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white placeholder-[#33ff00]/20 caret-[#33ff00]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            autoFocus
            spellCheck={false}
            placeholder="enter command…"
          />
          <span className="w-[7px] h-[1em] bg-[#33ff00] animate-blink opacity-80" />
        </form>
      </div>
    </div>
  );
};

export default TerminalApp;
