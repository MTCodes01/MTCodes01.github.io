import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useNebulaOverride } from '../contexts/NebulaOverrideContext';

// ─── Types ───────────────────────────────────────────────────────────
interface Star { x: number; y: number; speed: number; size: number; brightness: number; }
interface Bullet { x: number; y: number; vx: number; vy: number; isHoming?: boolean; }
type PowerUpType = 'spread' | 'rapid' | 'wingman' | 'homing' | 'bomb' | 'shield' | 'life';
interface PowerUp { x: number; y: number; speed: number; type: PowerUpType; color: string; radius: number; }
interface Enemy { x: number; y: number; speed: number; width: number; height: number; hp: number; type: number; startX?: number; time?: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number; }

// ─── Constants ───────────────────────────────────────────────────────
const PLAYER_SPEED = 5;
const BULLET_SPEED = 8;
const FIRE_RATE = 150; // ms between shots
const BASE_ENEMY_SPEED = 1.5;
const ENEMIES_PER_WAVE_BASE = 16;
const INVULNERABLE_MS = 1500;

const POWERUP_DEFS: Record<PowerUpType, { color: string; letter: string }> = {
  spread: { color: '#ff003c', letter: 'S' },
  rapid: { color: '#ffaa00', letter: 'R' },
  wingman: { color: '#ffff00', letter: 'W' },
  homing: { color: '#00ffaa', letter: 'H' },
  bomb: { color: '#aa00ff', letter: 'B' },
  shield: { color: '#00f0ff', letter: '⛨' },
  life: { color: '#ff00ff', letter: '❤' },
};
const POWERUP_TYPES = Object.keys(POWERUP_DEFS) as PowerUpType[];

const ENEMY_DEFS: Record<number, { hp: number, width: number, height: number, speedMod: number, pts: number, minWave: number, color: string, name: string }> = {
  1: { name: 'Scout', hp: 1, width: 22, height: 22, speedMod: 1.0, pts: 10, minWave: 1, color: '#ff003c' },
  2: { name: 'Fighter', hp: 2, width: 28, height: 28, speedMod: 0.9, pts: 20, minWave: 2, color: '#ffaa00' },
  3: { name: 'Cruiser', hp: 3, width: 32, height: 32, speedMod: 0.7, pts: 30, minWave: 4, color: '#ff003c' },
  4: { name: 'Bomber', hp: 4, width: 36, height: 32, speedMod: 0.6, pts: 40, minWave: 3, color: '#ff4400' },
  5: { name: 'Interceptor', hp: 1, width: 16, height: 32, speedMod: 1.5, pts: 15, minWave: 3, color: '#ff00ff' },
  6: { name: 'Carrier', hp: 6, width: 44, height: 44, speedMod: 0.5, pts: 60, minWave: 5, color: '#aa00ff' },
  7: { name: 'Star', hp: 3, width: 26, height: 26, speedMod: 1.1, pts: 35, minWave: 6, color: '#ffff00' },
  8: { name: 'Tank', hp: 8, width: 38, height: 38, speedMod: 0.4, pts: 80, minWave: 7, color: '#ff22aa' },
  9: { name: 'Dart', hp: 2, width: 24, height: 20, speedMod: 1.3, pts: 25, minWave: 4, color: '#00ffaa' },
  10: { name: 'Ghost', hp: 2, width: 28, height: 28, speedMod: 0.8, pts: 50, minWave: 6, color: '#bbbbbb' },
  11: { name: 'Juggernaut', hp: 15, width: 60, height: 60, speedMod: 0.3, pts: 200, minWave: 10, color: '#ff0000' },
  12: { name: 'Seeker', hp: 2, width: 26, height: 26, speedMod: 1.2, pts: 40, minWave: 8, color: '#ff0000' },
};

const COLORS = {
  player: '#00f0ff',
  playerGlow: 'rgba(0, 240, 255, 0.3)',
  bullet: '#ff003c',
  bulletGlow: 'rgba(255, 0, 60, 0.4)',
  enemy1: '#ff003c',
  enemy2: '#ffaa00',
  enemy3: '#ff003c',
  hud: '#00f0ff',
  hudDim: 'rgba(0, 240, 255, 0.4)',
  star: '#ffffff',
  gridLine: 'rgba(255, 255, 255, 0.04)',
  bg: '#020204',
};

const NebulaOverride: React.FC = () => {
  const {
    gameState, highScore,
    setScore, setLives, setWave, deactivateNebula,
  } = useNebulaOverride();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  // Game objects stored in refs to avoid re-render overhead
  const playerRef = useRef({ x: 0, y: 0, width: 24, height: 28, invulnerableUntil: 0 });
  const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight - 80 });
  const isMouseDownRef = useRef(false);
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const powerupsRef = useRef<PowerUp[]>([]);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastFireRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const waveRef = useRef(1);
  const enemiesSpawnedRef = useRef(0);
  const totalEnemiesInWaveRef = useRef(ENEMIES_PER_WAVE_BASE);
  const spawnTimerRef = useRef(0);
  const gameOverRef = useRef(false);
  const peakScoreRef = useRef(0);
  const [_showGameOver, setShowGameOver] = useState(false);
  const highScoreRef = useRef(highScore);
  const activeBuffsRef = useRef({ spread: 0, rapid: 0, wingman: 0, homing: 0, shield: 0 });

  // Sync high score to ref to avoid triggering the main game loop useEffect
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  // ─── Activation glitch state ──────────────────────────────────────
  const [activationText, setActivationText] = useState('');
  const [activationOpacity, setActivationOpacity] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  // ─── Activation animation ─────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'activating') {
      setActivationText('');
      setActivationOpacity(0);
      setGlitchIntensity(0);
      return;
    }

    const lines = [
      '> SYSTEM INTERRUPT DETECTED',
      '> BYPASSING SECURITY PROTOCOLS...',
      '> LOADING NEBULA_OVERRIDE.exe',
      '> ██████████████████ 100%',
      '',
      '[ NEBULA OVERRIDE ACTIVATED ]',
    ];

    let idx = 0;
    let displayed = '';
    setGlitchIntensity(1);

    const interval = setInterval(() => {
      if (idx < lines.length) {
        displayed += (idx > 0 ? '\n' : '') + lines[idx];
        setActivationText(displayed);
        setActivationOpacity(1);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 350);

    // Escalate glitch
    const glitchTimer = setInterval(() => {
      setGlitchIntensity(prev => Math.min(prev + 0.3, 3));
    }, 500);

    // Smooth fade out of text right before game starts (around 2000ms, game starts at 2500ms)
    const fadeTimer = setTimeout(() => {
      setActivationOpacity(0);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchTimer);
      clearTimeout(fadeTimer);
    };
  }, [gameState]);

  // ─── Initialize stars ─────────────────────────────────────────────
  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 2,
        size: Math.random() * 1.5 + 0.5,
        brightness: 0.3 + Math.random() * 0.7,
      });
    }
    starsRef.current = stars;
  }, []);

  // ─── Spawn enemies for current wave ───────────────────────────────
  const spawnEnemy = useCallback((width: number) => {
    const waveNum = waveRef.current;
    
    const candidates = Object.keys(ENEMY_DEFS).map(Number).filter(k => ENEMY_DEFS[k].minWave <= waveNum);
    
    let totalWeight = 0;
    const weights = candidates.map(c => {
      const def = ENEMY_DEFS[c];
      const age = waveNum - def.minWave;
      const weight = Math.max(20, 100 - age * 15);
      totalWeight += weight;
      return weight;
    });
    
    let r = Math.random() * totalWeight;
    let selectedType = candidates[0];
    for (let i = 0; i < candidates.length; i++) {
      if (r < weights[i]) {
        selectedType = candidates[i];
        break;
      }
      r -= weights[i];
    }
    
    const def = ENEMY_DEFS[selectedType];
    const enemy: Enemy = {
      startX: 30 + Math.random() * (width - 60),
      x: 0,
      y: -50,
      speed: (BASE_ENEMY_SPEED + (waveNum - 1) * 0.15 + Math.random() * 0.5) * def.speedMod,
      width: def.width,
      height: def.height,
      hp: def.hp,
      type: selectedType,
      time: Math.random() * 100, // For trigonometric movement
    };
    enemy.x = enemy.startX!;
    enemiesRef.current.push(enemy);
  }, []);

  // ─── Create explosion particles ───────────────────────────────────
  const createExplosion = useCallback((x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 1 + Math.random() * 3;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color,
        size: 1 + Math.random() * 2,
      });
    }
  }, []);

  // ─── Main game loop ───────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (starsRef.current.length === 0) {
        initStars(canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Reset game state
    const player = playerRef.current;
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
    player.invulnerableUntil = 0;
    bulletsRef.current = [];
    enemiesRef.current = [];
    powerupsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    peakScoreRef.current = 0;
    livesRef.current = 3;
    waveRef.current = 1;
    enemiesSpawnedRef.current = 0;
    totalEnemiesInWaveRef.current = ENEMIES_PER_WAVE_BASE;
    spawnTimerRef.current = 0;
    gameOverRef.current = false;
    activeBuffsRef.current = { spread: 0, rapid: 0, wingman: 0, homing: 0, shield: 0 };
    setShowGameOver(false);
    setScore(0);
    setLives(3);
    setWave(1);
    initStars(canvas.width, canvas.height);

    const gameLoop = (timestamp: number) => {
      if (gameState !== 'playing') return;

      const { width, height } = canvas;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, width, height);

      // ─── Grid background ─────────────────────────────────────
      ctx.strokeStyle = COLORS.gridLine;
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ─── Stars ────────────────────────────────────────────────
      starsRef.current.forEach(star => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      if (!gameOverRef.current) {
        // ─── Player input (Keyboard + Mouse) ────────────────────
        const keys = keysRef.current;
        let dx = 0;
        let dy = 0;
        let usingKeyboard = false;

        if (keys.has('ArrowLeft') || keys.has('a')) { dx -= PLAYER_SPEED; usingKeyboard = true; }
        if (keys.has('ArrowRight') || keys.has('d')) { dx += PLAYER_SPEED; usingKeyboard = true; }
        if (keys.has('ArrowUp') || keys.has('w')) { dy -= PLAYER_SPEED; usingKeyboard = true; }
        if (keys.has('ArrowDown') || keys.has('s')) { dy += PLAYER_SPEED; usingKeyboard = true; }

        if (usingKeyboard) {
          player.x = Math.max(player.width / 2, Math.min(width - player.width / 2, player.x + dx));
          player.y = Math.max(player.height, Math.min(height - player.height, player.y + dy));
          // Update mouse ref so mouse doesn't snap back immediately
          mousePosRef.current.x = player.x;
          mousePosRef.current.y = player.y;
        } else {
          // Smooth mouse follow
          const mouseX = Math.max(player.width / 2, Math.min(width - player.width / 2, mousePosRef.current.x));
          const mouseY = Math.max(player.height, Math.min(height - player.height, mousePosRef.current.y));
          
          // Interpolate for smooth movement
          player.x += (mouseX - player.x) * 0.3;
          player.y += (mouseY - player.y) * 0.3;
        }

        // ─── Shooting ───────────────────────────────────────────
        const isRapid = timestamp < activeBuffsRef.current.rapid;
        const currentFireRate = isRapid ? FIRE_RATE / 2 : FIRE_RATE;

        if ((keys.has(' ') || isMouseDownRef.current) && timestamp - lastFireRef.current > currentFireRate) {
          const isSpread = timestamp < activeBuffsRef.current.spread;
          const isHoming = timestamp < activeBuffsRef.current.homing;
          const hasWingman = timestamp < activeBuffsRef.current.wingman;

          bulletsRef.current.push({
            x: player.x,
            y: player.y - player.height / 2,
            vx: 0, vy: -BULLET_SPEED, isHoming
          });

          if (isSpread) {
            bulletsRef.current.push({ x: player.x, y: player.y - player.height / 2, vx: -2, vy: -BULLET_SPEED, isHoming });
            bulletsRef.current.push({ x: player.x, y: player.y - player.height / 2, vx: 2, vy: -BULLET_SPEED, isHoming });
          }

          if (hasWingman) {
            bulletsRef.current.push({ x: player.x - 30, y: player.y + 10, vx: 0, vy: -BULLET_SPEED, isHoming });
            bulletsRef.current.push({ x: player.x + 30, y: player.y + 10, vx: 0, vy: -BULLET_SPEED, isHoming });
          }

          lastFireRef.current = timestamp;
        }

        // ─── Draw player ────────────────────────────────────────
        const hasShield = timestamp < activeBuffsRef.current.shield;
        const isInvulnerable = timestamp < player.invulnerableUntil || hasShield;
        const drawPlayer = !isInvulnerable || Math.floor(timestamp / 80) % 2 === 0;

        if (drawPlayer) {
          ctx.save();
          // Glow
          ctx.shadowColor = COLORS.player;
          ctx.shadowBlur = 15;
          ctx.fillStyle = COLORS.player;
          ctx.beginPath();
          ctx.moveTo(player.x, player.y - player.height / 2);
          ctx.lineTo(player.x - player.width / 2, player.y + player.height / 2);
          ctx.lineTo(player.x, player.y + player.height / 4);
          ctx.lineTo(player.x + player.width / 2, player.y + player.height / 2);
          ctx.closePath();
          ctx.fill();
          // Inner highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.moveTo(player.x, player.y - player.height / 3);
          ctx.lineTo(player.x - 4, player.y + 4);
          ctx.lineTo(player.x + 4, player.y + 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Engine trail
          ctx.fillStyle = COLORS.bullet;
          ctx.shadowColor = COLORS.bullet;
          ctx.shadowBlur = 10;
          const trailX = player.x;
          const trailY = player.y + player.height / 2 + 2;
          const trailLen = 5 + Math.random() * 8;
          ctx.beginPath();
          ctx.moveTo(trailX - 3, trailY);
          ctx.lineTo(trailX, trailY + trailLen);
          ctx.lineTo(trailX + 3, trailY);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw Wingmen
          if (timestamp < activeBuffsRef.current.wingman) {
            ctx.fillStyle = COLORS.player;
            ctx.shadowColor = COLORS.player;
            ctx.shadowBlur = 5;
            // Left
            ctx.beginPath(); ctx.moveTo(player.x - 30, player.y + 5); ctx.lineTo(player.x - 35, player.y + 15); ctx.lineTo(player.x - 25, player.y + 15); ctx.fill();
            // Right
            ctx.beginPath(); ctx.moveTo(player.x + 30, player.y + 5); ctx.lineTo(player.x + 25, player.y + 15); ctx.lineTo(player.x + 35, player.y + 15); ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Draw Shield ring
          if (hasShield) {
            ctx.strokeStyle = COLORS.player;
            ctx.lineWidth = 2;
            ctx.shadowColor = COLORS.player;
            ctx.shadowBlur = 10;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -timestamp / 20;
            ctx.beginPath(); ctx.arc(player.x, player.y, 35, 0, Math.PI * 2); ctx.stroke();
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;
          }
        }

        // ─── Enemy spawning ─────────────────────────────────────
        spawnTimerRef.current += 16;
        const spawnInterval = Math.max(250, 1500 - waveRef.current * 100);
        if (spawnTimerRef.current >= spawnInterval && enemiesSpawnedRef.current < totalEnemiesInWaveRef.current) {
          spawnEnemy(width);
          enemiesSpawnedRef.current++;
          spawnTimerRef.current = 0;
        }

        // Check wave completion
        if (enemiesSpawnedRef.current >= totalEnemiesInWaveRef.current && enemiesRef.current.length === 0) {
          const newWave = waveRef.current + 1;
          waveRef.current = newWave;
          setWave(newWave);
          enemiesSpawnedRef.current = 0;
          totalEnemiesInWaveRef.current = Math.floor(10 + newWave * 5 + Math.pow(newWave, 1.5));
          spawnTimerRef.current = -1000; // brief pause between waves
        }
      }

      // ─── Update & draw bullets ──────────────────────────────
      bulletsRef.current = bulletsRef.current.filter(b => {
        if (b.isHoming && enemiesRef.current.length > 0) {
          let nearest = enemiesRef.current[0];
          let minDist = Infinity;
          for (const e of enemiesRef.current) {
            const dist = Math.hypot(e.x - b.x, e.y - b.y);
            if (dist < minDist) { minDist = dist; nearest = e; }
          }
          const dx = nearest.x - b.x;
          const dy = nearest.y - b.y;
          const len = Math.hypot(dx, dy);
          if (len > 0) {
             const targetVx = (dx / len) * BULLET_SPEED;
             const targetVy = (dy / len) * BULLET_SPEED;
             b.vx += (targetVx - b.vx) * 0.1;
             b.vy += (targetVy - b.vy) * 0.1;
          }
        }

        b.x += b.vx;
        b.y += b.vy;
        
        if (b.y < -30 || b.x < -30 || b.x > width + 30 || b.y > height + 30) return false;

        ctx.save();
        const bColor = b.isHoming ? '#00ffaa' : COLORS.bullet;
        ctx.shadowColor = bColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = bColor;
        
        const angle = Math.atan2(b.vy, b.vx);
        ctx.translate(b.x, b.y);
        ctx.rotate(angle + Math.PI/2);
        ctx.fillRect(-1.5, -6, 3, 12);
        ctx.restore();

        return true;
      });

      // ─── Update & draw enemies ────────────────────────────────
      enemiesRef.current = enemiesRef.current.filter(enemy => {
        const def = ENEMY_DEFS[enemy.type];
        enemy.y += enemy.speed;
        
        // Ghost specific erratic movement
        if (enemy.type === 10) {
          enemy.time = (enemy.time || 0) + 0.05;
          enemy.x = (enemy.startX || enemy.x) + Math.sin(enemy.time) * 40;
        }

        // Seeker specific homing logic
        if (enemy.type === 12 && player.y > enemy.y) {
          if (player.x > enemy.x) enemy.x += 0.5;
          if (player.x < enemy.x) enemy.x -= 0.5;
        }
        
        // Enemy escaped past the bottom of the screen
        if (enemy.y > canvas.height + 40) {
          scoreRef.current -= def.pts;
          
          if (scoreRef.current <= 0) {
            scoreRef.current = 0;
            gameOverRef.current = true;
            setShowGameOver(true);
          }
          
          setScore(scoreRef.current);
          return false;
        }

        // Draw enemy
        ctx.save();
        const eColor = def.color;
        ctx.shadowColor = eColor;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = eColor;
        ctx.lineWidth = 1.5;

        const hw = enemy.width / 2;
        const hh = enemy.height / 2;

        ctx.beginPath();
        switch (enemy.type) {
          case 1: // Diamond
            ctx.moveTo(enemy.x, enemy.y - hh);
            ctx.lineTo(enemy.x + hw, enemy.y);
            ctx.lineTo(enemy.x, enemy.y + hh);
            ctx.lineTo(enemy.x - hw, enemy.y);
            break;
          case 2: // Hexagon
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
              const px = enemy.x + Math.cos(angle) * hw;
              const py = enemy.y + Math.sin(angle) * hh;
              if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            break;
          case 3: // Cross
            ctx.moveTo(enemy.x - hw, enemy.y - hw); ctx.lineTo(enemy.x + hw, enemy.y + hw);
            ctx.moveTo(enemy.x + hw, enemy.y - hw); ctx.lineTo(enemy.x - hw, enemy.y + hw);
            ctx.stroke(); ctx.strokeRect(enemy.x - hw, enemy.y - hw, enemy.width, enemy.height);
            break;
          case 4: // Bomber (Inverted Triangle)
            ctx.moveTo(enemy.x - hw, enemy.y - hh);
            ctx.lineTo(enemy.x + hw, enemy.y - hh);
            ctx.lineTo(enemy.x, enemy.y + hh);
            break;
          case 5: // Interceptor (Needle)
            ctx.moveTo(enemy.x, enemy.y - hh);
            ctx.lineTo(enemy.x + hw, enemy.y + hh);
            ctx.lineTo(enemy.x, enemy.y + hh - 8);
            ctx.lineTo(enemy.x - hw, enemy.y + hh);
            break;
          case 6: // Carrier (Octagon)
            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI * 2 * i) / 8 - Math.PI / 8;
              if (i === 0) ctx.moveTo(enemy.x + Math.cos(angle) * hw, enemy.y + Math.sin(angle) * hh);
              else ctx.lineTo(enemy.x + Math.cos(angle) * hw, enemy.y + Math.sin(angle) * hh);
            }
            ctx.moveTo(enemy.x - hw/2, enemy.y); ctx.lineTo(enemy.x + hw/2, enemy.y);
            break;
          case 7: // Star
            for (let i = 0; i < 10; i++) {
              const r = i % 2 === 0 ? hw : hw / 2;
              const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
              if (i === 0) ctx.moveTo(enemy.x + Math.cos(angle) * r, enemy.y + Math.sin(angle) * r);
              else ctx.lineTo(enemy.x + Math.cos(angle) * r, enemy.y + Math.sin(angle) * r);
            }
            break;
          case 8: // Tank (Square)
            ctx.rect(enemy.x - hw, enemy.y - hh, enemy.width, enemy.height);
            ctx.rect(enemy.x - hw/2, enemy.y - hh/2, enemy.width/2, enemy.height/2);
            break;
          case 9: // Dart
            ctx.moveTo(enemy.x, enemy.y - hh);
            ctx.lineTo(enemy.x + hw, enemy.y + hh);
            ctx.lineTo(enemy.x, enemy.y + hh / 2);
            ctx.lineTo(enemy.x - hw, enemy.y + hh);
            break;
          case 10: // Ghost (Circle)
            ctx.arc(enemy.x, enemy.y, hw, 0, Math.PI * 2);
            ctx.moveTo(enemy.x - hw/2, enemy.y - hh/2); ctx.arc(enemy.x - hw/2, enemy.y - hh/2, 2, 0, Math.PI*2);
            ctx.moveTo(enemy.x + hw/2, enemy.y - hh/2); ctx.arc(enemy.x + hw/2, enemy.y - hh/2, 2, 0, Math.PI*2);
            break;
          case 11: // Juggernaut
            for (let i = 0; i < 12; i++) {
              const angle = (Math.PI * 2 * i) / 12;
              if (i === 0) ctx.moveTo(enemy.x + Math.cos(angle) * hw, enemy.y + Math.sin(angle) * hh);
              else ctx.lineTo(enemy.x + Math.cos(angle) * hw, enemy.y + Math.sin(angle) * hh);
            }
            ctx.moveTo(enemy.x, enemy.y - hh); ctx.lineTo(enemy.x, enemy.y + hh);
            ctx.moveTo(enemy.x - hw, enemy.y); ctx.lineTo(enemy.x + hw, enemy.y);
            break;
          case 12: // Seeker (X)
            ctx.moveTo(enemy.x - hw, enemy.y - hh); ctx.lineTo(enemy.x + hw, enemy.y + hh);
            ctx.moveTo(enemy.x + hw, enemy.y - hh); ctx.lineTo(enemy.x - hw, enemy.y + hh);
            break;
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = eColor + '20';
        if (enemy.type !== 3 && enemy.type !== 12) ctx.fill();
        ctx.restore();

        // Bullet-enemy collision
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
          const b = bulletsRef.current[i];
          if (
            b.x > enemy.x - enemy.width / 2 &&
            b.x < enemy.x + enemy.width / 2 &&
            b.y > enemy.y - enemy.height / 2 &&
            b.y < enemy.y + enemy.height / 2
          ) {
            bulletsRef.current.splice(i, 1);
            enemy.hp--;
            if (enemy.hp <= 0) {
              scoreRef.current += def.pts;
              peakScoreRef.current = Math.max(peakScoreRef.current, scoreRef.current);
              setScore(scoreRef.current);
              createExplosion(enemy.x, enemy.y, eColor, 16);
              
              const dropChance = 0.03 + (def.hp * 0.01);
              if (Math.random() < dropChance) {
                const pType = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
                powerupsRef.current.push({
                   x: enemy.x, y: enemy.y, speed: 1.5, type: pType, 
                   color: POWERUP_DEFS[pType].color, radius: 10 
                });
              }
              return false;
            } else {
              createExplosion(b.x, b.y, eColor, 6);
            }
          }
        }

        // Enemy-player collision
        if (!gameOverRef.current) {
          const player = playerRef.current;
          const now = performance.now();
          const hasShield = now < activeBuffsRef.current.shield;
          if (
            now > player.invulnerableUntil &&
            !hasShield &&
            enemy.x + enemy.width / 2 > player.x - player.width / 2 &&
            enemy.x - enemy.width / 2 < player.x + player.width / 2 &&
            enemy.y + enemy.height / 2 > player.y - player.height / 2 &&
            enemy.y - enemy.height / 2 < player.y + player.height / 2
          ) {
            livesRef.current--;
            setLives(livesRef.current);
            createExplosion(player.x, player.y, COLORS.player, 20);
            player.invulnerableUntil = now + INVULNERABLE_MS;

            if (livesRef.current <= 0) {
              gameOverRef.current = true;
              setShowGameOver(true);
            }
            return false; // remove enemy that hit player
          }
        }

        return true;
      });

      // ─── Update & draw powerups ──────────────────────────────
      powerupsRef.current = powerupsRef.current.filter(p => {
        p.y += p.speed;
        if (p.y > height + 20) return false;

        const player = playerRef.current;
        if (
          !gameOverRef.current &&
          p.x > player.x - player.width / 2 - p.radius &&
          p.x < player.x + player.width / 2 + p.radius &&
          p.y > player.y - player.height / 2 - p.radius &&
          p.y < player.y + player.height / 2 + p.radius
        ) {
          if (p.type === 'bomb') {
            enemiesRef.current.forEach(e => {
              const d = ENEMY_DEFS[e.type];
              scoreRef.current += d.pts;
              createExplosion(e.x, e.y, d.color, 16);
            });
            peakScoreRef.current = Math.max(peakScoreRef.current, scoreRef.current);
            setScore(scoreRef.current);
            enemiesRef.current = [];
          } else if (p.type === 'life') {
            livesRef.current++;
            setLives(livesRef.current);
          } else {
            const duration = p.type === 'shield' ? 5000 : p.type === 'wingman' ? 12000 : p.type === 'spread' ? 8000 : p.type === 'homing' ? 7000 : 6000;
            activeBuffsRef.current[p.type] = timestamp + duration;
          }
          createExplosion(p.x, p.y, p.color, 8);
          return false;
        }

        ctx.save();
        ctx.fillStyle = p.color + '40';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 0;
        ctx.font = 'bold 12px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(POWERUP_DEFS[p.type].letter, p.x, p.y + 1);
        ctx.restore();
        
        return true;
      });

      // ─── Update & draw particles ──────────────────────────────
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
        return true;
      });

      // ─── HUD ──────────────────────────────────────────────────
      ctx.save();
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textBaseline = 'top';

      // Score top-left
      ctx.fillStyle = COLORS.hudDim;
      ctx.fillText('SCORE', 20, 44);
      ctx.fillStyle = COLORS.hud;
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText(String(scoreRef.current).padStart(6, '0'), 20, 60);

      // High score
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = COLORS.hudDim;
      ctx.fillText(`HI ${String(Math.max(scoreRef.current, highScoreRef.current)).padStart(6, '0')}`, 20, 86);

      // Wave
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = COLORS.hudDim;
      ctx.textAlign = 'center';
      ctx.fillText(`WAVE ${waveRef.current}`, width / 2, 44);

      // Lives top-right
      ctx.textAlign = 'right';
      ctx.fillStyle = COLORS.hudDim;
      ctx.fillText('LIVES', width - 20, 44);
      for (let i = 0; i < livesRef.current; i++) {
        ctx.fillStyle = COLORS.player;
        ctx.shadowColor = COLORS.player;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(width - 30 - i * 18, 68, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // NEBULA OVERRIDE title bar
      ctx.textAlign = 'center';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 0, 60, 0.5)';
      ctx.fillText('[ NEBULA OVERRIDE ]', width / 2, 12);

      ctx.restore();

      // ─── Game over overlay ────────────────────────────────────
      if (gameOverRef.current) {
        ctx.save();
        ctx.fillStyle = 'rgba(2, 2, 4, 0.7)';
        ctx.fillRect(0, 0, width, height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = 'bold 36px "Space Grotesk", sans-serif';
        ctx.fillStyle = COLORS.enemy1;
        ctx.shadowColor = COLORS.enemy1;
        ctx.shadowBlur = 20;
        ctx.fillText('SYSTEM FAILURE', width / 2, height / 2 - 60);

        ctx.shadowBlur = 0;
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillStyle = COLORS.hud;
        ctx.fillText(`ROUND HIGH SCORE: ${String(peakScoreRef.current).padStart(6, '0')}`, width / 2, height / 2);
        ctx.fillText(`WAVE REACHED: ${waveRef.current}`, width / 2, height / 2 + 28);

        ctx.fillStyle = COLORS.hudDim;
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText('[ PRESS ENTER TO RETRY  •  ESC TO EXIT ]', width / 2, height / 2 + 70);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [gameState, initStars, spawnEnemy, createExplosion, setScore, setLives, setWave, deactivateNebula]);

  // ─── Input Listeners (Keyboard & Mouse) ───────────────────────────
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'activating') return;

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);

      if (e.key === 'Escape') {
        e.preventDefault();
        deactivateNebula();
      }

      // Retry on Enter when game over
      if (e.key === 'Enter' && gameOverRef.current) {
        gameOverRef.current = false;
        setShowGameOver(false);
        scoreRef.current = 0;
        peakScoreRef.current = 0;
        livesRef.current = 3;
        waveRef.current = 1;
        enemiesSpawnedRef.current = 0;
        totalEnemiesInWaveRef.current = ENEMIES_PER_WAVE_BASE;
        bulletsRef.current = [];
        enemiesRef.current = [];
        powerupsRef.current = [];
        particlesRef.current = [];
        activeBuffsRef.current = { spread: 0, rapid: 0, wingman: 0, homing: 0, shield: 0 };
        setScore(0);
        setLives(3);
        setWave(1);
        const canvas = canvasRef.current;
        if (canvas) {
          playerRef.current.x = canvas.width / 2;
          playerRef.current.y = canvas.height - 80;
          mousePosRef.current.x = canvas.width / 2;
          mousePosRef.current.y = canvas.height - 80;
          playerRef.current.invulnerableUntil = 0;
        }
      }

      // Prevent page scroll on game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    // Mouse
    const onMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      // Handle potential scaling or offsets
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      mousePosRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click
        isMouseDownRef.current = true;
        
        // Allow clicking to retry
        if (gameOverRef.current) {
          const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
          onKeyDown(fakeEvent);
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        isMouseDownRef.current = false;
      }
    };

    // Prevent context menu on right click during gameplay
    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    // Attach context menu prevention to canvas if it exists
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('contextmenu', onContextMenu);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      if (canvas) {
        canvas.removeEventListener('contextmenu', onContextMenu);
      }
      keysRef.current.clear();
      isMouseDownRef.current = false;
    };
  }, [gameState, deactivateNebula, setScore, setLives, setWave]);

  // ─── Render nothing when idle ──────────────────────────────────────
  if (gameState === 'idle') return null;

  return (
    <div
      className="fixed inset-0 z-[99999]"
      style={{
        opacity: gameState === 'deactivating' ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Activation overlay */}
      {gameState === 'activating' && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100000]"
          style={{
            background: '#020204',
            animation: `nebula-glitch ${0.1 / glitchIntensity}s infinite`,
          }}
        >
          {/* Scanline overlay during activation */}
          <div 
            className="absolute inset-0 scanlines opacity-30 pointer-events-none transition-opacity duration-500" 
            style={{ opacity: activationOpacity === 0 ? 0 : 0.3 }}
          />

          {/* Activation text */}
          <pre
            className="font-jetbrains text-sm md:text-base tracking-wider text-center leading-relaxed transition-opacity duration-500"
            style={{
              color: COLORS.hud,
              textShadow: `0 0 10px ${COLORS.hud}, 0 0 20px ${COLORS.hud}`,
              opacity: activationOpacity,
              whiteSpace: 'pre-wrap',
              maxWidth: '90vw',
            }}
          >
            {activationText}
          </pre>

          {/* Glitch bars */}
          {glitchIntensity > 1 && (
            <>
              <div
                className="absolute left-0 right-0 h-1 bg-[#ff003c] opacity-50"
                style={{
                  top: `${30 + Math.random() * 40}%`,
                  transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
                  animation: 'nebula-glitch-bar 0.15s infinite',
                }}
              />
              <div
                className="absolute left-0 right-0 h-0.5 bg-[#00f0ff] opacity-40"
                style={{
                  top: `${50 + Math.random() * 30}%`,
                  transform: `translateX(${(Math.random() - 0.5) * 30}px)`,
                  animation: 'nebula-glitch-bar 0.1s infinite reverse',
                }}
              />
            </>
          )}
        </div>
      )}

      {/* Game canvas */}
      {(gameState === 'playing' || gameState === 'deactivating' || gameState === 'activating') && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full"
          style={{ 
            background: COLORS.bg,
            opacity: gameState === 'activating' ? (activationOpacity === 0 ? 1 : 0) : 1,
            transition: 'opacity 0.5s ease-in',
            cursor: 'crosshair',
          }}
        />
      )}
    </div>
  );
};

export default NebulaOverride;
