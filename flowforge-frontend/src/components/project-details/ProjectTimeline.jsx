import React from 'react';
import { GitCommit, Clock, CheckCircle2 } from 'lucide-react';

export const ProjectTimeline = ({ activities = [] }) => {
  const list = activities.length > 0 ? activities : [
    {
      id: 'act-1',
      activity: 'created project workspace repository',
      userName: 'Sarah Connor',
      userAvatar: 'SC',
      statusBadge: 'Created',
      timeAgo: '5d ago',
    },
    {
      id: 'act-2',
      activity: 'updated milestone target sprint due date',
      userName: 'Manju',
      userAvatar: 'MJ',
      statusBadge: 'Updated',
      timeAgo: '2d ago',
    },
    {
      id: 'act-3',
      activity: 'added new team member Rahul Verma to repository',
      userName: 'Priya Sharma',
      userAvatar: 'PS',
      statusBadge: 'Member Added',
      timeAgo: '4h ago',
    },
  ];

  const badgeStyles = {
    Created: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Updated: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    'Member Added': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Status Changed': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
        <div className="p-2 bg-brand-500/10 rounded-xl text-brand-400 border border-brand-500/20">
          <GitCommit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Project Activity Timeline</h3>
          <p className="text-xs text-slate-400">Audit trail of workspace events (Newest first)</p>
        </div>
      </div>

      <div className="space-y-4 relative pl-4 border-l border-slate-800/80 my-2">
        {list.map((item) => (
          <div key={item.id} className="relative group pl-3 space-y-1">
            {/* Timeline Dot */}
            <div className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-brand-400 group-hover:scale-125 transition-transform duration-200"></div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-200">{item.userName || 'User'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[item.statusBadge] || 'bg-slate-800 text-slate-300'}">
                  {item.statusBadge}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{item.timeAgo || 'Recently'}</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-snug">{item.activity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
