import React from 'react';
import { Calendar, Clock, Activity, CheckSquare, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export const ProjectOverviewCards = ({ project, details }) => {
  if (!project) return null;

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'N/A';

  const cards = [
    {
      title: 'Created Date',
      value: formatDate(project.createdAt || project.startDate),
      icon: Calendar,
      gradient: 'from-brand-600/20 to-brand-500/5',
      borderColor: 'border-brand-500/30',
      iconBg: 'bg-brand-500/15 text-brand-400',
    },
    {
      title: 'Due Date',
      value: formatDate(project.dueDate),
      icon: Clock,
      gradient: 'from-amber-600/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400',
    },
    {
      title: 'Last Updated',
      value: formatDate(project.updatedAt || project.createdAt),
      icon: RefreshCw,
      gradient: 'from-cyan-600/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
    },
    {
      title: 'Progress Rate',
      value: `${project.progress || 0}%`,
      icon: Activity,
      gradient: 'from-emerald-600/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      title: 'Total Tasks',
      value: project.totalTasks || 45,
      icon: CheckSquare,
      gradient: 'from-purple-600/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/15 text-purple-400',
    },
    {
      title: 'Completed Tasks',
      value: project.completedTasks || 38,
      icon: CheckCircle2,
      gradient: 'from-emerald-600/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      title: 'Pending Tasks',
      value: details?.pendingTasks ?? Math.max(0, (project.totalTasks || 45) - (project.completedTasks || 38)),
      icon: Layers,
      gradient: 'from-brand-600/20 to-brand-500/5',
      borderColor: 'border-brand-500/30',
      iconBg: 'bg-brand-500/15 text-brand-400',
    },
    {
      title: 'Overdue Tasks',
      value: details?.overdueTasks ?? 2,
      icon: AlertCircle,
      gradient: 'from-rose-600/20 to-rose-500/5',
      borderColor: 'border-rose-500/30',
      iconBg: 'bg-rose-500/15 text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border ${card.borderColor} p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg} border border-white/10 transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 truncate">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
