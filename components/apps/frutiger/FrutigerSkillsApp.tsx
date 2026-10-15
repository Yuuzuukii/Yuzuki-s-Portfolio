import React, { useState, useEffect } from 'react';
import { 
  Activity, Cpu, HardDrive, ShieldCheck, CheckCircle2, AlertTriangle, 
  Layers, RefreshCw, BarChart3, Database, Globe, Terminal, Sparkles
} from 'lucide-react';
import { audio } from '../../../services/audioService';

interface SkillProcess {
  pid: number;
  name: string;
  category: string;
  cpu: number;
  memory: string;
  score: number;
  description: string;
  status: 'Running' | 'Active' | 'Optimized';
}

const PROCESS_LIST: SkillProcess[] = [
  { pid: 1042, name: 'typescript.exe', category: 'Language', cpu: 28, memory: '184,200 K', score: 5.9, description: 'Type-safe frontend logic & static analysis engine', status: 'Running' },
  { pid: 1420, name: 'python_ai.exe', category: 'AI & Backend', cpu: 34, memory: '246,180 K', score: 5.9, description: 'Multi-Agent dialogue protocol & NLP coordination', status: 'Running' },
  { pid: 2012, name: 'react19_vdom.dll', category: 'Framework', cpu: 18, memory: '152,400 K', score: 5.9, description: 'Concurrent React 19 rendering & UI component tree', status: 'Running' },
  { pid: 2480, name: 'fastapi_service.exe', category: 'Backend', cpu: 12, memory: '98,340 K', score: 5.8, description: 'Asynchronous RESTful microservice & endpoints', status: 'Running' },
  { pid: 3108, name: 'grpc_stream.sys', category: 'Protocol', cpu: 8, memory: '64,120 K', score: 5.7, description: 'High-throughput binary RPC communication channel', status: 'Running' },
  { pid: 3840, name: 'docker_daemon.exe', category: 'DevOps', cpu: 6, memory: '112,800 K', score: 5.8, description: 'Container runtime isolation & cluster deployment', status: 'Running' },
  { pid: 4210, name: 'mysql_storage.exe', category: 'Database', cpu: 5, memory: '89,450 K', score: 5.7, description: 'Relational data persistence & transactional integrity', status: 'Running' },
  { pid: 5120, name: 'frutiger_aero.scr', category: 'Graphics UI', cpu: 15, memory: '134,600 K', score: 5.8, description: 'Skeuomorphic glass shaders & Web Audio synthesizers', status: 'Optimized' },
];

export const FrutigerSkillsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wei' | 'taskmgr' | 'specs'>('wei');
  const [ticker, setTicker] = useState(0);
  const [processes, setProcesses] = useState<SkillProcess[]>(PROCESS_LIST);
  const [selectedPid, setSelectedPid] = useState<number>(1042);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(t => (t + 1) % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tab: any) => {
    audio.playClick();
    setActiveTab(tab);
  };

  const handleEndProcess = () => {
    audio.playClick();
    setShowWarningModal(true);
  };

  return (
    <div className="h-full w-full bg-[#f1f5f9] text-slate-800 flex flex-col font-frutiger-ui select-none overflow-hidden text-xs">
      {/* 2000s Classic Vista Tab Bar */}
      <div 
        className="flex items-end gap-1 px-3 pt-2 border-b border-[#94a3b8] shrink-0"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        }}
      >
        {[
          { id: 'wei', label: 'Performance Rating (WEI)' },
          { id: 'taskmgr', label: 'Windows Task Manager' },
          { id: 'specs', label: 'Hardware Architecture' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1.5 rounded-t-sm font-semibold transition-all relative cursor-pointer text-[11px] whitespace-nowrap ${
                isActive
                  ? 'bg-white text-blue-900 border-t-2 border-l-2 border-r-2 border-t-[#0284c7] border-l-[#0284c7] border-r-[#64748b] shadow-xs -mb-px z-10 font-bold'
                  : 'bg-[#cbd5e1] hover:bg-[#e2e8f0] text-slate-700 border-t border-l border-r border-[#94a3b8]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3 bg-white m-2 border-2 border-t-[#64748b] border-l-[#64748b] border-r-white border-b-white shadow-inner">
        {/* TAB 1: WINDOWS EXPERIENCE INDEX (WEI) & CANDY PROGRESS BARS */}
        {activeTab === 'wei' && (
          <div className="space-y-4">
            {/* Top Windows Vista Experience Index Header */}
            <div className="p-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-sm flex items-start gap-4 shadow-xs">
              <div 
                className="w-16 h-16 rounded-sm flex flex-col items-center justify-center text-white font-extrabold shadow-md border-2 border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1] shrink-0"
                style={{
                  background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 45%, #0369a1 100%)',
                }}
              >
                <span className="text-2xl leading-none">5.9</span>
                <span className="text-[9px] uppercase tracking-wider opacity-90">Rating</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-blue-950">Technical Capability Evaluation</h3>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Subscores evaluate practical engineering competencies across algorithms, multi-agent artificial intelligence, frontend reactive architectures, and distributed microservices.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-emerald-800 font-semibold">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>All components meet or exceed Windows Aero Premium requirements.</span>
                </div>
              </div>
            </div>

            {/* Skill Bars with 2000s Green Glossy Candy Progress Bars */}
            <div className="space-y-3">
              {[
                { name: 'TypeScript & JavaScript', cat: 'Frontend Architecture', score: '5.9', percent: 95 },
                { name: 'Python & LLM Multi-Agent Protocol', cat: 'SI Lab AI Research', score: '5.9', percent: 92 },
                { name: 'React 19 & Next.js', cat: 'Modern Component Systems', score: '5.9', percent: 94 },
                { name: 'FastAPI & REST Web Services', cat: 'Backend Microservices', score: '5.8', percent: 88 },
                { name: 'gRPC & Protocol Buffers', cat: 'High-Throughput IPC', score: '5.7', percent: 82 },
                { name: 'Docker & Container Deployment', cat: 'Cloud & Infrastructure', score: '5.8', percent: 85 },
                { name: 'MySQL & Prisma ORM', cat: 'Relational Database Engine', score: '5.7', percent: 80 },
              ].map((skill, idx) => (
                <div key={idx} className="p-2 border border-slate-200 rounded-sm hover:border-sky-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-800">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{skill.cat}</span>
                      <span className="font-extrabold text-blue-900 px-1.5 py-0.2 bg-sky-100 rounded border border-sky-300 text-[10px]">
                        {skill.score}
                      </span>
                    </div>
                  </div>

                  {/* Authentic 2000s Windows XP/Vista Candy Segmented Green Progress Bar */}
                  <div 
                    className="h-4 w-full bg-slate-200 rounded-xs border border-t-[#64748b] border-l-[#64748b] border-r-white border-b-white p-0.5 overflow-hidden shadow-inner relative"
                  >
                    <div 
                      className="h-full rounded-xs transition-all duration-500 relative overflow-hidden"
                      style={{
                        width: `${skill.percent}%`,
                        background: 'linear-gradient(180deg, #bbf7d0 0%, #4ade80 40%, #22c55e 50%, #15803d 100%)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 0 6px rgba(34,197,94,0.4)',
                      }}
                    >
                      {/* Segment Lines Pattern */}
                      <div 
                        className="absolute inset-0 opacity-40 pointer-events-none"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 12px)',
                        }}
                      />
                      {/* High Gloss Reflection Strip */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 100%)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: WINDOWS TASK MANAGER */}
        {activeTab === 'taskmgr' && (
          <div className="space-y-4">
            {/* Top Oscilloscope / CPU Usage Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* CPU Usage History */}
              <fieldset className="border border-slate-300 p-2.5 rounded-xs">
                <legend className="px-1.5 font-bold text-blue-900 flex items-center gap-1 text-[11px]">
                  <Activity size={12} className="text-emerald-600" />
                  <span>CPU Usage History (Multi-Agent Threads)</span>
                </legend>

                {/* Task Manager Neon Green Oscilloscope */}
                <div 
                  className="h-28 w-full bg-black rounded-xs border border-t-[#333] border-l-[#333] border-r-[#666] border-b-[#666] p-2 relative overflow-hidden flex items-end justify-between"
                  style={{
                    backgroundImage: 'linear-gradient(#052e16 1px, transparent 1px), linear-gradient(90deg, #052e16 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                  }}
                >
                  {[55, 65, 60, 78, 85, 72, 88, 92, 80, 89, 94, 87, 96, 91, 95].map((val, i) => (
                    <div
                      key={i}
                      className="w-2.5 bg-emerald-500 rounded-t-xs transition-all duration-300 shadow-[0_0_8px_#22c55e]"
                      style={{
                        height: `${Math.min(100, val + ((ticker + i) % 4) * 2)}%`,
                      }}
                    />
                  ))}
                  <div className="absolute top-1.5 right-2 font-mono text-[10px] text-emerald-400 font-bold bg-black/60 px-1 border border-emerald-900">
                    CPU: {82 + (ticker % 10)}%
                  </div>
                </div>
              </fieldset>

              {/* Memory Usage History */}
              <fieldset className="border border-slate-300 p-2.5 rounded-xs">
                <legend className="px-1.5 font-bold text-blue-900 flex items-center gap-1 text-[11px]">
                  <HardDrive size={12} className="text-amber-600" />
                  <span>Physical Memory History (RAM Allocator)</span>
                </legend>

                <div 
                  className="h-28 w-full bg-black rounded-xs border border-t-[#333] border-l-[#333] border-r-[#666] border-b-[#666] p-2 relative overflow-hidden flex items-end justify-between"
                  style={{
                    backgroundImage: 'linear-gradient(#422006 1px, transparent 1px), linear-gradient(90deg, #422006 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                  }}
                >
                  {[60, 62, 65, 68, 70, 72, 75, 74, 76, 78, 77, 80, 82, 81, 83].map((val, i) => (
                    <div
                      key={i}
                      className="w-2.5 bg-amber-400 rounded-t-xs transition-all duration-300 shadow-[0_0_8px_#f59e0b]"
                      style={{
                        height: `${val}%`,
                      }}
                    />
                  ))}
                  <div className="absolute top-1.5 right-2 font-mono text-[10px] text-amber-400 font-bold bg-black/60 px-1 border border-amber-900">
                    RAM: 1.42 GB / 2.00 GB
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Active Processes Table */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-[11px]">
                <span className="font-bold text-slate-700">Active Task Processes:</span>
                <span className="text-[10px] text-slate-500 font-mono">Processes: {processes.length} | Threads: 148</span>
              </div>

              <div className="border border-slate-300 rounded-xs overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-[10px] text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] border-b border-slate-300 text-slate-700 select-none">
                      <th className="p-1.5 font-bold border-r border-slate-200">Image Name</th>
                      <th className="p-1.5 font-bold border-r border-slate-200 text-right">PID</th>
                      <th className="p-1.5 font-bold border-r border-slate-200">Category</th>
                      <th className="p-1.5 font-bold border-r border-slate-200 text-right">CPU</th>
                      <th className="p-1.5 font-bold border-r border-slate-200 text-right">Mem Usage</th>
                      <th className="p-1.5 font-bold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((proc) => {
                      const isSelected = selectedPid === proc.pid;
                      return (
                        <tr
                          key={proc.pid}
                          onClick={() => {
                            audio.playClick();
                            setSelectedPid(proc.pid);
                          }}
                          className={`border-b border-slate-100 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-sky-50 text-slate-700'
                          }`}
                        >
                          <td className="p-1.5 font-mono">{proc.name}</td>
                          <td className="p-1.5 text-right font-mono">{proc.pid}</td>
                          <td className="p-1.5">{proc.category}</td>
                          <td className="p-1.5 text-right font-mono">{proc.cpu}%</td>
                          <td className="p-1.5 text-right font-mono">{proc.memory}</td>
                          <td className="p-1.5 truncate max-w-xs">{proc.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Task Manager Bottom Control Bar */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[11px]">
                <div className="text-[10px] text-slate-500 font-mono">
                  Selected PID: {selectedPid}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      audio.playClick();
                      setTicker(t => t + 1);
                    }}
                    className="px-3 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-slate-800 shadow-xs cursor-pointer active:translate-y-px"
                  >
                    Refresh Now
                  </button>
                  <button
                    onClick={handleEndProcess}
                    className="px-3 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-rose-700 shadow-xs cursor-pointer active:translate-y-px"
                  >
                    End Process
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HARDWARE ARCHITECTURE & SPECS */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <fieldset className="border border-slate-300 p-3 rounded-xs">
              <legend className="px-1.5 font-bold text-blue-900 text-xs">Workstation Topology</legend>
              <table className="w-full text-[11px] text-slate-700">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500 w-36">Host Architecture:</td>
                    <td className="py-1.5 font-mono text-slate-900">Ritsumeikan SI-Lab Multi-Node Agent Cluster</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500">Virtual Machine:</td>
                    <td className="py-1.5 text-slate-900">YuzuOS 64-bit Aero Hypervisor</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500">Primary Core:</td>
                    <td className="py-1.5 text-slate-900">TypeScript 5.8 / React 19 Frontend Renderer</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500">Inference Engine:</td>
                    <td className="py-1.5 text-slate-900">Python 3.12, FastAPI, gRPC, Groq & Gemini APIs</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-slate-500">Storage Subsystem:</td>
                    <td className="py-1.5 text-slate-900">MySQL Database Engine + High-Density Vector Stores</td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </div>
        )}
      </div>

      {/* END PROCESS CONFIRMATION MODAL */}
      {showWarningModal && (
        <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-center p-4">
          <div className="w-80 bg-[#f1f5f9] border-2 border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1] shadow-2xl p-3 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Windows Task Manager Warning</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Terminating core engineering skill processes may cause instability in Masuo Yuzuki's development output. Are you sure you wish to continue?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  audio.playClick();
                  setShowWarningModal(false);
                }}
                className="px-4 py-1 bg-gradient-to-b from-white to-[#cbd5e1] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-slate-800 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  audio.playBubble();
                  setShowWarningModal(false);
                }}
                className="px-4 py-1 bg-gradient-to-b from-white to-[#cbd5e1] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-rose-700 text-xs cursor-pointer"
              >
                Keep Process Alive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div 
        className="px-3 py-1 border-t border-[#94a3b8] flex items-center justify-between text-[11px] text-slate-600 select-none shrink-0"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        }}
      >
        <span className="font-semibold text-blue-900">CPU Usage: {82 + (ticker % 10)}%</span>
        <span>Mem Usage: 1420MB / 2048MB</span>
        <span className="font-mono text-emerald-700 font-bold">STATUS: NOMINAL</span>
      </div>
    </div>
  );
};
