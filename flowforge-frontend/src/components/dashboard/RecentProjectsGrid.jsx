import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ArrowRight, PlusCircle, FolderPlus } from 'lucide-react';

/**
 * Dashboard Recent Projects Grid Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Renders recent projects or a clean SaaS Empty State card with a [ Create Project ] CTA button when empty.
 */
export const RecentProjectsGrid = ({ projects }) => {
  const navigate = useNavigate();
  const list = projects || [];

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Active Projects Overview
            </h3>
            <p className="text-xs text-slate-400">Current progress across primary repositories</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="text-xs text-amber-400 font-semibold hover:underline flex items-center space-x-1"
        >
          <span>All Projects</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {list.length === 0 ? (
        <div className="p-8 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">No Projects Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Create your first project to start managing team repositories and task workflows.
            </p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 mx-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-3 hover:border-amber-500/40 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-100 truncate pr-2">{p.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/20">
                  {p.status || 'Active'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Completion:</span>
                  <span className="font-bold text-slate-200">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
