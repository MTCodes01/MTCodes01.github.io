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

    // Handle responsive fullscreen canvas sizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      // Fixed height roughly ~25vh
      canvas.height = window.innerHeight * 0.25;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animationId: number;
    // Map across a much wider array for full-width fidelity
    const numBars = 100;
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

        // Focus solely on the lower-mid energy chunk for spanning width
        for (let i = 0; i < numBars; i++) {
          const dataIndex = Math.floor(i * (70 / numBars)); 
          const value = dataArray[dataIndex] || 0;
          
          const visualGain = 1 + (i / numBars) * 2.5; 
          
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
        
        // Draw the bar slightly thicker and lower opacity for ambient desktop look
        ctx.fillStyle = musicState.trackColor;
        ctx.globalAlpha = 0.55; // Semi-transparent to act as a background element
        ctx.fillRect(x, y, barWidth - 2, h);
        
        // Bright solid top cap
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, barWidth - 2, Math.min(2, h)); 
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [musicState.isPlaying, musicState.trackColor, musicState.analyserNode]);

  return (
    <div 
      className={`absolute bottom-0 left-0 w-full transition-all duration-[1200ms] ease-out pointer-events-none z-0 ${
        musicState.isPlaying ? 'opacity-80 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-105'
      }`}
      style={{ 
        // Adding a gradient mask makes it "fade in" visually from the bottom up to the desktop
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black)',
        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black)',
        filter: `drop-shadow(0 0 16px ${musicState.trackColor}60)` 
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full"
      />
    </div>
  );
};

export default Visualizer;
