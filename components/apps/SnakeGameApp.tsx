import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Pause, Sparkles, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { audio } from '../../services/audioService';
import { useIsMobile } from '../../hooks/useIsMobile';

const GRID_SIZE = 22; // 22 x 22 grid
const INITIAL_SPEED = 110; // ms per tick

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
  const isMobile = useIsMobile();
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
      } while (bonusCollision);
      bonusFoodRef.current = { ...bonusPos, life: 120 }; // lasts ~120 frames
    }
  }, []);

  // Add burst particles
  const addParticles = (gx: number, gy: number, count: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cellSize = canvas.width / GRID_SIZE;
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
    const cur = dirRef.current;
    if (newDir === 'UP' && cur !== 'DOWN') nextDirRef.current = 'UP';
    if (newDir === 'DOWN' && cur !== 'UP') nextDirRef.current = 'DOWN';
    if (newDir === 'LEFT' && cur !== 'RIGHT') nextDirRef.current = 'LEFT';
    if (newDir === 'RIGHT' && cur !== 'LEFT') nextDirRef.current = 'RIGHT';
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

      const cellSize = canvas.width / GRID_SIZE;

      // 1. GAME TICK LOGIC (deterministic speed based on level)
      if (isPlaying && !isPaused && !isGameOver) {
        const tickInterval = Math.max(55, INITIAL_SPEED - (level - 1) * 8);

        if (time - lastTickTimeRef.current >= tickInterval) {
          lastTickTimeRef.current = time;

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
            audio.playDrain();
            setIsGameOver(true);
            setAnnouncement('CRITICAL COLLISION: WALL IMPACT');
            return;
          }

          // Check Self Collision
          if (snakeRef.current.some(seg => seg.x === head.x && seg.y === head.y)) {
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
              curCombo = Math.min(5, combo + 1);
              setCombo(curCombo);
              if (curCombo > 2) audio.playJackpot();
            } else {
              setCombo(1);
            }

            const pts = 100 * curCombo;
            setScore(s => {
              const newScore = s + pts;
              setHighScore(h => {
                if (newScore > h) {
                  localStorage.setItem('yuzuos_snake_highscore', newScore.toString());
                  return newScore;
                }
                return h;
              });
              // Level up every 500 pts
              const nextLevel = Math.floor(newScore / 500) + 1;
              if (nextLevel > level) {
                setLevel(nextLevel);
                audio.playBumper();
                setAnnouncement(`LEVEL UP! ACCELERATION: LVL ${nextLevel}`);
              }
              return newScore;
            });

            spawnFood();
          } else if (bonusFoodRef.current && head.x === bonusFoodRef.current.x && head.y === bonusFoodRef.current.y) {
            // Check Bonus Gold Food
            audio.playJackpot();
            addParticles(head.x, head.y, 20, '#fbbf24');
            setScore(s => {
              const newScore = s + 500;
              setHighScore(h => Math.max(h, newScore));
              return newScore;
            });
            bonusFoodRef.current = null;
            setAnnouncement('SUPER BONUS! +500 PTS');
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep Cyber Obsidian Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#060a12');
      bgGrad.addColorStop(0.5, '#0a101f');
      bgGrad.addColorStop(1, '#05070f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid Lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvas.width, pos);
        ctx.stroke();
      }

      // Outer Cyber Arena Border
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
      ctx.shadowBlur = 0;

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

      // Render Snake Body & Head
      const snake = snakeRef.current;
      snake.forEach((seg, idx) => {
        const sx = seg.x * cellSize + 1.5;
        const sy = seg.y * cellSize + 1.5;
        const sSize = cellSize - 3;
        const isHead = idx === 0;

        ctx.save();
        if (isHead) {
          // Neon Cyan Glowing Head
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 16;
          const headGrad = ctx.createLinearGradient(sx, sy, sx + sSize, sy + sSize);
          headGrad.addColorStop(0, '#67e8f9');
          headGrad.addColorStop(0.5, '#06b6d4');
          headGrad.addColorStop(1, '#0891b2');
          ctx.fillStyle = headGrad;
          ctx.beginPath();
          ctx.roundRect(sx, sy, sSize, sSize, 6);
          ctx.fill();

          // Snake Eyes
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          let eye1 = { x: sx + 4, y: sy + 4 };
          let eye2 = { x: sx + sSize - 4, y: sy + 4 };
          if (dirRef.current === 'DOWN') {
            eye1 = { x: sx + 4, y: sy + sSize - 4 };
            eye2 = { x: sx + sSize - 4, y: sy + sSize - 4 };
          } else if (dirRef.current === 'LEFT') {
            eye1 = { x: sx + 4, y: sy + 4 };
            eye2 = { x: sx + 4, y: sy + sSize - 4 };
          } else if (dirRef.current === 'RIGHT') {
            eye1 = { x: sx + sSize - 4, y: sy + 4 };
            eye2 = { x: sx + sSize - 4, y: sy + sSize - 4 };
          }
          ctx.beginPath();
          ctx.arc(eye1.x, eye1.y, 2, 0, Math.PI * 2);
          ctx.arc(eye2.x, eye2.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Gradient Body Segments (Cyan to Emerald)
          const fraction = idx / snake.length;
          const r = Math.round(6 + fraction * 10);
          const g = Math.round(182 - fraction * 40);
          const bVal = Math.round(212 - fraction * 80);

          ctx.fillStyle = `rgb(${r}, ${g}, ${bVal})`;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.roundRect(sx + 1, sy + 1, sSize - 2, sSize - 2, 4);
          ctx.fill();
        }
        ctx.restore();
      });

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
  }, [isPlaying, isPaused, isGameOver, level, combo, spawnFood]);

  return (
    <div className="h-full w-full bg-[#070b14] flex flex-col items-center justify-between p-2 select-none font-mono text-cyan-300">
      {/* Top Cyber HUD Status */}
      <div className="w-full max-w-[420px] bg-slate-900/80 border border-cyan-500/30 rounded-xl p-2.5 backdrop-blur-md shadow-[0_4px_20px_rgba(6,182,212,0.15)] flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-cyan-400/70 uppercase tracking-widest">Score</span>
          <span className="text-xl font-black text-white tracking-wider">{score.toLocaleString()}</span>
        </div>

        {/* Combo Multiplier indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs">
          <Zap size={14} className={combo > 1 ? 'text-amber-400 animate-bounce' : 'text-cyan-400'} />
          <span className="font-bold text-white">{combo}x COMBO</span>
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
          width={400}
          height={400}
          className="rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] aspect-square max-h-[calc(100vh-270px)] sm:max-h-[380px] w-auto h-auto object-contain border border-cyan-500/40"
        />

        {/* Overlay: Start / Ready Screen */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-4 z-20">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_#06b6d4] mb-3 animate-pulse">
              <Zap size={28} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1 drop-shadow-[0_0_10px_#06b6d4]">
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
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-4 z-30 animate-in zoom-in-95">
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center z-20">
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
            className="w-full h-8 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 active:bg-cyan-500 active:text-black flex items-center justify-center text-cyan-300 cursor-pointer transition-colors shadow"
            title="Up"
          >
            <ArrowUp size={16} />
          </button>
          <div />

          <button
            onPointerDown={() => changeDirection('LEFT')}
            className="w-full h-8 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 active:bg-cyan-500 active:text-black flex items-center justify-center text-cyan-300 cursor-pointer transition-colors shadow"
            title="Left"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
          </div>
          <button
            onPointerDown={() => changeDirection('RIGHT')}
            className="w-full h-8 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 active:bg-cyan-500 active:text-black flex items-center justify-center text-cyan-300 cursor-pointer transition-colors shadow"
            title="Right"
          >
            <ArrowRight size={16} />
          </button>

          <div />
          <button
            onPointerDown={() => changeDirection('DOWN')}
            className="w-full h-8 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 active:bg-cyan-500 active:text-black flex items-center justify-center text-cyan-300 cursor-pointer transition-colors shadow"
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