import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const PLAYLIST = [
  { 
    id: 1, 
    title: 'Lofi Beats', 
    artist: 'Chillhop Music', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    color: '#ff7e67'
  },
  { 
    id: 2, 
    title: 'Coding Flow', 
    artist: 'Study Music', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
    color: '#00f0ff'
  },
  { 
    id: 3, 
    title: 'Focus Mode', 
    artist: 'Ambient Sounds', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
    color: '#ff003c'
  },
  { 
    id: 4, 
    title: 'Deep Work', 
    artist: 'Brain Waves', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    color: '#9d00ff'
  },
  { 
    id: 5, 
    title: 'Midnight Drive', 
    artist: 'Synthwave FM', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover: 'https://picsum.photos/seed/midnight5/400/400',
    color: '#2dd4bf'
  },
  { 
    id: 6, 
    title: 'Starlight', 
    artist: 'Galactic Radio', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    cover: 'https://picsum.photos/seed/starlight6/400/400',
    color: '#fbbf24'
  },
  { 
    id: 7, 
    title: 'Coffee Beans', 
    artist: 'Morning Routine', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    cover: 'https://picsum.photos/seed/coffee7/400/400',
    color: '#f472b6'
  },
  { 
    id: 8, 
    title: 'Vibrant Flow', 
    artist: 'Creative Mind', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover: 'https://picsum.photos/seed/vibrant8/400/400',
    color: '#60a5fa'
  },
];

// SVG Icons
const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>;
const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>;
const PrevIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="18,20 8,12 18,4" /><rect x="4" y="4" width="3" height="16" rx="1"/></svg>;
const NextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 16,12 6,20" /><rect x="17" y="4" width="3" height="16" rx="1"/></svg>;
const ShuffleIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-[#ff003c]' : 'text-white/40'}>
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);
const RepeatIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-[#ff003c]' : 'text-white/40'}>
    <polyline points="17 1 21 5 17 9"></polyline>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
    <polyline points="7 23 3 19 7 15"></polyline>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
  </svg>
);
const VolumeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>;

const MusicApp: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onUpdate = () => { setProgress(audio.currentTime); setDuration(audio.duration || 0); };
    
    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };
    
    audio.addEventListener('timeupdate', onUpdate);
    audio.addEventListener('loadedmetadata', onUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onUpdate);
      audio.removeEventListener('loadedmetadata', onUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack, isRepeat]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Handle play/pause sync when track changes
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      // Small timeout prevents play interruption bugs in some browsers
      setTimeout(() => audioRef.current?.play().catch(() => setIsPlaying(false)), 50);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffle) {
      let next = Math.floor(Math.random() * PLAYLIST.length);
      if (next === currentTrack) next = (next + 1) % PLAYLIST.length;
      setCurrentTrack(next);
    } else {
      setCurrentTrack(p => (p + 1) % PLAYLIST.length);
    }
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    if (progress > 3 && audioRef.current) {
      // Re-start track if they're 3 sec deep
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrack(p => (p - 1 + PLAYLIST.length) % PLAYLIST.length);
    }
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = t; setProgress(t); }
  };

  const fmt = (s: number) => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const track = PLAYLIST[currentTrack];
  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="h-full bg-[#0a0a0c] text-white font-inter flex flex-col md:flex-row overflow-hidden relative select-none">
      <audio ref={audioRef} src={track.url} />

      {/* Dynamic ambient backdrop */}
      <div className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000 blur-[80px]" style={{ backgroundColor: track.color }} />
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

      {/* Left Column - Main Player */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 border-b md:border-b-0 md:border-r border-white/5">
        
        {/* Dynamic Vinyl Cover */}
        <div className="relative mb-8 w-48 h-48 md:w-64 md:h-64 group drop-shadow-2xl">
          {/* Vinyl Disc - shifts out slightly on play */}
          <div 
            className="absolute inset-0 rounded-full bg-[#111] border-4 border-[#222] shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden flex items-center justify-center"
            style={{
              transform: isPlaying ? 'translateX(15%) rotate(0deg)' : 'translateX(0%) rotate(0deg)',
              animation: 'spin 8s linear infinite',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            {/* Vinyl grooves */}
            <div className="absolute inset-2 rounded-full border border-white/5" />
            <div className="absolute inset-6 rounded-full border border-white/5" />
            <div className="absolute inset-10 rounded-full border border-white/5" />
            <div className="absolute inset-14 rounded-full border border-white/5" />
            
            {/* Center label */}
            <div className="w-16 h-16 rounded-full overflow-hidden relative">
              <img src={track.cover} alt="label" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#111] rounded-full border border-white/20" />
            </div>
          </div>
          
          {/* Album Cover Slip */}
          <div className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden glass-panel z-10 border border-white/10">
            <motion.img 
              key={track.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={track.cover} 
              alt={track.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Track info */}
        <motion.div 
          key={`info-${track.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 w-full px-4"
        >
          <h2 className="font-space-grotesk font-bold text-3xl text-white tracking-tight mb-1 truncate">
            {track.title}
          </h2>
          <p className="font-jetbrains text-[12px] text-white/50 uppercase tracking-widest truncate">{track.artist}</p>
        </motion.div>

        {/* Playback Controls & Scrubber */}
        <div className="w-full max-w-sm px-4">
          {/* Progress bar */}
          <div className="mb-6 group">
            <div className="relative h-[4px] bg-white/10 rounded-full cursor-pointer overflow-hidden transition-all group-hover:h-[6px]">
              <div
                className="absolute left-0 top-0 h-full transition-none rounded-full"
                style={{ width: `${pct}%`, backgroundColor: track.color }}
              />
              <input
                type="range" min="0" max={duration || 0} value={progress} onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between font-jetbrains text-[10px] text-white/40 mt-2 font-medium">
              <span>{fmt(progress)}</span>
              <span>-{fmt(duration - progress)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between px-2">
            <button onClick={() => setIsShuffle(!isShuffle)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ShuffleIcon active={isShuffle} />
            </button>
            
            <div className="flex items-center gap-4">
              <button onClick={handlePrev} className="p-2 text-white/50 hover:text-white transition-colors">
                <PrevIcon />
              </button>
              
              <button
                onClick={togglePlay}
                className="w-14 h-14 flex items-center justify-center rounded-full text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ backgroundColor: track.color, boxShadow: `0 8px 24px -6px ${track.color}` }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <button onClick={handleNext} className="p-2 text-white/50 hover:text-white transition-colors">
                <NextIcon />
              </button>
            </div>

            <button onClick={() => setIsRepeat(!isRepeat)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <RepeatIcon active={isRepeat} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Playlist & Volume */}
      <div className="w-full md:w-[320px] bg-black/40 backdrop-blur-md flex flex-col z-10">
        
        {/* Header / Volume */}
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <VolumeIcon />
            <input
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-[#ff003c] transition-all"
            />
          </div>
        </div>

        {/* Playlist Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
          <h3 className="font-space-grotesk text-sm font-bold tracking-widest uppercase text-white/70">Up Next</h3>
          <span className="font-jetbrains text-[9px] bg-white/10 px-2 py-1 rounded-sm text-white/50">{PLAYLIST.length} Tracks</span>
        </div>

        {/* Scrollable Tracks */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-3 pb-6">
          <div className="space-y-1">
            {PLAYLIST.map((song, idx) => {
              const isActive = idx === currentTrack;
              return (
                <div
                  key={song.id}
                  onClick={() => { setCurrentTrack(idx); setIsPlaying(true); }}
                  className={`group relative flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 shadow-md">
                    <img src={song.cover} alt={song.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {isActive && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-[2px] backdrop-blur-[1px]">
                        {[1,2,3].map(b => (
                          <div key={b} className="w-[2px] bg-white animate-pulse rounded-sm" style={{ height: `${40 + b * 20}%`, animationDelay: `${b * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-inter text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-white/80'}`}>
                      {song.title}
                    </p>
                    <p className="font-jetbrains text-[10px] text-white/40 mt-0.5 uppercase tracking-wider truncate">
                      {song.artist}
                    </p>
                  </div>

                  {/* Play trigger hint */}
                  {!isActive && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2 text-white/40">
                      <PlayIcon />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MusicApp;
