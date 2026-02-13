import React, { useState, useRef, useEffect } from 'react';

const PLAYLIST = [
  {
    id: 1,
    title: 'Lofi Beats',
    artist: 'Chillhop Music',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Coding Flow',
    artist: 'Study Music',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Focus Mode',
    artist: 'Ambient Sounds',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

const MusicApp: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const track = PLAYLIST[currentTrack];

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl text-white p-6 flex flex-col items-center justify-center font-inter">
      <audio ref={audioRef} src={track.url} />

      {/* Album Art with Glow */}
      <div className="relative group mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
        <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-gray-900 to-black border-4 border-white/10 flex items-center justify-center text-7xl shadow-2xl animate-spin-slow">
          <span className={`transform transition-all duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}>🎵</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 tracking-tight drop-shadow-lg">{track.title}</h2>
        <p className="text-white/60 font-medium">{track.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm mb-8 px-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 transition-all"
        />
        <div className="flex justify-between text-xs text-white/40 mt-2 font-medium">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-xl backdrop-blur-sm"
        >
          ⏮️
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center text-3xl transition-all hover:scale-105 active:scale-95"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-xl backdrop-blur-sm"
        >
          ⏭️
        </button>
      </div>
      
      {/* Playlist */}
      <div className="w-full max-w-sm bg-black/20 rounded-2xl p-2 backdrop-blur-md border border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 px-3 pt-2">Playing Next</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
          {PLAYLIST.map((song, index) => (
            <div
              key={song.id}
              onClick={() => {
                setCurrentTrack(index);
                setIsPlaying(true);
              }}
              className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
                index === currentTrack 
                  ? 'bg-white/10 border border-white/10 shadow-sm' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div>
                <div className={`text-sm font-medium ${index === currentTrack ? 'text-white' : 'text-white/80'}`}>{song.title}</div>
                <div className="text-xs text-white/40">{song.artist}</div>
              </div>
              {index === currentTrack && <div className="text-xs animate-pulse text-pink-400">Playing</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicApp;
