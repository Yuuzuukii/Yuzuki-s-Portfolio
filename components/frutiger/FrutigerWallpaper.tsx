import React, { useMemo } from 'react';
import { GrassField, IconFish, IconBubble } from '@frutiger.js/react';

interface FrutigerWallpaperProps {
  onBubblePop?: () => void;
}

export const FrutigerWallpaper: React.FC<FrutigerWallpaperProps> = ({ onBubblePop }) => {
  // Generate random floating bubbles
  const bubbles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: 16 + (i % 5) * 12,
      left: `${(i * 5.6 + 3) % 96}%`,
      duration: `${14 + (i % 7) * 3}s`,
      delay: `${(i * 1.3) % 12}s`,
      drift: `${((i % 3) - 1) * 20}px`
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 2000s Daylight Sky & Atmosphere Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 26%, #7dd3fc 52%, #bae6fd 78%, #e0f2fe 100%)',
        }}
      />

      {/* Sun Lens Flare & Daylight Halo */}
      <div 
        className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(254,240,138,0.4) 30%, rgba(56,189,248,0.15) 60%, transparent 80%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Aurora / Aero Wave Glow Ribbon */}
      <div 
        className="absolute top-1/4 -left-20 w-[120%] h-48 opacity-45 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(167,243,208,0.6) 0%, rgba(56,189,248,0.4) 50%, transparent 75%)',
          transform: 'rotate(-6deg) skewX(-15deg)',
          filter: 'blur(35px)',
        }}
      />

      {/* Secondary Soft Cloud Waves */}
      <svg className="absolute bottom-28 w-full h-40 opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path 
          fill="url(#sky-gradient-wave)" 
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
        <defs>
          <linearGradient id="sky-gradient-wave" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tropical Fish 1 (Clownfish / Blue Tang Style) Swimming Across */}
      <div className="absolute top-[38%] left-0 animate-swim pointer-events-auto cursor-pointer filter drop-shadow-md hover:scale-125 transition-transform" onClick={onBubblePop}>
        <div className="relative flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 shadow-lg">
          <IconFish size={38} className="text-amber-500 filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.6)]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white/80 animate-ping" />
        </div>
      </div>

      {/* Tropical Fish 2 (Discus / Aqua Fish) Swimming Reverse */}
      <div className="absolute top-[52%] left-0 animate-swim-delayed pointer-events-auto cursor-pointer filter drop-shadow-md hover:scale-125 transition-transform" onClick={onBubblePop}>
        <div className="relative flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 shadow-lg">
          <IconFish size={32} className="text-cyan-400 filter drop-shadow-[0_2px_4px_rgba(34,211,238,0.7)]" />
        </div>
      </div>

      {/* Interactive Floating Bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute pointer-events-auto cursor-pointer transition-transform hover:scale-150"
          style={{
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animation: `float-bubble ${b.duration} linear infinite`,
            animationDelay: b.delay,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onBubblePop?.();
          }}
          title="Pop!"
        >
          <div 
            className="w-full h-full rounded-full relative"
            style={{
              background: 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 25%, rgba(56,189,248,0.2) 60%, rgba(2,132,199,0.5) 100%)',
              border: '1px solid rgba(255,255,255,0.85)',
              boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.9), 0 2px 8px rgba(2,132,199,0.3)',
            }}
          >
            {/* Glossy specular dot */}
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
          </div>
        </div>
      ))}

      {/* Rolling Lush Green Hills (Frutiger Bliss) at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none">
        {/* Rear Hill */}
        <div 
          className="absolute -bottom-8 -left-10 w-[60%] h-36 rounded-[100%_100%_0_0]"
          style={{
            background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 35%, #15803d 100%)',
            boxShadow: '0 -2px 10px rgba(22,163,74,0.3)',
          }}
        />
        {/* Right Hill */}
        <div 
          className="absolute -bottom-10 right-0 w-[55%] h-40 rounded-[100%_100%_0_0]"
          style={{
            background: 'linear-gradient(180deg, #86efac 0%, #34d399 40%, #059669 100%)',
            boxShadow: '0 -2px 12px rgba(16,185,129,0.3)',
          }}
        />
        {/* Foreground Center Hill */}
        <div 
          className="absolute -bottom-12 left-[20%] w-[65%] h-36 rounded-[100%_100%_0_0]"
          style={{
            background: 'linear-gradient(180deg, #a7f3d0 0%, #4ade80 25%, #16a34a 100%)',
            boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.6)',
          }}
        />

        {/* GrassField component from @frutiger.js/react for authentic blades */}
        <div className="absolute bottom-10 left-0 right-0 h-16 opacity-60">
          <GrassField height={60} bladeCount={50} />
        </div>

        {/* Water Surface reflection layer */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-14"
          style={{
            background: 'linear-gradient(180deg, rgba(56,189,248,0.2) 0%, rgba(2,132,199,0.5) 100%)',
            backdropFilter: 'blur(4px)',
            borderTop: '1px solid rgba(255,255,255,0.5)',
          }}
        />
      </div>
    </div>
  );
};
