import React from 'react';
import { ExternalLink, Github, Folder } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "ShigaChat",
    category: "Web Application / AI",
    description: "滋賀県在住の外国人向け多言語対応Q&Aサービス。ChatGPTとRAG（検索拡張生成）を組み合わせることで、地域特化の情報を迅速かつ正確に提供します。日本語、英語、ベトナム語、中国語、韓国語に対応。",
    image: "https://picsum.photos/600/400?random=1",
    tags: ["React", "Python", "FastAPI", "ChatGPT", "RAG", "MySQL"],
    github: "https://github.com/Yuuzuukii/ShigaChat",
  },
  {
    id: 2,
    title: "YuzukiOS Portfolio",
    category: "Frontend / React",
    description: "ブラウザ上で動作するWindows風のオペレーティングシステム。カスタムウィンドウマネージャー、タスクバー、各種アプリケーションを実装。このポートフォリオそのものです！",
    image: "https://picsum.photos/600/400?random=2",
    tags: ["React", "TypeScript", "Tailwind", "Vite"],
    github: "https://github.com/Yuuzuukii/portfolio",
  },
  {
    id: 3,
    title: "Multi-Agent Dialogue Protocol",
    category: "Research / AI",
    description: "大規模言語モデルを用いたマルチエージェント対話プロトコルの研究。異文化コラボレーションを軸に、LLMマルチエージェントを用いて社会的課題を解決する実験的プロジェクト。",
    image: "https://picsum.photos/600/400?random=3",
    tags: ["Python", "LLM", "AI Research", "NLP"],
    github: null,
  },
];

export const ProjectsApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-slate-50 overflow-y-auto text-slate-900">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Folder className="text-yellow-500" />
          My Projects
        </h2>
        <span className="text-sm text-slate-500">{projects.length} items</span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                  View Details
                </button>
              </div>
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{project.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{project.title}</h3>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                {project.github && (
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors"
                  >
                    <Github size={16} /> Source
                  </a>
                )}
                {!project.github && (
                  <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-300 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed">
                    <Github size={16} /> Private
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
