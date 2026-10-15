import React, { useState } from 'react';
import { audio } from '../../services/audioService';
import { MessageSquare, X } from 'lucide-react';

export const ClippyAssistant: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const tips = [
    "It looks like you're exploring Yuzuki Masuo's portfolio! Did you know he researches LLM Multi-Agent Dialogue Protocols at Ritsumeikan University?",
    "Need to see full-stack projects? Click the Manila Folder icon to check out ShigaChat with FastAPI, RAG, and MySQL!",
    "Looking for AI Chat? Click the MSN jelly buddies icon to talk with YuzuBot AI directly!",
    "Want to test his skills? Open the holographic CD/DVD disc to view the technical proficiency charts!",
    "Want to return to modern design? Click the '未来へ進む' button on the taskbar or login screen anytime!"
  ];

  const handleNextTip = () => {
    audio.playClick();
    setTipIndex((tipIndex + 1) % tips.length);
  };

  return (
    <div className="fixed bottom-16 right-8 z-30 select-none flex flex-col items-end gap-2 animate-in slide-in-from-bottom-2">
      {/* Speech Bubble */}
      {isOpen && (
        <div 
          className="w-64 p-3 rounded-xl shadow-xl border border-amber-300 relative text-slate-800 text-xs leading-relaxed"
          style={{
            background: 'linear-gradient(180deg, #fef9c3 0%, #fef08a 100%)',
          }}
        >
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-300/80 font-bold text-[11px] text-amber-900">
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              <span>Clippy's 2000s Tip</span>
            </span>
            <button
              onClick={() => { audio.playClick(); setIsOpen(false); }}
              className="text-amber-800 hover:text-black p-0.5 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>

          <p className="font-frutiger-ui">{tips[tipIndex]}</p>

          <div className="mt-2 pt-1 border-t border-amber-300/60 flex justify-between items-center text-[10px]">
            <span className="text-amber-800/80">{tipIndex + 1} of {tips.length}</span>
            <button
              onClick={handleNextTip}
              className="font-bold text-amber-900 hover:text-black underline cursor-pointer"
            >
              Next Tip &gt;&gt;
            </button>
          </div>

          {/* Speech bubble pointer arrow */}
          <div 
            className="absolute -bottom-2 right-6 w-3 h-3 rotate-45 border-r border-b border-amber-300"
            style={{ backgroundColor: '#fef08a' }}
          />
        </div>
      )}

      {/* Clippy Character Icon (Click to toggle speech) */}
      <button
        onClick={() => {
          audio.playClick();
          setIsOpen(!isOpen);
        }}
        className="relative cursor-pointer transition-transform hover:scale-110 active:scale-95 group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
        title="Clippy Assistant"
      >
        <svg viewBox="0 0 60 70" className="w-14 h-16">
          {/* Wire Paperclip Body */}
          <path
            d="M20 50 V18 C20 10 32 10 32 18 V46 C32 52 42 52 42 46 V22"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="5"
            strokeLinecap="round"
            filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.4))"
          />
          {/* Metallic Inner Highlight */}
          <path
            d="M20 50 V18 C20 10 32 10 32 18 V46 C32 52 42 52 42 46 V22"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Googly Eyes */}
          {/* Left Eye */}
          <ellipse cx="26" cy="24" rx="4.5" ry="6" fill="#ffffff" stroke="#475569" strokeWidth="1" />
          <circle cx="27" cy="24" r="2.5" fill="#0f172a" />
          <circle cx="28" cy="23" r="0.8" fill="#ffffff" />
          {/* Eyebrows */}
          <path d="M22 17 Q26 14 29 17" stroke="#334155" strokeWidth="1.2" fill="none" />

          {/* Right Eye */}
          <ellipse cx="36" cy="24" rx="4.5" ry="6" fill="#ffffff" stroke="#475569" strokeWidth="1" />
          <circle cx="37" cy="24" r="2.5" fill="#0f172a" />
          <circle cx="38" cy="23" r="0.8" fill="#ffffff" />
          {/* Eyebrows */}
          <path d="M33 17 Q37 14 41 17" stroke="#334155" strokeWidth="1.2" fill="none" />
        </svg>
      </button>
    </div>
  );
};
