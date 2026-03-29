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

        // Calculate current maximum peak and average energy
        let currentFrameMax = 0;
        let averageEnergy = 0;
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i] > currentFrameMax) currentFrameMax = dataArray[i];
          averageEnergy += dataArray[i];
        }
        averageEnergy /= dataArray.length;
        
        // Auto-Gain Control (AGC): Dynamically scale the normalization ceiling
        // maxPeak tracks the loudest signal; slowly decays to stay responsive
        if (currentFrameMax > maxPeak) {
          maxPeak = currentFrameMax; 
        } else {
          maxPeak = Math.max(100, maxPeak * 0.99); // Slightly faster decay for better agility
        }
        
        // Group frequency bins with a hybrid mapping to spread out the bass and mids
        const binCount = dataArray.length;
        const tempTargets = new Array(numBars).fill(0);

        for (let i = 0; i < numBars; i++) {
          // Hybrid Indexing: ensures bass bars are unique while maintaining mid/high energy
          // Part linear offset + part power curve for an organic "audio profile" look
          const fraction = i / numBars;
          const index = (i * 0.45) + Math.pow(fraction, 2.8) * (binCount * 0.6);
          
          const lowIdx = Math.max(0, Math.floor(index));
          const highIdx = Math.min(binCount - 1, lowIdx + 1);
          const interp = index - lowIdx;
          
          // Smoothed linear interpolation between bins
          let value = (dataArray[lowIdx] * (1 - interp)) + (dataArray[highIdx] * interp);
          
          // Frequency-specific weighting: compensative but not overbearing
          // We boost the highs slightly more than the bass to keep the whole wall active
          const frequencyWeight = 1.0 + (i / numBars) * 1.8; 
          
          // Calculate intensity with a slightly softer curve
          let intensity = (value / maxPeak) * frequencyWeight;
          
          // Add a tiny floor (1.5%) so the visualizer never feels "dead" when music is on
          const floor = musicState.isPlaying ? 0.015 : 0;
          tempTargets[i] = (Math.min(1.1, intensity) + floor) * canvas.height * 0.65;
        }

        // Lateral Smoothing (Spatial Blur) for a fluid, wave-like appearance
        // This prevents the "jagged" or "sawtooth" edges shown in the previous attempt
        for (let i = 0; i < numBars; i++) {
          const prev = i > 0 ? tempTargets[i - 1] : tempTargets[i];
          const next = i < numBars - 1 ? tempTargets[i + 1] : tempTargets[i];
          const curr = tempTargets[i];
          
          // Weighted average (20% neighbors, 60% self)
          targetHeights[i] = (prev * 0.2) + (curr * 0.6) + (next * 0.2);
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
