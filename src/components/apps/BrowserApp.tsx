import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../Icons';

const PRESET_URLS = [
  { name: 'My GitHub',  url: 'https://www.bing.com/search?q=github+MTCodes01', icon: <Icons.github size={14} /> },
];

const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const ForwardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);
const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

type ViewMode = 'home' | 'browser' | 'proxied';

interface Tab {
  id: string;
  url: string;
  inputUrl: string;
  title: string;
  viewMode: ViewMode;
  proxiedContent?: string;
  loading: boolean;
  history: string[];
  historyIndex: number;
}

const createInitialTab = (url = '', viewMode: ViewMode = 'home'): Tab => ({
  id: Math.random().toString(36).substring(7),
  url,
  inputUrl: url,
  title: url ? (url.includes('search?q=') ? decodeURIComponent(url.split('q=')[1].split('&')[0]) : url.replace(/^https?:\/\//, '')) : 'New Tab',
  viewMode,
  loading: false,
  history: url ? [url] : [],
  historyIndex: url ? 0 : -1,
});

const BrowserApp: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([createInitialTab()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateTab = (id: string, update: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...update } : t));
  };

  const createNewTab = (url = '', viewMode: ViewMode = 'home') => {
    const newTab = createInitialTab(url, viewMode);
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    if (url) {
      // Small timeout to ensure state is ready before navigation if needed, 
      // though navigate can handle its own state.
      setTimeout(() => navigate(url, newTab.id), 10);
    }
  };

  const closeTab = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (tabs.length === 1) {
      updateTab(id, createInitialTab());
      return;
    }
    const newTabs = tabs.filter(t => t.id !== id);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
    setTabs(newTabs);
  };

  // Listen for navigation messages from the proxied iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'navigate') {
        navigate(event.data.url, activeTabId);
      } else if (event.data && event.data.type === 'open_tab') {
        createNewTab(event.data.url, 'browser');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeTabId]); // Re-bind listener when activeTabId changes to ensure it navigates the right tab

  const fetchProxiedSite = async (targetUrl: string, tabId: string) => {
    updateTab(tabId, { loading: true, viewMode: 'proxied' });
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();
      let html = data.contents;

      // Inject Base Tag and Navigation Interceptor
      const injection = `
        <base href="${targetUrl}">
        <script>
          document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith('http')) {
              // Check if it's a new tab link
              const isNewTab = link.target === '_blank' || e.ctrlKey || e.metaKey || e.button === 1;
              
              e.preventDefault();
              window.parent.postMessage({ 
                type: isNewTab ? 'open_tab' : 'navigate', 
                url: link.href 
              }, '*');
            }
          }, true);
          
          // Intercept window.open
          window.open = (url) => {
            window.parent.postMessage({ type: 'open_tab', url: url }, '*');
            return null;
          };

          // Intercept forms as well
          document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.action && form.action.startsWith('http')) {
              e.preventDefault();
              window.parent.postMessage({ type: 'navigate', url: form.action }, '*');
            }
          }, true);
        </script>
      `;

      // Insert injection after <head> or at the start
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${injection}`);
      } else {
        html = injection + html;
      }

      updateTab(tabId, { proxiedContent: html, loading: false });
    } catch (error) {
      console.error('Proxy error:', error);
      updateTab(tabId, { viewMode: 'browser', loading: false });
    }
  };

  const navigate = (target: string, tabId = activeTabId) => {
    if (!target) return;
    let finalUrl = target;
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.includes('.')) {
      finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
    } else if (!target.startsWith('http://') && !target.startsWith('https://')) {
      finalUrl = `https://${target}`;
    }

    // Smart Transform: Use YouTube Embed mode for videos to avoid framing blocks
    if (finalUrl.includes('youtube.com/watch?v=')) {
      const vid = finalUrl.split('v=')[1]?.split('&')[0];
      if (vid) finalUrl = `https://www.youtube-nocookie.com/embed/${vid}`;
    } else if (finalUrl.includes('youtu.be/')) {
      const vid = finalUrl.split('youtu.be/')[1]?.split('?')[0];
      if (vid) finalUrl = `https://www.youtube-nocookie.com/embed/${vid}`;
    }

    const title = finalUrl.includes('search?q=') 
      ? decodeURIComponent(finalUrl.split('q=')[1].split('&')[0]) 
      : finalUrl.replace(/^https?:\/\//, '').split('/')[0];

    updateTab(tabId, { 
      url: finalUrl, 
      inputUrl: finalUrl, 
      loading: true,
      title: title
    });

    // Broaden proxy usage to try and render most blocked sites inside the app
    const lowerUrl = finalUrl.toLowerCase();
    const needsProxy = lowerUrl.includes('github.com') || 
                       lowerUrl.includes('linkedin.com') || 
                       lowerUrl.includes('twitter.com') ||
                       lowerUrl.includes('bing.com'); 
                       // Note: YouTube embed links work fine in direct iframe mode if they are the /embed/ version

    if (needsProxy) {
      fetchProxiedSite(finalUrl, tabId);
    } else {
      updateTab(tabId, { viewMode: 'browser', loading: false });
    }

    const currentTab = tabs.find(t => t.id === tabId);
    if (currentTab && finalUrl !== currentTab.history[currentTab.historyIndex]) {
      const newHistory = currentTab.history.slice(0, currentTab.historyIndex + 1);
      newHistory.push(finalUrl);
      updateTab(tabId, { 
        history: newHistory, 
        historyIndex: newHistory.length - 1 
      });
    }
  };

  const goHome = () => updateTab(activeTabId, { viewMode: 'home', inputUrl: '', url: '', title: 'New Tab' });
  const goBack = () => {
    if (activeTab.historyIndex > 0) {
      const prevUrl = activeTab.history[activeTab.historyIndex - 1];
      navigate(prevUrl, activeTabId);
      updateTab(activeTabId, { historyIndex: activeTab.historyIndex - 1 });
    }
  };
  const goForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextUrl = activeTab.history[activeTab.historyIndex + 1];
      navigate(nextUrl, activeTabId);
      updateTab(activeTabId, { historyIndex: activeTab.historyIndex + 1 });
    }
  };

  const openExternal = () => { if (activeTab.url) window.open(activeTab.url, '_blank'); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') navigate(activeTab.inputUrl); };

  return (
    <div className="h-full flex flex-col bg-[#0b0b0f] font-inter overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-2 pt-2 bg-[#0d0d12] border-b border-white/5 overflow-x-auto scrollbar-hide">
        <AnimatePresence initial={false}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              onClick={() => setActiveTabId(tab.id)}
              className={`group relative flex items-center gap-2 px-4 py-2 min-w-[140px] max-w-[220px] text-[11px] font-medium rounded-t-lg transition-all duration-300 border-t border-x ${
                activeTabId === tab.id 
                  ? 'bg-[#050508] text-[#00f0ff] border-white/10 shadow-[0_-4px_12px_rgba(0,0,0,0.5)]' 
                  : 'bg-transparent text-white/30 border-transparent hover:text-white/60 hover:bg-white/[0.02]'
              }`}
            >
              {/* Active Glow Indicator */}
              {activeTabId === tab.id && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent"
                />
              )}
              
              <span className="truncate flex-1 text-left">{tab.title || 'New Tab'}</span>
              
              <motion.span 
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.1)' }}
                onClick={(e) => closeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 rounded-md w-4 h-4 flex items-center justify-center transition-opacity text-[14px]"
              >
                ×
              </motion.span>
              
              {activeTabId === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[1.2px] bg-[#050508] z-30" />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
        
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,240,255,0.1)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => createNewTab()}
          className="ml-1 p-2 text-white/20 hover:text-[#00f0ff] rounded-lg transition-colors"
          title="New Tab"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </motion.button>
      </div>

      <div className="border-b border-white/5 bg-[#0d0d12]/80 backdrop-blur-md flex flex-col z-20">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex gap-0.5">
            <button onClick={goHome} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"><HomeIcon /></button>
            <button onClick={goBack} disabled={activeTab.historyIndex <= 0} className={`w-8 h-8 flex items-center justify-center transition-colors ${activeTab.historyIndex > 0 ? 'text-white/70 hover:text-white' : 'text-white/10'}`}><BackIcon /></button>
            <button onClick={goForward} disabled={activeTab.historyIndex >= activeTab.history.length - 1} className={`w-8 h-8 flex items-center justify-center transition-colors ${activeTab.historyIndex < activeTab.history.length - 1 ? 'text-white/70 hover:text-white' : 'text-white/10'}`}><ForwardIcon /></button>
            <button onClick={() => navigate(activeTab.url)} className={`w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors ${activeTab.loading ? 'animate-spin' : ''}`}><RefreshIcon /></button>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 focus-within:border-[#00f0ff]/40 rounded-md h-8 group overflow-hidden">
            <span className="text-[#33ff00]/60"><LockIcon /></span>
            <input 
              type="text" 
              value={activeTab.inputUrl} 
              onChange={e => updateTab(activeTabId, { inputUrl: e.target.value })} 
              onKeyDown={handleKeyDown} 
              className="flex-1 bg-transparent text-[13px] text-white/60 focus:text-white focus:outline-none font-jetbrains truncate" 
              placeholder="Enter URL or search..." 
            />
            <button onClick={openExternal} className="text-white/20 hover:text-[#00f0ff] transition-colors px-1" title="Open in New Tab"><ExternalIcon /></button>
          </div>
          <button onClick={() => navigate(activeTab.inputUrl)} className="px-4 h-8 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff] hover:text-black transition-all text-[11px] font-bold uppercase rounded-md tracking-wider">Go</button>
        </div>
        <div className="flex items-center gap-1 px-3 pb-1.5 overflow-x-auto scrollbar-hide border-t border-white/5 pt-1.5">
          {PRESET_URLS.map(preset => (
            <button key={preset.name} onClick={() => navigate(preset.url)} className={`flex items-center gap-2 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-all rounded-sm ${activeTab.url === preset.url && activeTab.viewMode !== 'home' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>
              <span className="leading-none opacity-60 font-bold flex items-center justify-center min-w-[14px]">{preset.icon}</span>{preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col bg-[#050508]">
        {activeTab.loading && <div className="absolute top-0 left-0 right-0 h-[2px] z-50 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.6)]" /></div>}
        
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`absolute inset-0 transition-opacity duration-300 ${activeTabId === tab.id ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <AnimatePresence mode="wait">
              {tab.viewMode === 'home' ? (
                <motion.div key={`home-${tab.id}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#0d0d12] to-[#050508]">
                  <div className="text-center space-y-8 max-w-2xl w-full">
                    <div className="space-y-2">
                      <h1 className="text-5xl font-bold tracking-tighter text-white/90">C<span className="text-[#00f0ff]">H</span>ECKPOINT <span className="text-[#00f0ff] italic text-4xl">OS</span></h1>
                      <p className="text-white/30 text-xs font-jetbrains uppercase tracking-[0.3em] font-medium">Original Sites Implementation</p>
                    </div>
                    <div className="relative group max-w-sm mx-auto w-full">
                      <input type="text" placeholder="Search or URL" className="w-full bg-white/5 border border-white/10 px-5 py-3.5 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-1 ring-[#00f0ff]/40 transition-all text-sm font-jetbrains" onKeyDown={(e) => { if (e.key === 'Enter') navigate((e.target as HTMLInputElement).value); }} />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00f0ff]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 pt-4">
                      {PRESET_URLS.map(preset => (
                        <button key={preset.name} onClick={() => navigate(preset.url)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                          <div className="w-11 h-11 flex items-center justify-center bg-white/5 rounded-2xl text-xl group-hover:bg-[#00f0ff]/10 group-hover:text-[#00f0ff] transition-all border border-white/5">
                            {typeof preset.icon === 'string' ? preset.icon : React.cloneElement(preset.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                          </div>
                          <span className="text-[10px] text-white/50 group-hover:text-white font-medium uppercase tracking-wider">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-8 text-[10px] text-white/10 font-jetbrains uppercase tracking-widest text-center">Built for MTCodes Portfolio • All Access Mode • Sandbox Disabled</div>
                </motion.div>
              ) : tab.viewMode === 'browser' ? (
                <motion.div key={`browser-${tab.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white/20 -z-10 animate-pulse">
                    <span className="text-4xl">󰇄</span>
                    <span className="text-[10px] uppercase tracking-widest mt-4">Connecting to original site...</span>
                  </div>
                  <iframe 
                    src={tab.url} 
                    className="w-full h-full border-0 relative z-10" 
                    title="Browser Original Content" 
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms" 
                    onLoad={() => updateTab(tab.id, { loading: false })}
                  />
                </motion.div>
              ) : (
                <motion.div key={`proxied-${tab.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white/20 -z-10 animate-pulse">
                    <span className="text-4xl text-[#00f0ff]">󰇄</span>
                    <span className="text-[10px] uppercase tracking-widest mt-4">Proxying Secure Content...</span>
                  </div>
                  <iframe 
                    srcDoc={tab.proxiedContent}
                    className="w-full h-full border-0 relative z-10" 
                    title="Browser Proxied Content" 
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    onLoad={() => updateTab(tab.id, { loading: false })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserApp;
