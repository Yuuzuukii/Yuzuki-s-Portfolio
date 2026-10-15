import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, ArrowUp, Folder, Github, ExternalLink, 
  Search, HardDrive, LayoutGrid, List, FileText, Cpu, Globe, 
  ChevronRight, RefreshCw, Disc, Shield, Download, X
} from 'lucide-react';
import { audio } from '../../../services/audioService';

interface Project {
  id: number;
  fileName: string;
  title: string;
  category: string;
  type: 'exe' | 'doc' | 'web';
  description: string;
  details: string[];
  tags: string[];
  github: string | null;
  demoUrl?: string | null;
  size: string;
  bytes: string;
  modified: string;
  version: string;
  author: string;
  iconBg: string;
}

const projects: Project[] = [
  {
    id: 1,
    fileName: "ShigaChat_Setup.exe",
    title: "ShigaChat (多言語対応Q&Aサービス)",
    category: "AI & RAG Applications",
    type: "exe",
    description: "滋賀県在住の外国人向け多言語対応地域情報Q&Aサービス。ChatGPTとRAG（検索拡張生成）を融合し、行政手続・防災・生活情報を正確かつ親しみやすく提供。",
    details: [
      "日本語、英語、ベトナム語、中国語、韓国語の5言語対応",
      "自治体情報や観光・生活ガイドラインを独自ベクトルDBにインデックス",
      "FastAPI + Reactによる低レイテンシ・高スループット対話パイプライン",
      "MySQLとPrisma ORMによる対話ログ・フィードバック追跡"
    ],
    tags: ["React", "Python", "FastAPI", "ChatGPT", "RAG", "MySQL"],
    github: "https://github.com/Yuuzuukii/ShigaChat",
    size: "18.4 MB",
    bytes: "19,293,798 bytes",
    modified: "2024-08-12 14:22",
    version: "1.2.0.4",
    author: "Masuo Yuzuki",
    iconBg: "from-amber-400 to-amber-600"
  },
  {
    id: 2,
    fileName: "YuzukiOS_Portfolio.exe",
    title: "YuzukiOS Web Operating System",
    category: "Web OS / Frontend & React",
    type: "exe",
    description: "ブラウザ上で完全動作するデュアルモードWebオペレーティングシステム。現代のWindows風UIと2000年代のFrutiger Aero（Windows Vista / 7 / XP）を瞬時に切り替え可能。",
    details: [
      "カスタムウィンドウマネージャー（ドラッグ、最小化、最大化、フォーカス管理）",
      "2000年代Frutiger Aeroのスキューモーフィズム・ガラス質感・音響の完全再現",
      "MSN Messenger風AIチャット、Task Manager風スキル診断、クラシックゲーム搭載",
      "Web Audio APIによるレトロシステム音・バブルポップ音のリアルタイム合成"
    ],
    tags: ["React 19", "TypeScript", "TailwindCSS", "Vite", "Web Audio"],
    github: "https://github.com/Yuuzuukii/portfolio",
    size: "8.2 MB",
    bytes: "8,598,322 bytes",
    modified: "2024-09-01 09:15",
    version: "2.0.0.6002",
    author: "Masuo Yuzuki",
    iconBg: "from-cyan-400 to-blue-600"
  },
  {
    id: 3,
    fileName: "MultiAgent_Dialogue_Protocol.doc",
    title: "LLMマルチエージェント対話プロトコルの研究",
    category: "Academic Research (SI Lab)",
    type: "doc",
    description: "立命館大学大学院情報理工学研究科 社会知能研究室（SI Lab）における修士研究。複数の自律型LLMエージェントが協調して異文化対話や合意形成を行うための通信プロトコル。",
    details: [
      "異文化コラボレーションにおける社会的コンセンサス形成モデルの構築",
      "エージェント間の認知バイアス緩和および発話ターン制御アルゴリズム",
      "定量的評価実験による人間同士の合意形成プロセスとの比較検証",
      "社会知能研究室（SI Lab）公式研究テーマとして進行中"
    ],
    tags: ["Python", "Multi-Agent System", "LLM", "NLP", "SI Lab Research"],
    github: null,
    size: "16.0 MB",
    bytes: "16,777,216 bytes",
    modified: "2024-10-04 18:30",
    version: "Draft 3.1",
    author: "Masuo Yuzuki (SI Lab)",
    iconBg: "from-emerald-400 to-green-600"
  },
];

export const FrutigerProjectsApp: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'tiles' | 'details'>('tiles');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showInspector, setShowInspector] = useState<boolean>(false);

  const filteredProjects = projects.filter(p => {
    const matchesCat = activeCategory === 'all' || 
      (activeCategory === 'ai' && (p.category.includes('AI') || p.category.includes('Research'))) ||
      (activeCategory === 'web' && p.category.includes('Web'));
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const selectedProject = projects.find(p => p.id === selectedId) || projects[0];

  const handleSelect = (id: number) => {
    audio.playClick();
    setSelectedId(id);
  };

  const handleDoubleClick = (id: number) => {
    audio.playWindowOpen();
    setSelectedId(id);
    setShowInspector(true);
  };

  return (
    <div className="h-full w-full bg-[#f1f5f9] text-slate-800 flex flex-col font-frutiger-ui select-none overflow-hidden text-xs">
      {/* 2000s Windows Vista Navigation Strip */}
      <div 
        className="flex items-center gap-1.5 p-1.5 border-b border-[#94a3b8] shrink-0"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        }}
      >
        {/* Glossy Aqua Back & Forward Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => audio.playClick()}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-transform active:scale-95 shadow-md border border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1]"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0284c7 60%, #0369a1 100%)',
            }}
            title="Back (Alt+Left Arrow)"
          >
            <ArrowLeft size={13} strokeWidth={3} />
          </button>

          <button
            disabled
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/50 cursor-not-allowed opacity-50 border border-slate-300"
            style={{
              background: 'linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%)',
            }}
            title="Forward"
          >
            <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Segmented Breadcrumb Address Bar */}
        <div className="flex-1 flex items-center bg-white px-2 py-1 border border-t-[#64748b] border-l-[#64748b] border-r-white border-b-white rounded-xs shadow-inner min-w-0">
          <HardDrive size={13} className="text-blue-700 mr-1.5 shrink-0" />
          <div className="flex items-center gap-1 text-[11px] text-slate-700 overflow-x-auto no-scrollbar font-medium truncate">
            <span className="hover:bg-blue-100 hover:text-blue-900 px-1 rounded-xs cursor-pointer">Computer</span>
            <ChevronRight size={11} className="text-slate-400" />
            <span className="hover:bg-blue-100 hover:text-blue-900 px-1 rounded-xs cursor-pointer">Local Disk (C:)</span>
            <ChevronRight size={11} className="text-slate-400" />
            <span className="hover:bg-blue-100 hover:text-blue-900 px-1 rounded-xs cursor-pointer">Users</span>
            <ChevronRight size={11} className="text-slate-400" />
            <span className="hover:bg-blue-100 hover:text-blue-900 px-1 rounded-xs cursor-pointer">Yuzuki</span>
            <ChevronRight size={11} className="text-slate-400" />
            <span className="font-bold text-blue-950 px-1 bg-sky-100 rounded-xs">Projects</span>
          </div>
          <button 
            onClick={() => audio.playClick()}
            className="ml-auto text-slate-400 hover:text-blue-700 p-0.5" 
            title="Refresh (F5)"
          >
            <RefreshCw size={11} />
          </button>
        </div>

        {/* Search Box */}
        <div className="w-44 hidden md:flex items-center bg-white px-2 py-1 border border-t-[#64748b] border-l-[#64748b] border-r-white border-b-white rounded-xs shadow-inner shrink-0">
          <Search size={12} className="text-slate-400 mr-1.5 shrink-0" />
          <input
            type="text"
            placeholder="Search Projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[11px] text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* 2000s Explorer Command Bar */}
      <div 
        className="px-2 py-1 flex items-center justify-between gap-2 border-b border-[#94a3b8] text-[11px] text-slate-800 shrink-0 select-none"
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
        }}
      >
        <div className="flex items-center gap-1">
          <button 
            onClick={() => audio.playClick()}
            className="px-2 py-0.5 rounded-xs hover:bg-white/60 transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Organize</span>
            <span className="text-[9px]">▼</span>
          </button>

          <div className="h-4 w-px bg-sky-400/60 mx-1" />

          <button
            onClick={() => {
              audio.playClick();
              setShowInspector(true);
            }}
            className="px-2 py-0.5 rounded-xs bg-white/50 hover:bg-white/80 transition-colors font-bold text-blue-950 flex items-center gap-1 cursor-pointer border border-sky-300"
          >
            <ExternalLink size={11} />
            <span>Open Details</span>
          </button>

          {selectedProject.github && (
            <a
              href={selectedProject.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audio.playClick()}
              className="px-2 py-0.5 rounded-xs bg-white/50 hover:bg-white/80 transition-colors font-medium text-slate-800 flex items-center gap-1 border border-sky-300"
            >
              <Github size={11} />
              <span>GitHub</span>
            </a>
          )}

          <button
            onClick={() => audio.playBubble()}
            className="hidden sm:flex px-2 py-0.5 rounded-xs hover:bg-white/60 transition-colors font-medium items-center gap-1 cursor-pointer text-slate-700"
            title="Burn to Disc"
          >
            <Disc size={11} className="text-purple-600" />
            <span>Burn to CD</span>
          </button>
        </div>

        {/* View Mode Toggle (Tiles vs Details) */}
        <div className="flex items-center gap-1 bg-white/40 p-0.5 rounded-xs border border-sky-300">
          <button
            onClick={() => {
              audio.playClick();
              setViewMode('tiles');
            }}
            className={`p-1 rounded-xs transition-colors cursor-pointer ${
              viewMode === 'tiles' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tiles / Icons View"
          >
            <LayoutGrid size={13} />
          </button>
          <button
            onClick={() => {
              audio.playClick();
              setViewMode('details');
            }}
            className={`p-1 rounded-xs transition-colors cursor-pointer ${
              viewMode === 'details' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Details List View"
          >
            <List size={13} />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Sidebar + File Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Windows Vista Navigation Sidebar */}
        <div 
          className="w-48 border-r border-[#94a3b8] flex flex-col justify-between hidden sm:flex shrink-0 select-none overflow-y-auto"
          style={{
            background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          <div className="p-2 space-y-3">
            {/* Favorite Links Group */}
            <div>
              <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider px-1 mb-1">
                Favorite Links
              </div>
              <div className="space-y-0.5 text-[11px]">
                <button
                  onClick={() => {
                    audio.playClick();
                    setActiveCategory('all');
                  }}
                  className={`w-full text-left px-2 py-1 rounded-xs flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Folder size={13} className={activeCategory === 'all' ? 'text-yellow-200' : 'text-amber-500 fill-amber-400'} />
                  <span>All Projects ({projects.length})</span>
                </button>

                <button
                  onClick={() => {
                    audio.playClick();
                    setActiveCategory('ai');
                  }}
                  className={`w-full text-left px-2 py-1 rounded-xs flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'ai'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Cpu size={13} className={activeCategory === 'ai' ? 'text-white' : 'text-indigo-600'} />
                  <span>AI & NLP Research</span>
                </button>

                <button
                  onClick={() => {
                    audio.playClick();
                    setActiveCategory('web');
                  }}
                  className={`w-full text-left px-2 py-1 rounded-xs flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'web'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Globe size={13} className={activeCategory === 'web' ? 'text-white' : 'text-emerald-600'} />
                  <span>Web & Frontend OS</span>
                </button>
              </div>
            </div>

            {/* Folders Tree */}
            <div>
              <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider px-1 mb-1">
                Folders
              </div>
              <div className="pl-1 space-y-1 text-[11px] text-slate-700 font-mono">
                <div className="flex items-center gap-1 text-slate-800 font-semibold">
                  <HardDrive size={12} className="text-blue-700" />
                  <span>Local Disk (C:)</span>
                </div>
                <div className="pl-3 space-y-0.5 text-[10px] text-slate-600">
                  <div>├─ Program Files</div>
                  <div>├─ Ritsumeikan_SI_Lab</div>
                  <div>└─ Portfolio_Projects</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left Details Preview Box */}
          <div className="p-2 border-t border-[#cbd5e1] bg-white/70 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Selected Item Details</div>
            <div className="font-bold text-blue-950 text-[11px] truncate">{selectedProject.fileName}</div>
            <div className="text-[10px] text-slate-600">Size: {selectedProject.size}</div>
            <div className="text-[10px] text-slate-600 truncate">Date: {selectedProject.modified}</div>
          </div>
        </div>

        {/* Main Explorer Viewport */}
        <div className="flex-1 bg-white p-3 overflow-y-auto">
          {/* TILES / ICONS VIEW */}
          {viewMode === 'tiles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProjects.map((project) => {
                const isSelected = selectedId === project.id;
                return (
                  <div
                    key={project.id}
                    onClick={() => handleSelect(project.id)}
                    onDoubleClick={() => handleDoubleClick(project.id)}
                    className={`p-3 rounded-xs border transition-all cursor-pointer flex flex-col justify-between group relative ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#e0f2fe] to-[#bae6fd] border-[#0284c7] shadow-[0_0_8px_rgba(2,132,199,0.3)]'
                        : 'bg-white hover:bg-sky-50/60 border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* 3D Skeuomorphic Executable/Document Icon */}
                      <div 
                        className={`w-12 h-12 rounded-sm p-1.5 flex flex-col items-center justify-center text-white shrink-0 shadow-md border-2 border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1] bg-gradient-to-br ${project.iconBg}`}
                      >
                        {project.type === 'exe' ? (
                          <>
                            <Cpu size={20} className="drop-shadow-xs" />
                            <span className="text-[7px] font-extrabold uppercase mt-0.5 tracking-tighter">EXE</span>
                          </>
                        ) : (
                          <>
                            <FileText size={20} className="drop-shadow-xs" />
                            <span className="text-[7px] font-extrabold uppercase mt-0.5 tracking-tighter">DOC</span>
                          </>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-900">
                          {project.fileName}
                        </h4>
                        <p className="text-[10px] text-blue-700 font-semibold truncate">
                          {project.category}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & Tag strip */}
                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{project.size}</span>
                      <span className="font-mono">{project.modified}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DETAILS LIST VIEW */}
          {viewMode === 'details' && (
            <table className="w-full border-collapse text-[11px] text-left">
              <thead>
                <tr className="bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] border-b border-slate-300 text-slate-700 select-none">
                  <th className="p-2 font-bold border-r border-slate-200">Name</th>
                  <th className="p-2 font-bold border-r border-slate-200">Date modified</th>
                  <th className="p-2 font-bold border-r border-slate-200">Type</th>
                  <th className="p-2 font-bold border-r border-slate-200 text-right">Size</th>
                  <th className="p-2 font-bold">Tech Stack</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const isSelected = selectedId === project.id;
                  return (
                    <tr
                      key={project.id}
                      onClick={() => handleSelect(project.id)}
                      onDoubleClick={() => handleDoubleClick(project.id)}
                      className={`border-b border-slate-100 cursor-pointer ${
                        isSelected
                          ? 'bg-[#e0f2fe] text-blue-950 font-semibold'
                          : 'hover:bg-sky-50 text-slate-700'
                      }`}
                    >
                      <td className="p-2 flex items-center gap-2">
                        <div 
                          className={`w-5 h-5 rounded-xs flex items-center justify-center text-white shrink-0 bg-gradient-to-br ${project.iconBg}`}
                        >
                          {project.type === 'exe' ? <Cpu size={12} /> : <FileText size={12} />}
                        </div>
                        <span className="font-bold">{project.fileName}</span>
                      </td>
                      <td className="p-2 font-mono text-[10px] text-slate-600">{project.modified}</td>
                      <td className="p-2 text-slate-600">{project.category}</td>
                      <td className="p-2 text-right font-mono text-[10px] text-slate-600">{project.size}</td>
                      <td className="p-2 text-slate-500 truncate max-w-xs">{project.tags.join(', ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PROJECT INSPECTOR MODAL (2000s Properties Dialog) */}
      {showInspector && (
        <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-center p-4 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-[#f1f5f9] border-3 border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95"
            style={{
              backgroundColor: '#7dd3fc',
            }}
          >
            {/* Modal Titlebar */}
            <div 
              className="h-7 px-2 flex items-center justify-between text-white font-bold text-xs"
              style={{
                background: 'linear-gradient(90deg, #000080 0%, #0055ea 50%, #0284c7 100%)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <Cpu size={14} />
                <span>{selectedProject.fileName} Properties</span>
              </div>
              <button
                onClick={() => {
                  audio.playClick();
                  setShowInspector(false);
                }}
                className="w-5 h-4.5 bg-[#cbd5e1] hover:bg-rose-500 hover:text-white text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-[#475569] border-b-[#475569] cursor-pointer"
                title="Close"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 bg-white m-1.5 border-2 border-t-[#64748b] border-l-[#64748b] border-r-white border-b-white space-y-3 max-h-[70vh] overflow-y-auto text-xs">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                <div 
                  className={`w-14 h-14 rounded-sm p-2 flex flex-col items-center justify-center text-white shrink-0 shadow-md border-2 border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1] bg-gradient-to-br ${selectedProject.iconBg}`}
                >
                  <Cpu size={24} />
                  <span className="text-[8px] font-extrabold uppercase mt-0.5">EXE</span>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-blue-950">{selectedProject.title}</h3>
                  <p className="text-[11px] text-blue-700 font-semibold">{selectedProject.category}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Version: {selectedProject.version}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Description:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2 border border-slate-200 rounded-xs">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Technical Highlights & Architecture:</span>
                <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-1 pl-1">
                  {selectedProject.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Tech Stack:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-sky-100 text-sky-900 border border-sky-300 rounded-xs text-[10px] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-0.5">
                <div>File Size: {selectedProject.bytes} ({selectedProject.size})</div>
                <div>Author: {selectedProject.author}</div>
                <div>Last Modified: {selectedProject.modified}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-3 py-2 bg-[#e2e8f0] flex justify-end gap-2 text-xs">
              {selectedProject.github && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-blue-900 shadow-xs flex items-center gap-1"
                >
                  <Github size={12} />
                  <span>View Repository</span>
                </a>
              )}
              <button
                onClick={() => setShowInspector(false)}
                className="px-5 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-slate-800 shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Windows Status Bar */}
      <div 
        className="px-3 py-1 border-t border-[#94a3b8] flex items-center justify-between text-[11px] text-slate-600 select-none shrink-0"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <span>{filteredProjects.length} items</span>
          <span>|</span>
          <span className="text-blue-900 font-semibold truncate">Selected: {selectedProject.fileName} ({selectedProject.size})</span>
        </div>

        <div className="flex items-center gap-2">
          <Shield size={12} className="text-emerald-600" />
          <span>Local intranet | Protected Mode: On</span>
        </div>
      </div>
    </div>
  );
};
