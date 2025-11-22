import React from 'react';
import { MapPin, Mail, Github, Linkedin, GraduationCap, Code } from 'lucide-react';

export const AboutApp: React.FC = () => {
  return (
    <div className="p-8 h-full w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-lg">
             <img 
                src="https://picsum.photos/200/200" 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full border-4 border-slate-900"
             />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Masuo Yuzuki</h2>
            <p className="text-slate-400">Information Systems Student</p>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Github size={20} />
            </button>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Linkedin size={20} />
            </button>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Mail size={20} />
            </button>
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <section>
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <GraduationCap className="text-purple-400" /> Education
            </h3>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-baseline">
                <h4 className="font-semibold text-lg">University of Information Science</h4>
                <span className="text-sm text-slate-400">2021 - Present</span>
              </div>
              <p className="text-slate-300 mt-1">Bachelor of Information Systems</p>
              <p className="text-sm text-slate-400 mt-2">
                Focusing on Human-Computer Interaction, Web Technologies, and Artificial Intelligence. 
                Currently conducting research on "User Perception in Web-based Operating Systems."
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <Code className="text-pink-400" /> Bio
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Hello! I'm a 4th-year student passionate about bridging the gap between complex backend logic and beautiful frontend experiences. 
              I believe software should not only be functional but also delightful to use. This "OS Portfolio" is an experiment 
              in pushing the boundaries of what a standard web portfolio can be.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
              <MapPin className="text-blue-400" /> Location
            </h3>
            <p className="text-slate-300">
              Based in Tokyo, Japan. Available for remote work and internships.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
