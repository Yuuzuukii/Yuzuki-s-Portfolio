import React, { useState, useEffect } from 'react';
import { SystemState, WindowState, AppConfig } from './types';
import { User, Code, Cpu, Terminal, MessageSquare, FolderOpen, Gamepad2 } from 'lucide-react';
import { BootScreen } from './components/BootScreen';
import { LoginScreen } from './components/LoginScreen';
import { Taskbar } from './components/Taskbar';
import { DesktopIcons } from './components/DesktopIcons';
import { WindowFrame } from './components/WindowFrame';
import { MobileOS } from './components/MobileOS';
import { useIsMobile } from './hooks/useIsMobile';

// App Components
import { AboutApp } from './components/apps/AboutApp';
import { ProjectsApp } from './components/apps/ProjectsApp';
import { SkillsApp } from './components/apps/SkillsApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { AIApp } from './components/apps/AIApp';
import { SnakeGameApp } from './components/apps/SnakeGameApp';

// App Configuration
const APPS: AppConfig[] = [
  { id: 'about', title: 'About Me', icon: User, color: 'bg-pink-500' },
  { id: 'projects', title: 'Projects', icon: FolderOpen, color: 'bg-yellow-500' },
  { id: 'skills', title: 'Skills', icon: Cpu, color: 'bg-blue-500' },
  { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'bg-slate-800' },
  { id: 'ai_chat', title: 'YuzuBot AI', icon: MessageSquare, color: 'bg-indigo-600' },
  { id: 'snake', title: 'Snake OS', icon: Gamepad2, color: 'bg-green-500' },
];

// Component Mapping
const APP_COMPONENTS: Record<string, React.FC> = {
  about: AboutApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  terminal: TerminalApp,
  ai_chat: AIApp,
  snake: SnakeGameApp,
};

function App() {
  const isMobile = useIsMobile();
  const [systemState, setSystemState] = useState<SystemState>(SystemState.BOOT);
  
  // Desktop State
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(100);

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

  // Window Management Logic
  const openApp = (appId: string) => {
    const existingWindow = windows.find(w => w.id === appId);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => w.id === appId ? { ...w, isMinimized: false } : w));
      }
      focusWindow(appId);
      return;
    }

    const appConfig = APPS.find(a => a.id === appId);
    if (!appConfig) return;

    const Component = APP_COMPONENTS[appId];
    const newZ = zIndexCounter + 1;
    setZIndexCounter(newZ);

    // Calculate random offset for initial position
    const offsetX = 50 + (windows.length * 30);
    const offsetY = 50 + (windows.length * 30);

    const newWindow: WindowState = {
      id: appId,
      title: appConfig.title,
      icon: <appConfig.icon size={16} />,
      component: <Component />,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZ,
      position: { x: Math.min(offsetX, window.innerWidth - 600), y: Math.min(offsetY, window.innerHeight - 500) },
      size: { width: Math.min(800, window.innerWidth - 40), height: Math.min(600, window.innerHeight - 100) },
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(appId);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
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

  // Render based on state
  if (systemState === SystemState.BOOT) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  if (systemState === SystemState.LOGIN) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Mobile Interface
  if (isMobile) {
    return (
        <MobileOS 
            apps={APPS} 
            appComponents={APP_COMPONENTS} 
            onLogout={handleLogout} 
        />
    );
  }

  // Desktop Interface
  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat font-sans selection:bg-pink-500/30"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop')" }}
    >
      {/* Desktop Overlay for darkening bg */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <DesktopIcons apps={APPS} onAppClick={openApp} />

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

      <Taskbar 
        apps={APPS} 
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