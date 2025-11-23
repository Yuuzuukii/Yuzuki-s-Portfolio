import React from 'react';
import { MapPin, Mail, Github, Linkedin, GraduationCap, Code } from 'lucide-react';

export const AboutApp: React.FC = () => {
  return (
    <div className="p-8 h-full w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-lg">
             <img 
               src="/Yuzuki-s-Portfolio/profile.jpg" 
               alt="Yuzuki Masuo"
               className="w-full h-full rounded-full object-cover border-4 border-slate-900"
             />
          </div>
          <div>
            <h2 className="text-2xl font-bold">増尾 柚希</h2>
            <p className="text-slate-400">Yuzuki Masuo</p>
            <p className="text-slate-400 text-sm mt-1">Information Systems Student</p>
          </div>
          
          <div className="flex gap-2">
            <a 
              href="https://github.com/Yuuzuukii" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://www.si-lab.org/index-ja.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <GraduationCap size={20} />
            </a>
            <a 
              href="mailto:is0690ke@ed.ritsumei.ac.jp"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <section>
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <GraduationCap className="text-purple-400" /> Education
            </h3>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-baseline">
                <h4 className="font-semibold text-lg">立命館大学 (Ritsumeikan University)</h4>
                <span className="text-sm text-slate-400">2021 - Present</span>
              </div>
              <p className="text-slate-300 mt-1">情報理工学部 情報理工学科 4年生</p>
              <p className="text-slate-300 text-sm">Faculty of Information Science and Engineering</p>
              <p className="text-sm text-slate-400 mt-2">
                社会知能研究室（SI Lab）にて、大規模言語モデルを用いたマルチエージェント対話プロトコルの研究に従事。
                異文化コラボレーションを軸に、LLMマルチエージェントを用いて社会的課題を解決する研究を行っています。
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <Code className="text-pink-400" /> Bio
            </h3>
            <p className="text-slate-300 leading-relaxed">
              立命館大学情報理工学部4年生。社会知能研究室（SI Lab）にて、機械学習とデータ分析の研究に従事。
              ウェブ開発からAI技術まで幅広い技術領域に興味を持ち、理論と実践の両面から技術を探求しています。
              REST API、gRPCを用いたフルスタック開発の実務経験があります。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <Code className="text-emerald-400" /> Certifications
            </h3>
            <div className="space-y-2">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-slate-300 font-semibold">基本情報技術者 (FE)</p>
                <p className="text-sm text-slate-400">Fundamental Information Technology Engineer</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-slate-300 font-semibold">TOEIC IP: 895点</p>
                <p className="text-sm text-slate-400">Advanced Level English Communication</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <MapPin className="text-blue-400" /> Contact
            </h3>
            <div className="space-y-2">
              <p className="text-slate-300 flex items-center gap-2">
                <Mail size={16} className="text-purple-400" />
                <a href="mailto:is0690ke@ed.ritsumei.ac.jp" className="hover:text-purple-400 transition-colors">
                  is0690ke@ed.ritsumei.ac.jp
                </a>
              </p>
              <p className="text-slate-300 flex items-center gap-2">
                <Github size={16} className="text-purple-400" />
                <a href="https://github.com/Yuuzuukii" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                  github.com/Yuuzuukii
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
