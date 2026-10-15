import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Sparkles, X } from 'lucide-react';
import { audio } from '../../services/audioService';

export const FrutigerCyberPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [elapsed, setElapsed] = useState(24);
  const [isMinimized, setIsMinimized] = useState(false);

  const playlist = [
    { title: "Walls to Build", artist: "Kilo", duration: "3:37" },
    { title: "ShigaChat RAG Beats", artist: "Yuzuki Masuo", duration: "2:45" },
    { title: "Multi-Agent Ambient", artist: "SI Lab Ritsumeikan", duration: "4:12" },
    { title: "Aqua Daylight 2004", artist: "Frutiger Aero", duration: "3:18" }
  ];

  const currentTrack = playlist[trackIndex];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsed(e => (e + 1) % 240);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    audio.playClick();
    if (!isPlaying) {
      audio.playTimeWarp();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    audio.playClick();
    setTrackIndex((trackIndex + 1) % playlist.length);
    setElapsed(0);
    if (isPlaying) audio.playWindowOpen();
  };

  const prevTrack = () => {
    audio.playClick();
    setTrackIndex((trackIndex - 1 + playlist.length) % playlist.length);
    setElapsed(0);
    if (isPlaying) audio.playWindowOpen();
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => { audio.playClick(); setIsMinimized(false); }}
        className="fixed top-24 right-6 z-20 p-2.5 rounded-2xl aero-button shadow-xl flex items-center gap-2 cursor-pointer text-sky-950 font-bold text-xs"
        title="Open Cyber MP3 Player"
      >
        <Sparkles size={16} className="text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
        <span>Cyber MP3 Player</span>
      </button>
    );
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed top-24 right-6 z-20 select-none animate-in fade-in duration-300">
      {/* 2000s Handheld Cyber MP3 Device (Directly from Image 2) */}
      <div 
        className="w-56 p-3 rounded-[2rem] relative shadow-[0_16px_36px_rgba(2,60,110,0.5),0_0_20px_rgba(56,189,248,0.4)] border-2 border-white/90"
        style={{
          background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 40%, #0f172a 100%)',
        }}
      >
        {/* Device Top Chrome Rim with Minimize Button */}
        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-sky-400/40">
          <div className="flex items-center gap-1 text-[10px] font-bold text-sky-100 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
            <span>CYBER AUDIO PMP</span>
          </div>
          <button
            onClick={() => { audio.playClick(); setIsMinimized(true); }}
            className="text-sky-200 hover:text-white p-0.5 cursor-pointer"
            title="Minimize"
          >
            <X size={12} />
          </button>
        </div>

        {/* Backlit Cyan LCD Display */}
        <div 
          className="mt-2 p-2 rounded-xl border border-cyan-400/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #083344 0%, #0e7490 50%, #155e75 100%)',
          }}
        >
          {/* LCD scanline grid effect */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '100% 3px' }} />

          <div className="relative z-10 font-mono">
            <div className="flex items-center justify-between text-[9px] text-cyan-300 border-b border-cyan-500/30 pb-0.5">
              <span>TRK {trackIndex + 1}/{playlist.length}</span>
              <span className="flex items-center gap-1">
                {isPlaying && <span className="animate-pulse text-emerald-400 font-bold">PLAY</span>}
                {!isPlaying && <span className="text-cyan-400/60 font-bold">PAUSE</span>}
              </span>
            </div>

            <div className="my-1.5">
              <p className="text-xs font-bold text-white truncate tracking-tight">{currentTrack.title}</p>
              <p className="text-[10px] text-cyan-200 truncate">{currentTrack.artist}</p>
            </div>

            {/* Visualizer audio bars */}
            <div className="flex items-end gap-1 h-4 pt-1">
              {[40, 70, 95, 60, 85, 50, 100, 75, 45, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-400 rounded-t-xs transition-all duration-150"
                  style={{
                    height: isPlaying ? `${(h * ((elapsed + i) % 5 + 1)) / 5}%` : '20%',
                    opacity: isPlaying ? 0.9 : 0.3,
                  }}
                />
              ))}
            </div>

            <div className="flex justify-between text-[9px] text-cyan-300 pt-1">
              <span>{formatTime(elapsed)}</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>
        </div>

        {/* 2000s Jog Dial & Physical Control Buttons */}
        <div className="mt-3 flex flex-col items-center">
          {/* Circular Jog Wheel */}
          <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-b from-slate-200 via-sky-300 to-sky-700 shadow-md border border-white flex items-center justify-center">
            {/* Center Play/Pause button */}
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-b from-white via-cyan-100 to-cyan-400 border border-white flex items-center justify-center text-sky-900 shadow-inner hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>

            {/* Prev Track button on left */}
            <button
              onClick={prevTrack}
              className="absolute left-1.5 text-sky-900 hover:text-white transition-colors cursor-pointer"
              title="Previous Track"
            >
              <SkipBack size={13} fill="currentColor" />
            </button>

            {/* Next Track button on right */}
            <button
              onClick={nextTrack}
              className="absolute right-1.5 text-sky-900 hover:text-white transition-colors cursor-pointer"
              title="Next Track"
            >
              <SkipForward size={13} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
