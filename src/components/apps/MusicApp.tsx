import React, { useState, useRef, useEffect } from 'react';

const PLAYLIST = [
  { id: 1, title: 'Lofi Beats', artist: 'Chillhop Music', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Coding Flow', artist: 'Study Music', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Focus Mode', artist: 'Ambient Sounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

// SVG control icons
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);
const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="19,20 9,12 19,4" /><rect x="5" y="4" width="3" height="16" />
  </svg>
);
const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,4 15,12 5,20" /><rect x="16" y="4" width="3" height="16" />
  </svg>
);

const MusicApp: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onUpdate = () => { setProgress(audio.currentTime); setDuration(audio.duration || 0); };
    audio.addEventListener('timeupdate', onUpdate);
    audio.addEventListener('loadedmetadata', onUpdate);
    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('timeupdate', onUpdate);
      audio.removeEventListener('loadedmetadata', onUpdate);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => { setCurrentTrack(p => (p + 1) % PLAYLIST.length); setIsPlaying(true); };
  const handlePrev = () => { setCurrentTrack(p => (p - 1 + PLAYLIST.length) % PLAYLIST.length); setIsPlaying(true); };

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

  // Fake visualizer bars
  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="h-full bg-[#08080d] text-white font-inter flex flex-col overflow-hidden">
      <audio ref={audioRef} src={track.url} />

      {/* Now playing header */}
      <div className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#ff003c] animate-pulse' : 'bg-white/20'}`} />
          <span className="font-jetbrains text-[10px] text-white/35 uppercase tracking-widest">
            {isPlaying ? 'NOW PLAYING' : 'PAUSED'}
          </span>
        </div>
        <span className="font-jetbrains text-[10px] text-white/25">
          {currentTrack + 1} / {PLAYLIST.length}
        </span>
      </div>

      {/* Main player area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">

        {/* Waveform visualizer (decorative) */}
        <div className="flex items-end gap-[3px] h-16 mb-8 opacity-60">
          {bars.map(i => {
            const h = isPlaying
              ? Math.random() * 70 + 20
              : 10 + Math.sin(i * 0.5) * 15;
            return (
              <div
                key={i}
                className="w-1.5 rounded-sm transition-all"
                style={{
                  height: `${h}%`,
                  backgroundColor: i < (bars.length * pct / 100)
                    ? '#ff003c'
                    : 'rgba(255,255,255,0.15)',
                  transitionDuration: isPlaying ? `${Math.random() * 200 + 100}ms` : '300ms',
                }}
              />
            );
          })}
        </div>

        {/* Track info */}
        <div className="text-center mb-6 w-full">
          <h2 className="font-space-grotesk font-bold text-2xl text-white uppercase tracking-tight mb-1">
            {track.title}
          </h2>
          <p className="font-jetbrains text-[11px] text-white/35 uppercase tracking-widest">{track.artist}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mb-5">
          <div className="relative h-1 bg-white/10 mb-2 group cursor-pointer">
            <div
              className="absolute left-0 top-0 h-full bg-[#ff003c] transition-none"
              style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(255,0,60,0.6)' }}
            />
            <input
              type="range" min="0" max={duration || 0} value={progress} onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between font-jetbrains text-[10px] text-white/30">
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-6">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/5 transition-all"
          >
            <PrevIcon />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-[#ff003c] hover:bg-[#ff003c]/80 text-white transition-all hover:scale-105 active:scale-95"
            style={{ boxShadow: isPlaying ? '0 0 20px rgba(255,0,60,0.4)' : 'none' }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/5 transition-all"
          >
            <NextIcon />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30 shrink-0">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
          </svg>
          <input
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-[2px] bg-white/15 appearance-none cursor-pointer accent-[#ff003c]"
          />
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30 shrink-0">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
          </svg>
        </div>
      </div>

      {/* Playlist */}
      <div className="border-t border-white/8">
        <div className="px-4 py-2 flex items-center">
          <span className="font-jetbrains text-[9px] text-white/25 uppercase tracking-widest">Playlist</span>
        </div>
        {PLAYLIST.map((song, idx) => (
          <div
            key={song.id}
            onClick={() => { setCurrentTrack(idx); setIsPlaying(true); }}
            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all border-l-2 ${
              idx === currentTrack
                ? 'border-[#ff003c] bg-[#ff003c]/5 text-white'
                : 'border-transparent hover:border-white/15 hover:bg-white/[0.02] text-white/50'
            }`}
          >
            <div>
              <p className="font-inter text-sm font-medium">{song.title}</p>
              <p className="font-jetbrains text-[10px] text-white/30 mt-0.5">{song.artist}</p>
            </div>
            {idx === currentTrack && isPlaying && (
              <div className="flex items-end gap-[2px] h-4">
                {[1,2,3].map(b => (
                  <div key={b} className="w-[3px] bg-[#ff003c] animate-pulse rounded-sm" style={{ height: `${40 + b * 20}%`, animationDelay: `${b * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicApp;
