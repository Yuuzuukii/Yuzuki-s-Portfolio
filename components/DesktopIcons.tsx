import React from 'react';
import { AppConfig } from '../types';

interface DesktopIconsProps {
  apps: AppConfig[];
  onAppClick: (id: string) => void;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({ apps, onAppClick }) => {
  return (
    <div className="absolute top-0 left-0 p-4 h-[calc(100%-48px)] w-full flex flex-col flex-wrap content-start gap-4 z-0">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onAppClick(app.id)}
          className="w-20 h-24 flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors focus:bg-white/20 focus:border-white/20 outline-none group"
        >
          <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
            <app.icon size={24} />
          </div>
          <span className="text-xs text-white font-medium text-center drop-shadow-md line-clamp-2">
            {app.title}
          </span>
        </button>
      ))}
    </div>
  );
};
