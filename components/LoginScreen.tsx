import React, { useState, useEffect } from 'react';
import { ArrowRight, User, Lock } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const isMobile = useIsMobile();
  const [isLandscape, setIsLandscape] = useState(false);

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
    setLoading(true);
    
    // Simulate processing
    setTimeout(() => {
        // Allow any password for demo purposes
        if (true) {
            onLogin();
        } else {
            setError(true);
            setLoading(false);
        }
    }, 800);
  };

  // Landscape Mobile Adjustment
  const containerClass = isMobile && isLandscape 
    ? "flex-row gap-16" 
    : "flex-col space-y-6";

  return (
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      {/* Mobile Lock Screen Clock */}
      {isMobile && !isLandscape && (
          <div className="absolute top-16 left-0 w-full text-center z-10 animate-in slide-in-from-top-4 duration-700">
              <h1 className="text-7xl font-thin text-white tracking-tighter">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </h1>
              <p className="text-white/80 text-lg mt-2">
                  {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
          </div>
      )}

      <div className={`z-10 flex items-center justify-center animate-in zoom-in-95 duration-500 ${containerClass} ${isMobile && !isLandscape ? 'mt-32' : ''}`}>
        
        <div className="flex flex-col items-center gap-4">
            <div className={`rounded-full p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-2xl transition-all duration-500 ${isMobile ? 'w-24 h-24' : 'w-32 h-32'}`}>
                <img 
                    src="/Yuzuki-s-Portfolio/profile.jpg" 
                    alt="Yuzuki Masuo" 
                    className="w-full h-full rounded-full border-4 border-black/50 object-cover"
                />
            </div>
            <h1 className="text-3xl font-semibold text-white drop-shadow-lg whitespace-nowrap">増尾 柚希</h1>
        </div>
        
        {loading ? (
            <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-sm text-white/80">Welcome</span>
            </div>
        ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-2 items-center w-full max-w-xs min-w-[250px]">
            <div className="relative w-full group">
                <input 
                    type="password" 
                    placeholder={isMobile ? "Enter Passcode" : "Password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    className={`w-full bg-black/40 text-white placeholder-white/50 px-4 py-3 rounded-full border ${error ? 'border-red-500' : 'border-white/20'} outline-none focus:bg-black/60 focus:border-white/40 transition-all backdrop-blur-md text-center`}
                    autoFocus
                />
                {!isMobile && (
                    <button 
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 w-8 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors flex items-center justify-center"
                    >
                        <ArrowRight size={16} />
                    </button>
                )}
            </div>
            {error && <span className="text-xs text-red-400 bg-black/50 px-3 py-1 rounded-full">Incorrect password</span>}
            
            {isMobile ? (
                <div className="mt-4 flex flex-col items-center gap-2 text-white/50">
                     <Lock size={16} />
                     <span className="text-xs uppercase tracking-widest">Swipe up to unlock</span>
                </div>
            ) : (
                <p className="text-xs text-white/50 mt-4 cursor-pointer hover:text-white transition-colors">Forgot password?</p>
            )}
            </form>
        )}
      </div>

      {/* Desktop Power/Network Icons */}
      {!isMobile && (
          <div className="absolute bottom-8 right-8 text-white/60 z-10 flex gap-6">
              <span className="cursor-pointer hover:text-white transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              </span>
              <span className="cursor-pointer hover:text-white transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              </span>
          </div>
      )}
    </div>
  );
};