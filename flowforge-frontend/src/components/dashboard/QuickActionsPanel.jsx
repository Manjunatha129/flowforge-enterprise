import React, { useState } from 'react';
import { FolderPlus, PlusCircle, UserPlus, FileSpreadsheet, Zap } from 'lucide-react';
import { QuickActionModal } from './QuickActionModal';

export const QuickActionsPanel = () => {
  const [activeModal, setActiveModal] = useState(null);

  const actions = [
    {
      id: 'project',
      label: 'Create New Project',
      icon: FolderPlus,
      color: 'from-brand-600 to-brand-500',
      shadow: 'shadow-brand-500/20 hover:shadow-brand-500/35',
    },
    {
      id: 'task',
      label: 'Create New Task',
      icon: PlusCircle,
      color: 'from-cyan-600 to-cyan-500',
      shadow: 'shadow-cyan-500/20 hover:shadow-cyan-500/35',
    },
    {
      id: 'invite',
      label: 'Invite Member',
      icon: UserPlus,
      color: 'from-purple-600 to-purple-500',
      shadow: 'shadow-purple-500/20 hover:shadow-purple-500/35',
    },
    {
      id: 'report',
      label: 'Generate Report',
      icon: FileSpreadsheet,
      color: 'from-emerald-600 to-emerald-500',
      shadow: 'shadow-emerald-500/20 hover:shadow-emerald-500/35',
    },
  ];

  return (
    <>
      <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Quick Workspace Actions
            </h3>
            <p className="text-xs text-slate-400">Instant shortcuts to create and manage assets</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => setActiveModal(act.id)}
                className={`p-4 bg-gradient-to-tr ${act.color} text-white font-semibold text-xs rounded-xl shadow-lg ${act.shadow} transition-all duration-200 hover:-translate-y-1 active:translate-y-0 flex flex-col items-center justify-center text-center space-y-2 group`}
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <QuickActionModal
        isOpen={!!activeModal}
        type={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
};
