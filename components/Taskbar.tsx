import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { Power, Wifi, Volume2, Battery } from 'lucide-react';

interface TaskbarProps {
  apps: AppConfig[];
  openWindows: string[];
  activeWindowId: string | null;
  onAppClick: (id: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ apps, openWindows, activeWindowId, onAppClick }) => {
  const [time, setTime] = useState(new Date());
  const [isStartOpen, setIsStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Start Menu Popover (Simplified) */}
      {isStartOpen && (
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-[500px] h-[600px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200 z-50">
           <div className="mb-4">
              <input type="text" placeholder="Search for apps, settings, and documents" className="w-full bg-slate-800/50 border border-white/10 rounded-md px-4 py-2 text-sm text-white outline-none focus:border-blue-500" />
           </div>
           <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-400 mb-4">Pinned</h3>
              <div className="grid grid-cols-4 gap-4">
                  {apps.map(app => (
                      <button key={app.id} onClick={() => { onAppClick(app.id); setIsStartOpen(false); }} className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors group">
                          <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                              <app.icon size={20} />
                          </div>
                          <span className="text-xs text-slate-300">{app.title}</span>
                      </button>
                  ))}
              </div>
           </div>
           <div className="pt-4 border-t border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 overflow-hidden">
                       <img src="https://picsum.photos/100/100" alt="User" />
                   </div>
                   <span className="text-sm font-medium text-slate-200">Masuo Yuzuki</span>
               </div>
               <button className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-400 transition-colors" onClick={() => window.location.reload()}>
                   <Power size={18} />
               </button>
           </div>
        </div>
      )}

      {/* Taskbar Bar */}
      <div className="h-12 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 absolute bottom-0 w-full flex items-center justify-between px-4 z-50">
        {/* Left - Widgets placeholder */}
        <div className="w-24 hidden md:flex items-center text-white/50 hover:text-white transition-colors cursor-pointer">
           {/* Weather widget could go here */}
        </div>

        {/* Center - Apps */}
        <div className="flex items-center gap-2">
          <button 
            className={`p-2 rounded-md transition-all duration-200 hover:bg-white/10 ${isStartOpen ? 'bg-white/10' : ''}`}
            onClick={() => setIsStartOpen(!isStartOpen)}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500">
               <path d="M0 0h11v11H0zM13 0h11v11H13zM0 13h11v11H0zM13 13h11v11H13z" />
            </svg>
          </button>

          {apps.map((app) => {
            const isOpen = openWindows.includes(app.id);
            const isActive = activeWindowId === app.id;
            
            return (
              <button
                key={app.id}
                onClick={() => onAppClick(app.id)}
                className={`
                  relative p-2 rounded-md transition-all duration-200 group
                  ${isOpen ? 'bg-white/5' : 'hover:bg-white/5'}
                  ${isActive ? 'bg-white/10' : ''}
                `}
                title={app.title}
              >
                <div className={`w-8 h-8 rounded-md ${app.color} flex items-center justify-center text-white shadow-md group-hover:-translate-y-1 transition-transform`}>
                  <app.icon size={18} />
                </div>
                {isOpen && (
                  <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isActive ? 'w-3 bg-blue-400' : 'bg-slate-400'} transition-all`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right - Status */}
        <div className="flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-2 hidden md:flex">
            <Wifi size={14} />
            <Volume2 size={14} />
            <Battery size={14} />
          </div>
          <div className="flex flex-col items-end leading-tight cursor-default">
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>{time.toLocaleDateString()}</span>
          </div>
          {/* Show Desktop Nudge */}
          <div className="w-1 h-full border-l border-white/10 ml-2"></div>
        </div>
      </div>
    </>
  );
};
