import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, AppWindow } from 'lucide-react';
import { WindowState } from '../types';

interface WindowFrameProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, pos: { x: number; y: number }) => void;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  windowState,
  onClose,
  onMinimize,
  onFocus,
  onUpdatePosition
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (windowState.isMaximized) return;
    onFocus(windowState.id);
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
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
      className="absolute flex flex-col bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden transition-shadow duration-200"
      style={{
        ...style,
        zIndex: windowState.zIndex,
        boxShadow: isDragging ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : undefined
      }}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-white/5 flex items-center justify-between px-3 cursor-default select-none border-b border-white/5"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="text-white/70 w-4 h-4">{windowState.icon}</div>
          <span className="text-sm font-medium text-white/90">{windowState.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md text-white/70 transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            className="p-1.5 hover:bg-white/10 rounded-md text-white/70 transition-colors cursor-not-allowed opacity-50"
            title="Maximize not implemented in this demo"
          >
            <Square size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            className="p-1.5 hover:bg-red-500 hover:text-white rounded-md text-white/70 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content Content */}
      <div className="flex-1 overflow-auto relative text-white">
        {windowState.component}
      </div>
    </div>
  );
};
