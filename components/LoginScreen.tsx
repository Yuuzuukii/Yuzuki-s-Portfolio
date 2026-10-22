import React, { useState, useEffect } from 'react';
import { ArrowRight, Rewind, Rocket } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { OSTheme } from '../types';
import { audio } from '../services/audioService';

interface LoginScreenProps {
  onLogin: () => void;
  osTheme: OSTheme;
  onToggleTheme: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, osTheme, onToggleTheme }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const isMobile = useIsMobile();
  const [isLandscape, setIsLandscape] = useState(false);
  const isFrutiger = osTheme === 'frutiger';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
        clearInterval(timer);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    audio.playClick();
    setLoading(true);
    
    // Simulate processing
    setTimeout(() => {
        onLogin();
    }, 800);
  };

  // onToggleTheme already plays the time-warp chime
  const handleTimeTravel = () => {
    onToggleTheme();
  };

  // Landscape Mobile Adjustment
  const containerClass = isMobile && isLandscape 
    ? "flex-row gap-16" 
    : "flex-col space-y-6";

  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center z-50 overflow-hidden transition-all duration-700 select-none ${isFrutiger ? 'font-frutiger-ui' : 'font-sans'}`}
      style={{
        backgroundImage: isFrutiger 
          ? "linear-gradient(180deg, #0284c7 0%, #38bdf8 30%, #7dd3fc 60%, #bae6fd 85%, #dcfce7 100%)"
          : "url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Overlay */}
      {isFrutiger ? (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Sun rays */}
          <div
            className="absolute left-1/3 w-[140vmax] h-[140vmax] -translate-x-1/2 opacity-40 animate-spin"
            style={{
              top: 'calc(120px - 70vmax)', // centre the rays on the sun
              background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.35) 0deg 6deg, transparent 6deg 18deg)',
              maskImage: 'radial-gradient(circle, black 0%, transparent 45%)',
              WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 45%)',
              animationDuration: '120s',
            }}
          />
          {/* Sun flare & daylight halo */}
          <div
            className="absolute -top-32 left-1/3 w-[500px] h-[500px] -translate-x-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 25%, rgba(56,189,248,0.15) 55%, transparent 75%)',
              filter: 'blur(20px)',
            }}
          />
          {/* Lens flare dots */}
          <div className="absolute top-[30%] left-[42%] w-10 h-10 rounded-full bg-white/25 blur-[2px]" />
          <div className="absolute top-[42%] left-[48%] w-5 h-5 rounded-full bg-cyan-100/40" />
          <div className="absolute top-[52%] left-[53%] w-16 h-16 rounded-full border-2 border-white/20" />

          {/* Soft clouds */}
          {[
            { top: '10%', left: '6%', w: 260, o: 0.85 },
            { top: '18%', left: '68%', w: 320, o: 0.75 },
            { top: '34%', left: '-4%', w: 200, o: 0.55 },
            { top: '28%', left: '82%', w: 180, o: 0.6 },
          ].map((c, i) => (
            <div key={i} className="absolute" style={{ top: c.top, left: c.left, width: c.w, height: c.w * 0.38, opacity: c.o }}>
              <div className="absolute bottom-0 inset-x-0 h-1/2 rounded-full bg-white blur-[6px]" />
              <div className="absolute bottom-[20%] left-[15%] w-[45%] h-[85%] rounded-full bg-white blur-[6px]" />
              <div className="absolute bottom-[15%] left-[45%] w-[38%] h-[70%] rounded-full bg-white blur-[6px]" />
            </div>
          ))}

          {/* Aero light swooshes */}
          <svg className="absolute inset-x-0 bottom-16 w-full h-[55%]" viewBox="0 0 1440 500" preserveAspectRatio="none">
            <defs>
              <linearGradient id="loginSwooshA" x1="0" x2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="45%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="loginSwooshB" x1="0" x2="1">
                <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0" />
                <stop offset="55%" stopColor="#ecfeff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,380 C360,220 760,460 1440,180 L1440,220 C800,500 380,280 0,420 Z" fill="url(#loginSwooshA)" />
            <path d="M0,300 C420,420 900,160 1440,320 L1440,340 C900,200 420,450 0,318 Z" fill="url(#loginSwooshB)" />
            <path d="M0,440 C500,330 980,470 1440,390" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" />
          </svg>

          {/* Rising glossy bubbles (decorative only) */}
          {[
            { left: '8%', size: 34, dur: '18s', delay: '0s' },
            { left: '22%', size: 20, dur: '14s', delay: '4s' },
            { left: '37%', size: 46, dur: '22s', delay: '8s' },
            { left: '63%', size: 26, dur: '16s', delay: '2s' },
            { left: '78%', size: 40, dur: '20s', delay: '6s' },
            { left: '91%', size: 22, dur: '15s', delay: '10s' },
          ].map((b, i) => (
            <div
              key={i}
              className="absolute top-0"
              style={{ left: b.left, width: b.size, height: b.size, animation: `float-bubble ${b.dur} linear infinite`, animationDelay: b.delay }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 25%, rgba(56,189,248,0.2) 60%, rgba(2,132,199,0.45) 100%)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.9), 0 2px 8px rgba(2,132,199,0.3)',
                }}
              />
            </div>
          ))}

          {/* Layered hills with glossy rim light */}
          <div
            className="absolute -bottom-6 -left-[10%] w-[70%] h-44 rounded-t-[100%]"
            style={{ background: 'linear-gradient(180deg, #86efac 0%, #22c55e 60%, #15803d 100%)', opacity: 0.8 }}
          />
          <div
            className="absolute bottom-0 inset-x-0 h-32 rounded-t-[100%_40%]"
            style={{
              background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)',
              boxShadow: 'inset 0 6px 10px rgba(255,255,255,0.55)',
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      )}
      
      {/* Mobile Lock Screen Clock */}
      {isMobile && !isLandscape && (
          <div className="absolute top-16 left-0 w-full text-center z-10 animate-in slide-in-from-top-4 duration-700">
              <h1 className={`text-7xl font-thin tracking-tighter ${isFrutiger ? 'text-sky-950 font-normal drop-shadow-sm' : 'text-white'}`}>
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </h1>
              <p className={`text-lg mt-2 ${isFrutiger ? 'text-sky-900 font-medium' : 'text-white/80'}`}>
                  {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
          </div>
      )}

      <div className={`z-10 flex items-center justify-center animate-in zoom-in-95 duration-500 ${containerClass} ${isMobile && !isLandscape ? 'mt-32' : ''}`}>
        
        {/* User Profile Avatar with Skeuomorphic Glass Glow in Frutiger Mode */}
        <div className="flex flex-col items-center gap-4">
            <div className={`rounded-full p-1.5 shadow-2xl transition-all duration-500 ${
              isFrutiger 
                ? 'bg-gradient-to-b from-white via-sky-200 to-sky-500 border-2 border-white/90 shadow-[0_10px_25px_rgba(2,132,199,0.5)]'
                : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500'
            } ${isMobile ? 'w-24 h-24' : 'w-32 h-32'}`}>
                <img 
                    src={`${import.meta.env.BASE_URL}profile.jpg`} 
                    alt="Yuzuki Masuo" 
                    className={`w-full h-full rounded-full object-cover ${isFrutiger ? 'border-2 border-white' : 'border-4 border-black/50'}`}
                />
            </div>
            <div className="text-center">
              <h1 className={`text-3xl font-semibold drop-shadow-lg whitespace-nowrap ${isFrutiger ? 'text-sky-950 font-bold' : 'text-white'}`}>
                増尾 柚希
              </h1>
              {isFrutiger && (
                <span className="text-xs font-semibold text-sky-800 bg-white/70 px-2 py-0.5 rounded-full border border-sky-300 shadow-xs inline-block mt-1">
                  YuzuOS Aero Edition
                </span>
              )}
            </div>
        </div>
        
        {loading ? (
            <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className={`w-6 h-6 border-2 rounded-full animate-spin ${
                  isFrutiger ? 'border-sky-300 border-t-sky-700' : 'border-white/30 border-t-white'
                }`}></div>
                <span className={`text-sm ${isFrutiger ? 'text-sky-900 font-semibold' : 'text-white/80'}`}>Welcome</span>
            </div>
        ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-3 items-center w-full max-w-xs min-w-[250px]">
            <div className="relative w-full group">
                <input 
                    type="password" 
                    placeholder={isMobile ? "Enter Passcode" : "Password (Press Enter)"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    className={`w-full px-4 py-3 rounded-full border outline-none transition-all backdrop-blur-md text-center text-sm ${
                      isFrutiger
                        ? 'bg-white/85 text-slate-800 placeholder-slate-500 border-sky-300 shadow-[inset_0_2px_4px_rgba(2,132,199,0.2)] focus:bg-white focus:border-sky-500'
                        : 'bg-black/40 text-white placeholder-white/50 border-white/20 focus:bg-black/60 focus:border-white/40'
                    }`}
                    autoFocus
                />
                {!isMobile && (
                    <button 
                        type="submit"
                        className={`absolute right-2 top-2 bottom-2 w-8 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                          isFrutiger
                            ? 'bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-sm hover:brightness-110 active:scale-95'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                        title="Log In"
                    >
                        <ArrowRight size={16} />
                    </button>
                )}
            </div>
            {error && <span className="text-xs text-red-400 bg-black/50 px-3 py-1 rounded-full">Incorrect password</span>}
            
            {/* Login Prompt info */}
            <p className={`text-xs ${isFrutiger ? 'text-sky-800' : 'text-white/60'} text-center`}>
              {isMobile ? "Tap to unlock" : "Click arrow or press Enter to login"}
            </p>

            {/* Time Travel Button: only offered here on the login screen */}
            <div className="w-full pt-2">
              <button
                type="button"
                onClick={handleTimeTravel}
                className={`group w-full py-2.5 px-4 rounded-full flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${
                  isFrutiger
                    ? 'aero-button text-sky-950 shadow-[0_4px_14px_rgba(2,132,199,0.3)] hover:scale-105'
                    : 'bg-gradient-to-r from-cyan-500/80 via-teal-400/80 to-blue-500/80 hover:from-cyan-400 hover:to-blue-400 text-slate-900 border border-white/40 shadow-[0_0_20px_rgba(56,189,248,0.4)] backdrop-blur-md hover:scale-105'
                }`}
                title={isFrutiger ? 'Jump forward to the sleek modern desktop' : 'Travel back to the glossy Frutiger Aero era'}
              >
                {isFrutiger ? (
                  <Rocket size={18} className="text-sky-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                ) : (
                  <Rewind size={18} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
                )}
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-extrabold tracking-wide">
                    {isFrutiger ? 'Warp to the Future' : 'Rewind Time'}
                  </span>
                  <span className={`text-[10px] font-semibold ${isFrutiger ? 'text-sky-800/80' : 'text-slate-900/70'}`}>
                    {isFrutiger ? 'Back to the modern OS' : 'Step into the glossy Aero era'}
                  </span>
                </span>
              </button>
            </div>
            </form>
        )}
      </div>

      {/* Desktop Power/Network Icons */}
      {!isMobile && (
          <div className={`absolute bottom-8 right-8 z-10 flex gap-6 ${isFrutiger ? 'text-sky-900' : 'text-white/60'}`}>
              <span className="cursor-pointer hover:opacity-100 transition-opacity">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              </span>
              <span className="cursor-pointer hover:opacity-100 transition-opacity">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              </span>
          </div>
      )}
    </div>
  );
};