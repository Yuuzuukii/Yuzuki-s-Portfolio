import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Initializing BIOS...");

  useEffect(() => {
    const texts = [
        "Initializing BIOS...",
        "Loading Kernel...",
        "Mounting File System...",
        "Starting YuzuOS...",
        "Ready."
    ];
    
    let step = 0;
    const interval = setInterval(() => {
        setProgress(old => {
            const next = old + Math.random() * 15;
            if (next > 100) return 100;
            return next;
        });

        if (progress > step * 20 && step < texts.length) {
            setText(texts[step]);
            step++;
        }
    }, 200);

    const timeout = setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(onComplete, 500);
    }, 2500);

    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, []); // eslint-disable-line

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-[100] font-mono">
      <div className="mb-8">
        <Cpu size={64} className="text-blue-500 animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold mb-8 tracking-widest">YUZU<span className="text-blue-500">OS</span></h1>
      
      <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div 
            className="h-full bg-blue-500 transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-xs text-zinc-500 animate-pulse">{text}</p>
      
      <div className="absolute bottom-4 left-4 text-[10px] text-zinc-700">
        Version 1.0.0-release | Memory: 16GB OK
      </div>
    </div>
  );
};
