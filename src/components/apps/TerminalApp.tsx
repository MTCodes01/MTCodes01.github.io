import React, { useState, useRef, useEffect } from 'react';

const COMMANDS: Record<string, () => string> = {
  whoami: () => `Sreedev S S — Developer, Designer, Editor
Location: Thiruvananthapuram, India
Education: B.Tech in CSE, College of Engineering, Attingal
Passion: Building impactful digital experiences`,
  
  skills: () => `Technical Skills:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design:    Figma, Photoshop
Frontend:  HTML, CSS, JS (React), TypeScript
Backend:   Python (Django, Flask)
Editing:   After Effects, Da Vinci
Database:  MySQL, Postgres, SQLite`,

  projects: () => `Featured Projects:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Check out my work on GitHub:
github.com/MTCodes01

Type 'open projects' to view details`,

  contact: () => `Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:     sreedevss05@gmail.com
GitHub:    github.com/MTCodes01
LinkedIn:  linkedin.com/in/sreedevss
Instagram: @_mt_yt_
YouTube:   @MT_yt`,

  help: () => `Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
whoami    - Display information about me
skills    - List technical skills
projects  - Show featured projects
contact   - Display contact information
clear     - Clear terminal screen
help      - Show this help message`,

  clear: () => 'CLEAR',
};

const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; text: string }>>([
    { type: 'output', text: 'Portfolio Terminal v1.0.0' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setHistory(prev => [...prev, { type: 'input', text: `$ ${cmd}` }]);

    if (trimmed === '') return;

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    const output = COMMANDS[trimmed];
    if (output) {
      setHistory(prev => [...prev, { type: 'output', text: output() + '\n' }]);
    } else {
      setHistory(prev => [...prev, { type: 'output', text: `Command not found: ${trimmed}\nType "help" for available commands.\n` }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="h-full bg-black/90 text-[#33ff00] font-mono text-sm p-4 flex flex-col font-jetbrains shadow-inner relative overflow-hidden">
      {/* CRT Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none z-10" />
      
      <div ref={terminalRef} className="flex-1 overflow-auto mb-4 space-y-1 scrollbar-hide relative z-0">
        {history.map((entry, i) => (
          <div key={i} className={`${entry.type === 'input' ? 'text-white' : 'text-[#33ff00]'} drop-shadow-[0_0_2px_rgba(51,255,0,0.4)]`}>
            <pre className="whitespace-pre-wrap font-inherit">{entry.text}</pre>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-[#33ff00]/30 pt-3 relative z-20">
        <div className="mb-3 flex flex-wrap gap-2">
          {Object.keys(COMMANDS).filter(cmd => cmd !== 'clear').map(cmd => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              className="px-2 py-1 bg-[#33ff00]/10 hover:bg-[#33ff00]/20 border border-[#33ff00]/30 hover:border-[#33ff00] text-[#33ff00] text-xs transition-all uppercase tracking-wider"
            >
              [{cmd}]
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-black p-2 border border-[#33ff00]/30">
          <span className="text-[#33ff00] font-bold">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[#33ff00] placeholder-[#33ff00]/30 font-bold"
            autoFocus
            spellCheck={false}
            placeholder="ENTER COMMAND..."
          />
          <span className="animate-pulse text-[#33ff00] block w-2 h-4 bg-[#33ff00]" />
        </form>
      </div>
    </div>
  );
};

export default TerminalApp;
