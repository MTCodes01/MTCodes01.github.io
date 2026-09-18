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
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Sreedev_Resume</title>
          <style>
            @page {
              margin: 0.35in 0.5in;
            }
            body {
              font-family: "Computer Modern", "Times New Roman", Times, serif;
              font-size: 10pt;
              line-height: 1.15;
              color: #000;
              margin: 0;
              padding: 0;
            }
            a { color: #2563EB; text-decoration: none; }
            .center { text-align: center; }
            .large { font-size: 22pt; font-weight: bold; margin-bottom: 2px; text-transform: uppercase; }
            .subtitle { font-size: 10pt; margin-bottom: 4px; }
            .contact { font-size: 9pt; margin-bottom: 1px; }
            
            .section-title {
              font-size: 12.5pt;
              font-weight: bold;
              border-bottom: 1px solid #000;
              margin-top: 10px;
              margin-bottom: 4px;
              padding-bottom: 1px;
            }
            
            .flex-between {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
            }
            
            .bold { font-weight: bold; }
            .italic { font-style: italic; }
            .small { font-size: 9.5pt; text-align: justify; }
            
            .entry-title { margin-top: 5px; }
            .entry-subtitle { margin-top: 1px; margin-bottom: 2px;}
            
            ul {
              margin-top: 3px;
              margin-bottom: 3px;
              padding-left: 1.2em;
            }
            li {
              margin-bottom: 2px;
              font-size: 9.5pt;
              text-align: justify;
            }
            
            p { margin: 2px 0; }
          </style>
        </head>
        <body>
          <div class="center">
            <div class="large">SREEDEV S S</div>
            <div class="subtitle">Full-Stack Developer &bull; Designer &bull; Editor</div>
            <div class="contact">
              <a href="mailto:sreedevss05@gmail.com">sreedevss05@gmail.com</a> &nbsp;&nbsp;&nbsp;
              +91 89219 30800 &nbsp;&nbsp;&nbsp;
              Kerala, India
            </div>
            <div class="contact">
              <a href="https://github.com/MTCodes01">github.com/MTCodes01</a> &nbsp;&nbsp;&nbsp;
              <a href="https://linkedin.com/in/sreedevss">linkedin.com/in/sreedevss</a> &nbsp;&nbsp;&nbsp;
              <a href="https://sreedevss.in">sreedevss.in</a>
            </div>
          </div>

          <div class="section-title">Summary</div>
          <div class="small">
            B.Tech Computer Science student focused on full-stack web development, open-source software, and application deployment. Experienced in building applications with React, Django, Go, PostgreSQL, and Docker, with hands-on experience developing both frontend and backend systems.
          </div>

          <div class="section-title">Education</div>
          <div class="entry-title flex-between">
            <span class="bold">College of Engineering Attingal (CEAL)</span>
            <span class="small">Sep 2023 - Present</span>
          </div>
          <div class="entry-subtitle flex-between">
            <span class="italic small">B.Tech in Computer Science &amp; Engineering</span>
            <span class="small">Kerala, India</span>
          </div>

          <div class="section-title">Technical Skills</div>
          <div class="small">
            <div><span class="bold">Languages:</span> Python, C, JavaScript, TypeScript, HTML, CSS</div>
            <div><span class="bold">Frameworks &amp; Libraries:</span> React, Django, Flask, Three.js</div>
            <div><span class="bold">Databases:</span> PostgreSQL, MySQL, SQLite, Supabase</div>
            <div><span class="bold">DevOps &amp; Infrastructure:</span> Docker, Docker Compose, Linux/Debian, GitHub Actions, Cloudflare, SSH, DNS</div>
            <div><span class="bold">Development Tools:</span> Git, GitHub, GitLab, VS Code, Figma</div>
            <div><span class="bold">AI Tools:</span> Antigravity, ChatGPT, Claude, Gemini</div>
          </div>

          <div class="section-title">Experience</div>
          <div class="entry-title flex-between">
            <span class="bold">Software Development Intern</span>
            <span class="small">Nov 2024 - Jul 2026</span>
          </div>
          <div class="entry-subtitle flex-between">
            <span class="italic small"><a href="https://logixmotion.com/">LogixMotion Pvt. Ltd.</a></span>
            <span class="small">Remote</span>
          </div>
          <ul>
            <li>Contributed from product ideation through development, helping validate the feasibility of a proposed mapping-based product and participating in architecture and technology decisions.</li>
            <li>Designed the initial UI/UX in Figma and built the first functional web prototype using HTML, CSS, JavaScript, Leaflet, and Geoman for interactive mapping and geometry-based workflows.</li>
            <li>Migrated the validated prototype to Ionic, React, and Capacitor for web, Android, and iOS compatibility, while developing core functionality and implementing customer-driven product requirements.</li>
            <li>Migrated the mapping system from Leaflet to MapLibre to support 3D mapping capabilities while retaining Geoman for map interactions and editing.</li>
            <li>Implemented UI/UX improvements including light/dark mode, contributed to core application logic, and supported teammates throughout development.</li>
          </ul>

          <div class="section-title">Projects</div>
          
          <div class="entry-title flex-between" style="margin-bottom: 2px;">
            <span class="bold"><a href="https://github.com/MTCodes01/CEAL-Calendar">CEAL Calendar</a> <span style="font-weight: normal; font-size: 9pt;">(Used by 5+ Clubs &amp; 40+ Students)</span> &nbsp;</span>
            <span class="small">Django, React, PostgreSQL, Docker, Celery</span>
          </div>
          <div class="small">Full-stack event and calendar management platform for college communities. Implements event management, club hierarchy, role-based access control, REST APIs, and automated email notifications using Celery.</div>

          <div class="entry-title flex-between" style="margin-bottom: 2px;">
            <span class="bold"><a href="https://github.com/MTCodes01/commit_overflow">Commit Overflow</a> <span style="font-weight: normal; font-size: 9pt;">(20+ participants across the program)</span> &nbsp;</span>
            <span class="small">React, Go, SQLite, Docker</span>
          </div>
          <div class="small">Full-stack platform for a month-long beginner-friendly FOSS contribution program. Developed frontend and Maintained backend components, including REST APIs, database operations, dynamic tag statistics, GitHub &amp; GitLab Integrations and Docker-based deployment.</div>

          <div class="entry-title flex-between" style="margin-bottom: 2px;">
            <span class="bold"><a href="https://github.com/MTCodes01/FlowTrack">FlowTrack</a> <span style="font-weight: normal; font-size: 9pt;">(Supports 3 platforms)</span> &nbsp;</span>
            <span class="small">Tauri, React, TypeScript, Vite</span>
          </div>
          <div class="small" style="margin-bottom: 8px;">Open-source cross-platform desktop application for tracking software usage across Windows, macOS, and Linux. Includes background usage tracking, analytics, yearly activity heatmaps, application categorization, aliases, and configurable backend integration.</div>

          <div class="section-title">Leadership</div>
          
          <div class="entry-title flex-between">
            <span class="bold"><a href="https://foss.ceal.in">FOSS CEAL</a></span>
            <span class="small">Jul 2025 - Present</span>
          </div>
          <div class="entry-subtitle flex-between">
            <span class="italic small">Mentor (Tech) &bull; Former Deputy CFA</span>
            <span class="small">College of Engineering Attingal</span>
          </div>
          <ul>
            <li>Currently mentor executive committee members in technical responsibilities and assist with technical decision-making.</li>
            <li>Previously served as Deputy CFA, promoting open-source culture through workshops and events while contributing to planning and coordination.</li>
          </ul>

          <div class="entry-title flex-between">
            <span class="bold"><a href="https://ieee.ceal.in">IEEE SB CEAL</a></span>
            <span class="small">Feb 2025 - Mar 2026</span>
          </div>
          <div class="entry-subtitle flex-between">
            <span class="italic small">Web Master</span>
            <span class="small">College of Engineering Attingal</span>
          </div>
          <ul>
            <li>Designed and developed the IEEE Student Branch CEAL website and provided technical support for events.</li>
          </ul>

          <div class="entry-title flex-between">
            <span class="bold"><a href="https://iedc.ceal.in">Alchemy IEDC CEAL</a></span>
            <span class="small">Feb 2025 - Mar 2026</span>
          </div>
          <div class="entry-subtitle flex-between">
            <span class="italic small">Technical Team Lead</span>
            <span class="small">College of Engineering Attingal</span>
          </div>
          <ul>
            <li>Maintained the organization's website and provided technical support during events.</li>
          </ul>

          <div class="entry-title flex-between">
            <span class="bold"><a href="https://iste.ceal.in">ISTE CEAL</a></span>
            <span class="small">Apr 2025 - Mar 2026</span>
          </div>
          <div class="entry-subtitle flex-between">
            <span class="italic small">Design Lead</span>
            <span class="small">College of Engineering Attingal</span>
          </div>
          <ul>
            <li>Guided the design team in creating posters and other visual materials.</li>
          </ul>

        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 100);
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
