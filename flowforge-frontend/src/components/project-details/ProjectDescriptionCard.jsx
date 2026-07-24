import React from 'react';
import { FileText, Layers, CheckCircle2 } from 'lucide-react';

export const ProjectDescriptionCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
        <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Project Description & Architecture Overview</h3>
          <p className="text-xs text-slate-400">Technical specifications and repository scope</p>
        </div>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <p className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/80 font-medium">
          {project.description || 'No detailed description provided for this project.'}
        </p>

        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Repository Key Highlights</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <li className="p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/60 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Java 21 Spring Boot 3 RESTful Microservice</span>
            </li>
            <li className="p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/60 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Spring Security 6 Stateless JWT Auth</span>
            </li>
            <li className="p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/60 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>React 18 Single Page App with Tailwind Styling</span>
            </li>
            <li className="p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/60 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>MySQL Relational Persistence & Hibernate JPA</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
