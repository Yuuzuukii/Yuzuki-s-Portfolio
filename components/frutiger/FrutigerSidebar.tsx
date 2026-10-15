import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Sun, ArrowRight, Clock } from 'lucide-react';
import { audio } from '../../services/audioService';

interface FrutigerSidebarProps {
  onSwitchToModern: () => void;
}

export const FrutigerSidebar: React.FC<FrutigerSidebarProps> = ({ onSwitchToModern }) => {
  const [time, setTime] = useState(new Date());
  const [isMuted, setIsMuted] = useState(audio.isMuted());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSoundToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audio.playClick();
    }
  };

  const handleTimeWarp = () => {
    audio.playTimeWarp();
    onSwitchToModern();
  };

  // Clock hands math
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="hidden lg:flex flex-col gap-4 absolute top-4 right-4 z-20 w-60 select-none">
      {/* Time Portal / Era Warp Gadget */}
      <div className="p-3.5 rounded-2xl aero-glass-window shadow-xl border border-white/80">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-sky-300/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
            <Sparkles size={14} className="text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Time Portal Gadget</span>
          </div>
          <span className="text-[10px] bg-sky-200/80 text-sky-800 font-bold px-1.5 py-0.5 rounded-full border border-sky-300">
            2000s
          </span>
        </div>

        <p className="text-[11px] text-slate-700 leading-snug mb-3">
          Frutiger Aero mode active. Explore 2000s optimism, glass aesthetics, and interactive sound!
        </p>

        {/* The requested "先に進む" switch back to modern design button */}
        <button
          onClick={handleTimeWarp}
          className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs aero-button text-sky-950 cursor-pointer group"
          title="Return to Modern OS Design"
        >
          <span>未来へ進む (Modern OS)</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Authentic Vista Analog Clock Gadget */}
      <div className="p-4 rounded-2xl aero-glass-window flex flex-col items-center justify-center shadow-lg border border-white/80">
        <div className="relative w-28 h-28 rounded-full border-2 border-white/90 shadow-[inset_0_2px_8px_rgba(2,132,199,0.3),0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center bg-gradient-to-b from-white via-sky-50 to-sky-100">
          {/* Glass specular sheen */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.2) 40%, transparent 60%)',
            }}
          />

          {/* Hour tick marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
            <div
              key={deg}
              className="absolute w-0.5 h-2 bg-sky-900/60"
              style={{
                transform: `rotate(${deg}deg) translateY(-46px)`,
              }}
            />
          ))}

          {/* Hour hand */}
          <div
            className="absolute w-1 h-8 bg-slate-800 rounded-full origin-bottom"
            style={{
              transform: `rotate(${hourDeg}deg) translateY(-14px)`,
              transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
            }}
          />

          {/* Minute hand */}
          <div
            className="absolute w-0.5 h-11 bg-sky-900 rounded-full origin-bottom"
            style={{
              transform: `rotate(${minuteDeg}deg) translateY(-18px)`,
              transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
            }}
          />

          {/* Second hand (Orange/Aqua needle) */}
          <div
            className="absolute w-px h-12 bg-amber-500 origin-bottom"
            style={{
              transform: `rotate(${secondDeg}deg) translateY(-18px)`,
            }}
          />

          {/* Center cap */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-sky-600 border border-white shadow-xs z-10" />
        </div>

        <span className="text-[11px] font-bold text-sky-900 mt-2 font-mono">
          {time.toLocaleTimeString()}
        </span>
      </div>

      {/* Audio & Environment Control Gadget */}
      <div className="p-3 rounded-2xl aero-glass-window shadow-md flex items-center justify-between border border-white/80">
        <div className="flex items-center gap-2">
          <Sun size={16} className="text-amber-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-800 leading-none">Tokyo 24°C</span>
            <span className="text-[9px] text-sky-700">Fair & Sunny</span>
          </div>
        </div>

        {/* Audio Mute / Unmute Button */}
        <button
          onClick={handleSoundToggle}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isMuted ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-sky-100 text-sky-800 border border-sky-300 hover:bg-sky-200'
          }`}
          title={isMuted ? 'Unmute 2000s Sound Effects' : 'Mute Sound Effects'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>
    </div>
  );
};
