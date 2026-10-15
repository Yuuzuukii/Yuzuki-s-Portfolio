import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Sparkles, Clock, Undo2 } from 'lucide-react';
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

  const handleTimeTravel = () => {
    audio.playTimeWarp();
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
        <div className="absolute inset-0 pointer-events-none">
          {/* Sun flare & daylight halo */}
          <div 
            className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(56,189,248,0.2) 60%, transparent 80%)',
              filter: 'blur(30px)',
            }}
          />
          {/* Green Hill Silhouette at bottom */}
          <div 
            className="absolute bottom-0 inset-x-0 h-32 rounded-t-[100%_40%]"
            style={{
              background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)',
              opacity: 0.85,
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
                    src="/profile.jpg" 
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
                  YuzuOS 2000s Aero
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

            {/* Time Travel Button: "昔に戻る" in modern mode, "未来へ進む" in Frutiger mode */}
            <div className="w-full pt-2">
              <button
                type="button"
                onClick={handleTimeTravel}
                className={`w-full py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                  isFrutiger
                    ? 'aero-button text-sky-950 shadow-[0_4px_14px_rgba(2,132,199,0.3)] hover:scale-105'
                    : 'bg-gradient-to-r from-cyan-500/80 via-teal-400/80 to-blue-500/80 hover:from-cyan-400 hover:to-blue-400 text-slate-900 border border-white/40 shadow-[0_0_20px_rgba(56,189,248,0.4)] backdrop-blur-md hover:scale-105'
                }`}
                title={isFrutiger ? "現在のモダンOSデザインに戻る" : "2000年代のFrutiger Aeroデザインを体験する"}
              >
                {isFrutiger ? (
                  <>
                    <Sparkles size={16} className="text-amber-500" />
                    <span>未来へ進む (Modern OS)</span>
                  </>
                ) : (
                  <>
                    <Clock size={16} className="text-slate-900 animate-pulse" />
                    <span>昔に戻る (2000s Frutiger Aero)</span>
                  </>
                )}
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