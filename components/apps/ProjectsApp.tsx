import React from 'react';
import { ExternalLink, Github, Folder } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "YuzuOS",
    category: "Frontend / React",
    description: "A Windows-like operating system running in the browser. You're using it right now! Features a custom window manager, taskbar, and file system simulation.",
    image: "https://picsum.photos/600/400?random=1",
    tags: ["React", "TypeScript", "Tailwind", "Vite"],
  },
  {
    id: 2,
    title: "EcoTracker Mobile",
    category: "Mobile / UX",
    description: "A cross-platform mobile application helping users track their carbon footprint with gamification elements to encourage sustainable habits.",
    image: "https://picsum.photos/600/400?random=2",
    tags: ["React Native", "Firebase", "Figma"],
  },
  {
    id: 3,
    title: "DataViz Dashboard",
    category: "Data Science",
    description: "Interactive dashboard visualizing Tokyo public transport real-time data using D3.js and WebGL for high-performance rendering.",
    image: "https://picsum.photos/600/400?random=3",
    tags: ["D3.js", "WebGL", "Next.js"],
  },
  {
    id: 4,
    title: "Gemini Chatbot",
    category: "AI / API",
    description: "Integrated Google's Gemini API to create a context-aware chatbot that helps users navigate complex documentation sites.",
    image: "https://picsum.photos/600/400?random=4",
    tags: ["Node.js", "Google GenAI SDK", "WebSockets"],
  }
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
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">
                  <Github size={16} /> Source
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
                  <ExternalLink size={16} /> Demo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
