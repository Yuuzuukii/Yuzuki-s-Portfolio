import React, { useState, useEffect } from 'react';
import { AppConfig } from '../../types';
import { Volume2, VolumeX, Power } from 'lucide-react';
import { audio } from '../../services/audioService';

interface FrutigerTaskbarV2Props {
  apps: AppConfig[];
  openWindows: string[];
  activeWindowId: string | null;
  onAppClick: (id: string) => void;
  onShowDesktop: () => void;
}

export const FrutigerTaskbarV2: React.FC<FrutigerTaskbarV2Props> = ({
  apps,
  openWindows,
  activeWindowId,
  onAppClick,
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
      {/* 2000s Classic Start Menu Popup */}
      {isStartOpen && (
        <div 
          className="absolute bottom-10 left-0 w-80 rounded-t-xl shadow-2xl p-3 flex flex-col z-50 animate-in slide-in-from-bottom-2 duration-150 select-none"
          style={{
            background: 'linear-gradient(180deg, #e0f2fe 0%, #ffffff 30%, #f0f9ff 100%)',
            border: '2px solid',
            borderColor: '#ffffff #003366 #003366 #ffffff',
            boxShadow: '0 10px 30px rgba(0, 40, 80, 0.45)',
          }}
        >
          {/* Top Blue Header */}
          <div 
            className="flex items-center gap-2 p-2 rounded-t-lg -mt-1 -mx-1 mb-2 shadow-xs"
            style={{
              background: 'linear-gradient(90deg, #0055ea 0%, #0284c7 100%)',
            }}
          >
            <div className="w-8 h-8 rounded-full border border-white overflow-hidden bg-white">
              <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="Yuzuki Masuo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">増尾 柚希 (Yuzuki Masuo)</p>
              <p className="text-[10px] text-cyan-200">Ritsumeikan University • SI Lab</p>
            </div>
          </div>

          {/* Program list */}
          <div className="space-y-1 my-1">
            <span className="text-[10px] font-bold text-sky-800 uppercase px-1">All Programs</span>
            {apps.map(app => {
              const IconComp = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    handleAppButtonClick(app.id);
                    setIsStartOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-blue-600 hover:text-white text-slate-800 transition-colors text-left text-xs font-semibold group cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${app.color} shadow-xs`}>
                    <IconComp size={14} />
                  </div>
                  <span>{app.title}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-sky-300 flex items-center justify-end">
            <button
              onClick={() => window.location.reload()}
              className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 transition-colors cursor-pointer"
              title="Restart"
            >
              <Power size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Classic 2000s Royal Blue Taskbar (Directly from Image 2) */}
      <div 
        className="h-9 absolute bottom-0 inset-x-0 flex items-center justify-between z-50 select-none font-frutiger-ui shadow-[0_-2px_10px_rgba(0,0,0,0.3)]"
        style={{
          background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 25%, #1e40af 60%, #172554 100%)',
          borderTop: '1px solid #60a5fa',
        }}
      >
        {/* Left Section: Iconic Green Curved Windows "start" Button (Image 2 bottom left) */}
        <div className="flex items-center h-full">
          <button
            onClick={handleStartToggle}
            className="h-full px-4 rounded-r-2xl flex items-center gap-2 cursor-pointer transition-all hover:brightness-110 active:brightness-95 shadow-md relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #86efac 0%, #22c55e 30%, #16a34a 70%, #14532d 100%)',
              borderRight: '2px solid #15803d',
              borderTop: '1px solid #bbf7d0',
            }}
            title="Start Menu"
          >
            {/* Top specular glint */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

            {/* Windows 4-color flag */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              <path d="M2 4 Q7 2 12 5 Q7 8 2 7 Z" fill="#ef4444" />
              <path d="M13 5.5 Q18 3.5 23 6.5 Q18 9.5 13 8.5 Z" fill="#22c55e" />
              <path d="M2 8 Q7 9 12 6 Q7 12 2 11 Z" fill="#3b82f6" />
              <path d="M13 9.5 Q18 10.5 23 7.5 Q18 13.5 13 12.5 Z" fill="#eab308" />
            </svg>

            {/* Bold italic "start" label */}
            <span 
              className="font-black italic text-sm text-white tracking-wide"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              start
            </span>
          </button>

          {/* Running Program Tabs with 2000s Beveled Borders (Image 2 taskbar) */}
          <div className="flex items-center gap-1 ml-2 h-full py-0.5 overflow-x-auto max-w-[calc(100vw-340px)]">
            {apps.map(app => {
              const isOpen = openWindows.includes(app.id);
              const isActive = activeWindowId === app.id;
              const IconComp = app.icon;

              if (!isOpen) return null;

              return (
                <button
                  key={app.id}
                  onClick={() => handleAppButtonClick(app.id)}
                  className="h-full px-3 rounded-xs flex items-center gap-2 cursor-pointer transition-all relative overflow-hidden"
                  style={{
                    backgroundColor: isActive ? '#1e3a8a' : '#2563eb',
                    border: '1.5px solid',
                    borderColor: isActive 
                      ? '#0f172a #93c5fd #93c5fd #0f172a' // Inset depressed look
                      : '#93c5fd #0f172a #0f172a #93c5fd', // Raised 3D look
                    boxShadow: isActive ? 'inset 0 1px 3px rgba(0,0,0,0.5)' : 'none',
                  }}
                  title={app.title}
                >
                  <div className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center text-white ${app.color}`}>
                    <IconComp size={10} />
                  </div>
                  <span className="text-[11px] font-bold text-white truncate max-w-[120px]" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.7)' }}>
                    {app.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: System Notification Area Tray (Image 2 bottom right) */}
        <div 
          className="flex items-center gap-2.5 h-full px-3 text-white border-l"
          style={{
            background: 'linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%)',
            borderColor: '#1e3a8a',
            borderLeft: '2px solid #0f172a',
          }}
        >
          {/* Audio Mute / Unmute */}
          <button
            onClick={handleSoundToggle}
            className="hover:text-cyan-300 transition-colors cursor-pointer"
            title={isMuted ? 'Muted' : 'Sound On'}
          >
            {isMuted ? <VolumeX size={14} className="text-rose-300" /> : <Volume2 size={14} />}
          </button>

          {/* Tray Clock with AM/PM (Matching Image 2 "12:10:42 PM") */}
          <div className="text-[11px] font-mono font-bold text-cyan-100 pl-1">
            {time.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </>
  );
};
