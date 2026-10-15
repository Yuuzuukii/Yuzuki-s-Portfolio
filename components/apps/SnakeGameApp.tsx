import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Pause, Sparkles, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { audio } from '../../services/audioService';

const GRID_SIZE = 22; // 22 x 22 grid
const INITIAL_SPEED = 110; // ms per tick
const CANVAS_SIZE = 400; // logical px
// Crisp rendering on HiDPI screens (capped to keep fill-rate reasonable)
const DPR = typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 1;

// Ignore game hotkeys while the user is typing in another app's input
const isTypingTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export const SnakeGameApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yuzuos_snake_highscore');
      return saved ? parseInt(saved, 10) : 1200;
    }
    return 1200;
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.isMuted());
  const [level, setLevel] = useState<number>(1);
  const [combo, setCombo] = useState<number>(1);
  const [announcement, setAnnouncement] = useState<string>('PRESS PLAY OR SPACE TO START');

  // Game state stored in refs for 60fps frame loop & deterministic tick
  const snakeRef = useRef<Position[]>([
    { x: 10, y: 11 },
    { x: 10, y: 12 },
    { x: 10, y: 13 },
  ]);
  const dirRef = useRef<Direction>('UP');
  const nextDirRef = useRef<Direction>('UP');
  const foodRef = useRef<Position>({ x: 10, y: 6 });
  const bonusFoodRef = useRef<{ x: number; y: number; life: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastEatTimeRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number>(0);
  const dirQueueRef = useRef<Direction[]>([]);
  const scoreRef = useRef<number>(0);
  const levelRef = useRef<number>(1);
  const comboRef = useRef<number>(1);
  const deadRef = useRef<boolean>(false);

  // Sound toggle
  const toggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  // Spawn standard cyber food away from snake body
  const spawnFood = useCallback(() => {
    const snake = snakeRef.current;
    let newFood: Position;
    let collision: boolean;
    let attempts = 0;
    do {
      newFood = {
        x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
      };
      collision = snake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      attempts++;
    } while (collision && attempts < 100);

    foodRef.current = newFood;

    // Chance to spawn special bonus gold orb
    if (Math.random() < 0.25 && !bonusFoodRef.current) {
      let bonusPos: Position;
      let bonusCollision: boolean;
      do {
        bonusPos = {
          x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
          y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        };
        bonusCollision = snake.some(s => s.x === bonusPos.x && s.y === bonusPos.y) || 
                         (bonusPos.x === newFood.x && bonusPos.y === newFood.y);
        attempts++;
      } while (bonusCollision && attempts < 200);
      bonusFoodRef.current = { ...bonusPos, life: 120 }; // lasts ~120 frames
    }
  }, []);

  // Add burst particles
  const addParticles = (gx: number, gy: number, count: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cellSize = CANVAS_SIZE / GRID_SIZE;
    const px = (gx + 0.5) * cellSize;
    const py = (gy + 0.5) * cellSize;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.0;
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color,
        size: 2.5 + Math.random() * 3.5,
      });
    }
  };

  // Start / restart game
  const startGame = useCallback(() => {
    audio.playTargetHit();
    snakeRef.current = [
      { x: 10, y: 11 },
      { x: 10, y: 12 },
      { x: 10, y: 13 },
    ];
    dirRef.current = 'UP';
    nextDirRef.current = 'UP';
    dirQueueRef.current = [];
    scoreRef.current = 0;
    levelRef.current = 1;
    comboRef.current = 1;
    deadRef.current = false;
    lastEatTimeRef.current = 0;
    particlesRef.current = [];
    bonusFoodRef.current = null;
    setScore(0);
    setLevel(1);
    setCombo(1);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setAnnouncement('SYSTEM ACTIVE - GOOD LUCK');
    spawnFood();
  }, [spawnFood]);

  // Handle direction changes
  const changeDirection = useCallback((newDir: Direction) => {
    const queue = dirQueueRef.current;
    const last = queue.length > 0 ? queue[queue.length - 1] : dirRef.current;
    const opposite: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (newDir === last || newDir === opposite[last] || queue.length >= 2) return;
    queue.push(newDir);
  }, []);

  // Add points and keep high score / level in sync (side effects outside state updaters)
  const addPoints = useCallback((pts: number) => {
    const newScore = scoreRef.current + pts;
    scoreRef.current = newScore;
    setScore(newScore);
    setHighScore(h => Math.max(h, newScore));
    try {
      const saved = parseInt(localStorage.getItem('yuzuos_snake_highscore') || '0', 10);
      if (newScore > saved) localStorage.setItem('yuzuos_snake_highscore', newScore.toString());
    } catch {
      // storage unavailable: keep in-memory high score only
    }
    const nextLevel = Math.floor(newScore / 500) + 1;
    if (nextLevel > levelRef.current) {
      levelRef.current = nextLevel;
      setLevel(nextLevel);
      audio.playBumper();
      setAnnouncement(`LEVEL UP! SPEED LVL ${nextLevel}`);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.code === 'Space') {
        if (!isPlaying || isGameOver) {
          startGame();
        } else {
          setIsPaused(prev => !prev);
          audio.playClick();
        }
        return;
      }

      if (!isPlaying || isPaused || isGameOver) return;

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          changeDirection('UP');
          break;
        case 'arrowdown':
        case 's':
          changeDirection('DOWN');
          break;
        case 'arrowleft':
        case 'a':
          changeDirection('LEFT');
          break;
        case 'arrowright':
        case 'd':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isGameOver, changeDirection, startGame]);

  // Main 60fps Game & Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      const cellSize = CANVAS_SIZE / GRID_SIZE;

      // 1. GAME TICK LOGIC (deterministic speed based on level)
      if (isPlaying && !isPaused && !isGameOver && !deadRef.current) {
        const tickInterval = Math.max(55, INITIAL_SPEED - (levelRef.current - 1) * 8);

        if (time - lastTickTimeRef.current >= tickInterval) {
          lastTickTimeRef.current = time;

          const queued = dirQueueRef.current.shift();
          if (queued) nextDirRef.current = queued;
          dirRef.current = nextDirRef.current;
          const head = { ...snakeRef.current[0] };

          switch (dirRef.current) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
          }

          // Check Wall Collision
          if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            deadRef.current = true;
            audio.playDrain();
            setIsGameOver(true);
            setAnnouncement('CRITICAL COLLISION: WALL IMPACT');
            return;
          }

          // Check Self Collision (the tail cell is vacated this tick unless we eat)
          const eats =
            (head.x === foodRef.current.x && head.y === foodRef.current.y) ||
            (!!bonusFoodRef.current && head.x === bonusFoodRef.current.x && head.y === bonusFoodRef.current.y);
          const body = eats ? snakeRef.current : snakeRef.current.slice(0, -1);
          if (body.some(seg => seg.x === head.x && seg.y === head.y)) {
            deadRef.current = true;
            audio.playDrain();
            setIsGameOver(true);
            setAnnouncement('CRITICAL COLLISION: SELF IMPACT');
            return;
          }

          const newSnake = [head, ...snakeRef.current];

          // Check Normal Food
          if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            audio.playTargetHit();
            addParticles(head.x, head.y, 14, '#06b6d4');

            const now = Date.now();
            const timeDiff = now - lastEatTimeRef.current;
            lastEatTimeRef.current = now;

            let curCombo = 1;
            if (timeDiff < 2500) {
              curCombo = Math.min(5, comboRef.current + 1);
              if (curCombo > 2) audio.playJackpot();
            }
            comboRef.current = curCombo;
            setCombo(curCombo);

            addPoints(100 * curCombo);

            snakeRef.current = newSnake; // so new food never spawns under the head
            spawnFood();
          } else if (bonusFoodRef.current && head.x === bonusFoodRef.current.x && head.y === bonusFoodRef.current.y) {
            // Check Bonus Gold Food
            audio.playJackpot();
            addParticles(head.x, head.y, 20, '#fbbf24');
            bonusFoodRef.current = null;
            setAnnouncement('SUPER BONUS! +500 PTS');
            addPoints(500);
          } else {
            // Normal move: remove tail
            newSnake.pop();
          }

          snakeRef.current = newSnake;

          // Decay bonus food life
          if (bonusFoodRef.current) {
            bonusFoodRef.current.life -= 1;
            if (bonusFoodRef.current.life <= 0) {
              bonusFoodRef.current = null;
            }
          }
        }
      }

      // 2. CANVAS RENDERING
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Deep obsidian background with soft center glow
      const bgGrad = ctx.createRadialGradient(
        CANVAS_SIZE / 2, CANVAS_SIZE / 2, 20,
        CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE * 0.75
      );
      bgGrad.addColorStop(0, '#0d1b2e');
      bgGrad.addColorStop(1, '#04070d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Subtle checkerboard tiles instead of harsh grid lines
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        for (let gy = 0; gy < GRID_SIZE; gy++) {
          if ((gx + gy) % 2 === 0) {
            ctx.fillStyle = 'rgba(103, 232, 249, 0.035)';
            ctx.fillRect(gx * cellSize, gy * cellSize, cellSize, cellSize);
          }
        }
      }

      // Inner arena frame (double line with glow)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.strokeRect(1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(165, 243, 252, 0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(5.5, 5.5, CANVAS_SIZE - 11, CANVAS_SIZE - 11);

      // Render Food (Neon Magenta Energy Core)
      const food = foodRef.current;
      const fx = (food.x + 0.5) * cellSize;
      const fy = (food.y + 0.5) * cellSize;
      const foodRadius = (cellSize / 2) * 0.72;

      ctx.save();
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 14;
      const foodGrad = ctx.createRadialGradient(fx - 2, fy - 2, 1, fx, fy, foodRadius);
      foodGrad.addColorStop(0, '#ffffff');
      foodGrad.addColorStop(0.3, '#fb7185');
      foodGrad.addColorStop(0.8, '#f43f5e');
      foodGrad.addColorStop(1, '#be123c');
      ctx.fillStyle = foodGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, foodRadius, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing outer ring
      const pulseRing = foodRadius + Math.sin(time * 0.008) * 3 + 1;
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(fx, fy, pulseRing, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Render Bonus Food if active (Gold Cyber Star)
      if (bonusFoodRef.current) {
        const bx = (bonusFoodRef.current.x + 0.5) * cellSize;
        const by = (bonusFoodRef.current.y + 0.5) * cellSize;
        const bRadius = (cellSize / 2) * 0.85;

        ctx.save();
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 18;
        const bGrad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, bRadius);
        bGrad.addColorStop(0, '#ffffff');
        bGrad.addColorStop(0.4, '#fde047');
        bGrad.addColorStop(0.9, '#f59e0b');
        bGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(bx, by, bRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', bx, by);
        ctx.restore();
      }

      // Render Snake: smooth connected body (tail tapers), glossy head with eyes
      const snake = snakeRef.current;
      const half = cellSize / 2;
      for (let idx = snake.length - 1; idx >= 0; idx--) {
        const seg = snake[idx];
        const cx = (seg.x + 0.5) * cellSize;
        const cy = (seg.y + 0.5) * cellSize;
        const isHead = idx === 0;
        const taper = isHead ? 1 : 1 - (idx / Math.max(snake.length, 8)) * 0.3;
        const rad = (half - 1.5) * taper;
        const fraction = idx / Math.max(snake.length, 1);

        ctx.save();
        ctx.shadowColor = isHead ? '#22d3ee' : '#10b981';
        ctx.shadowBlur = isHead ? 16 : 6;

        // Bridge to the next segment so the body reads as one continuous creature
        if (idx < snake.length - 1) {
          const nx = (snake[idx + 1].x + 0.5) * cellSize;
          const ny = (snake[idx + 1].y + 0.5) * cellSize;
          ctx.strokeStyle = `rgb(${Math.round(8 + fraction * 8)}, ${Math.round(170 - fraction * 40)}, ${Math.round(205 - fraction * 75)})`;
          ctx.lineWidth = rad * 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }

        const grad = ctx.createRadialGradient(cx - rad * 0.35, cy - rad * 0.4, 1, cx, cy, rad);
        if (isHead) {
          grad.addColorStop(0, '#cffafe');
          grad.addColorStop(0.45, '#22d3ee');
          grad.addColorStop(1, '#0e7490');
        } else {
          grad.addColorStop(0, `rgb(${Math.round(110 - fraction * 40)}, ${Math.round(235 - fraction * 50)}, ${Math.round(230 - fraction * 90)})`);
          grad.addColorStop(1, `rgb(${Math.round(8 + fraction * 8)}, ${Math.round(150 - fraction * 40)}, ${Math.round(185 - fraction * 75)})`);
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();

        if (isHead) {
          ctx.shadowBlur = 0;
          const d = dirRef.current;
          const fx = d === 'LEFT' ? -1 : d === 'RIGHT' ? 1 : 0;
          const fy = d === 'UP' ? -1 : d === 'DOWN' ? 1 : 0;
          const px = -fy;
          const py = fx;
          [-1, 1].forEach(side => {
            const ex = cx + fx * rad * 0.35 + px * side * rad * 0.5;
            const ey = cy + fy * rad * 0.35 + py * side * rad * 0.5;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ex, ey, 2.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(ex + fx * 0.9, ey + fy * 0.9, 1.3, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        ctx.restore();
      }

      // Update & Render Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        p.vx *= 0.94;
        p.vy *= 0.94;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isPaused, isGameOver, spawnFood, addPoints]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-3 select-none font-mono text-cyan-300" style={{ background: 'radial-gradient(ellipse at 50% 0%, #0f2336 0%, #070b14 60%, #04060c 100%)' }}>
      {/* Top Cyber HUD Status */}
      <div className="w-full max-w-[420px] bg-gradient-to-b from-slate-800/70 to-slate-900/80 border border-cyan-400/25 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] gap-3 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-cyan-400/70 uppercase tracking-widest">Score</span>
          <span className="text-2xl font-black text-white tracking-wider tabular-nums leading-none">{score.toLocaleString()}</span>
        </div>

        {/* Combo Multiplier indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs">
          <Zap size={14} className={combo > 1 ? 'text-amber-400 animate-bounce' : 'text-cyan-400'} />
          <span className="font-bold text-white">{combo}x COMBO</span>
          <span className="text-cyan-400/50">|</span>
          <span className="font-bold text-cyan-200">LV {level}</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[10px] text-cyan-400/70 uppercase tracking-widest flex items-center justify-end gap-1">
            <Trophy size={10} className="text-amber-400" /> High
          </span>
          <span className="text-sm font-bold text-cyan-200">{highScore.toLocaleString()}</span>
        </div>

        {/* Audio Mute Button */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/20 cursor-pointer ml-1"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Main Game Canvas Viewport */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center my-1">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE * DPR}
          height={CANVAS_SIZE * DPR}
          className="max-w-[min(400px,100%)] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_0_1px_rgba(103,232,249,0.25),0_0_30px_rgba(6,182,212,0.15)] aspect-square max-h-[calc(100vh-270px)] sm:max-h-[380px] w-auto h-auto object-contain"
        />

        {/* Overlay: Start / Ready Screen */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 z-20">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_#06b6d4] mb-3 animate-pulse">
              <Zap size={28} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-[0.25em] uppercase mb-1 drop-shadow-[0_0_14px_rgba(6,182,212,0.8)]">
              CYBER SNAKE
            </h2>
            <p className="text-xs text-cyan-300/80 text-center mb-4 max-w-[240px]">
              Classic retro gameplay with ultra-responsive neon physics & combo scoring
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl font-black text-base text-black bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer flex items-center gap-2"
            >
              <Play size={18} className="fill-black" />
              <span>START GAME</span>
            </button>
          </div>
        )}

        {/* Overlay: Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 z-30 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 shadow-[0_0_20px_#f43f5e] mb-2">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-black text-rose-400 tracking-widest uppercase">SYSTEM TERMINATED</h3>
            <p className="text-sm text-white font-bold mt-1">Final Score: {score.toLocaleString()}</p>
            <p className="text-xs text-cyan-400/80 mb-4">High Score: {highScore.toLocaleString()}</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 shadow-[0_0_20px_#06b6d4] cursor-pointer flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}

        {/* Overlay: Pause Screen */}
        {isPaused && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
            <h3 className="text-2xl font-black text-amber-300 tracking-widest uppercase mb-3">PAUSED</h3>
            <button
              onClick={() => setIsPaused(false)}
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm cursor-pointer shadow-lg"
            >
              RESUME
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Announcement Banner */}
      <div className="w-full max-w-[420px] text-center text-[10px] text-cyan-400/80 font-mono tracking-tight shrink-0 my-0.5">
        {announcement}
      </div>

      {/* On-screen Ergonomic Cyber D-Pad Controls (for Mobile, Touch & Quick Mouse Click) */}
      <div className="w-full max-w-[420px] flex items-center justify-between px-2 py-1 shrink-0">
        {/* Pause / Play button */}
        <button
          onClick={() => {
            if (!isPlaying || isGameOver) startGame();
            else setIsPaused(p => !p);
          }}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-bold text-xs flex items-center gap-1.5 active:scale-95 cursor-pointer shadow"
        >
          {isPaused || !isPlaying ? <Play size={14} /> : <Pause size={14} />}
          <span>{isPaused ? 'RESUME' : !isPlaying ? 'PLAY' : 'PAUSE'}</span>
        </button>

        {/* 4-Way Cyber D-Pad */}
        <div className="grid grid-cols-3 gap-1 w-28 h-24">
          <div />
          <button
            onPointerDown={() => changeDirection('UP')}
            className="w-full h-8 rounded-lg bg-gradient-to-b from-slate-700/80 to-cyan-950/90 hover:from-slate-600 hover:to-cyan-900 border border-cyan-400/30 active:bg-cyan-500 active:text-black flex items-center justify-center text-cyan-300 cursor-pointer transition-colors shadow"
            title="Up"
          >
            <ArrowUp size={16} />
          </button>
          <div />

          <button
            onPointerDown={() => changeDirection('LEFT')}
            className="w-full h-8 rounded-lg bg-gradient-to-b from-slate-700/80 to-cyan-950/90 hover:from-slate-600 hover:to-cyan-900 border border-cyan-400/30 active:bg-cyan-500 active:text-black flex items-center justify-center text-cyan-300 cursor-pointer transition-colors shadow"
            title="Left"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
          </div>
          <button
            onPointerDown={() => changeDirection('RIGHT')}
            className="w-full h-8 rounded-lg bg-gradient-to-b from-slate-700/80 to-cyan-950/90 hover:from-slate-600 hover:to-cyan-900 border border-cyan-400/30 active:bg-cyan-500 active:text-black flex items-center justify-center text-cyan-300 cursor-pointer transition-colors shadow"
            title="Right"
          >
            <ArrowRight size={16} />
          </button>

          <div />
          <button
            onPointerDown={() => changeDirection('DOWN')}
            className="w-full h-8 rounded-lg bg-gradient-to-b from-slate-700/80 to-cyan-950/90 hover:from-slate-600 hover:to-cyan-900 border border-cyan-400/30 active:bg-cyan-500 active:text-black flex items-center justify-center text-cyan-300 cursor-pointer transition-colors shadow"
            title="Down"
          >
            <ArrowDown size={16} />
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};