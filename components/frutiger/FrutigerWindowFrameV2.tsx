import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { WindowState } from '../../types';
import { audio } from '../../services/audioService';

import { FrutigerAboutApp } from '../apps/frutiger/FrutigerAboutApp';
import { FrutigerProjectsApp } from '../apps/frutiger/FrutigerProjectsApp';
import { FrutigerSkillsApp } from '../apps/frutiger/FrutigerSkillsApp';
import { FrutigerTerminalApp } from '../apps/frutiger/FrutigerTerminalApp';
import { FrutigerAIApp } from '../apps/frutiger/FrutigerAIApp';
import { FrutigerPinballApp } from '../apps/frutiger/FrutigerPinballApp';

export const FRUTIGER_COMPONENTS: Record<string, React.FC> = {
  about: FrutigerAboutApp,
  projects: FrutigerProjectsApp,
  skills: FrutigerSkillsApp,
  terminal: FrutigerTerminalApp,
  ai_chat: FrutigerAIApp,
  snake: FrutigerPinballApp,
  pinball: FrutigerPinballApp,
};

interface FrutigerWindowFrameV2Props {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, pos: { x: number; y: number }) => void;
}

export const FrutigerWindowFrameV2: React.FC<FrutigerWindowFrameV2Props> = ({
  windowState,
  onClose,
  onMinimize,
  onFocus,
  onUpdatePosition,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (windowState.isMaximized) return;
    audio.playClick();
    onFocus(windowState.id);
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onUpdatePosition(windowState.id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onUpdatePosition, windowState.id]);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const style = windowState.isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)' }
    : {
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
      };

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col font-frutiger-ui select-none transition-shadow duration-150 animate-in zoom-in-95"
      style={{
        ...style,
        zIndex: windowState.zIndex,
        backgroundColor: '#7dd3fc', // Classic 2000s Aqua-teal window border from Image 2
        border: '3px solid',
        borderColor: '#ffffff #0369a1 #0369a1 #ffffff',
        boxShadow: isDragging
          ? '0 20px 40px rgba(0, 40, 80, 0.5), 0 0 15px rgba(56, 189, 248, 0.4)'
          : '0 10px 25px rgba(0, 40, 80, 0.35), 0 0 8px rgba(2, 132, 199, 0.25)',
      }}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* 2000s Classic Aqua-Royal Blue Titlebar (Directly from Image 2) */}
      <div
        className="h-7 px-2 flex items-center justify-between cursor-default relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #000080 0%, #0055ea 45%, #0284c7 85%, #38bdf8 100%)',
          borderBottom: '1px solid #002868',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Subtle Horizontal Gloss Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 50%, transparent 51%)',
          }}
        />

        {/* Window Title & Icon */}
        <div className="flex items-center gap-1.5 relative z-10 truncate pr-2">
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            {windowState.icon}
          </div>
          <span 
            className="text-xs font-bold text-white tracking-wide truncate"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            {windowState.title}
          </span>
        </div>

        {/* Square Beveled Window Controls (Classic [_] [□] [X] from Image 2) */}
        <div className="flex items-center gap-1 relative z-10 shrink-0">
          {/* Minimize button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              audio.playWindowClose();
              onMinimize(windowState.id);
            }}
            className="w-5 h-4.5 flex items-center justify-center cursor-pointer active:translate-y-px"
            style={{
              backgroundColor: '#cbd5e1',
              border: '1.5px solid',
              borderColor: '#ffffff #475569 #475569 #ffffff',
            }}
            title="Minimize"
          >
            <div className="w-2 h-0.5 bg-black" />
          </button>

          {/* Maximize button */}
          <button
            className="w-5 h-4.5 flex items-center justify-center opacity-60 cursor-not-allowed"
            style={{
              backgroundColor: '#cbd5e1',
              border: '1.5px solid',
              borderColor: '#ffffff #475569 #475569 #ffffff',
            }}
            title="Maximize"
          >
            <div className="w-2.5 h-2.5 border border-black" />
          </button>

          {/* Close button with classic [X] */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              audio.playWindowClose();
              onClose(windowState.id);
            }}
            className="w-5 h-4.5 flex items-center justify-center cursor-pointer active:translate-y-px hover:bg-rose-500 hover:text-white text-black transition-colors"
            style={{
              backgroundColor: '#cbd5e1',
              border: '1.5px solid',
              borderColor: '#ffffff #475569 #475569 #ffffff',
            }}
            title="Close"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Classic Menu Bar with Windows hotkey access underlines (File, Edit, Search, Help) */}
      <div 
        className="h-6 px-2 flex items-center gap-3 text-[11px] text-slate-800 border-b select-none"
        style={{
          backgroundColor: '#e0f2fe',
          borderColor: '#94a3b8',
        }}
      >
        <span className="cursor-pointer hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded-xs transition-colors">
          <span className="underline">F</span>ile
        </span>
        <span className="cursor-pointer hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded-xs transition-colors">
          <span className="underline">E</span>dit
        </span>
        <span className="cursor-pointer hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded-xs transition-colors">
          <span className="underline">S</span>earch
        </span>
        <span className="cursor-pointer hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded-xs transition-colors">
          <span className="underline">H</span>elp
        </span>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>v2000.Aero</span>
        </div>
      </div>

      {/* Inner Inset Sunken 3D Application Viewport */}
      <div 
        className="flex-1 overflow-hidden relative text-slate-900 flex flex-col"
        style={{
          border: '2px solid',
          borderColor: '#64748b #ffffff #ffffff #64748b',
          backgroundColor: '#f1f5f9',
        }}
      >
        <div className="flex-1 overflow-auto relative">
          {(() => {
            const FrutigerComp = FRUTIGER_COMPONENTS[windowState.id];
            return FrutigerComp ? <FrutigerComp /> : windowState.component;
          })()}
        </div>

        {/* Authentic 2000s Window Status Bar */}
        <div 
          className="h-5 px-2 flex items-center justify-between text-[10px] text-slate-600 select-none border-t border-[#94a3b8] shrink-0"
          style={{
            background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
          }}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-blue-900">{windowState.title}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">Status: Ready</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-slate-500 hidden sm:inline">Local Intranet Zone</span>
            <div className="flex items-center gap-0.5 text-slate-400 font-mono text-[9px] select-none" title="Resize grip">
              <span>░</span>
              <span>▒</span>
              <span>▓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
