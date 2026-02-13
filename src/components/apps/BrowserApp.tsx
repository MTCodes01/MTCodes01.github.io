import React, { useState } from 'react';

const PRESET_URLS = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'CodePen', url: 'https://codepen.io' },
  { name: 'MDN Docs', url: 'https://developer.mozilla.org' },
];

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState(PRESET_URLS[0].url);
  const [inputUrl, setInputUrl] = useState(PRESET_URLS[0].url);

  const handleNavigate = () => {
    setUrl(inputUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#e0e0e0] font-mono">
      {/* Browser Chrome */}
      <div className="bg-[#f0f0f0] p-2 flex items-center gap-2 border-b-2 border-black/10 shadow-sm relative z-10">
        <div className="flex gap-1">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 flex items-center justify-center border border-black/10 hover:bg-black/5 hover:border-black/30 transition-all text-black/60"
            title="Back"
          >
            ←
          </button>
          <button
            onClick={() => window.history.forward()}
            className="w-8 h-8 flex items-center justify-center border border-black/10 hover:bg-black/5 hover:border-black/30 transition-all text-black/60"
            title="Forward"
          >
            →
          </button>
          <button
            onClick={() => setUrl(url + '?refresh=' + Date.now())}
            className="w-8 h-8 flex items-center justify-center border border-black/10 hover:bg-black/5 hover:border-black/30 transition-all text-black/60"
            title="Refresh"
          >
            ↻
          </button>
        </div>

        <div className="flex-1 flex gap-2 bg-white border border-black/20 px-3 py-1.5 focus-within:border-[#00f0ff] focus-within:shadow-[0_0_0_2px_rgba(0,240,255,0.2)] transition-all">
          <span className="text-green-500 text-xs self-center">SECURE://</span>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent text-sm focus:outline-none text-black font-mono"
            placeholder="ENTER URL..."
          />
        </div>

        <button
          onClick={handleNavigate}
          className="px-4 py-1.5 bg-black text-white hover:bg-black/80 text-xs font-bold uppercase tracking-wider border border-transparent transition-colors"
        >
          GO
        </button>
      </div>

      {/* Preset URLs */}
      <div className="bg-[#e8e8e8] px-2 py-1 flex gap-2 border-b border-black/5 overflow-x-auto">
        {PRESET_URLS.map(preset => (
          <button
            key={preset.name}
            onClick={() => {
              setUrl(preset.url);
              setInputUrl(preset.url);
            }}
            className="flex items-center gap-2 px-3 py-1 bg-white border border-black/10 hover:border-black/30 hover:shadow-sm text-xs text-black/70 transition-all uppercase tracking-wide"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full opacity-50"></span>
            {preset.name}
          </button>
        ))}
      </div>

      {/* iframe */}
      <div className="flex-1 bg-white relative">
        <iframe
          src={url}
          className="w-full h-full border-0 grayscale-[20%] contrast-110"
          title="Browser Preview"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
        {/* Loading Overlay (simulated) */}
        <div className="absolute inset-0 bg-white flex items-center justify-center pointer-events-none opacity-0 transition-opacity">
          <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default BrowserApp;
