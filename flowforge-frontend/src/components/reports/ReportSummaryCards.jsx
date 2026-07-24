import React from 'react';
import { FolderKanban, CheckSquare, Percent, Clock, Award, Flame, Users, Calendar } from 'lucide-react';

/**
 * Report Summary Cards Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Renders key executive metrics computed strictly from live database queries.
 */
export const ReportSummaryCards = ({ overview }) => {
  const cards = [
    {
      title: 'Total Projects',
      value: overview?.totalProjects || 0,
      sub: `${overview?.activeProjects || 0} Active • ${overview?.completedProjects || 0} Completed`,
      icon: FolderKanban,
      accent: 'from-amber-500/20 to-orange-500/10 text-amber-400',
      border: 'border-amber-500/20',
    },
    {
      title: 'Tasks Completed',
      value: overview?.completedTasks || 0,
      sub: `${overview?.tasksCompletedThisMonth || 0} completed this month`,
      icon: CheckSquare,
      accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-400',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Avg Project Completion',
      value: `${overview?.averageProjectCompletion || 0}%`,
      sub: `${overview?.overdueTasks || 0} overdue tasks requiring attention`,
      icon: Percent,
      accent: 'from-purple-500/20 to-violet-500/10 text-purple-400',
      border: 'border-purple-500/20',
    },
    {
      title: 'Avg Task Velocity',
      value: overview?.averageTaskCompletionTime || 'N/A',
      sub: `${overview?.pendingTasks || 0} pending backlog items`,
      icon: Clock,
      accent: 'from-rose-500/20 to-red-500/10 text-rose-400',
      border: 'border-rose-500/20',
    },
    {
      title: 'Top Contributor',
      value: overview?.topContributor || 'None',
      sub: 'Most tasks completed in workspace',
      icon: Award,
      accent: 'from-amber-500/20 to-yellow-500/10 text-amber-300',
      border: 'border-amber-500/20',
    },
    {
      title: 'Most Active Project',
      value: overview?.mostActiveProject || 'None',
      sub: 'Highest task volume in system',
      icon: Flame,
      accent: 'from-purple-500/20 to-indigo-500/10 text-purple-300',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-gradient-to-br ${card.accent} border ${card.border} backdrop-blur-xl shadow-xl space-y-3 transition-transform duration-200 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-slate-100">{card.value}</div>
            <p className="text-[11px] text-slate-400 font-medium truncate">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ReportSummaryCards;
