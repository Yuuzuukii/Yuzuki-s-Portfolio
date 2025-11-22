import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { Battery, Wifi, Signal, ChevronLeft, Circle, Square, Sun } from 'lucide-react';

interface MobileOSProps {
  apps: AppConfig[];
  appComponents: Record<string, React.FC>;
  onLogout: () => void;
}

export const MobileOS: React.FC<MobileOSProps> = ({ apps, appComponents, onLogout }) => {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [isClosing, setIsClosing] = useState(false);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showInitialApp, setShowInitialApp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener('resize', handleResize);
    
    // 壁紙をプリロード
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop';
    img.onload = () => setImageLoaded(true);
    
    // 初回起動時にAboutアプリを自動表示（オプション）
    const timer2 = setTimeout(() => {
      setShowInitialApp(true);
      // 3秒後にAboutアプリを開く（初回のみ）
      const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        setTimeout(() => {
          const aboutApp = apps.find(app => app.id === 'about');
          if (aboutApp) {
            setActiveAppId('about');
            sessionStorage.setItem('hasSeenWelcome', 'true');
          }
        }, 1500);
      }
    }, 500);
    
    return () => {
        clearInterval(timer);
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer2);
    };
  }, [apps]);

  const handleAppClick = (id: string) => {
    setActiveAppId(id);
  };

  const handleHome = () => {
    if (activeAppId) {
      setIsClosing(true);
      setTimeout(() => {
        setActiveAppId(null);
        setIsClosing(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (activeAppId) {
      handleHome();
    }
  };

  const ActiveComponent = activeAppId ? appComponents[activeAppId] : null;

  return (
    <div className="h-full w-full bg-black relative overflow-hidden font-sans select-none text-white">
      {/* ローディング表示 */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop'), linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            transform: activeAppId ? 'scale(1.1)' : 'scale(1)',
            filter: activeAppId ? 'brightness(0.8)' : 'brightness(1)'
        }}
      />

      {/* Android Status Bar */}
      <div className={`absolute top-0 w-full h-8 z-50 flex justify-between items-center px-4 text-xs font-medium transition-colors duration-300 ${activeAppId ? 'text-black bg-white/80 backdrop-blur-md' : 'text-white shadow-sm'}`}>
        <div className="flex items-center gap-2">
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex gap-1 ml-2 opacity-80">
             <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
             <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={14} />
        </div>
      </div>

      {/* Home Screen Content */}
      <div className={`absolute inset-0 pt-12 pb-16 px-4 md:px-12 flex flex-col transition-all duration-500 ${activeAppId ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
        
        {/* Weather / Date Widget */}
        <div className={`mt-8 md:mt-16 mb-auto mx-auto text-center text-white/90 transition-all ${isLandscape ? 'flex items-center gap-8 text-left' : ''}`}>
            <div>
                <div className="text-6xl md:text-8xl font-thin tracking-tighter drop-shadow-lg">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="text-lg md:text-2xl font-medium opacity-90 drop-shadow-md mb-2">
                    {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
            </div>
            {isLandscape && <div className="h-20 w-px bg-white/20 mx-4"></div>}
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/10 ${isLandscape ? 'h-fit' : ''}`}>
                <Sun size={18} className="text-yellow-300" />
                <span>Tokyo 24°C</span>
            </div>
        </div>

        {/* App Grid */}
        <div className={`grid ${isLandscape ? 'grid-cols-8 gap-6' : 'grid-cols-4 gap-y-8 gap-x-4'} mb-8 md:mb-12 justify-items-center`}>
            {apps.map(app => (
                <button 
                    key={app.id} 
                    onClick={() => handleAppClick(app.id)}
                    className="flex flex-col items-center gap-2 group active:scale-90 transition-transform duration-150 w-16"
                >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[18px] ${app.color} flex items-center justify-center text-white shadow-xl shadow-black/20`}>
                        <app.icon size={28} className="md:w-8 md:h-8" />
                    </div>
                    <span className="text-xs text-white font-medium drop-shadow-md truncate w-full text-center">{app.title}</span>
                </button>
            ))}
        </div>
        
        {/* Dock - Centered and constrained width */}
        <div className="flex justify-center w-full mb-2">
            <div className="flex justify-around items-center bg-white/10 backdrop-blur-2xl rounded-[2rem] p-3 md:p-4 border border-white/10 shadow-2xl gap-4 md:gap-8 max-w-md w-full">
                {apps.slice(0, 4).map(app => (
                    <button key={`dock-${app.id}`} onClick={() => handleAppClick(app.id)} className="active:scale-90 transition-transform hover:-translate-y-2 duration-200">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${app.color} flex items-center justify-center text-white shadow-lg`}>
                            <app.icon size={24} className="md:w-7 md:h-7" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Active App Container */}
      {activeAppId && ActiveComponent && (
        <div 
            className={`absolute inset-0 z-40 bg-slate-50 pt-8 pb-12 flex flex-col transform transition-transform duration-300 ease-out ${isClosing ? 'translate-y-full rounded-t-3xl' : 'translate-y-0'}`}
            style={{ boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' }}
        >
            {/* App Handle */}
            <div className="w-full h-6 absolute top-0 left-0 flex justify-center items-center cursor-pointer" onClick={handleHome}>
                <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
            </div>
            
            {/* App Content */}
            <div className="flex-1 overflow-hidden relative rounded-t-lg bg-white text-slate-900">
                <ActiveComponent />
            </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="absolute bottom-0 w-full h-12 bg-black/90 backdrop-blur-md z-50 flex justify-around items-center text-white/70">
        <button 
            onClick={handleBack}
            className="p-4 active:text-white active:bg-white/10 rounded-full transition-all"
        >
            <ChevronLeft size={24} />
        </button>
        <button 
            onClick={handleHome}
            className="p-4 active:text-white active:bg-white/10 rounded-full transition-all"
        >
            <Circle size={20} fill={activeAppId ? "transparent" : "rgba(255,255,255,0.7)"} strokeWidth={2} />
        </button>
        <button 
            onClick={() => { /* Recents not implemented */ }}
            className="p-4 active:text-white active:bg-white/10 rounded-full transition-all"
        >
            <Square size={20} />
        </button>
      </div>
    </div>
  );
};