import React, { useState, useEffect } from 'react';
import { SystemState, WindowState, AppConfig, OSTheme } from './types';
import { User, Cpu, Terminal, MessageSquare, FolderOpen, Gamepad2, Disc } from 'lucide-react';
import { BootScreen } from './components/BootScreen';
import { LoginScreen } from './components/LoginScreen';
import { Taskbar } from './components/Taskbar';
import { DesktopIcons } from './components/DesktopIcons';
import { WindowFrame } from './components/WindowFrame';
import { MobileOS } from './components/MobileOS';
import { useIsMobile } from './hooks/useIsMobile';
import { audio } from './services/audioService';

// Frutiger Aero Components (V2 matching Image 1 & Image 2)
import { FrutigerWallpaperV2 } from './components/frutiger/FrutigerWallpaperV2';
import { FrutigerWindowFrameV2 } from './components/frutiger/FrutigerWindowFrameV2';
import { FrutigerTaskbarV2 } from './components/frutiger/FrutigerTaskbarV2';
import { FrutigerDesktopIconsV2 } from './components/frutiger/FrutigerDesktopIconsV2';
import { FrutigerCyberPlayer } from './components/frutiger/FrutigerCyberPlayer';
import { ClippyAssistant } from './components/frutiger/ClippyAssistant';

// App Components
import { AboutApp } from './components/apps/AboutApp';
import { ProjectsApp } from './components/apps/ProjectsApp';
import { SkillsApp } from './components/apps/SkillsApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { AIApp } from './components/apps/AIApp';
import { SnakeGameApp } from './components/apps/SnakeGameApp';
import { FrutigerPinballApp } from './components/apps/frutiger/FrutigerPinballApp';

// Modern OS App Configuration (Cyber theme with Cyber Snake)
const MODERN_APPS: AppConfig[] = [
  { id: 'about', title: 'About Me', icon: User, color: 'bg-pink-500' },
  { id: 'projects', title: 'Projects', icon: FolderOpen, color: 'bg-yellow-500' },
  { id: 'skills', title: 'Skills', icon: Cpu, color: 'bg-blue-500' },
  { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'bg-slate-800' },
  { id: 'ai_chat', title: 'YuzuBot AI', icon: MessageSquare, color: 'bg-indigo-600' },
  { id: 'snake', title: 'Cyber Snake', icon: Gamepad2, color: 'bg-emerald-600' },
];

// Frutiger Aero OS App Configuration (2000s Aqua theme with 3D Space Pinball)
const FRUTIGER_APPS: AppConfig[] = [
  { id: 'about', title: 'About Me', icon: User, color: 'bg-pink-500' },
  { id: 'projects', title: 'Projects', icon: FolderOpen, color: 'bg-yellow-500' },
  { id: 'skills', title: 'Skills', icon: Cpu, color: 'bg-blue-500' },
  { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'bg-slate-800' },
  { id: 'ai_chat', title: 'YuzuBot AI', icon: MessageSquare, color: 'bg-indigo-600' },
  { id: 'snake', title: 'Space Pinball', icon: Disc, color: 'bg-red-600' },
];

// Component Mapping
const APP_COMPONENTS: Record<string, React.FC> = {
  about: AboutApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  terminal: TerminalApp,
  ai_chat: AIApp,
  snake: SnakeGameApp,
  pinball: FrutigerPinballApp,
};

function App() {
  const isMobile = useIsMobile();
  const [systemState, setSystemState] = useState<SystemState>(SystemState.BOOT);
  
  // OS Theme: 'modern' | 'frutiger'
  const [osTheme, setOsTheme] = useState<OSTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yuzuos_theme');
      if (saved === 'frutiger' || saved === 'modern') return saved;
    }
    return 'modern';
  });

  // Desktop State
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(100);

  // Active App Configuration based on current theme
  const currentApps = osTheme === 'frutiger' ? FRUTIGER_APPS : MODERN_APPS;

  const toggleTheme = () => {
    audio.playTimeWarp();
    const nextTheme = osTheme === 'modern' ? 'frutiger' : 'modern';
    setOsTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yuzuos_theme', nextTheme);
    }
  };

  const handleBootComplete = () => setSystemState(SystemState.LOGIN);
  const handleLogin = () => {
      setSystemState(SystemState.DESKTOP);
      // Auto open 'About' on login for desktop users
      if (!isMobile) {
          setTimeout(() => openApp('about'), 500);
      }
  };

  const handleLogout = () => {
      setSystemState(SystemState.LOGIN);
      setWindows([]);
      setActiveWindowId(null);
  };

  // Mobile users skip the boot animation and land on the login (lock) screen,
  // which is the only place to switch between the modern and Aero eras
  useEffect(() => {
    if (isMobile && systemState === SystemState.BOOT) {
      setSystemState(SystemState.LOGIN);
    }
  }, [isMobile, systemState]);

  // Window Management Logic
  const openApp = (appId: string) => {
    const existingWindow = windows.find(w => w.id === appId);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => w.id === appId ? { ...w, isMinimized: false } : w));
        audio.playWindowOpen();
      }
      focusWindow(appId);
      return;
    }

    const appConfig = currentApps.find(a => a.id === appId);
    if (!appConfig) return;

    audio.playWindowOpen();
    const isGame = appId === 'snake' || appId === 'pinball';
    const isPinball = isGame && osTheme === 'frutiger';
    const isSnake = isGame && osTheme === 'modern';

    const Component = isGame
      ? (osTheme === 'frutiger' ? FrutigerPinballApp : SnakeGameApp)
      : (APP_COMPONENTS[appId] || AboutApp);

    const newZ = zIndexCounter + 1;
    setZIndexCounter(newZ);

    // Calculate offset for initial position
    const offsetX = 50 + (windows.length * 30);
    const offsetY = 50 + (windows.length * 30);

    const initialWidth = isPinball
      ? Math.min(460, window.innerWidth - 30)
      : isSnake
      ? Math.min(460, window.innerWidth - 30)
      : Math.min(800, window.innerWidth - 60);

    const initialHeight = isPinball
      ? Math.min(670, window.innerHeight - 50)
      : isSnake
      ? Math.min(600, window.innerHeight - 50)
      : Math.min(600, window.innerHeight - 120);

    const newWindow: WindowState = {
      id: appId,
      title: appConfig.title,
      icon: <appConfig.icon size={16} />,
      component: <Component />,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZ,
      position: { 
        x: isGame 
          ? Math.max(30, Math.round((window.innerWidth - initialWidth) / 2))
          : Math.max(20, Math.min(offsetX, window.innerWidth - initialWidth - 20)), 
        y: isGame 
          ? Math.max(20, Math.round((window.innerHeight - initialHeight - 50) / 2))
          : Math.max(20, Math.min(offsetY, window.innerHeight - initialHeight - 40)),
      },
      size: { width: initialWidth, height: initialHeight },
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(appId);
  };

  const closeWindow = (id: string) => {
    audio.playWindowClose();
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    audio.playWindowClose();
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    const newZ = zIndexCounter + 1;
    setZIndexCounter(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
    setActiveWindowId(id);
  };

  const updateWindowPosition = (id: string, pos: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: pos } : w));
  };

  const handleShowDesktop = () => {
    const allMinimized = windows.every(w => w.isMinimized);
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: !allMinimized })));
    if (!allMinimized) {
      setActiveWindowId(null);
    }
  };

  // Render based on state
  if (systemState === SystemState.BOOT) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  if (systemState === SystemState.LOGIN) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        osTheme={osTheme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Mobile Interface
  if (isMobile) {
    return (
        <MobileOS 
            apps={currentApps} 
            appComponents={APP_COMPONENTS} 
            onLogout={handleLogout} 
            osTheme={osTheme}
        />
    );
  }

  // ==========================================
  // Frutiger Aero OS Desktop Mode (2000s)
  // ==========================================
  if (osTheme === 'frutiger') {
    return (
      <div className="relative h-screen w-screen overflow-hidden font-frutiger-ui select-none">
        {/* Dynamic Frutiger Aero Wallpaper (Image 2: Sky, Clouds, Birds, Eco-Towers, Giant Bubble, Fish, Sunflowers, Lemons) */}
        <FrutigerWallpaperV2 />

        {/* Unboxed 3D Pushable Desktop Icons (Image 1: Manila folder, MSN buddies, CRT monitor, CD, Info sphere, Spiky mine) */}
        <FrutigerDesktopIconsV2 apps={currentApps} onAppClick={openApp} />

        {/* Cyber Handheld MP3 Player Gadget (Image 2) */}
        <FrutigerCyberPlayer />

        {/* Interactive Clippy Companion (Image 2) */}
        <ClippyAssistant />

        {/* Classic 2000s Aqua-Teal Beveled Windows (Image 2: square [_] [□] [X], File/Edit menu) */}
        {windows.map(windowState => (
          <FrutigerWindowFrameV2
            key={windowState.id}
            windowState={windowState}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            onUpdatePosition={updateWindowPosition}
          />
        ))}

        {/* Classic Windows XP/Vista Hybrid Taskbar (Image 2: Green 'start' button, royal blue glass bar, beveled tabs) */}
        <FrutigerTaskbarV2 
          apps={currentApps} 
          openWindows={windows.filter(w => !w.isMinimized).map(w => w.id)}
          activeWindowId={activeWindowId}
          onAppClick={(id) => {
              const win = windows.find(w => w.id === id);
              if (win && !win.isMinimized && activeWindowId === id) {
                  minimizeWindow(id);
              } else {
                  openApp(id);
              }
          }}
          onShowDesktop={handleShowDesktop}
        />
      </div>
    );
  }

  // ==========================================
  // Modern OS Desktop Mode (Windows-inspired)
  // ==========================================
  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat font-sans selection:bg-pink-500/30"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop')" }}
    >
      {/* Desktop Overlay for darkening bg */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Modern Desktop Icons */}
      <DesktopIcons apps={currentApps} onAppClick={openApp} />

      {/* Modern Window Frames */}
      {windows.map(windowState => (
        <WindowFrame
          key={windowState.id}
          windowState={windowState}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updateWindowPosition}
        />
      ))}

      {/* Modern Taskbar */}
      <Taskbar 
        apps={currentApps} 
        openWindows={windows.map(w => w.id)}
        activeWindowId={activeWindowId}
        onAppClick={(id) => {
            const win = windows.find(w => w.id === id);
            if(win && !win.isMinimized && activeWindowId === id) {
                minimizeWindow(id);
            } else {
                openApp(id);
            }
        }}
      />
    </div>
  );
}

export default App;