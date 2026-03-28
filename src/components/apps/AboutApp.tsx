import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ROLES = ['Developer', 'Designer', 'Editor'];

const SKILLS = [
  { label: 'React', color: '#61dafb' },
  { label: 'TypeScript', color: '#3178c6' },
  { label: 'Python', color: '#3572A5' },
  { label: 'Django', color: '#092e20' },
  { label: 'Figma', color: '#f24e1e' },
  { label: 'HTML/CSS', color: '#e34c26' },
  { label: 'MySQL', color: '#00758f' },
  { label: 'After Effects', color: '#9999ff' },
];

const SOCIALS = [
  {
    label: 'GitHub',
    short: 'GH',
    url: 'https://github.com/MTCodes01',
    color: '#ffffff',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    short: 'LI',
    url: 'https://www.linkedin.com/in/sreedevss/',
    color: '#0a66c2',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    short: 'IG',
    url: 'https://www.instagram.com/_mt_yt_',
    color: '#e1306c',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    short: 'YT',
    url: 'https://www.youtube.com/@MT_yt',
    color: '#ff0000',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
];

const AboutApp: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter effect for roles
  useEffect(() => {
    const role = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < role.length) {
        timeout = setTimeout(() => setCharIndex(c => c + 1), 90);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
      setDisplayed(role.slice(0, charIndex));
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => setCharIndex(c => c - 1), 45);
        setDisplayed(role.slice(0, charIndex));
      } else {
        setIsDeleting(false);
        setRoleIndex(r => (r + 1) % ROLES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <div className="h-full overflow-auto px-8 pt-8 pb-6 text-white font-inter bg-dot-pattern">
      <div className="max-w-2xl mx-auto w-full">

        {/* Hero row */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative shrink-0"
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-2 rounded-none opacity-30 blur-md bg-[#ff003c]" />
            <div className="relative w-36 h-36 border border-[#ff003c]/40 bg-gradient-to-br from-[#1a0008] to-[#0a0a0f] flex items-center justify-center overflow-hidden group">
              {/* Scan line */}
              <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-[#ff003c]/15 to-transparent animate-scan pointer-events-none" />
              {/* Initials */}
              <span className="font-space-grotesk font-bold text-4xl text-white/90 tracking-tight select-none z-10">SS</span>
              {/* Corner marks */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff003c]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff003c]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff003c]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff003c]" />
            </div>
          </motion.div>

          {/* Name + animated role */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center md:text-left flex-1"
          >
            <h1 className="text-5xl font-space-grotesk font-bold mb-3 uppercase tracking-tighter text-white">
              Sreedev S S
            </h1>

            {/* Animated role line */}
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <span className="w-2 h-2 bg-[#ff003c] rounded-none animate-pulse shrink-0" />
              <span className="font-jetbrains text-sm text-[#ff003c] min-w-[120px]">
                {displayed}
                <span className="animate-blink inline-block w-[2px] h-[1em] bg-[#ff003c] ml-0.5 align-middle" />
              </span>
            </div>

            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-jetbrains text-xs text-white/30 uppercase tracking-widest">B.Tech CSE</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="font-jetbrains text-xs text-white/30 uppercase tracking-widest">CEAL, Kerala</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="font-jetbrains text-xs text-white/30 uppercase tracking-widest">India</span>
            </div>
          </motion.div>
        </div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="border-l-2 border-[#ff003c]/40 pl-5 mb-8 space-y-3"
        >
          <p className="text-white/70 leading-relaxed text-sm font-inter">
            <span className="text-[#ff003c] font-jetbrains mr-1">&gt;&gt;</span>
            B.Tech CSE student at{' '}
            <span className="text-white border-b border-white/20">College of Engineering Attingal</span>,
            skilled in web design, full-stack development, server management, and video editing.
          </p>
          <p className="text-white/60 leading-relaxed text-sm font-inter">
            <span className="text-[#ff003c] font-jetbrains mr-1">&gt;&gt;</span>
            Passionate about building impactful digital experiences. Beyond code, I'm a{' '}
            <span className="text-[#ff003c]">Minecraft Redstoner</span> and{' '}
            <span className="text-[#ff003c]">Content Creator</span>{' '}
            <span className="text-white/30 italic">(sometimes)</span>.
          </p>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <p className="font-jetbrains text-[10px] text-white/30 uppercase tracking-widest mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <span
                key={skill.label}
                className="px-2.5 py-1 bg-white/[0.04] border border-white/10 text-white/60 text-xs font-jetbrains hover:border-[#ff003c]/50 hover:text-white hover:bg-[#ff003c]/5 transition-all cursor-default"
                style={{ borderLeftColor: skill.color, borderLeftWidth: 2 }}
              >
                {skill.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          {SOCIALS.map(s => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/10 hover:border-[#ff003c]/60 hover:bg-[#ff003c]/5 transition-all duration-200"
            >
              <span className="text-white/40 group-hover:text-[#ff003c] transition-colors">{s.icon}</span>
              <span className="font-jetbrains text-xs text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
                {s.label}
              </span>
              <span className="text-white/20 group-hover:text-[#ff003c]/60 transition-all opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 duration-200">
                →
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutApp;
