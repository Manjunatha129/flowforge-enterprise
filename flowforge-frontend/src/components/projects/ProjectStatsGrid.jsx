import React from 'react';
import { FolderKanban, PlayCircle, CheckCircle2, Archive, TrendingUp } from 'lucide-react';

export const ProjectStatsGrid = ({ projects = [] }) => {
  const total = projects.length;
  const active = projects.filter((p) => p.status === 'ACTIVE' || p.status === 'IN_REVIEW' || p.status === 'PLANNING').length;
  const completed = projects.filter((p) => p.status === 'COMPLETED').length;
  const archived = projects.filter((p) => p.status === 'ARCHIVED').length;

  const cards = [
    {
      title: 'Total Projects',
      value: total,
      trend: `${total} registered workspace repositories`,
      icon: FolderKanban,
      gradient: 'from-brand-600/20 to-brand-500/5',
      borderColor: 'border-brand-500/30',
      iconBg: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
    },
    {
      title: 'Active Projects',
      value: active,
      trend: `${active} currently in active development`,
      icon: PlayCircle,
      gradient: 'from-cyan-600/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    },
    {
      title: 'Completed Projects',
      value: completed,
      trend: '100% milestone deliverables delivered',
      icon: CheckCircle2,
      gradient: 'from-emerald-600/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Archived Projects',
      value: archived,
      trend: `${archived} preserved for reference`,
      icon: Archive,
      gradient: 'from-purple-600/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border ${card.borderColor} p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-default`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight text-slate-100">
                {card.value}
              </div>
              <div className="flex items-center space-x-1 text-xs font-medium text-slate-400">
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
