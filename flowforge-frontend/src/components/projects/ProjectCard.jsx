import React from 'react';
import { Calendar, CheckSquare, ExternalLink, Edit3, Trash2, Tag, Clock } from 'lucide-react';

export const ProjectCard = ({ project, onOpen, onEdit, onDelete }) => {
  const statusStyles = {
    PLANNING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ACTIVE: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    IN_REVIEW: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ARCHIVED: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const priorityStyles = {
    CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    MEDIUM: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    LOW: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const formattedDueDate = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No deadline';

  return (
    <div className="group relative overflow-hidden bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Top Project Color Bar Accent */}
      <div
        className="h-2 w-full transition-all duration-300"
        style={{ backgroundColor: project.projectColor || '#0c93e7' }}
      ></div>

      <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
        {/* Header Badges & Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  statusStyles[project.status] || statusStyles.ACTIVE
                }`}
              >
                {project.status.replace('_', ' ')}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  priorityStyles[project.priority] || priorityStyles.MEDIUM
                }`}
              >
                {project.priority}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>{project.category || 'Engineering'}</span>
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 group-hover:text-brand-400 transition-colors line-clamp-1">
              {project.projectName}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-1">
              {project.description || 'No description provided for this project.'}
            </p>
          </div>
        </div>

        {/* Progress Bar & Tasks Counter */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Progress</span>
              <span className="text-slate-200">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-slate-800/80">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-md"
                style={{
                  width: `${project.progress}%`,
                  backgroundColor: project.projectColor || '#0c93e7',
                }}
              ></div>
            </div>
          </div>

          {/* Task Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60 text-center text-xs">
            <div>
              <span className="block text-[10px] text-slate-500 font-semibold uppercase">Total</span>
              <span className="font-bold text-slate-200">{project.totalTasks || 0}</span>
            </div>
            <div>
              <span className="block text-[10px] text-emerald-500 font-semibold uppercase">Done</span>
              <span className="font-bold text-emerald-400">{project.completedTasks || 0}</span>
            </div>
            <div>
              <span className="block text-[10px] text-amber-500 font-semibold uppercase">Left</span>
              <span className="font-bold text-amber-400">{project.remainingTasks || 0}</span>
            </div>
          </div>
        </div>

        {/* Footer info: Members avatars stack & Action Buttons */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="flex items-center -space-x-2">
              {(project.members || ['SC', 'AC']).map((m, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-brand-300 font-bold text-[10px] flex items-center justify-center shadow"
                >
                  {m}
                </div>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline-block flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{formattedDueDate}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => onOpen(project)}
              className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
              title="Open Project Details"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
              title="Edit Project"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(project)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
