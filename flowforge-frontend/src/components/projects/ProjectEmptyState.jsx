import React from 'react';
import { FolderPlus, Layers } from 'lucide-react';

export const ProjectEmptyState = ({ onCreateNew }) => {
  return (
    <div className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-12 text-center shadow-xl space-y-5 my-6">
      <div className="inline-flex p-4 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20 shadow-lg shadow-brand-500/10">
        <Layers className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-2 max-w-sm mx-auto">
        <h3 className="text-xl font-bold text-slate-100">No projects yet</h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Get started by creating your first FlowForge project repository to manage team tasks and track milestone velocity.
        </p>
      </div>

      <button
        onClick={onCreateNew}
        className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
      >
        <FolderPlus className="w-4 h-4" />
        <span>Create Your First Project</span>
      </button>
    </div>
  );
};
