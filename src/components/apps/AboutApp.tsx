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
            <div className="flex flex-col gap-2 items-center md:items-start text-[#ff003c] font-mono text-sm tracking-widest uppercase">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#ff003c] animate-pulse" /> B.Tech in CSE
                <span className="w-2 h-2 bg-[#ff003c] animate-pulse" /> 3rd Year
              </div>
              <div className="flex items-center gap-3 text-white/50 text-xs">
                 <span>CEAL, Trivandrum</span>
                 <span className="w-1 h-1 bg-white/20 rounded-full" />
                 <span>Kerala, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l-2 border-[#ff003c]/30 pl-6 text-white/80 leading-relaxed max-w-lg mb-12 font-mono text-sm md:text-base">
          <p className="mb-4">
            <span className="text-[#ff003c]">{">>"}</span> I am a <span className="text-white bg-[#ff003c]/20 px-1">Developer</span>, a <span className="text-white bg-[#ff003c]/20 px-1">Designer</span>, and an <span className="text-white bg-[#ff003c]/20 px-1">Editor</span>. B.Tech CSE student at College of Engineering Attingal, skilled in web design, frontend & backend development along with managing servers, and video editing.
          </p>
          <p>
            <span className="text-[#ff003c]">{">>"}</span> Passionate about building impactful digital experiences. Beyond code, I'm a <span className="text-[#ff003c]">Minecraft Redstoner</span> and <span className="text-[#ff003c]">Content Creator</span><i>(Sometimes)</i>.
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
