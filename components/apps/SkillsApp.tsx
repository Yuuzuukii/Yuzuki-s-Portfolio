import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Cpu, Palette, Database } from 'lucide-react';

const radarData = [
  { subject: 'Frontend', A: 95, fullMark: 100 },
  { subject: 'Backend', A: 70, fullMark: 100 },
  { subject: 'UI/UX', A: 85, fullMark: 100 },
  { subject: 'DevOps', A: 60, fullMark: 100 },
  { subject: 'Communication', A: 90, fullMark: 100 },
  { subject: 'English', A: 75, fullMark: 100 },
];

const languageData = [
  { name: 'TypeScript', level: 90 },
  { name: 'Python', level: 80 },
  { name: 'Rust', level: 40 },
  { name: 'Go', level: 65 },
  { name: 'SQL', level: 70 },
];

export const SkillsApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-slate-900 text-white overflow-y-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Technical Proficiency
        </h2>
        <p className="text-slate-400">Visualizing my skill distribution across various domains.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cpu size={18} className="text-cyan-400" /> Core Competencies
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Yuzuki"
                  dataKey="A"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="#22d3ee"
                  fillOpacity={0.3}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#22d3ee' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database size={18} className="text-purple-400" /> Languages & Tools
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={languageData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8' }} width={80} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Bar dataKey="level" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
         {["React", "Next.js", "TailwindCSS", "Node.js", "Docker", "AWS", "Figma", "Git"].map((tech) => (
            <div key={tech} className="bg-slate-800 p-4 rounded-lg border border-white/5 text-center hover:bg-slate-700 transition-colors">
                <span className="font-mono text-sm text-cyan-200">{tech}</span>
            </div>
         ))}
      </div>
    </div>
  );
};
