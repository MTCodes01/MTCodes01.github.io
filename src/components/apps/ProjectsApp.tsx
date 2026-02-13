import React from 'react';

const PROJECTS = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with payment integration and real-time inventory management.',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: 'https://github.com',
    demo: 'https://example.com',
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Collaborative task manager with real-time updates, drag-and-drop interface, and team features.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    github: 'https://github.com',
    demo: 'https://example.com',
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'Beautiful weather app with forecasts, interactive maps, and location-based alerts.',
    tech: ['React', 'Tailwind', 'OpenWeather API'],
    github: 'https://github.com',
    demo: 'https://example.com',
  },
  {
    id: 4,
    title: 'Social Media Analytics',
    description: 'Analytics dashboard for tracking social media metrics with data visualization.',
    tech: ['Vue.js', 'D3.js', 'Firebase'],
    github: 'https://github.com',
    demo: 'https://example.com',
  },
];

const ProjectsApp: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-auto bg-grid-pattern bg-fixed">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-white/10 pb-6 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-space-grotesk font-bold text-white mb-2 uppercase tracking-tight">
              Projects <span className="text-[#ffaa00]">_</span>
            </h2>
            <p className="text-white/50 font-mono text-sm">Select a module to view details</p>
          </div>
          <div className="text-[#ffaa00] font-mono text-xs border border-[#ffaa00]/30 px-2 py-1 bg-[#ffaa00]/10">
            {PROJECTS.length} MODULES DETECTED
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className="group relative bg-black/40 border border-white/10 hover:border-[#ffaa00] transition-colors overflow-hidden"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-[#ffaa00] transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 group-hover:border-[#ffaa00] transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 group-hover:border-[#ffaa00] transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-[#ffaa00] transition-colors" />

              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[#ffaa00]/50 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                    <h3 className="text-xl font-bold font-space-grotesk uppercase text-white group-hover:text-[#ffaa00] transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 border border-white/20 hover:bg-white/10 hover:border-white/50 text-white/70 hover:text-white transition-colors"
                      title="View Code"
                    >
                      <span className="text-xs font-mono">[CODE]</span>
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 border border-[#ffaa00]/50 bg-[#ffaa00]/10 hover:bg-[#ffaa00]/20 text-[#ffaa00] transition-colors"
                      title="Live Demo"
                    >
                      <span className="text-xs font-mono">[RUN]</span>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/60 text-sm mb-6 leading-relaxed font-mono custom-scrollbar">
                  {project.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-dashed border-white/10">
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="text-white/30 mr-2">STACK:</span>
                    {project.tech.map(tech => (
                      <span
                        key={tech}
                        className="text-[#ffaa00]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsApp;
