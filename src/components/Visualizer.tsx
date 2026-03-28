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
      // Expanded runway so the visualizer takes up ~35% of the screen 
      canvas.height = window.innerHeight * 0.35;
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
          
          // Pump the math: amplify the raw volume/amplitude reading globally by 1.6x 
          // to make the bars physically skyrocket higher up the new massive canvas boundary
          targetHeights[i] = Math.min(1, (value / 255) * visualGain * 0.6) * canvas.height * 0.75;
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
        
        // Remove heavy canvas gradients, simply draw solidly and let CSS handle the mask
        ctx.fillStyle = musicState.trackColor;
        ctx.globalAlpha = 0.85; 
        ctx.fillRect(x, y, barWidth - 1, h);
        
        // Bright solid top cap
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, barWidth - 1, Math.min(2, h)); 
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
        musicState.isPlaying ? 'opacity-90 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-105'
      }`}
      style={{ 
        filter: `drop-shadow(0 -8px 24px ${musicState.trackColor}40)`,
        // CSS Mask smoothly dissolves the solid bars into the desktop at the bottom
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)'
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
