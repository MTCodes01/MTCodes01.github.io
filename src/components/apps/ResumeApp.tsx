import React from 'react';
import { motion } from 'framer-motion';

const EXPERIENCE = [
  {
    role: 'Software Development Intern',
    org: 'LogixMotion Pvt. Ltd.',
    period: 'Nov 2024 - Jul 2026',
    primary: true,
    bullets: [
      'Contributed from product ideation through development, helping validate the feasibility of a proposed mapping-based product and participating in architecture and technology decisions.',
      'Designed the initial UI/UX in Figma and built the first functional web prototype using HTML, CSS, JavaScript, Leaflet, and Geoman for interactive mapping and geometry-based workflows.',
      'Migrated the validated prototype to Ionic, React, and Capacitor for web, Android, and iOS compatibility, while developing core functionality and implementing customer-driven product requirements.',
      'Migrated the mapping system from Leaflet to MapLibre to support 3D mapping capabilities while retaining Geoman for map interactions and editing.',
      'Implemented UI/UX improvements including light/dark mode, contributed to core application logic, and supported teammates throughout development.'
    ],
  }
];

const PROJECTS = [
  {
    name: 'CEAL Calendar',
    tech: 'Django, React, PostgreSQL, Docker, Celery',
    desc: 'Full-stack event and calendar management platform for college communities. Implements event management, club hierarchy, role-based access control, REST APIs, and automated email notifications using Celery.',
    link: 'https://github.com/MTCodes01/CEAL-Calendar'
  },
  {
    name: 'Commit Overflow',
    tech: 'React, Go, SQLite, Docker',
    desc: 'Full-stack platform for a month-long beginner-friendly FOSS contribution program. Developed frontend and Maintained backend components, including REST APIs, database operations, dynamic tag statistics, GitHub & GitLab Integrations and Docker-based deployment.',
    link: 'https://github.com/MTCodes01/commit_overflow'
  },
  {
    name: 'FlowTrack',
    tech: 'Tauri, React, TypeScript, Vite',
    desc: 'Open-source cross-platform desktop application for tracking software usage across Windows, macOS, and Linux. Includes background usage tracking, analytics, yearly activity heatmaps, application categorization, aliases, and configurable backend integration.',
    link: 'https://github.com/MTCodes01/FlowTrack'
  }
];

const LEADERSHIP = [
  {
    role: 'Mentor (Tech) · Former Deputy CFA',
    org: 'FOSS CEAL',
    period: 'Jul 2025 - Present',
    primary: true,
    bullets: [
      'Currently mentor executive committee members in technical responsibilities and assist with technical decision-making.',
      'Previously served as Deputy CFA, promoting open-source culture through workshops and events while contributing to planning and coordination.'
    ]
  },
  {
    role: 'Web Master',
    org: 'IEEE SB CEAL',
    period: 'Feb 2025 - Mar 2026',
    bullets: [
      'Designed and developed the IEEE Student Branch CEAL website and provided technical support for events.'
    ]
  },
  {
    role: 'Technical Team Lead',
    org: 'Alchemy IEDC CEAL',
    period: 'Feb 2025 - Mar 2026',
    bullets: [
      'Maintained the organization\'s website and provided technical support during events.'
    ]
  },
  {
    role: 'Design Lead',
    org: 'ISTE CEAL',
    period: 'Apr 2025 - Mar 2026',
    bullets: [
      'Guided the design team in creating posters and other visual materials.'
    ]
  }
];

const SKILLS_MAP: Record<string, { items: string[]; accent: string }> = {
  'Languages':              { items: ['Python', 'C', 'JavaScript', 'TypeScript', 'HTML', 'CSS'], accent: '#00f0ff' },
  'Frameworks & Libraries': { items: ['React', 'Django', 'Flask', 'Three.js'], accent: '#ffaa00' },
  'Databases':              { items: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'], accent: '#00f0ff' },
  'DevOps & Infra':         { items: ['Docker', 'Docker Compose', 'Linux/Debian', 'GitHub Actions', 'Cloudflare', 'SSH', 'DNS'], accent: '#22c55e' },
  'Development Tools':      { items: ['Git', 'GitHub', 'GitLab', 'VS Code', 'Figma'], accent: '#9333ea' },
  'AI Tools':               { items: ['Antigravity', 'ChatGPT', 'Claude', 'Gemini'], accent: '#ff003c' },
};

const ResumeApp: React.FC = () => {
  const handlePrint = () => {
    const originalNode = document.getElementById('resume-print-area');
    if (!originalNode) return;

    const printMount = document.createElement('div');
    printMount.id = 'print-mount';
    printMount.className = 'font-inter';
    printMount.innerHTML = originalNode.innerHTML;

    const varOverride = document.createElement('style');
    varOverride.textContent = `
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
      #print-mount * {
        background-color: transparent !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      #print-mount > * {
        background-color: white !important;
      }
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
      #print-mount *[class*="text-os-main"]   { color: #111111 !important; }
      #print-mount *[class*="text-os-muted"]  { color: #555555 !important; }
      #print-mount *[class*="bg-os-surface"]  { background: #f9f9f9 !important; }
      #print-mount *[class*="bg-os-element"]  { background: white !important; }
      #print-mount *[class*="border-os-muted"]{ border-color: #cccccc !important; }
      #print-mount *[class*="border-os"]      { border-color: #cccccc !important; }
      #print-mount [style*="color: rgb(0, 240, 255)"]            { color: #0056b3 !important; }
      #print-mount [style*="border-left-color: rgb(0, 240, 255)"]{ border-left-color: #0056b3 !important; }
      #print-mount [style*="background-color: rgb(0, 240, 255)"] { background-color: transparent !important; }
      #print-mount .relative.group {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      #print-mount .grid {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 2.5rem !important;
      }
      #print-mount .md\\:col-span-2 {
        grid-column: span 2 / span 2 !important;
      }
      #print-mount header.flex {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
      }
      #print-mount .sm\\:flex-row {
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
      }
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
              Full-Stack Developer · Designer · Editor
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
              <span className="text-os-muted">Kerala, India</span>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-10">

            {/* Summary */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-4 flex items-center gap-3 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50">01.</span> Summary
              </h2>
              <p className="text-sm text-os-muted leading-relaxed font-inter">
                B.Tech Computer Science student focused on full-stack web development, open-source software, and application deployment. Experienced in building applications with React, Django, Go, PostgreSQL, and Docker, with hands-on experience developing both frontend and backend systems.
              </p>
            </motion.section>

            {/* Experience */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 flex items-center gap-3 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50">02.</span> Experience
              </h2>
              <div className="relative">
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
                        <ul className="space-y-1">
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

            {/* Projects */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 flex items-center gap-3 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50">03.</span> Projects
              </h2>
              <div className="space-y-6">
                {PROJECTS.map((proj, i) => (
                  <div key={i} className="group relative">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                      <h3 className="font-space-grotesk font-bold text-base text-os-main group-hover:text-[#00f0ff] transition-colors">
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.name}</a>
                      </h3>
                    </div>
                    <p className="font-jetbrains text-[10px] text-[#00f0ff]/80 uppercase tracking-wider mb-2">
                      {proj.tech}
                    </p>
                    <p className="text-xs text-os-muted font-inter">
                      {proj.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Leadership */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 flex items-center gap-3 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50">04.</span> Leadership
              </h2>
              <div className="relative">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[#00f0ff]/40 via-os-muted/30 to-transparent" />
                <div className="space-y-7 pl-6">
                  {LEADERSHIP.map((lead: any, i) => (
                    <div key={i} className="relative group">
                      <div className={`absolute -left-7 top-1.5 w-2.5 h-2.5 rotate-45 ${lead.primary ? 'bg-[#00f0ff]' : 'bg-os-surface group-hover:bg-[#00f0ff]/50'} transition-colors`} />
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                        <h3 className="font-space-grotesk font-bold text-base text-os-main group-hover:text-[#00f0ff] transition-colors">
                          {lead.org}
                        </h3>
                        <span className="font-jetbrains text-[10px] text-os-muted uppercase tracking-widest whitespace-nowrap">
                          {lead.period}
                        </span>
                      </div>
                      <p className="font-jetbrains text-[11px] mb-2 uppercase tracking-wider text-[#00f0ff]/80">
                        {lead.role}
                      </p>
                      {lead.bullets && (
                        <ul className="space-y-1">
                          {lead.bullets.map((b: string, j: number) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-os-muted font-inter">
                              <span className="text-[#00f0ff]/40 mt-0.5 shrink-0">-</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Education */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 flex items-center gap-3 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50">05.</span> Education
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-space-grotesk font-bold text-base text-os-main">
                    B.Tech in Computer Science & Engineering
                  </h3>
                  <p className="font-jetbrains text-[11px] text-[#00f0ff]/70 uppercase tracking-wider mt-1">
                    College of Engineering Attingal (CEAL)
                  </p>
                  <p className="font-jetbrains text-[10px] text-os-muted mt-0.5">Sep 2023 - Present · Kerala, India</p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar - Skills + Languages + Download */}
          <div className="space-y-8">
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="font-space-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f0ff] mb-6 border-b border-[#00f0ff]/15 pb-2">
                <span className="text-base opacity-50 mr-2">06.</span> Skills
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

            {/* Download / Print */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="no-print sticky top-8">
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
