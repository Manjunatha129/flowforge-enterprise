import React from 'react';
import { Clock, MessageSquare, Paperclip, Star, CheckSquare, AlertTriangle } from 'lucide-react';

export const TaskCard = ({ task, onSelect, onToggleStar, onDragStart }) => {
  const priorityStyles = {
    CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10',
    MEDIUM: 'bg-brand-500/10 text-brand-400 border-brand-500/20 shadow-brand-500/10',
    LOW: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const labelColors = {
    Bug: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Feature: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    UI: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Backend: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Database: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    API: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Testing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Research: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  };

  const isHighPriority = task.priority === 'CRITICAL' || task.priority === 'HIGH';
  const isOverdue = task.overdue || (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED');

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'No date';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onClick={() => onSelect(task)}
      className={`group relative overflow-hidden bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border ${
        isHighPriority ? 'border-amber-500/30' : 'border-slate-800/80'
      } rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-grab active:cursor-grabbing space-y-3`}
    >
      {/* High Priority Glow Strip */}
      {isHighPriority && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500"></div>
      )}

      {/* Top Section: Badges & Star Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              priorityStyles[task.priority] || priorityStyles.MEDIUM
            }`}
          >
            {task.priority}
          </span>

          {/* Overdue Warning Badge */}
          {isOverdue && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center space-x-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>OVERDUE</span>
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(task.id);
          }}
          className={`p-1 rounded-lg transition-colors ${
            task.starred ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
          }`}
          title={task.starred ? 'Starred task' : 'Star task'}
        >
          <Star className={`w-4 h-4 ${task.starred ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Title & Description */}
      <div className="space-y-1">
        <h4 className="text-xs sm:text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 group-hover:text-brand-400 transition-colors line-clamp-2">
          {task.title}
        </h4>
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Labels Badges Stack */}
      <div className="flex flex-wrap items-center gap-1 pt-1">
        {(task.labels || ['Backend']).map((label) => (
          <span
            key={label}
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
              labelColors[label] || 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Subtasks Progress Bar (if available) */}
      {task.subtasksProgress !== undefined && (
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
            <span className="flex items-center space-x-1">
              <CheckSquare className="w-3 h-3 text-brand-400" />
              <span>Subtasks</span>
            </span>
            <span>{task.subtasksProgress}%</span>
          </div>
          <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-brand-400 rounded-full transition-all duration-300"
              style={{ width: `${task.subtasksProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer Info: User Avatar, Due Date & Metrics */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-400 text-white font-extrabold text-[10px] flex items-center justify-center shadow">
            {task.assignedUserAvatar || 'AC'}
          </div>
          <span className="flex items-center space-x-1 text-[10px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{formattedDueDate}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[10px]">
          <span className="flex items-center space-x-1" title="Comments">
            <MessageSquare className="w-3 h-3 text-slate-500" />
            <span>{task.commentsCount || 0}</span>
          </span>
          <span className="flex items-center space-x-1" title="Attachments">
            <Paperclip className="w-3 h-3 text-slate-500" />
            <span>{task.attachmentsCount || 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
