import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState } from '../../types';
import { audio } from '../../services/audioService';

interface FrutigerWindowFrameProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, pos: { x: number; y: number }) => void;
}

export const FrutigerWindowFrame: React.FC<FrutigerWindowFrameProps> = ({
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
      className="absolute flex flex-col rounded-xl overflow-hidden aero-glass-window transition-shadow duration-150 animate-in zoom-in-95"
      style={{
        ...style,
        zIndex: windowState.zIndex,
        boxShadow: isDragging
          ? '0 25px 60px -10px rgba(2, 60, 110, 0.45), 0 0 25px rgba(56, 189, 248, 0.5)'
          : '0 16px 36px -4px rgba(2, 60, 110, 0.3), 0 0 15px rgba(56, 189, 248, 0.25)',
      }}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* 2000s Aero Glass Titlebar */}
      <div
        className="h-10 aero-titlebar flex items-center justify-between px-3 cursor-default select-none relative"
        onMouseDown={handleMouseDown}
      >
        {/* Specular curved highlight sheen overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 50%, transparent 51%)',
          }}
        />

        {/* Window Title & Icon */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-5 h-5 rounded-md flex items-center justify-center p-0.5 shadow-sm bg-gradient-to-b from-white to-sky-100 border border-white/80">
            {windowState.icon}
          </div>
          <span 
            className="text-xs font-bold text-slate-800 tracking-wide"
            style={{
              textShadow: '0 1px 2px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.8)',
            }}
          >
            {windowState.title}
          </span>
        </div>

        {/* Windows Aero Jewel Control Buttons */}
        <div className="flex items-center gap-1.5 relative z-10">
          {/* Minimize button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              audio.playWindowClose();
              onMinimize(windowState.id);
            }}
            className="w-7 h-5 rounded flex items-center justify-center transition-all bg-gradient-to-b from-white/90 via-sky-100/70 to-sky-200/90 border border-sky-300/80 hover:brightness-110 active:scale-95 shadow-xs text-slate-700 hover:text-sky-900"
            title="Minimize"
          >
            <Minus size={12} strokeWidth={2.5} />
          </button>

          {/* Maximize button */}
          <button
            className="w-7 h-5 rounded flex items-center justify-center opacity-70 cursor-not-allowed bg-gradient-to-b from-white/90 via-sky-100/70 to-sky-200/90 border border-sky-300/80 shadow-xs text-slate-600"
            title="Maximize (Fixed Size)"
          >
            <Square size={10} strokeWidth={2.5} />
          </button>

          {/* Iconic Glossy Red Aero Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              audio.playWindowClose();
              onClose(windowState.id);
            }}
            className="w-9 h-5 rounded-sm flex items-center justify-center transition-all relative overflow-hidden bg-gradient-to-b from-rose-400 via-red-500 to-red-600 border border-red-700 hover:brightness-115 active:brightness-90 shadow-[0_1px_3px_rgba(220,38,38,0.5)] text-white group"
            title="Close"
          >
            {/* Top specular glint */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
            <X size={13} strokeWidth={2.5} className="filter drop-shadow-xs group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Frutiger Sub-header Navigation Bar (Aero breadcrumb style) */}
      <div className="h-7 bg-white/75 backdrop-blur-md border-b border-sky-200/70 px-3 flex items-center gap-3 text-[11px] text-slate-700 select-none">
        <span className="font-medium text-sky-800">File</span>
        <span className="font-medium text-sky-800">View</span>
        <span className="font-medium text-sky-800">Help</span>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>YuzuOS Aero Active</span>
        </div>
      </div>

      {/* Inner Application Content Container */}
      <div className="flex-1 overflow-auto relative bg-slate-900/95 text-white">
        {windowState.component}
      </div>
    </div>
  );
};
