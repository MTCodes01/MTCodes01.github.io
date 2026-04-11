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
  const handlePrint = () => {
    const originalNode = document.getElementById('resume-print-area');
    if (!originalNode) return;

    const printMount = document.createElement('div');
    printMount.id = 'print-mount';
    printMount.className = 'font-inter';
    printMount.innerHTML = originalNode.innerHTML;

    // Aggressively override all CSS variables and backgrounds so no dark theme bleeds through.
    // The :root vars (--bg-element, --bg-surface etc.) are inherited even in cloned nodes,
    // so we must re-declare them to white-mode equivalents inside #print-mount.
    const varOverride = document.createElement('style');
    varOverride.textContent = `
      /* Re-declare all OS theme variables to white/light equivalents */
      #print-mount {
        --bg-primary: #ffffff;
        --bg-secondary: #f5f5f5;
        --bg-desktop: #ffffff;
        --bg-window: #ffffff;
        --bg-surface: #f9f9f9;
        --bg-element: #ffffff;
        --glass-bg: #ffffff;
        --border-color: rgba(0,0,0,0.15);
        --glass-border: rgba(0,0,0,0.1);
        --text-main: #111111;
        --text-muted: #555555;
        background: white !important;
        color: #111 !important;
      }

      /* Blanket force: every element gets white background */
      #print-mount * {
        background-color: transparent !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }

      /* Restore white where a filled background is genuinely needed */
      #print-mount > * {
        background-color: white !important;
      }

      /* Neon cyan → professional blue */
      #print-mount *[class*="00f0ff"] {
        color: #0056b3 !important;
        border-color: #0056b3 !important;
      }
      #print-mount *[class*="ff003c"] {
        color: #cc0030 !important;
        border-color: #cc0030 !important;
      }
      #print-mount *[class*="ffaa00"] {
        color: #996600 !important;
        border-color: #996600 !important;
      }

      /* OS semantic color classes */
      #print-mount *[class*="text-os-main"]   { color: #111111 !important; }
      #print-mount *[class*="text-os-muted"]  { color: #555555 !important; }
      #print-mount *[class*="bg-os-surface"]  { background: #f9f9f9 !important; }
      #print-mount *[class*="bg-os-element"]  { background: white !important; }
      #print-mount *[class*="border-os-muted"]{ border-color: #cccccc !important; }
      #print-mount *[class*="border-os"]      { border-color: #cccccc !important; }

      /* Inline style overrides for neon colors set directly on elements */
      #print-mount [style*="color: rgb(0, 240, 255)"]            { color: #0056b3 !important; }
      #print-mount [style*="border-left-color: rgb(0, 240, 255)"]{ border-left-color: #0056b3 !important; }
      #print-mount [style*="background-color: rgb(0, 240, 255)"] { background-color: transparent !important; }

      /* Page breaking: never cut an experience entry in half */
      #print-mount .relative.group {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      /* Hide print button in cloned node */
      #print-mount .no-print { display: none !important; }
    `;
    document.head.appendChild(varOverride);
    document.body.appendChild(printMount);

    const cleanup = () => {
      if (document.body.contains(printMount)) document.body.removeChild(printMount);
      if (document.head.contains(varOverride)) document.head.removeChild(varOverride);
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();

    // Safety fallback in case afterprint never fires
    setTimeout(cleanup, 10000);
  };

  return (
    <div className="h-full overflow-auto bg-os-element text-os-main p-8 font-inter" id="resume-print-area">
      <div className="max-w-4xl mx-auto min-h-full relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col md:flex-row justify-between md:items-start border-b border-os-muted pb-8 mb-10 gap-6"
        >
          <div>
            <h1 className="text-5xl font-space-grotesk font-bold mb-1 uppercase tracking-tighter text-os-main">
              Sreedev S S
            </h1>
            <p className="text-[#00f0ff] font-jetbrains text-sm tracking-widest uppercase">
              Developer · Designer · Editor
            </p>
          </div>
          <div className="text-right text-[11px] text-os-muted space-y-1.5 font-jetbrains">
            <div className="flex items-center justify-end gap-2">
              <span className="text-[#00f0ff]/60 text-[9px] tracking-widest uppercase">Email</span>
              <span className="text-os-muted">sreedevss05@gmail.com</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[#00f0ff]/60 text-[9px] tracking-widest uppercase">Web</span>
              <span className="text-os-muted">sreedevss.in</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[#00f0ff]/60 text-[9px] tracking-widest uppercase">Location</span>
              <span className="text-os-muted">Thiruvananthapuram, Kerala</span>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main - Experience + Education */}
          <div className="md:col-span-2 space-y-10">

            {/* Experience */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 flex items-center gap-3 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50">01.</span> Experience
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[#00f0ff]/40 via-os-muted/30 to-transparent" />

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
                      <div className={`absolute -left-7 top-1.5 w-2.5 h-2.5 rotate-45 ${exp.primary ? 'bg-[#00f0ff]' : 'bg-os-surface group-hover:bg-os-surface'} transition-colors`} />

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                        <h3 className="font-space-grotesk font-bold text-base text-os-main group-hover:text-[#00f0ff] transition-colors">
                          {exp.role}
                        </h3>
                        <span className="font-jetbrains text-[10px] text-os-muted uppercase tracking-widest whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <p className={`font-jetbrains text-[11px] mb-2 uppercase tracking-wider ${exp.primary ? 'text-[#00f0ff]/80' : 'text-os-muted'}`}>
                        {exp.org}
                      </p>
                      {exp.bullets && (
                        <ul className="space-y-0.5">
                          {exp.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-os-muted font-inter">
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
                  <h3 className="font-space-grotesk font-bold text-base text-os-main">
                    B.Tech in Computer Science &amp; Engineering
                  </h3>
                  <p className="font-jetbrains text-[11px] text-[#00f0ff]/70 uppercase tracking-wider mt-1">
                    College of Engineering, Attingal (CEAL)
                  </p>
                  <p className="font-jetbrains text-[10px] text-os-muted mt-0.5">2023 - Present · Thiruvananthapuram</p>
                </div>
                <div>
                  <h3 className="font-space-grotesk font-bold text-base text-os-main">
                    Secondary Education
                  </h3>
                  <p className="font-jetbrains text-[11px] text-os-muted uppercase tracking-wider mt-1">
                    Dr. GR Public School, Neyyattinkara
                  </p>
                  <p className="font-jetbrains text-[10px] text-os-muted mt-0.5">2021 - 2023 · Thiruvananthapuram</p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar - Skills + Languages + Download */}
          <div className="space-y-8">
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50 mr-2">03.</span> Skills
              </h2>
              <div className="space-y-6">
                {Object.entries(SKILLS_MAP).map(([category, { items, accent }]) => (
                  <div key={category}>
                    <h4 className="font-jetbrains font-bold text-[10px] uppercase tracking-widest text-os-muted mb-2">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-os-surface border border-os-muted text-os-muted text-[11px] font-jetbrains hover:text-os-main hover:bg-os-element transition-all cursor-default"
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
                  <span key={lang} className="px-2.5 py-1 bg-os-surface border border-os-muted text-os-muted text-xs font-jetbrains">
                    {lang}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Download / Print */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="no-print">
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
