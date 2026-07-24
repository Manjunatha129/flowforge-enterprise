import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

export const ProjectProgressSection = ({ project }) => {
  if (!project) return null;

  const progress = project.progress || 0;
  const isHighCompletion = progress >= 80;

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Project Completion Velocity</h3>
          <p className="text-xs text-slate-400">Milestone completion rate & progress status</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
        {/* SVG Circular Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="56"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="56"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={351.8}
              strokeDashoffset={351.8 - (351.8 * progress) / 100}
              strokeLinecap="round"
              className="text-brand-400 transition-all duration-1000 ease-out"
              fill="transparent"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-3xl font-extrabold text-white">{progress}%</span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Overall</span>
          </div>
        </div>

        {/* Linear Progress Bar & Message */}
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Milestone Progress Bar</span>
              <span className="text-brand-400">{progress}% Completed</span>
            </div>
            <div className="w-full bg-slate-950/80 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-brand-600 via-cyan-400 to-emerald-400 shadow-lg shadow-brand-500/20"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className={`w-5 h-5 shrink-0 ${isHighCompletion ? 'text-emerald-400' : 'text-brand-400'}`} />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-slate-200">
                {isHighCompletion ? 'Sprint Milestone On Track' : 'Active Progress in Motion'}
              </div>
              <p className="text-slate-400 leading-relaxed">
                {isHighCompletion
                  ? 'Project velocity is exceeding target metrics. Remaining tasks are scheduled for completion ahead of due date.'
                  : 'Project tasks are actively moving through sprint stages. 7 remaining items in active development.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
