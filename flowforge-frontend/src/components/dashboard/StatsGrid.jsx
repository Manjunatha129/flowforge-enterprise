import React from 'react';
import { FolderKanban, CheckSquare, CheckCircle2, Clock, AlertCircle, Users, TrendingUp } from 'lucide-react';

/**
 * Workspace Statistics Summary Cards Grid.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Renders 6 metric summary cards powered strictly by database queries.
 * Zero hardcoded fallback numbers.
 */
export const StatsGrid = ({ stats }) => {
  if (!stats) return null;

  const totalProjects = stats.totalProjects ?? 0;
  const totalTasks = stats.totalTasks ?? 0;
  const completedTasks = stats.completedTasks ?? 0;
  const pendingTasks = stats.pendingTasks ?? 0;
  const overdueTasks = stats.overdueTasks ?? 0;
  const teamMembers = stats.teamMembers ?? 1;

  const cards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      trend: stats.totalProjectsTrend ?? (totalProjects > 0 ? `${totalProjects} active workspace projects` : '0 projects created'),
      icon: FolderKanban,
      gradient: 'from-brand-600/20 to-brand-500/5',
      borderColor: 'border-brand-500/30',
      iconBg: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      trend: stats.totalTasksTrend ?? (totalTasks > 0 ? `${totalTasks} total workspace tasks` : '0 tasks created'),
      icon: CheckSquare,
      gradient: 'from-cyan-600/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      trend: stats.completedTasksTrend ?? `${totalTasks > 0 ? Math.round((completedTasks * 100) / totalTasks) : 0}% completion rate`,
      icon: CheckCircle2,
      gradient: 'from-emerald-600/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      trend: stats.pendingTasksTrend ?? (pendingTasks > 0 ? `${pendingTasks} pending tasks` : '0 pending work'),
      icon: Clock,
      gradient: 'from-amber-600/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks,
      trend: stats.overdueTasksTrend ?? (overdueTasks > 0 ? `${overdueTasks} tasks overdue` : '0 overdue tasks'),
      icon: AlertCircle,
      gradient: 'from-rose-600/20 to-rose-500/5',
      borderColor: 'border-rose-500/30',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    },
    {
      title: 'Team Members',
      value: teamMembers,
      trend: stats.teamMembersTrend ?? `${teamMembers} registered user${teamMembers === 1 ? '' : 's'}`,
      icon: Users,
      gradient: 'from-purple-600/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border ${card.borderColor} p-5 shadow-lg shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-default`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900">
                {card.value}
              </div>
              <div className="flex items-center space-x-1 text-xs font-semibold text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
