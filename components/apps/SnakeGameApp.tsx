import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

// Game Configuration
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const SnakeGameApp: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Game State
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  
  // Refs for mutable state in interval
  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('yuzuos_snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Initialize Game
  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const generateFood = (currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  };

  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = directionRef.current;
    const isOpposite = 
      (newDir === 'UP' && currentDir === 'DOWN') ||
      (newDir === 'DOWN' && currentDir === 'UP') ||
      (newDir === 'LEFT' && currentDir === 'RIGHT') ||
      (newDir === 'RIGHT' && currentDir === 'LEFT');
    
    if (!isOpposite) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  }, []);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Map arrow keys to direction
      let newDir: Direction | null = null;
      if (e.key === 'ArrowUp') newDir = 'UP';
      if (e.key === 'ArrowDown') newDir = 'DOWN';
      if (e.key === 'ArrowLeft') newDir = 'LEFT';
      if (e.key === 'ArrowRight') newDir = 'RIGHT';

      if (newDir) {
          setActiveKey(newDir);
          if (isPlaying) {
             changeDirection(newDir);
             e.preventDefault();
          }
      }
    };

    const handleKeyUp = () => {
        setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, changeDirection]);

  // Game Loop
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = setInterval(() => {
        setSnake(prevSnake => {
          const head = prevSnake[0];
          const newHead = { ...head };

          switch (directionRef.current) {
            case 'UP': newHead.y -= 1; break;
            case 'DOWN': newHead.y += 1; break;
            case 'LEFT': newHead.x -= 1; break;
            case 'RIGHT': newHead.x += 1; break;
          }

          // Check Wall Collision
          if (
            newHead.x < 0 || 
            newHead.x >= GRID_SIZE || 
            newHead.y < 0 || 
            newHead.y >= GRID_SIZE
          ) {
            handleGameOver();
            return prevSnake;
          }

          // Check Self Collision
          if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            handleGameOver();
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          // Check Food
          if (newHead.x === food.x && newHead.y === food.y) {
            setScore(s => s + 10);
            setFood(generateFood(newSnake));
            // Don't pop tail (grow)
          } else {
            newSnake.pop(); // Move forward
          }

          return newSnake;
        });
      }, INITIAL_SPEED);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver, food]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('yuzuos_snake_highscore', score.toString());
    }
  };

  // Helper component for Key Display
  const KeyCap = ({ label, icon: Icon, isActive, className = "" }: { label?: string, icon?: any, isActive: boolean, className?: string }) => (
      <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-100 shadow-lg ${
          isActive 
            ? 'bg-green-500 border-green-400 text-black translate-y-1 shadow-none' 
            : 'bg-slate-800 border-slate-600 text-slate-400 shadow-black/50'
      } ${className}`}>
          {Icon ? <Icon size={24} /> : <span className="font-bold font-mono">{label}</span>}
      </div>
  );

  return (
    <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center text-white relative overflow-hidden select-none">
      
      {/* Header Info */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center bg-slate-800/80 backdrop-blur-md border-b border-white/5 z-10">
        <div className="flex items-center gap-4">
           <div className="bg-black/50 px-4 py-1.5 rounded-lg border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex items-baseline gap-2">
              <span className="text-xs text-green-400 font-mono font-bold tracking-wider">SCORE</span>
              <span className="text-2xl font-bold font-mono text-white leading-none">{score.toString().padStart(3, '0')}</span>
           </div>
           <div className="flex items-center gap-2 text-yellow-500 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
              <Trophy size={14} />
              <span className="font-mono font-bold text-sm">{highScore}</span>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 hidden md:inline-block">SNAKE.EXE</span>
            <button 
                onClick={() => { setIsPlaying(false); setIsGameOver(false); startGame(); }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                title="Reset Game"
            >
                <RotateCcw size={18} className="text-slate-400 group-hover:text-white transition-colors" />
            </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mt-12">
        {/* Game Board */}
        <div 
            className="relative bg-black border-4 border-slate-700 rounded-xl shadow-2xl overflow-hidden ring-4 ring-black/20"
            style={{
                width: 'min(80vw, 400px)',
                height: 'min(80vw, 400px)',
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
        >
            {/* Grid Background Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
                    backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%` 
                }} 
            />

            {/* Food */}
            <div 
                className="absolute rounded-sm bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"
                style={{
                    width: `${100/GRID_SIZE}%`,
                    height: `${100/GRID_SIZE}%`,
                    left: `${(food.x / GRID_SIZE) * 100}%`,
                    top: `${(food.y / GRID_SIZE) * 100}%`,
                    transform: 'scale(0.8)'
                }}
            />

            {/* Snake */}
            {snake.map((segment, i) => (
                <div 
                    key={`${segment.x}-${segment.y}-${i}`}
                    className="absolute border border-black/20"
                    style={{
                        width: `${100/GRID_SIZE}%`,
                        height: `${100/GRID_SIZE}%`,
                        left: `${(segment.x / GRID_SIZE) * 100}%`,
                        top: `${(segment.y / GRID_SIZE) * 100}%`,
                        opacity: isGameOver ? 0.5 : 1,
                        backgroundColor: i === 0 ? '#4ade80' : '#22c55e', // Head is lighter
                        boxShadow: i === 0 ? '0 0 15px rgba(74, 222, 128, 0.6)' : 'none',
                        zIndex: i === 0 ? 2 : 1,
                        borderRadius: i === 0 ? '4px' : '2px'
                    }}
                />
            ))}

            {/* Start / Game Over Overlay */}
            {(!isPlaying || isGameOver) && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
                    {isGameOver ? (
                        <>
                            <h2 className="text-5xl font-black text-red-500 mb-2 tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">GAME OVER</h2>
                            <p className="text-slate-300 mb-8 font-mono text-lg">SCORE: {score}</p>
                        </>
                    ) : (
                        <div className="mb-8 text-center">
                            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-600 mb-2 tracking-tighter drop-shadow-sm filter">SNAKE</h2>
                            <div className="inline-block px-2 py-0.5 bg-green-900/30 border border-green-500/30 rounded text-[10px] text-green-400 font-mono tracking-widest">SYSTEM READY</div>
                        </div>
                    )}
                    
                    <button 
                        onClick={startGame}
                        className="group relative px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                    >
                        <Play size={20} className="fill-current" />
                        {isGameOver ? 'TRY AGAIN' : 'START GAME'}
                    </button>
                </div>
            )}
        </div>

        {/* Desktop Controls Guide */}
        {!isMobile && (
            <div className="flex flex-col items-center gap-6 bg-slate-800/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Keyboard size={20} />
                    <span className="text-xs font-bold tracking-widest uppercase">Controls</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <KeyCap isActive={activeKey === 'UP'} icon={ChevronUp} />
                    <div className="flex gap-2">
                        <KeyCap isActive={activeKey === 'LEFT'} icon={ChevronLeft} />
                        <KeyCap isActive={activeKey === 'DOWN'} icon={ChevronDown} />
                        <KeyCap isActive={activeKey === 'RIGHT'} icon={ChevronRight} />
                    </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono text-center max-w-[140px] leading-relaxed">
                    Use arrow keys to navigate the snake. Collect red pixels to grow.
                </div>
            </div>
        )}
      </div>

      {/* Mobile Controls */}
      {isMobile && (
          <div className="mt-8 grid grid-cols-3 gap-3 w-56 h-36">
              <div />
              <button 
                className="bg-slate-800 active:bg-green-600 active:text-white text-slate-400 rounded-xl flex items-center justify-center border border-white/5 shadow-lg transition-all duration-75"
                onPointerDown={(e) => { e.preventDefault(); changeDirection('UP'); setActiveKey('UP'); }}
                onPointerUp={() => setActiveKey(null)}
                onPointerLeave={() => setActiveKey(null)}
              >
                  <ChevronUp size={32} />
              </button>
              <div />
              
              <button 
                className="bg-slate-800 active:bg-green-600 active:text-white text-slate-400 rounded-xl flex items-center justify-center border border-white/5 shadow-lg transition-all duration-75"
                onPointerDown={(e) => { e.preventDefault(); changeDirection('LEFT'); setActiveKey('LEFT'); }}
                onPointerUp={() => setActiveKey(null)}
                onPointerLeave={() => setActiveKey(null)}
              >
                  <ChevronLeft size={32} />
              </button>
              <button 
                className="bg-slate-800 active:bg-green-600 active:text-white text-slate-400 rounded-xl flex items-center justify-center border border-white/5 shadow-lg transition-all duration-75"
                onPointerDown={(e) => { e.preventDefault(); changeDirection('DOWN'); setActiveKey('DOWN'); }}
                onPointerUp={() => setActiveKey(null)}
                onPointerLeave={() => setActiveKey(null)}
              >
                  <ChevronDown size={32} />
              </button>
              <button 
                className="bg-slate-800 active:bg-green-600 active:text-white text-slate-400 rounded-xl flex items-center justify-center border border-white/5 shadow-lg transition-all duration-75"
                onPointerDown={(e) => { e.preventDefault(); changeDirection('RIGHT'); setActiveKey('RIGHT'); }}
                onPointerUp={() => setActiveKey(null)}
                onPointerLeave={() => setActiveKey(null)}
              >
                  <ChevronRight size={32} />
              </button>
          </div>
      )}
    </div>
  );
};