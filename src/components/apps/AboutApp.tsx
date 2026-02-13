import React from 'react';

const AboutApp: React.FC = () => {
    return (
    <div className="h-full overflow-auto p-8 text-white flex flex-col items-center justify-center font-inter bg-dotted-pattern">
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          {/* Avatar Frame */}
          <div className="relative group">
            <div className="w-40 h-40 border-2 border-white/20 relative flex items-center justify-center bg-black overflow-hidden group-hover:border-[#ff003c] transition-colors">
              <div className="absolute inset-0 bg-[#ff003c]/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
              {/* Scanline for avatar */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff003c]/10 to-transparent h-1/2 w-full animate-scan" />
              <span className="text-8xl filter grayscale group-hover:grayscale-0 transition-all">👨‍💻</span>
            </div>
            {/* Tech markers */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#ff003c]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#ff003c]" />
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl font-space-grotesk font-bold mb-2 uppercase tracking-tighter glitch-hover" data-text="SREEDEV S S">
              SREEDEV S S
            </h1>
            <div className="flex items-center gap-3 justify-center md:justify-start text-[#ff003c] font-mono text-sm tracking-widest uppercase">
              <span className="w-2 h-2 bg-[#ff003c] animate-pulse" /> B.Tech in CSE
              <span className="w-2 h-2 bg-[#ff003c] animate-pulse" /> 3rd Year
            </div>
          </div>
        </div>

        <div className="border-l-2 border-[#ff003c]/30 pl-6 text-white/80 leading-relaxed max-w-lg mb-12 font-mono text-sm md:text-base">
          <p>
            <span className="text-[#ff003c]">{">>"}</span> Computer Science student and <span className="text-white bg-[#ff003c]/20 px-1">Python developer</span> blending technical logic with creative design. From engineering complex redstone circuits to digital design, I'm dedicated to building impactful solutions and constantly exploring new technological frontiers.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <a
            href="https://github.com/MTCodes01"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/5 border border-white/20 hover:border-[#ff003c] hover:bg-[#ff003c]/10 hover:text-[#ff003c] transition-all flex items-center gap-2 font-mono text-sm group"
          >
            <span>GITHUB</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </a>
          <a
            href="https://www.linkedin.com/in/sreedevss/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/5 border border-white/20 hover:border-[#ff003c] hover:bg-[#ff003c]/10 hover:text-[#ff003c] transition-all flex items-center gap-2 font-mono text-sm group"
          >
            <span>LINKEDIN</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </a>
          <a
            href="https://www.instagram.com/_mt_yt_"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/5 border border-white/20 hover:border-[#ff003c] hover:bg-[#ff003c]/10 hover:text-[#ff003c] transition-all flex items-center gap-2 font-mono text-sm group"
          >
            <span>INSTAGRAM</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </a>
          <a
            href="https://www.youtube.com/@MT_yt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/5 border border-white/20 hover:border-[#ff003c] hover:bg-[#ff003c]/10 hover:text-[#ff003c] transition-all flex items-center gap-2 font-mono text-sm group"
          >
            <span>YOUTUBE</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};
 
export default AboutApp;
