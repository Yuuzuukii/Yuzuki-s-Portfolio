import React, { useState } from 'react';
import { 
  Mail, Github, GraduationCap, Award, ExternalLink, HardDrive, 
  Cpu, Monitor, Shield, ChevronRight, ChevronDown, CheckCircle2, User,
  Layers, Network, Server, FileText, Sparkles
} from 'lucide-react';
import { audio } from '../../../services/audioService';

export const FrutigerAboutApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'wei' | 'education' | 'research' | 'certs' | 'devices' | 'contact'>('general');
  const [expandedDevices, setExpandedDevices] = useState<Record<string, boolean>>({
    processors: true,
    display: true,
    network: true,
    storage: false,
    ai: true,
  });

  const toggleDeviceGroup = (key: string) => {
    audio.playClick();
    setExpandedDevices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTabClick = (tab: any) => {
    audio.playClick();
    setActiveTab(tab);
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
          { id: 'general', label: 'General' },
          { id: 'wei', label: 'Experience Index' },
          { id: 'education', label: 'Education' },
          { id: 'research', label: 'Research (SI Lab)' },
          { id: 'certs', label: 'Certifications' },
          { id: 'devices', label: 'Device Manager' },
          { id: 'contact', label: 'Contact' },
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

      {/* Main Tab Content Area with 3D Sunken Frame */}
      <div className="flex-1 overflow-y-auto p-4 bg-white m-2 border-2 border-t-[#64748b] border-l-[#64748b] border-r-white border-b-white shadow-inner leading-relaxed">
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            {/* Top Windows Vista System Properties Banner */}
            <div 
              className="p-3 rounded-sm border border-[#38bdf8]/40 shadow-sm relative overflow-hidden flex items-start gap-4"
              style={{
                background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 45%, #38bdf8 100%)',
              }}
            >
              {/* Gloss Highlight Sheen */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 50%, transparent 51%)',
                }}
              />

              {/* Photo in 3D Metallic Glass Photo Frame */}
              <div className="w-24 h-24 shrink-0 p-1 bg-gradient-to-b from-white via-sky-100 to-sky-300 border-2 border-t-white border-l-white border-r-[#075985] border-b-[#075985] shadow-md flex items-center justify-center relative z-10">
                <img
                  src="/profile.jpg"
                  alt="Yuzuki Masuo"
                  className="w-full h-full object-cover border border-slate-400"
                />
              </div>

              <div className="flex-1 text-white relative z-10 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-extrabold tracking-wide drop-shadow-sm">増尾 柚希 (Yuzuki Masuo)</h3>
                  <span className="text-[10px] bg-sky-900/60 text-sky-100 px-2 py-0.5 rounded border border-sky-300/60 font-bold backdrop-blur-xs">
                    Professional Edition SP2
                  </span>
                </div>
                <p className="text-sky-100 font-semibold text-xs drop-shadow-xs">
                  Graduate Student / Full-Stack & AI Agent Engineer
                </p>
                <p className="text-sky-200 text-[11px]">
                  立命館大学 情報理工学研究科 1年 (Ritsumeikan University ISE)
                </p>
                <div className="pt-1.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white shadow-[0_0_8px_#34d399]" />
                  <span className="text-[11px] text-emerald-200 font-bold drop-shadow-xs">
                    System Status: Active & Available for Opportunities
                  </span>
                </div>
              </div>
            </div>

            {/* Windows Experience Index Teaser Box */}
            <div 
              onClick={() => handleTabClick('wei')}
              className="p-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-sm flex items-center justify-between cursor-pointer hover:border-sky-400 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Classic Vista WEI Blue Square Badge */}
                <div 
                  className="w-12 h-12 rounded-sm flex flex-col items-center justify-center text-white font-extrabold shadow-md border-2 border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1] shrink-0"
                  style={{
                    background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%)',
                  }}
                >
                  <span className="text-lg leading-none">5.9</span>
                  <span className="text-[8px] tracking-tight uppercase opacity-90">Score</span>
                </div>
                <div>
                  <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                    <span>Windows Experience Index: 5.9</span>
                    <span className="text-[10px] text-blue-600 underline font-normal">(View Details)</span>
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    Base score determined by lowest subscore (FastAPI & Microservices: 5.7, AI Core: 5.9).
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-blue-700" />
            </div>

            {/* System Specs Fieldset */}
            <fieldset className="border border-slate-300 p-3 rounded-xs">
              <legend className="px-1.5 font-bold text-blue-900 text-xs">System Information</legend>
              <table className="w-full text-[11px] text-slate-700">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500 w-36">Operating System:</td>
                    <td className="py-1.5 font-semibold text-slate-800">YuzuOS 2000s Frutiger Aero Edition (Build 6002)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500">Institution:</td>
                    <td className="py-1.5 text-slate-800">立命館大学大学院 情報理工学研究科 (ISE)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500">Laboratory:</td>
                    <td className="py-1.5 text-slate-800">社会知能研究室 (Social Intelligence Lab - SI Lab)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500">Research Focus:</td>
                    <td className="py-1.5 text-slate-800 font-medium">大規模言語モデルを用いたマルチエージェント対話プロトコルの研究</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-500">Primary Languages:</td>
                    <td className="py-1.5 text-slate-800">TypeScript, Python, JavaScript, SQL, HTML/CSS</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-slate-500">Key Technologies:</td>
                    <td className="py-1.5 text-slate-800">React 19, Next.js, FastAPI, Docker, gRPC, MySQL, TailwindCSS, Git</td>
                  </tr>
                </tbody>
              </table>
            </fieldset>

            {/* Quick Actions */}
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => handleTabClick('devices')}
                className="px-3 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] text-blue-900 font-bold text-[11px] flex items-center gap-1 active:translate-y-px cursor-pointer"
              >
                <Cpu size={12} />
                <span>Device Manager...</span>
              </button>
              <a
                href="https://github.com/Yuuzuukii"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] text-blue-900 font-bold text-[11px] flex items-center gap-1 active:translate-y-px"
              >
                <Github size={12} />
                <span>GitHub Profile...</span>
              </a>
              <a
                href="mailto:is0690ke@ed.ritsumei.ac.jp"
                className="px-3 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] text-blue-900 font-bold text-[11px] flex items-center gap-1 active:translate-y-px"
              >
                <Mail size={12} />
                <span>Send E-mail...</span>
              </a>
            </div>
          </div>
        )}

        {/* WINDOWS EXPERIENCE INDEX (WEI) TAB */}
        {activeTab === 'wei' && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 bg-gradient-to-r from-sky-50 to-slate-50 border border-sky-200 rounded-sm">
              {/* Giant 5.9 Blue Glass WEI Badge */}
              <div 
                className="w-16 h-16 rounded-sm flex flex-col items-center justify-center text-white font-extrabold shadow-lg border-2 border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1] shrink-0"
                style={{
                  background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 45%, #0369a1 100%)',
                }}
              >
                <span className="text-2xl leading-none">5.9</span>
                <span className="text-[9px] uppercase tracking-wider opacity-90">Base score</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-blue-950">Performance Information and Tools</h3>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  The Windows Experience Index assesses key system capabilities on a scale from 1.0 to 5.9 in Windows Vista. Higher scores indicate superior productivity and computational throughput.
                </p>
                <p className="text-blue-800 text-[11px] font-semibold mt-1">
                  Base score is determined by the lowest subscore.
                </p>
              </div>
            </div>

            {/* Subscores Assessment Table */}
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-gradient-to-b from-[#f1f5f9] to-[#e2e8f0] border-b border-slate-300 text-slate-700">
                  <th className="p-2 text-left font-bold border-r border-slate-300">Component</th>
                  <th className="p-2 text-left font-bold border-r border-slate-300">What is assessed</th>
                  <th className="p-2 text-center font-bold w-20">Subscore</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 hover:bg-sky-50/50">
                  <td className="p-2 font-bold text-blue-950 border-r border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Cpu size={14} className="text-blue-600" />
                      <span>Processor (AI Core)</span>
                    </div>
                  </td>
                  <td className="p-2 text-slate-600 border-r border-slate-200">
                    Multi-Agent Dialogue Protocols, Large Language Model coordination, reasoning algorithms
                  </td>
                  <td className="p-2 text-center font-extrabold text-blue-900 bg-blue-50/50">5.9</td>
                </tr>

                <tr className="border-b border-slate-200 hover:bg-sky-50/50">
                  <td className="p-2 font-bold text-blue-950 border-r border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Layers size={14} className="text-indigo-600" />
                      <span>Memory (Frontend Stack)</span>
                    </div>
                  </td>
                  <td className="p-2 text-slate-600 border-r border-slate-200">
                    TypeScript, React 19, state management, high-frequency DOM manipulation
                  </td>
                  <td className="p-2 text-center font-extrabold text-blue-900 bg-blue-50/50">5.9</td>
                </tr>

                <tr className="border-b border-slate-200 hover:bg-sky-50/50">
                  <td className="p-2 font-bold text-blue-950 border-r border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Monitor size={14} className="text-cyan-600" />
                      <span>Graphics (UI / UX)</span>
                    </div>
                  </td>
                  <td className="p-2 text-slate-600 border-r border-slate-200">
                    Responsive design, Frutiger Aero skeuomorphism, Tailwind CSS, cross-platform layouts
                  </td>
                  <td className="p-2 text-center font-extrabold text-blue-900 bg-blue-50/50">5.8</td>
                </tr>

                <tr className="border-b border-slate-200 hover:bg-sky-50/50">
                  <td className="p-2 font-bold text-blue-950 border-r border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Server size={14} className="text-emerald-600" />
                      <span>Gaming & Network (Backend)</span>
                    </div>
                  </td>
                  <td className="p-2 text-slate-600 border-r border-slate-200">
                    Python FastAPI, REST API endpoints, gRPC microservices, Docker containerization
                  </td>
                  <td className="p-2 text-center font-extrabold text-blue-900 bg-blue-50/50">5.7</td>
                </tr>

                <tr className="hover:bg-sky-50/50">
                  <td className="p-2 font-bold text-blue-950 border-r border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <HardDrive size={14} className="text-amber-600" />
                      <span>Primary Disk (Data)</span>
                    </div>
                  </td>
                  <td className="p-2 text-slate-600 border-r border-slate-200">
                    MySQL transactional performance, Prisma ORM, RAG vector indexing, search retrieval
                  </td>
                  <td className="p-2 text-center font-extrabold text-blue-900 bg-blue-50/50">5.8</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <fieldset className="border border-slate-300 p-3 rounded-xs">
              <legend className="px-1.5 font-bold text-blue-900 flex items-center gap-1 text-xs">
                <GraduationCap size={14} className="text-blue-700" />
                <span>Higher Education</span>
              </legend>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>立命館大学 (Ritsumeikan University)</span>
                  <span className="text-slate-500 font-normal">2022 - Present</span>
                </div>
                <p className="text-blue-800 font-semibold text-[11px]">
                  情報理工学研究科 1年生 / Graduate School of Information Science and Engineering
                </p>
                <div className="text-slate-700 text-[11px] leading-relaxed bg-slate-50 p-2.5 border border-slate-200 rounded-sm">
                  社会知能研究室（SI Lab）に所属。異文化コラボレーションや社会的課題の解決を目的とした、LLMマルチエージェント対話プロトコルの先端研究を行っています。
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-slate-300 p-3 rounded-xs">
              <legend className="px-1.5 font-bold text-blue-900 text-xs">Academic Background & Philosophy</legend>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                ウェブ開発から最先端の機械学習技術まで幅広い領域に深い関心を持ち、理論的な研究と実践的なソフトウェア開発の両輪で技術を探求しています。REST API、gRPC等を用いた実務的なフルスタック開発の知見を活かし、学術的な成果を実用的なプロダクトへ落とし込むことを得意としています。
              </p>
            </fieldset>
          </div>
        )}

        {/* RESEARCH TAB */}
        {activeTab === 'research' && (
          <div className="space-y-4">
            <fieldset className="border border-slate-300 p-3 rounded-xs">
              <legend className="px-1.5 font-bold text-blue-900 text-xs">Research Topic</legend>
              <div className="space-y-2">
                <h4 className="font-bold text-blue-950 text-xs">
                  大規模言語モデルを用いたマルチエージェント対話プロトコルの研究
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  複数自律型LLMエージェントが協調してタスクを解決するためのプロトコル設計および対話フローを研究。文化的多様性や異文化コラボレーションを軸とし、社会的な合意形成や協調作業の自動化・支援を目指しています。
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="https://www.si-lab.org/index-ja.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <ExternalLink size={12} />
                    <span>社会知能研究室 (SI Lab) 公式ウェブサイト</span>
                  </a>
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-slate-300 p-3 rounded-xs">
              <legend className="px-1.5 font-bold text-blue-900 text-xs">Key Research Disciplines</legend>
              <ul className="list-disc list-inside text-slate-700 text-[11px] space-y-1.5">
                <li>LLM Multi-Agent Coordination & Consensus Building</li>
                <li>Cross-cultural Collaborative Dialogue Systems</li>
                <li>Retrieval-Augmented Generation (RAG) Architecture</li>
                <li>Natural Language Processing & Distributed Systems</li>
              </ul>
            </fieldset>
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certs' && (
          <div className="space-y-3">
            <fieldset className="border border-slate-300 p-3 rounded-xs">
              <legend className="px-1.5 font-bold text-blue-900 flex items-center gap-1 text-xs">
                <Award size={14} className="text-amber-600" />
                <span>Technical & Language Qualifications</span>
              </legend>
              <div className="space-y-2.5">
                <div className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">基本情報技術者試験 (FE)</p>
                    <p className="text-slate-500 text-[10px]">Fundamental Information Technology Engineer Examination</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded border border-emerald-300">
                    Certified
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">TOEIC IP: 895点</p>
                    <p className="text-slate-500 text-[10px]">Advanced English Communication Proficiency</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded border border-blue-300">
                    Score: 895
                  </span>
                </div>
              </div>
            </fieldset>
          </div>
        )}

        {/* DEVICE MANAGER TAB */}
        {activeTab === 'devices' && (
          <div className="space-y-3">
            <div className="p-2 bg-slate-100 border border-slate-300 text-[11px] text-slate-700 font-medium">
              Hardware & Engineering Driver Tree (YUZU-WORKSTATION-2000)
            </div>

            <div className="border border-slate-300 p-3 bg-white font-mono text-[11px] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Monitor size={14} className="text-blue-700" />
                <span>YUZU-CORE-WORKSTATION (Ritsumeikan SI Lab)</span>
              </div>

              <div className="pl-4 space-y-2">
                {/* AI & Neural Processors */}
                <div>
                  <button 
                    onClick={() => toggleDeviceGroup('ai')}
                    className="flex items-center gap-1 text-slate-800 hover:text-blue-800 cursor-pointer font-semibold"
                  >
                    {expandedDevices.ai ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <Sparkles size={12} className="text-purple-600" />
                    <span>Neural & Cognitive AI Engines (SI Lab)</span>
                  </button>
                  {expandedDevices.ai && (
                    <div className="pl-6 pt-1 space-y-1 text-slate-600 text-[10px]">
                      <div>├─ LLM Multi-Agent Coordination Protocol Driver (v2.4)</div>
                      <div>├─ Retrieval-Augmented Generation (RAG) Vector Driver</div>
                      <div>└─ Cross-Cultural Dialogue Engine (Japanese / English / Multilingual)</div>
                    </div>
                  )}
                </div>

                {/* Processors */}
                <div>
                  <button 
                    onClick={() => toggleDeviceGroup('processors')}
                    className="flex items-center gap-1 text-slate-800 hover:text-blue-800 cursor-pointer font-semibold"
                  >
                    {expandedDevices.processors ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <Cpu size={12} className="text-blue-600" />
                    <span>Backend Microprocessors & Runtimes</span>
                  </button>
                  {expandedDevices.processors && (
                    <div className="pl-6 pt-1 space-y-1 text-slate-600 text-[10px]">
                      <div>├─ Python 3.12 Fast Execution Controller (FastAPI Core)</div>
                      <div>├─ gRPC High-Throughput Protocol Driver</div>
                      <div>└─ Docker Container Orchestration Hub</div>
                    </div>
                  )}
                </div>

                {/* Display Adapters */}
                <div>
                  <button 
                    onClick={() => toggleDeviceGroup('display')}
                    className="flex items-center gap-1 text-slate-800 hover:text-blue-800 cursor-pointer font-semibold"
                  >
                    {expandedDevices.display ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <Monitor size={12} className="text-emerald-600" />
                    <span>Frontend Graphical Adapters (Web)</span>
                  </button>
                  {expandedDevices.display && (
                    <div className="pl-6 pt-1 space-y-1 text-slate-600 text-[10px]">
                      <div>├─ TypeScript & React 19 Virtual DOM Render Engine</div>
                      <div>├─ Next.js Server-Side Pipeline Driver</div>
                      <div>└─ Frutiger Aero Skeuomorphic Shader System</div>
                    </div>
                  )}
                </div>

                {/* Network */}
                <div>
                  <button 
                    onClick={() => toggleDeviceGroup('network')}
                    className="flex items-center gap-1 text-slate-800 hover:text-blue-800 cursor-pointer font-semibold"
                  >
                    {expandedDevices.network ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <Network size={12} className="text-amber-600" />
                    <span>Network & Communications</span>
                  </button>
                  {expandedDevices.network && (
                    <div className="pl-6 pt-1 space-y-1 text-slate-600 text-[10px]">
                      <div>├─ HTTP/2 & WebSocket Realtime Stream Adapter</div>
                      <div>└─ RESTful API Gateway Controller</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <fieldset className="border border-slate-300 p-3 rounded-xs">
              <legend className="px-1.5 font-bold text-blue-900 text-xs">Communication Channels</legend>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-slate-500 w-24">Email:</td>
                    <td className="py-2">
                      <a href="mailto:is0690ke@ed.ritsumei.ac.jp" className="text-blue-700 hover:underline font-semibold">
                        is0690ke@ed.ritsumei.ac.jp
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-slate-500">GitHub:</td>
                    <td className="py-2">
                      <a href="https://github.com/Yuuzuukii" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-semibold">
                        https://github.com/Yuuzuukii
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-slate-500">Laboratory:</td>
                    <td className="py-2">
                      <a href="https://www.si-lab.org/index-ja.html" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-semibold">
                        https://www.si-lab.org/index-ja.html
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </div>
        )}
      </div>

      {/* 2000s Dialog Action Buttons (OK / Cancel / Apply) */}
      <div 
        className="px-3 py-2 border-t border-[#94a3b8] flex justify-end gap-2 text-xs shrink-0"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        }}
      >
        <button
          onClick={() => audio.playClick()}
          className="px-5 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-slate-800 shadow-xs active:translate-y-px cursor-pointer"
        >
          OK
        </button>
        <button
          onClick={() => audio.playClick()}
          className="px-5 py-1 bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-slate-800 shadow-xs active:translate-y-px cursor-pointer"
        >
          Cancel
        </button>
        <button
          disabled
          className="px-5 py-1 bg-[#e2e8f0] border border-[#cbd5e1] text-slate-400 font-bold shadow-xs cursor-not-allowed opacity-60"
        >
          Apply
        </button>
      </div>
    </div>
  );
};
