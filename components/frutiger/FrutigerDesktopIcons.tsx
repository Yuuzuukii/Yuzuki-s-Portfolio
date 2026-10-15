import React from 'react';
import { AppConfig } from '../../types';
import { audio } from '../../services/audioService';

interface FrutigerDesktopIconsProps {
  apps: AppConfig[];
  onAppClick: (id: string) => void;
}

export const FrutigerDesktopIcons: React.FC<FrutigerDesktopIconsProps> = ({ apps, onAppClick }) => {
  const handleClick = (id: string) => {
    audio.playClick();
    onAppClick(id);
  };

  return (
    <div className="absolute top-4 left-4 p-2 h-[calc(100%-64px)] flex flex-col flex-wrap content-start gap-5 z-10 select-none">
      {apps.map((app) => {
        const IconComponent = app.icon;
        return (
          <button
            key={app.id}
            onClick={() => handleClick(app.id)}
            className="w-24 flex flex-col items-center gap-1.5 p-2 rounded-xl group transition-all duration-200 hover:bg-white/30 hover:backdrop-blur-md border border-transparent hover:border-white/60 hover:shadow-[0_8px_20px_rgba(2,132,199,0.25)] outline-none focus:bg-white/40 focus:border-sky-400"
          >
            {/* 3D Skeuomorphic Aero Icon Tile */}
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-active:scale-95 shadow-[0_8px_16px_rgba(2,60,110,0.3)] overflow-hidden border border-white/80">
              {/* Dynamic Base Gradient */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%)',
                }}
              />

              {/* Specular curved dome highlight reflection */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 15%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, transparent 65%)',
                }}
              />

              {/* Inner ambient glow */}
              <div 
                className="absolute bottom-0 inset-x-0 h-6 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at bottom, rgba(167,243,208,0.5) 0%, transparent 80%)',
                }}
              />

              {/* App Icon */}
              <div className="relative z-10 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                <IconComponent size={28} />
              </div>

              {/* Top glass border reflection */}
              <div className="absolute top-0 inset-x-0 h-px bg-white/90" />
            </div>

            {/* Label with 2000s Aero daylight glow */}
            <span 
              className="text-xs font-semibold text-slate-900 text-center tracking-tight line-clamp-2 px-1.5 py-0.5 rounded-md group-hover:bg-white/60 transition-colors"
              style={{
                textShadow: '0 1px 2px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,0.9)',
              }}
            >
              {app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};
