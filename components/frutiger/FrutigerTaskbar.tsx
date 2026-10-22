import React, { useState, useEffect } from 'react';
import { AppConfig } from '../../types';
import { IconAeroOrb } from '@frutiger.js/react';
import { Volume2, VolumeX, Sparkles, Power, Wifi, Shield } from 'lucide-react';
import { audio } from '../../services/audioService';

interface FrutigerTaskbarProps {
  apps: AppConfig[];
  openWindows: string[];
  activeWindowId: string | null;
  onAppClick: (id: string) => void;
  onSwitchToModern: () => void;
  onShowDesktop: () => void;
}

export const FrutigerTaskbar: React.FC<FrutigerTaskbarProps> = ({
  apps,
  openWindows,
  activeWindowId,
  onAppClick,
  onSwitchToModern,
  onShowDesktop,
}) => {
  const [time, setTime] = useState(new Date());
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(audio.isMuted());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartToggle = () => {
    audio.playClick();
    setIsStartOpen(prev => !prev);
  };

  const handleAppButtonClick = (id: string) => {
    audio.playClick();
    onAppClick(id);
  };

  const handleSoundToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  return (
    <>
      {/* 2000s Aero Start Menu */}
      {isStartOpen && (
        <div 
          className="absolute bottom-14 left-3 w-[460px] h-[540px] rounded-2xl aero-glass-window shadow-2xl p-5 flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-200 border border-white/90"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(224,242,254,0.75) 40%, rgba(186,230,253,0.8) 100%)',
            backdropFilter: 'blur(25px)',
          }}
        >
          {/* Header user info */}
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-sky-300/60">
            <div className="w-12 h-12 rounded-xl p-0.5 bg-gradient-to-br from-white via-sky-200 to-sky-400 border border-white shadow-md overflow-hidden">
              <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="Yuzuki Masuo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-800">増尾 柚希 (Yuzuki Masuo)</h2>
              <span className="text-xs text-sky-700">YuzuOS 2000s Aero Edition</span>
            </div>
          </div>

          {/* Start Menu App List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 pl-1">Programs</span>
            {apps.map(app => {
              const IconComp = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    handleAppButtonClick(app.id);
                    setIsStartOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/60 transition-all text-left border border-transparent hover:border-white/80 group shadow-xs"
                >
                  <div className={`w-8 h-8 rounded-lg ${app.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <IconComp size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">{app.title}</span>
                    <span className="text-[10px] text-slate-500">Launch application</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Time Machine Quick Switch from Start Menu */}
          <div className="pt-3 mt-2 border-t border-sky-300/60 flex items-center justify-between">
            <button
              onClick={() => {
                audio.playTimeWarp();
                setIsStartOpen(false);
                onSwitchToModern();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl aero-button text-xs font-bold text-sky-950 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>未来へ進む (Modern OS)</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 transition-colors shadow-xs"
              title="Restart YuzuOS"
            >
              <Power size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 2000s Translucent Aero Taskbar */}
      <div className="h-12 aero-taskbar absolute bottom-0 inset-x-0 flex items-center justify-between px-2 z-50 select-none">
        {/* Left Section: Iconic Glowing Start Orb */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartToggle}
            className="relative -top-1 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 group focus:outline-hidden"
            title="Start"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.7) 40%, rgba(2,132,199,0.95) 80%, rgba(3,105,161,1) 100%)',
              border: '2px solid rgba(255,255,255,0.95)',
              boxShadow: isStartOpen
                ? '0 0 20px rgba(56,189,248,0.95), inset 0 2px 4px #ffffff'
                : '0 2px 10px rgba(2,132,199,0.5), inset 0 2px 4px rgba(255,255,255,0.85)',
            }}
          >
            {/* Inner jewel shine */}
            <div className="absolute top-1 left-2 w-4 h-2 bg-white/70 rounded-full blur-[0.5px] pointer-events-none" />
            <IconAeroOrb size={22} className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] text-white group-hover:rotate-12 transition-transform duration-300" />
          </button>

          {/* Taskbar Application Pills */}
          <div className="flex items-center gap-1.5 ml-1 overflow-x-auto max-w-[calc(100vw-360px)]">
            {apps.map(app => {
              const isOpen = openWindows.includes(app.id);
              const isActive = activeWindowId === app.id;
              const IconComp = app.icon;

              return (
                <button
                  key={app.id}
                  onClick={() => handleAppButtonClick(app.id)}
                  className={`
                    h-8 px-3 rounded-lg flex items-center gap-2 transition-all duration-150 cursor-pointer relative overflow-hidden group
                    ${isActive
                      ? 'bg-gradient-to-b from-white/90 via-sky-100/80 to-sky-200/90 border border-sky-400 shadow-[0_2px_8px_rgba(2,132,199,0.35)] text-sky-950 font-bold'
                      : isOpen
                      ? 'bg-white/45 hover:bg-white/70 border border-white/60 text-slate-800 font-medium'
                      : 'bg-white/20 hover:bg-white/50 border border-white/30 text-slate-700'
                    }
                  `}
                  title={app.title}
                >
                  {/* Top specular glint */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/70 pointer-events-none" />

                  <div className={`w-4 h-4 rounded flex items-center justify-center text-white ${app.color} shadow-xs`}>
                    <IconComp size={11} />
                  </div>
                  <span className="text-xs truncate max-w-[100px]">{app.title}</span>

                  {/* Active running neon glow indicator */}
                  {isOpen && (
                    <div 
                      className={`absolute bottom-0 inset-x-2 h-0.5 rounded-full ${
                        isActive ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,1)]' : 'bg-slate-400/80'
                      }`} 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: System Tray & Aero Peek */}
        <div className="flex items-center gap-3">
          {/* Quick Time Portal Button in Taskbar */}
          <button
            onClick={() => {
              audio.playTimeWarp();
              onSwitchToModern();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/40 hover:bg-white/70 border border-white/60 text-sky-950 text-[11px] font-bold transition-all shadow-xs"
            title="未来へ進む (Return to Modern Design)"
          >
            <Sparkles size={13} className="text-amber-500 animate-pulse" />
            <span>未来へ進む</span>
          </button>

          {/* System Notification Tray */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/30 backdrop-blur-xs border border-white/50 shadow-inner text-slate-800">
            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              className="hover:text-sky-600 transition-colors cursor-pointer"
              title={isMuted ? 'Muted (Click to Unmute)' : 'Sound On (Click to Mute)'}
            >
              {isMuted ? <VolumeX size={14} className="text-rose-600" /> : <Volume2 size={14} className="text-sky-800" />}
            </button>

            <Wifi size={13} className="text-sky-800 hidden md:inline" />
            <Shield size={13} className="text-emerald-700 hidden md:inline" />

            {/* Tray Clock */}
            <div className="flex flex-col items-end text-[10px] font-semibold leading-tight text-slate-900 border-l border-sky-300/50 pl-2">
              <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-[9px] text-slate-600">{time.toLocaleDateString([], { month: 'numeric', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Authentic Aero Peek Strip at Far Right */}
          <button
            onClick={() => {
              audio.playClick();
              onShowDesktop();
            }}
            className="w-3.5 h-8 rounded-xs bg-white/30 hover:bg-white/70 border border-white/60 transition-all cursor-pointer shadow-xs active:bg-sky-300"
            title="Show Desktop (Aero Peek)"
          />
        </div>
      </div>
    </>
  );
};
