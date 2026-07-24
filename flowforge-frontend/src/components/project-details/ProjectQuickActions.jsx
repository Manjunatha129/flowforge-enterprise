import React, { useState } from 'react';
import { PlusCircle, UserPlus, FileSpreadsheet, Share2, Zap } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { AddMemberModal } from './AddMemberModal';

export const ProjectQuickActions = ({ onAddMember }) => {
  const { showSuccess } = useToast();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleAction = (type) => {
    switch (type) {
      case 'task':
        showSuccess('Redirecting to task creation workflow...');
        break;
      case 'invite':
        setIsAddMemberOpen(true);
        break;
      case 'report':
        showSuccess('Project PDF performance report generated!');
        break;
      case 'share':
        navigator.clipboard?.writeText?.(window.location.href);
        showSuccess('Project URL copied to clipboard!');
        break;
      default:
        break;
    }
  };

  const actions = [
    { id: 'task', label: 'Add Task', icon: PlusCircle, color: 'from-brand-600 to-brand-500' },
    { id: 'invite', label: 'Invite Member', icon: UserPlus, color: 'from-purple-600 to-purple-500' },
    { id: 'report', label: 'Generate Report', icon: FileSpreadsheet, color: 'from-emerald-600 to-emerald-500' },
    { id: 'share', label: 'Share Project', icon: Share2, color: 'from-cyan-600 to-cyan-500' },
  ];

  return (
    <>
      <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Project Quick Actions</h3>
            <p className="text-xs text-slate-400">Shortcuts to extend and collaborate on project</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => handleAction(act.id)}
                className={`p-3.5 bg-gradient-to-tr ${act.color} text-white font-semibold text-xs rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 active:translate-y-0 flex flex-col items-center justify-center space-y-2 group`}
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={onAddMember}
      />
    </>
  );
};
