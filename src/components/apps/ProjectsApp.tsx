import React from 'react';
import { projectService, ProjectData } from '../../services/projectService';

interface Language {
  name: string;
  percentage: number;
  color: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'HTML': '#e34c26',
  'CSS': '#563d7b',
  'C': '#555555',
  'C++': '#f34b7d',
  'Java': '#b07219',
  'Rust': '#dea584',
  'Go': '#00ADD8',
  'Shell': '#89e051',
  'Vue': '#41b883',
  'React': '#61dafb',
  'PHP': '#4F5D95',
  'Ruby': '#701516',
};

const ProjectCard: React.FC<{ repo: ProjectData; index: number }> = ({ repo, index }) => {
  const [languages, setLanguages] = React.useState<Language[] | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchLanguages() {
      try {
        const cacheRaw = localStorage.getItem('portfolio_languages_cache');
        const cache = cacheRaw ? JSON.parse(cacheRaw) : {};
        
        if (cache[repo.name]) {
          setLanguages(cache[repo.name]);
          setLoading(false);
          return;
        }

        const response = await fetch(repo.languages_url, {
          headers: { "Accept": "application/vnd.github.v3+json" }
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        const totalBytes = Object.values(data).reduce((a: any, b: any) => a + b, 0) as number;
        const processed = Object.entries(data).map(([name, bytes]) => ({
          name,
          percentage: totalBytes > 0 ? Number(((bytes as number) / totalBytes * 100).toFixed(1)) : 0,
          color: LANGUAGE_COLORS[name] || `hsl(${Math.random() * 360}, 70%, 60%)`,
        })).sort((a, b) => b.percentage - a.percentage);

        // Re-read cache to prevent race conditions during concurrent component mounting
        const latestCacheRaw = localStorage.getItem('portfolio_languages_cache');
        const latestCache = latestCacheRaw ? JSON.parse(latestCacheRaw) : {};
        latestCache[repo.name] = processed;
        localStorage.setItem('portfolio_languages_cache', JSON.stringify(latestCache));

        setLanguages(processed);
      } catch (err) {
        console.error(`Failed to load languages for ${repo.name}`);
        setLanguages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLanguages();
  }, [repo.languages_url, repo.name]);

  const title = repo.name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const demoUrl = repo.homepage && repo.homepage.trim() !== "" ? repo.homepage : null;
  const displayTopics = repo.topics ? repo.topics.filter(t => t !== 'portfolio') : [];

  return (
    <div className="group relative bg-black/40 border border-white/10 hover:border-[#ffaa00] transition-colors overflow-hidden flex flex-col h-full min-h-[320px]">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-[#ffaa00] transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 group-hover:border-[#ffaa00] transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 group-hover:border-[#ffaa00] transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-[#ffaa00] transition-colors" />

      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[#ffaa00]/50 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</span>
            <h3 className="text-xl font-bold font-space-grotesk uppercase text-white group-hover:text-[#ffaa00] transition-colors truncate max-w-[200px]" title={title}>
              {title}
            </h3>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-white/20 hover:bg-white/10 hover:border-white/50 text-white/70 hover:text-white transition-colors" title="View Code">
              <span className="text-xs font-mono">[CODE]</span>
            </a>
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-[#ffaa00]/50 bg-[#ffaa00]/10 hover:bg-[#ffaa00]/20 text-[#ffaa00] transition-colors" title="Live Demo">
                <span className="text-xs font-mono">[RUN]</span>
              </a>
            )}
          </div>
        </div>
        
        <p className="text-white/60 text-sm mb-6 leading-relaxed font-mono custom-scrollbar line-clamp-3">
          {repo.description || "Experimental module with dynamic parameters."}
        </p>

        {/* GitHub Style Language Bar */}
        <div className="mb-6 flex-grow">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-2 w-full bg-white/5 rounded-full" />
              <div className="flex gap-4">
                <div className="h-2 w-12 bg-white/5 rounded-full" />
                <div className="h-2 w-16 bg-white/5 rounded-full" />
              </div>
            </div>
          ) : languages && languages.length > 0 ? (
            <>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5 mb-3">
                {languages.map((lang) => (
                  <div key={lang.name} style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} className="h-full first:rounded-l-full last:rounded-r-full" title={`${lang.name}: ${lang.percentage}%`} />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span className="text-white/70">{lang.name}</span>
                    <span className="text-white/30">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-white/20 italic text-[10px] py-1">ANALYZING_CODE_COMPOSITION...</div>
          )}
        </div>
        
        <div className="mt-auto pt-6 border-t border-dashed border-white/10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {displayTopics.length > 0 ? (
              <>
                <span className="text-white/30 mr-1 italic">MODULE_TAGS:</span>
                <div className="flex flex-wrap gap-1.5">
                  {displayTopics.map(topic => (
                    <span key={topic} className="text-[#ffaa00]/80 border border-[#ffaa00]/20 px-1.5 py-0.5 rounded-sm bg-[#ffaa00]/5 uppercase text-[9px] hover:border-[#ffaa00]/50 transition-colors">
                      {topic}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <span className="text-white/20 italic text-[10px]">NO_TAG_METADATA_DETECTED</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsApp: React.FC = () => {
  const [repos, setRepos] = React.useState<ProjectData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [columns, setColumns] = React.useState(2);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width < 550) setColumns(1);
        else if (width < 950) setColumns(2);
        else if (width < 1450) setColumns(3);
        else setColumns(4);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const loadRepos = React.useCallback(async (force = false) => {
    setLoading(true);
    if (force) {
      localStorage.removeItem('portfolio_languages_cache');
    }
    try {
      const data = await projectService.fetchProjects(force);
      setRepos(data);
    } catch (error) {
      console.error("Failed to load repositories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadRepos();
  }, [loadRepos]);

  const gridColsClass = 
    columns === 1 ? 'grid-cols-1' : 
    columns === 2 ? 'grid-cols-2' : 
    columns === 3 ? 'grid-cols-3' : 
    'grid-cols-4';

  const containerMaxWidth = columns >= 4 ? 'max-w-[1600px]' : columns === 3 ? 'max-w-7xl' : 'max-w-6xl';

  return (
    <div ref={containerRef} className="p-8 h-full overflow-auto bg-grid-pattern bg-fixed">
      <div className={`${containerMaxWidth} mx-auto transition-all duration-500`}>
        <header className="mb-12 border-b border-white/10 pb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-4xl font-space-grotesk font-bold text-white mb-2 uppercase tracking-tight">
              Projects <span className="text-[#ffaa00]">_</span>
            </h2>
            <p className="text-white/50 font-mono text-sm">Select a module to view details</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => loadRepos(true)}
              disabled={loading}
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/20 hover:border-[#ffaa00] bg-white/5 hover:bg-[#ffaa00]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Force Refresh Data"
            >
              <svg 
                className={`w-3.5 h-3.5 text-[#ffaa00] ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-mono text-white/70 group-hover:text-white uppercase tracking-wider">Refresh</span>
            </button>
            <div className="text-[#ffaa00] font-mono text-xs border border-[#ffaa00]/30 px-2 py-1 bg-[#ffaa00]/10 h-fit">
              {loading ? 'ANALYZING...' : `${repos.length} MODULES DETECTED`}
            </div>
          </div>
        </header>

        {loading ? (
          <div className={`grid ${gridColsClass} gap-6 opacity-50`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-[320px] bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={`grid ${gridColsClass} gap-6`}>
            {repos.map((repo, index) => (
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsApp;
