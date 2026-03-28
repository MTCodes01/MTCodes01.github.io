import React, { useEffect, useRef } from 'react';
import { useMusic } from '../contexts/MusicContext';

const Visualizer: React.FC = () => {
  const { musicState } = useMusic();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const numBars = 48; // Dense, realistic visualizer
    const barHeights = new Array(numBars).fill(2);
    const targetHeights = new Array(numBars).fill(2);

    let dataArray: Uint8Array | null = null;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / numBars;

      if (musicState.isPlaying && musicState.analyserNode) {
        if (!dataArray || dataArray.length !== musicState.analyserNode.frequencyBinCount) {
          dataArray = new Uint8Array(musicState.analyserNode.frequencyBinCount);
        }
        // Physically pull the active byte frequency data from the audio buffer
        musicState.analyserNode.getByteFrequencyData(dataArray as any);

        // Most musical energy lives in the lower half of the frequency spectrum (bins 0-60).
        // If we map past bin ~60, the visualizer looks empty on the right side.
        for (let i = 0; i < numBars; i++) {
          // Extract the relevant bin (focusing on the first 65 bins for MP3 compression)
          const dataIndex = Math.floor(i * (65 / numBars)); 
          const value = dataArray[dataIndex] || 0;
          
          // Structurally, higher frequencies have less raw amplitude. 
          // We apply a gentle ascending multiplier (gain) moving left to right 
          // so the visualizer looks perfectly balanced across the board.
          const visualGain = 1 + (i / numBars) * 1.8; 
          
          targetHeights[i] = Math.min(1, (value / 255) * visualGain) * canvas.height;
        }
      } else {
        for (let i = 0; i < numBars; i++) {
          targetHeights[i] = 2;
        }
      }

      for (let i = 0; i < numBars; i++) {
        const diff = targetHeights[i] - barHeights[i];
        if (diff > 0) {
          // Rise quickly
          barHeights[i] += diff * 0.4;
        } else {
          // Fall slower (decay)
          barHeights[i] += diff * 0.15;
        }

        // Draw the bar
        const h = Math.max(2, barHeights[i]);
        const x = i * barWidth;
        const y = canvas.height - h;
        
        // Slightly rounded top pseudo-look
        ctx.fillStyle = musicState.trackColor;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x, y, barWidth - 1, h);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, barWidth - 1, Math.min(2, h)); // White cap effect
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [musicState.isPlaying, musicState.trackColor, musicState.analyserNode]);

  return (
    <div 
      className={`absolute bottom-24 right-10 flex items-end transition-all duration-700 pointer-events-none z-0 ${
        musicState.isPlaying ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      style={{ filter: `drop-shadow(0 0 12px ${musicState.trackColor}40)` }}
    >
      <canvas 
        ref={canvasRef} 
        width={240} 
        height={60} 
        className="block"
      />
    </div>
  );
};

export default Visualizer;
