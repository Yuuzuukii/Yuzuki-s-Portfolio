import React from 'react';
import { AppConfig } from '../../types';
import { audio } from '../../services/audioService';

interface FrutigerDesktopIconsV2Props {
  apps: AppConfig[];
  onAppClick: (id: string) => void;
}

// 1. About Me: Glossy Royal Blue Info Sphere with Silver Rim (Image 1 row 4 col 2)
const InfoSphereIcon: React.FC = () => (
  <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-110 group-active:scale-95">
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <defs>
        {/* Outer Silver Rim Gradient */}
        <linearGradient id="silver-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#cbd5e1" />
          <stop offset="65%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        {/* Deep Royal Blue Sphere Gradient */}
        <radialGradient id="blue-sphere" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="30%" stopColor="#2563eb" />
          <stop offset="70%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
        {/* Specular curved dome highlight */}
        <linearGradient id="dome-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Silver Outer Ring */}
      <circle cx="32" cy="32" r="30" fill="url(#silver-rim)" />
      {/* Inner Rim Shadow */}
      <circle cx="32" cy="32" r="26.5" fill="#0f172a" opacity="0.3" />
      {/* Blue Sphere Core */}
      <circle cx="32" cy="32" r="25" fill="url(#blue-sphere)" />

      {/* Top Specular Glint */}
      <ellipse cx="32" cy="18" rx="16" ry="8" fill="url(#dome-highlight)" />

      {/* Lower Rim Reflection */}
      <path d="M16 42 Q32 52 48 42" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />

      {/* Embossed Bold Lowercase 'i' */}
      {/* Dot */}
      <circle cx="32" cy="21" r="3" fill="#ffffff" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.5))" />
      {/* Stem */}
      <path d="M29 28 H34 V44 H31 Z" fill="#ffffff" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.5))" />
    </svg>
  </div>
);

// 2. Projects: 3D Yellow Manila Folder with Protruding Film Strip (Image 1 row 1 col 1)
const ManilaFolderIcon: React.FC = () => (
  <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.38)] transition-transform group-hover:scale-110 group-active:scale-95">
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <defs>
        <linearGradient id="folder-back" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="folder-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="30%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="film-strip" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Folder Back with Tab */}
      <path d="M6 16 C6 14 7 13 9 13 H24 L29 18 H55 C57 18 58 19 58 21 V48 C58 50 57 51 55 51 H9 C7 51 6 50 6 48 Z" fill="url(#folder-back)" stroke="#ca8a04" strokeWidth="0.8" />

      {/* Protruding Film Strip / Project Slides popping out */}
      <g transform="rotate(-6 32 30)">
        <rect x="20" y="8" width="24" height="34" rx="2" fill="url(#film-strip)" stroke="#475569" strokeWidth="0.8" />
        {/* Film sprocket holes */}
        <rect x="22" y="11" width="2" height="3" fill="#ffffff" />
        <rect x="22" y="17" width="2" height="3" fill="#ffffff" />
        <rect x="22" y="23" width="2" height="3" fill="#ffffff" />
        <rect x="40" y="11" width="2" height="3" fill="#ffffff" />
        <rect x="40" y="17" width="2" height="3" fill="#ffffff" />
        <rect x="40" y="23" width="2" height="3" fill="#ffffff" />
        {/* Photo Slide Inside Film */}
        <rect x="26" y="12" width="12" height="15" rx="1" fill="#38bdf8" />
        <circle cx="32" cy="18" r="3.5" fill="#f59e0b" />
      </g>

      {/* 3D Open Folder Front Flap */}
      <path d="M4 27 L8 53 C8 55 10 56 12 56 H54 C56 56 58 55 58 53 L62 27 C62 25 60 24 58 24 H8 C6 24 4 25 4 27 Z" fill="url(#folder-front)" stroke="#a16207" strokeWidth="0.8" />

      {/* Glossy sheen on front flap */}
      <path d="M6 27 H60 L57 38 H9 Z" fill="rgba(255,255,255,0.4)" />
    </svg>
  </div>
);

// 3. Skills: Holographic CD/DVD Disc with Rainbow Iridescence (Image 1 row 1 col 4)
const HolographicDiscIcon: React.FC = () => (
  <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.38)] transition-transform group-hover:scale-110 group-active:scale-95">
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <defs>
        {/* Disc Metallic Aluminum Gradient */}
        <linearGradient id="disc-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="30%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        {/* Rainbow Iridescent Shimmer */}
        <linearGradient id="rainbow-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="10%" stopColor="#f43f5e" stopOpacity="0.4" />
          <stop offset="30%" stopColor="#eab308" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="90%" stopColor="#a855f7" stopOpacity="0.5" />
        </linearGradient>
        {/* 3D Blue Music Note */}
        <linearGradient id="blue-note" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Main Disc Body */}
      <circle cx="32" cy="32" r="28" fill="url(#disc-metal)" stroke="#94a3b8" strokeWidth="0.8" />
      {/* Rainbow Sheen Overlay */}
      <circle cx="32" cy="32" r="28" fill="url(#rainbow-sheen)" />

      {/* Disc Data Ring Grooves */}
      <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" fill="none" />
      <circle cx="32" cy="32" r="15" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" fill="none" />

      {/* Inner Clear Plastic Ring */}
      <circle cx="32" cy="32" r="10" fill="rgba(255,255,255,0.85)" stroke="#cbd5e1" strokeWidth="0.8" />
      {/* Spindle Hole */}
      <circle cx="32" cy="32" r="4.5" fill="#38bdf8" opacity="0.3" />
      <circle cx="32" cy="32" r="4" fill="#0f172a" />

      {/* Attached 3D Blue Musical Note / Skills Crest */}
      <g transform="translate(14, -2)">
        <path d="M28 14 C28 10 32 8 36 6 V24 C34 22 30 22 28 24 C26 26 26 29 28 31 C30 33 34 32 36 29 V14 Z" fill="url(#blue-note)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))" />
      </g>
    </svg>
  </div>
);

// 4. Terminal: Retro CRT/LCD Desktop Computer Monitor (Image 1 row 3 col 1 / row 5 col 1)
const ComputerMonitorIcon: React.FC = () => (
  <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.38)] transition-transform group-hover:scale-110 group-active:scale-95">
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <defs>
        <linearGradient id="monitor-frame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#e2e8f0" />
          <stop offset="80%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <radialGradient id="screen-glow" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="45%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>

      {/* Monitor Pedestal Base */}
      <ellipse cx="32" cy="56" rx="14" ry="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
      <ellipse cx="32" cy="55" rx="11" ry="2.5" fill="#f8fafc" />
      {/* Stand Neck */}
      <path d="M28 44 H36 L34 54 H30 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8" />

      {/* Monitor Bevel Enclosure */}
      <rect x="8" y="10" width="48" height="36" rx="4" fill="url(#monitor-frame)" stroke="#475569" strokeWidth="1" />
      {/* Inner Screen Bevel Inset */}
      <rect x="12" y="14" width="40" height="28" rx="2" fill="#0f172a" />
      {/* Glowing CRT Screen */}
      <rect x="13" y="15" width="38" height="26" rx="1.5" fill="url(#screen-glow)" />

      {/* Terminal prompt lines on screen */}
      <path d="M16 20 L20 23 L16 26" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="23" y1="23" x2="32" y2="23" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="30" x2="42" y2="30" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <line x1="16" y1="34" x2="36" y2="34" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

      {/* Glass Screen Reflection Sheen */}
      <path d="M13 15 L42 15 L13 36 Z" fill="rgba(255,255,255,0.25)" />
      {/* Power LED */}
      <circle cx="32" cy="42" r="1" fill="#4ade80" filter="drop-shadow(0 0 2px #4ade80)" />
    </svg>
  </div>
);

// 5. YuzuBot AI: Iconic MSN Messenger Jelly Bubble Buddies (Image 1 row 4 col 3)
const MsnBuddiesIcon: React.FC = () => (
  <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.38)] transition-transform group-hover:scale-110 group-active:scale-95">
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <defs>
        {/* Blue Buddy Jelly Gradient */}
        <radialGradient id="blue-jelly" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="30%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
        {/* Green Buddy Jelly Gradient */}
        <radialGradient id="green-jelly" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="30%" stopColor="#4ade80" />
          <stop offset="70%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </radialGradient>
      </defs>

      {/* Back Buddy (Blue) */}
      <g transform="translate(6, 4)">
        {/* Body */}
        <path d="M12 28 C6 28 2 34 2 44 H26 C26 34 22 28 16 28 Z" fill="url(#blue-jelly)" stroke="#0284c7" strokeWidth="0.8" />
        {/* Head */}
        <circle cx="14" cy="18" r="8" fill="url(#blue-jelly)" stroke="#0284c7" strokeWidth="0.8" />
        {/* Specular Glint */}
        <ellipse cx="12" cy="14" rx="4" ry="2" fill="#ffffff" opacity="0.8" />
      </g>

      {/* Front Buddy (Green, overlapping) */}
      <g transform="translate(20, 10)">
        {/* Body */}
        <path d="M15 28 C7 28 2 34 2 46 H32 C32 34 27 28 19 28 Z" fill="url(#green-jelly)" stroke="#16a34a" strokeWidth="0.8" />
        {/* Head */}
        <circle cx="17" cy="17" r="9.5" fill="url(#green-jelly)" stroke="#16a34a" strokeWidth="0.8" />
        {/* Specular Glint */}
        <ellipse cx="14" cy="12.5" rx="5" ry="2.5" fill="#ffffff" opacity="0.85" />
      </g>
    </svg>
  </div>
);

// 6. Pinball 3D: High-gloss 3D Chrome Pinball with Red Neon Arcade Bumper Ring
const PinballSphereIcon: React.FC = () => (
  <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(220,38,38,0.45)] transition-transform group-hover:scale-110 group-active:scale-95">
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <defs>
        {/* Steel Chrome Ball Radial Gradient */}
        <radialGradient id="pinball-chrome" cx="30%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#f1f5f9" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="85%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        {/* Crimson Neon Ring Gradient */}
        <linearGradient id="neon-bumper-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d6d" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <radialGradient id="red-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Red Neon Back Glow */}
      <circle cx="32" cy="32" r="28" fill="url(#red-core-glow)" />

      {/* Outer Slanted Pinball Bumper Ring */}
      <ellipse cx="32" cy="36" rx="26" ry="14" fill="none" stroke="url(#neon-bumper-ring)" strokeWidth="4" />
      <ellipse cx="32" cy="36" rx="26" ry="14" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

      {/* 3D Chrome Pinball Center Sphere */}
      <circle cx="32" cy="30" r="19" fill="url(#pinball-chrome)" stroke="#64748b" strokeWidth="0.8" />

      {/* Red Laser Arc Reflection on the steel surface */}
      <path d="M22 36 A 14 14 0 0 0 42 36" fill="none" stroke="#ef4444" strokeWidth="2.5" opacity="0.85" />
      <path d="M24 35 A 12 12 0 0 0 40 35" fill="none" stroke="#ff8da1" strokeWidth="1" opacity="0.9" />

      {/* Specular White Glint (Double highlight for 2000s skeuomorphism) */}
      <ellipse cx="26" cy="22" rx="7" ry="3.8" fill="#ffffff" opacity="0.9" transform="rotate(-25 26 22)" />
      <circle cx="21" cy="27" r="1.8" fill="#ffffff" opacity="0.7" />
    </svg>
  </div>
);

// Map app id to the distinct unboxed 3D icons from Image 1
const ICON_COMPONENTS: Record<string, React.FC> = {
  about: InfoSphereIcon,
  projects: ManilaFolderIcon,
  skills: HolographicDiscIcon,
  terminal: ComputerMonitorIcon,
  ai_chat: MsnBuddiesIcon,
  snake: PinballSphereIcon,
};

export const FrutigerDesktopIconsV2: React.FC<FrutigerDesktopIconsV2Props> = ({ apps, onAppClick }) => {
  const handleClick = (id: string) => {
    audio.playClick();
    onAppClick(id);
  };

  return (
    <div className="absolute top-6 left-6 p-2 h-[calc(100%-80px)] flex flex-col flex-wrap content-start gap-7 z-10 select-none font-frutiger-ui">
      {apps.map((app) => {
        const Icon3D = ICON_COMPONENTS[app.id] || InfoSphereIcon;
        return (
          <button
            key={app.id}
            onClick={() => handleClick(app.id)}
            className="w-24 flex flex-col items-center gap-1.5 p-1 rounded-lg group transition-all duration-150 outline-none cursor-pointer"
          >
            {/* Direct unboxed 3D pushable icon */}
            <div className="relative">
              <Icon3D />
            </div>

            {/* Label with white text & dark outline shadow underneath */}
            <span 
              className="text-xs font-bold text-white text-center tracking-tight line-clamp-2 px-2 py-0.5 rounded transition-all group-hover:bg-blue-600/80 group-hover:border group-hover:border-white/50"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.8), 0 0 2px #000000',
              }}
            >
              {app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};
