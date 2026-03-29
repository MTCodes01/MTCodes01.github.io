import React from 'react';
import { motion } from 'framer-motion';

const EXPERIENCE = [
  {
    role: 'Intern',
    org: 'Logixmotion Pvt Ltd',
    period: 'Nov 2024 - Present',
    primary: true,
    bullets: ['Worked on Initial UI/UX design', 'Frontend Development', 'Gained real-world experience in software development'],
  },
  {
    role: 'Deputy CFA',
    org: 'FOSS CEAL',
    period: 'Jul 2025 - Present',
    primary: true,
    bullets: ['Promoted open-source culture through workshops and events', 'Coordinated with the team to organise events', 'Part of planning most of the events'],
  },
  {
    role: 'CREATE101 Lead',
    org: 'Chambers of FOSS CEAL',
    period: 'Sep 2024 - Aug 2025',
    primary: false,
    bullets: ['Designed posters, videos, grids, and other materials', 'Organised workshops to teach designing', 'Maintained a team of students for Poster Works'],
  },
  {
    role: 'TRAIN303 Lead',
    org: 'Chambers of FOSS CEAL',
    period: 'Aug 2025 - Dec 2025',
    primary: false,
    bullets: ['Build Websites for College Clubs', 'Contributed in making open-source projects', 'Formed a team to continue building websites and gaining experience'],
  },
  {
    role: 'DEPLOY505 Lead',
    org: 'Chambers of FOSS CEAL',
    period: 'Dec 2025 - Present',
    primary: true,
    bullets: ['Deployed a lot of websites for Clubs, Events, and other purposes', 'Gained experience in server deployment and cloud fundamentals', 'Maintained all the domains and hosting for most of the websites'],
  },
  {
    role: 'Technical Team Lead',
    org: 'Alchemy IEDC CEAL',
    period: 'Feb 2025 - Mar 2026',
    primary: false,
    bullets: ['Updated the website for Alchemy IEDC CEAL', 'Gave technical support during events'],
  },
  {
    role: 'Web Master',
    org: 'IEEE SB CEAL',
    period: 'Feb 2025 - Mar 2026',
    primary: false,
    bullets: ['Designed and developed the IEEE student branch CEAL website', 'Technical Support for events', 'Made the initial websites for event proporsals'],
  },
  {
    role: 'Design Lead',
    org: 'ISTE CEAL',
    period: 'Apr 2025 - Mar 2026',
    primary: false,
    bullets: ['Guided my team to work on posters and other materials', 'Helped in some designing works'],
  },
];

const SKILLS_MAP: Record<string, { items: string[]; accent: string }> = {
  'Designing':  { items: ['Figma', 'Photoshop'], accent: '#ff003c' },
  'Frontend':    { items: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'], accent: '#00f0ff' },
  'Backend':     { items: ['Python', 'Django', 'Flask'], accent: '#ffaa00' },
  'Video Edit':  { items: ['After Effects', 'DaVinci Resolve'], accent: '#9333ea' },
  'Database':    { items: ['MySQL', 'PostgreSQL', 'SQLite'], accent: '#00f0ff' },
};

const ResumeApp: React.FC = () => {
  const handlePrint = () => window.print();

  return (
    <div className="h-full overflow-auto bg-[#08080d] text-white p-8 font-inter">
      <div className="max-w-4xl mx-auto min-h-full relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col md:flex-row justify-between md:items-start border-b border-white/8 pb-8 mb-10 gap-6"
        >
          <div>
            <h1 className="text-5xl font-space-grotesk font-bold mb-1 uppercase tracking-tighter text-white">
              Sreedev S S
            </h1>
            <p className="text-[#00f0ff] font-jetbrains text-sm tracking-widest uppercase">
              Developer · Designer · Editor
            </p>
          </div>
          <div className="text-right text-[11px] text-white/35 space-y-1.5 font-jetbrains">
            <div className="flex items-center justify-end gap-2">
              <span className="text-[#00f0ff]/60 text-[9px] tracking-widest uppercase">Email</span>
              <span className="text-white/50">sreedevss05@gmail.com</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[#00f0ff]/60 text-[9px] tracking-widest uppercase">Web</span>
              <span className="text-white/50">sreedevss.in</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[#00f0ff]/60 text-[9px] tracking-widest uppercase">Location</span>
              <span className="text-white/50">Thiruvananthapuram, Kerala</span>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main — Experience + Education */}
          <div className="md:col-span-2 space-y-10">

            {/* Experience */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 flex items-center gap-3 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50">01.</span> Experience
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[#00f0ff]/40 via-white/10 to-transparent" />

                <div className="space-y-7 pl-6">
                  {EXPERIENCE.map((exp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i + 0.15 }}
                      className="relative group"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute -left-7 top-1.5 w-2.5 h-2.5 rotate-45 ${exp.primary ? 'bg-[#00f0ff]' : 'bg-white/20 group-hover:bg-white/40'} transition-colors`} />

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                        <h3 className="font-space-grotesk font-bold text-base text-white group-hover:text-[#00f0ff] transition-colors">
                          {exp.role}
                        </h3>
                        <span className="font-jetbrains text-[10px] text-white/25 uppercase tracking-widest whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <p className={`font-jetbrains text-[11px] mb-2 uppercase tracking-wider ${exp.primary ? 'text-[#00f0ff]/80' : 'text-white/35'}`}>
                        {exp.org}
                      </p>
                      {exp.bullets && (
                        <ul className="space-y-0.5">
                          {exp.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-white/45 font-inter">
                              <span className="text-[#00f0ff]/40 mt-0.5 shrink-0">-</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Education */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 flex items-center gap-3 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50">02.</span> Education
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-space-grotesk font-bold text-base text-white">
                    B.Tech in Computer Science &amp; Engineering
                  </h3>
                  <p className="font-jetbrains text-[11px] text-[#00f0ff]/70 uppercase tracking-wider mt-1">
                    College of Engineering, Attingal (CEAL)
                  </p>
                  <p className="font-jetbrains text-[10px] text-white/25 mt-0.5">2023 - Present · Thiruvananthapuram</p>
                </div>
                <div>
                  <h3 className="font-space-grotesk font-bold text-base text-white">
                    Secondary Education
                  </h3>
                  <p className="font-jetbrains text-[11px] text-white/35 uppercase tracking-wider mt-1">
                    Dr. GR Public School, Neyyattinkara
                  </p>
                  <p className="font-jetbrains text-[10px] text-white/25 mt-0.5">2021 - 2023 · Thiruvananthapuram</p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar — Skills + Languages + Download */}
          <div className="space-y-8">
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50 mr-2">03.</span> Skills
              </h2>
              <div className="space-y-6">
                {Object.entries(SKILLS_MAP).map(([category, { items, accent }]) => (
                  <div key={category}>
                    <h4 className="font-jetbrains font-bold text-[10px] uppercase tracking-widest text-white/30 mb-2">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-white/[0.04] border border-white/8 text-white/60 text-[11px] font-jetbrains hover:text-white hover:bg-white/8 transition-all cursor-default"
                          style={{ borderLeftColor: accent, borderLeftWidth: 2 }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-4 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50 mr-2">04.</span> Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {['English', 'Malayalam', 'Hindi'].map(lang => (
                  <span key={lang} className="px-2.5 py-1 bg-white/[0.04] border border-white/8 text-white/50 text-xs font-jetbrains">
                    {lang}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Download / Print */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <button
                onClick={handlePrint}
                className="w-full py-3.5 bg-[#00f0ff]/8 text-[#00f0ff] border border-[#00f0ff]/40 hover:bg-[#00f0ff] hover:text-black transition-all text-center font-space-grotesk font-bold text-xs uppercase tracking-widest group"
              >
                <span className="group-hover:translate-x-0.5 inline-block transition-transform">
                  ↓ Print / Save PDF
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeApp;
