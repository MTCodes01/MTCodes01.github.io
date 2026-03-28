import React, { useEffect, useRef } from 'react';
import { useMusic } from '../contexts/MusicContext';

const Visualizer: React.FC = () => {
  const { musicState } = useMusic();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVisualizer, setShowVisualizer] = React.useState(musicState.isPlaying);
  
  // Persist the physical bar heights across re-renders (like pausing)
  const numBars = 100;
  const barHeightsRef = useRef(new Array(numBars).fill(0));
  const targetHeightsRef = useRef(new Array(numBars).fill(0));

  // Synchronize internal visibility with music state, but with a "settling" delay
  useEffect(() => {
    if (musicState.isPlaying) {
      setShowVisualizer(true);
    } else {
      const timer = setTimeout(() => {
        setShowVisualizer(false);
      }, 2000); // 2 second grace period for bars to fall
      return () => clearTimeout(timer);
    }
  }, [musicState.isPlaying]);

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
    const barHeights = barHeightsRef.current;
    const targetHeights = targetHeightsRef.current;

    let dataArray: Uint8Array | null = null;
    let maxPeak = 120; // Starts with a sensible default for normalization

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / numBars;

      if (musicState.isPlaying && musicState.analyserNode) {
        if (!dataArray || dataArray.length !== musicState.analyserNode.frequencyBinCount) {
          dataArray = new Uint8Array(musicState.analyserNode.frequencyBinCount);
        }
        musicState.analyserNode.getByteFrequencyData(dataArray as any);

        // Calculate the current frame's peak to dynamically adjust the visual "limit"
        let currentFrameMax = 0;
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i] > currentFrameMax) currentFrameMax = dataArray[i];
        }

        // Smoothly adjust the maxPeak ceiling (Auto-Gain Control)
        // This ensures quiet songs boost up and loud songs don't clip harshly.
        if (currentFrameMax > maxPeak) {
          maxPeak = currentFrameMax; // React quickly to peaks
        } else {
          maxPeak = Math.max(80, maxPeak * 0.995); // Slowly decay to keep it dynamic
        }

        // Map across the spectrum
        for (let i = 0; i < numBars; i++) {
          const dataIndex = Math.floor(i * (70 / numBars)); 
          const value = dataArray[dataIndex] || 0;
          
          // Higher frequencies naturally have lower amplitude
          const frequencyWeight = 1 + (i / numBars) * 2.5 * 0.6; 
          
          // Use dynamic maxPeak for perfect normalization (No fixed limit!)
          const intensity = (value / maxPeak) * frequencyWeight;
          targetHeights[i] = Math.min(1.1, intensity) * canvas.height * 0.75;
        }
      } else {
        // When paused, target the floor (0) but the damping will handle the "slow descend"
        for (let i = 0; i < numBars; i++) {
          targetHeights[i] = 0; 
        }
      }

      for (let i = 0; i < numBars; i++) {
        const diff = targetHeights[i] - barHeights[i];
        if (diff > 0) {
          barHeights[i] += diff * 0.35; // Responsive snap up
        } else {
          barHeights[i] += diff * 0.08; // Buttery smooth decay down
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
      className={`absolute bottom-0 left-0 w-full transition-all duration-[1200ms] ease-in-out pointer-events-none z-0 ${
        showVisualizer ? 'opacity-90 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-105'
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
