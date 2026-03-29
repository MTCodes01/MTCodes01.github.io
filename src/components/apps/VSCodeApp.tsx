import React from 'react';

const VSCodeApp: React.FC = () => {
  const vscodeUrl = "https://github1s.com/MTCodes01/MTCodes01.github.io/blob/Master/README.md";

  return (
    <div className="h-full w-full bg-[#1e1e1e] overflow-hidden flex flex-col">
      {/* Loading state / Background */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1e1e] text-white/10 -z-10 animate-pulse">
        <span className="text-6xl text-blue-500/20 mb-4">󰨞</span>
        <span className="text-[10px] uppercase tracking-[0.4em]">Initializing VS Code Environment...</span>
      </div>

      <iframe 
        src={vscodeUrl}
        className="w-full h-full border-0 relative z-10"
        title="VS Code - MTCodes01"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default VSCodeApp;
