import React, { useState } from 'react';

const PRESET_URLS = [
  { name: 'My GitHub',  url: 'https://github.com/MTCodes01' },
  { name: 'LinkedIn',   url: 'https://www.linkedin.com/in/sreedevss/' },
  { name: 'YouTube',    url: 'https://www.youtube.com/@MT_yt' },
  { name: 'MDN Docs',   url: 'https://developer.mozilla.org' },
  { name: 'CodePen',    url: 'https://codepen.io' },
];

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const ForwardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);
const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState(PRESET_URLS[0].url);
  const [inputUrl, setInputUrl] = useState(PRESET_URLS[0].url);
  const [loading, setLoading] = useState(false);

  const navigate = (target: string) => {
    setUrl(target);
    setInputUrl(target);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') navigate(inputUrl);
  };

  return (
    <div className="h-full flex flex-col bg-[#08080d] font-inter">
      {/* Browser chrome */}
      <div className="border-b border-white/8 bg-[#0d0d12] flex flex-col">
        {/* Navigation bar */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Nav buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => window.history.back()}
              className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all"
              title="Back"
            >
              <BackIcon />
            </button>
            <button
              onClick={() => window.history.forward()}
              className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all"
              title="Forward"
            >
              <ForwardIcon />
            </button>
            <button
              onClick={() => navigate(url)}
              className={`w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all ${loading ? 'animate-spin' : ''}`}
              title="Refresh"
            >
              <RefreshIcon />
            </button>
          </div>

          {/* URL bar */}
          <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 focus-within:border-[#00f0ff]/40 focus-within:bg-black/60 transition-all h-8">
            <span className="text-[#33ff00] shrink-0"><LockIcon /></span>
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-white/70 focus:text-white focus:outline-none font-jetbrains"
              placeholder="Enter URL…"
            />
          </div>

          <button
            onClick={() => navigate(inputUrl)}
            className="px-3 h-8 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff] hover:text-black transition-all text-xs font-space-grotesk font-bold uppercase tracking-wider whitespace-nowrap"
          >
            Go
          </button>
        </div>

        {/* Bookmarks bar */}
        <div className="flex items-center gap-1 px-3 pb-2 overflow-x-auto scrollbar-hide">
          {PRESET_URLS.map(preset => (
            <button
              key={preset.name}
              onClick={() => navigate(preset.url)}
              className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-inter whitespace-nowrap transition-all ${
                url === preset.url
                  ? 'bg-white/8 text-white border border-white/15'
                  : 'text-white/35 hover:text-white/70 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="h-[2px] bg-[#00f0ff]/10 overflow-hidden">
          <div
            className="h-full bg-[#00f0ff]"
            style={{
              animation: 'loading-bar 1.2s ease-out forwards',
              boxShadow: '0 0 8px rgba(0,240,255,0.6)',
            }}
          />
        </div>
      )}
      <style>{`@keyframes loading-bar { from { width: 0% } to { width: 95% } }`}</style>

      {/* iframe */}
      <div className="flex-1 relative bg-white">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="Browser Preview"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default BrowserApp;
