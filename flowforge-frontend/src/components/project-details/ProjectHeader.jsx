import React from 'react';
import { ArrowLeft, Edit3, Archive, Trash2, Tag, Calendar, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectHeader = ({ project, onEdit, onArchive, onDelete }) => {
  const navigate = useNavigate();

  if (!project) return null;

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

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl space-y-6">
      {/* Top Project Color Accent Banner */}
      <div
        className="h-3 w-full"
        style={{ backgroundColor: project.projectColor || '#0c93e7' }}
      ></div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Back Button & Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects Workspace</span>
          </button>

          <div className="text-xs text-slate-500 font-medium">
            Created by <span className="text-slate-300 font-semibold">{project.createdBy || 'Sarah Connor'}</span>
          </div>
        </div>

        {/* Project Title & Badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  statusStyles[project.status] || statusStyles.ACTIVE
                }`}
              >
                {project.status.replace('_', ' ')}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                  priorityStyles[project.priority] || priorityStyles.MEDIUM
                }`}
              >
                {project.priority} PRIORITY
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/80 flex items-center space-x-1">
                <Tag className="w-3 h-3 text-brand-400" />
                <span>{project.category || 'Engineering'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100">
              {project.projectName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.description || 'No description available for this project repository.'}
            </p>
          </div>

          {/* Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onEdit}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-cyan-400" />
              <span>Edit Project</span>
            </button>

            <button
              onClick={onArchive}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Archive className="w-4 h-4 text-amber-400" />
              <span>Archive</span>
            </button>

            <button
              onClick={onDelete}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
