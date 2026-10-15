import React, { useMemo } from 'react';
import { IconFish } from '@frutiger.js/react';

interface FrutigerWallpaperV2Props {
  onBubblePop?: () => void;
}

export const FrutigerWallpaperV2: React.FC<FrutigerWallpaperV2Props> = ({ onBubblePop }) => {
  // Floating iridescent bubble particles
  const ambientBubbles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      size: 20 + (i % 4) * 14,
      left: `${(i * 7.2 + 5) % 94}%`,
      duration: `${15 + (i % 6) * 4}s`,
      delay: `${(i * 1.5) % 10}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Deep Daylight Azure Sky Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 30%, #7dd3fc 55%, #bae6fd 75%, #06b6d4 100%)',
        }}
      />

      {/* 2. Fluffy White Clouds in the Sky */}
      <div 
        className="absolute top-6 left-12 w-80 h-24 rounded-full opacity-65"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 60%, transparent 85%)',
          filter: 'blur(10px)',
        }}
      />
      <div 
        className="absolute top-16 right-24 w-96 h-28 rounded-full opacity-60"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 60%, transparent 85%)',
          filter: 'blur(12px)',
        }}
      />

      {/* 3. Flocks of Soaring Birds (Image 2 top center) */}
      <svg className="absolute top-10 left-[42%] w-64 h-24 opacity-75" viewBox="0 0 200 80">
        <g stroke="#334155" strokeWidth="1.5" fill="none" strokeLinecap="round">
          {/* Bird 1 */}
          <path d="M20 25 Q25 18 30 25 Q35 18 40 25" />
          {/* Bird 2 */}
          <path d="M45 20 Q50 14 55 20 Q60 14 65 20" />
          {/* Bird 3 */}
          <path d="M68 28 Q73 22 78 28 Q83 22 88 28" />
          {/* Bird 4 */}
          <path d="M92 18 Q97 12 102 18 Q107 12 112 18" />
          {/* Bird 5 */}
          <path d="M120 26 Q124 20 128 26 Q132 20 136 26" />
          {/* Smaller distant birds */}
          <path d="M145 32 Q148 28 151 32 Q154 28 157 32" strokeWidth="1" />
          <path d="M165 24 Q168 20 171 24 Q174 20 177 24" strokeWidth="1" />
        </g>
      </svg>

      {/* 4. Modern Glass Eco-City Skyscrapers & Towers on the Horizon (Image 2 background) */}
      <div className="absolute top-1/4 left-1/3 flex items-end gap-3 opacity-80 pointer-events-none">
        {/* Tower 1 */}
        <div 
          className="w-14 h-64 rounded-t-sm shadow-md"
          style={{
            background: 'linear-gradient(180deg, #f0f9ff 0%, #bae6fd 30%, #38bdf8 70%, #0284c7 100%)',
            border: '1px solid rgba(255,255,255,0.9)',
          }}
        >
          {/* Windows Grid pattern */}
          <div className="w-full h-full opacity-35" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '6px 8px' }} />
        </div>

        {/* Tall Tower 2 */}
        <div 
          className="w-16 h-80 rounded-t-sm shadow-lg"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #e0f2fe 30%, #7dd3fc 65%, #0369a1 100%)',
            border: '1px solid rgba(255,255,255,0.9)',
          }}
        >
          <div className="w-full h-full opacity-40" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '7px 10px' }} />
        </div>

        {/* Eco Glass Tower 3 */}
        <div 
          className="w-12 h-60 rounded-t-sm shadow-md"
          style={{
            background: 'linear-gradient(180deg, #ecfdf5 0%, #a7f3d0 35%, #34d399 75%, #059669 100%)',
            border: '1px solid rgba(255,255,255,0.9)',
          }}
        >
          <div className="w-full h-full opacity-30" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '6px 8px' }} />
        </div>
      </div>

      {/* 5. Iconic Windows 4-Color Flag Glowing (Image 2 center background) */}
      <div className="absolute top-[40%] right-[32%] w-48 h-48 opacity-45 pointer-events-none transform -rotate-12">
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
          {/* Red Tile */}
          <path d="M10 20 Q30 15 50 25 Q30 35 10 30 Z" fill="#ef4444" opacity="0.85" />
          {/* Green Tile */}
          <path d="M54 26 Q74 21 94 31 Q74 41 54 36 Z" fill="#22c55e" opacity="0.85" />
          {/* Blue Tile */}
          <path d="M10 34 Q30 39 50 29 Q30 49 10 44 Z" fill="#3b82f6" opacity="0.85" />
          {/* Yellow Tile */}
          <path d="M54 40 Q74 45 94 35 Q74 55 54 50 Z" fill="#eab308" opacity="0.85" />
        </svg>
      </div>

      {/* 6. Giant Translucent Bubble World with Eco-Meadow & Blue Butterfly (Image 2 featured element) */}
      <div 
        className="absolute top-[28%] left-[16%] w-72 h-72 rounded-full overflow-hidden pointer-events-auto cursor-pointer shadow-[0_20px_50px_rgba(2,132,199,0.4)] transition-transform hover:scale-105 duration-300"
        style={{
          border: '2px solid rgba(255,255,255,0.85)',
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 30%, rgba(56,189,248,0.3) 60%, rgba(2,132,199,0.7) 100%)',
        }}
        onClick={onBubblePop}
        title="Eco-Bubble World (Click to Pop!)"
      >
        {/* Inside the Bubble: Meadow, Sunshine & Miniature Skyline */}
        <div className="absolute inset-0 flex flex-col justify-end">
          {/* Sun flare in bubble */}
          <div className="absolute top-4 right-10 w-16 h-16 rounded-full bg-white opacity-85 blur-[6px]" />

          {/* Miniature Skyline inside bubble */}
          <div className="flex items-end justify-center gap-1.5 h-20 opacity-75 mb-6">
            <div className="w-4 h-14 bg-sky-200/90 rounded-t-xs" />
            <div className="w-5 h-18 bg-white/95 rounded-t-xs" />
            <div className="w-6 h-12 bg-sky-100/90 rounded-t-xs" />
            <div className="w-4 h-16 bg-white/90 rounded-t-xs" />
          </div>

          {/* Lush Green Meadow inside bubble */}
          <div 
            className="w-full h-20 rounded-t-[50%]"
            style={{
              background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 40%, #15803d 100%)',
            }}
          />

          {/* Blue Butterfly hovering in bubble */}
          <div className="absolute top-28 left-32 animate-bounce" style={{ animationDuration: '3s' }}>
            <svg viewBox="0 0 24 24" className="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              {/* Left wing */}
              <ellipse cx="8" cy="10" rx="6" ry="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" transform="rotate(-25 8 10)" />
              {/* Right wing */}
              <ellipse cx="16" cy="10" rx="6" ry="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" transform="rotate(25 16 10)" />
              {/* Body */}
              <line x1="12" y1="6" x2="12" y2="16" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Bubble Specular Curved Dome Highlight */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 25%, transparent 60%)',
          }}
        />
        {/* Secondary Lower Reflection */}
        <div className="absolute bottom-4 inset-x-8 h-8 rounded-full bg-white/30 blur-[2px] pointer-events-none" />
      </div>

      {/* 7. Secondary Glass Bubble with Eco Leaf (Image 2 left) */}
      <div 
        className="absolute top-[16%] left-[6%] w-24 h-24 rounded-full overflow-hidden pointer-events-auto cursor-pointer shadow-lg hover:scale-110 transition-transform"
        style={{
          border: '1.5px solid rgba(255,255,255,0.9)',
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, rgba(134,239,172,0.4) 40%, rgba(34,197,94,0.6) 100%)',
        }}
        onClick={onBubblePop}
      >
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-emerald-600 filter drop-shadow-md">
            <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>
      </div>

      {/* 8. Swimming Tropical Fish in Clear Water (Image 2 bottom ocean) */}
      <div className="absolute top-[58%] left-0 animate-swim pointer-events-auto cursor-pointer filter drop-shadow-lg hover:scale-125 transition-transform" onClick={onBubblePop}>
        <div className="flex items-center gap-1 p-2 rounded-full bg-white/30 backdrop-blur-xs border border-white/60 shadow-md">
          <IconFish size={44} className="text-amber-500 filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.7)]" />
        </div>
      </div>

      <div className="absolute top-[68%] left-0 animate-swim-delayed pointer-events-auto cursor-pointer filter drop-shadow-lg hover:scale-125 transition-transform" onClick={onBubblePop}>
        <div className="flex items-center gap-1 p-2 rounded-full bg-white/30 backdrop-blur-xs border border-white/60 shadow-md">
          <IconFish size={38} className="text-cyan-300 filter drop-shadow-[0_2px_4px_rgba(34,211,238,0.8)]" />
        </div>
      </div>

      {/* 9. Floating Fresh Lemon & Lime Citrus Slices (Image 2 right edge) */}
      {/* Lemon Slice */}
      <div className="absolute top-1/4 -right-10 w-44 h-44 rounded-full pointer-events-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] transform rotate-12">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Rind */}
          <circle cx="50" cy="50" r="48" fill="#facc15" stroke="#eab308" strokeWidth="2" />
          {/* Pith */}
          <circle cx="50" cy="50" r="44" fill="#fef9c3" />
          {/* Segments Ring */}
          <circle cx="50" cy="50" r="40" fill="#fef08a" />
          {/* Radial Citrus Segments */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <path
              key={angle}
              d="M50 50 L46 16 A36 36 0 0 1 54 16 Z"
              fill="#eab308"
              transform={`rotate(${angle} 50 50)`}
              opacity="0.8"
            />
          ))}
          {/* Core */}
          <circle cx="50" cy="50" r="5" fill="#fef9c3" />
        </svg>
      </div>

      {/* Lime Slice */}
      <div className="absolute top-[52%] -right-8 w-36 h-36 rounded-full pointer-events-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] transform -rotate-12">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Rind */}
          <circle cx="50" cy="50" r="48" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
          {/* Pith */}
          <circle cx="50" cy="50" r="44" fill="#dcfce7" />
          {/* Segments Ring */}
          <circle cx="50" cy="50" r="40" fill="#86efac" />
          {/* Radial Lime Segments */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <path
              key={angle}
              d="M50 50 L46 16 A36 36 0 0 1 54 16 Z"
              fill="#16a34a"
              transform={`rotate(${angle} 50 50)`}
              opacity="0.85"
            />
          ))}
          {/* Core */}
          <circle cx="50" cy="50" r="5" fill="#dcfce7" />
        </svg>
      </div>

      {/* 10. Blooming Golden Sunflowers at Bottom Right (Image 2 lower right) */}
      <div className="absolute -bottom-8 right-16 w-52 h-52 pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Petals radiating */}
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(deg => (
            <ellipse
              key={deg}
              cx="60"
              cy="25"
              rx="6"
              ry="22"
              fill="#f59e0b"
              stroke="#d97706"
              strokeWidth="0.8"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          {/* Inner Petal Ring */}
          {[11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75, 191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75].map(deg => (
            <ellipse
              key={`inner-${deg}`}
              cx="60"
              cy="32"
              rx="4.5"
              ry="16"
              fill="#fbbf24"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          {/* Sunflower Seed Center */}
          <circle cx="60" cy="60" r="22" fill="#78350f" stroke="#451a03" strokeWidth="1" />
          <circle cx="60" cy="60" r="18" fill="#451a03" opacity="0.6" />
        </svg>
      </div>

      {/* 11. Crystal Ocean Water Layer with Shimmering Waves */}
      <div 
        className="absolute bottom-0 inset-x-0 h-44 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(56,189,248,0.2) 0%, rgba(2,132,199,0.5) 45%, rgba(3,105,161,0.85) 100%)',
          backdropFilter: 'blur(2px)',
          borderTop: '1px solid rgba(255,255,255,0.6)',
        }}
      />

      {/* 12. Floating Bubbles */}
      {ambientBubbles.map(b => (
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
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
          </div>
        </div>
      ))}
    </div>
  );
};
