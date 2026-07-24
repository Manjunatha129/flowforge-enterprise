import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Mail, Shield } from 'lucide-react';
import { AddMemberModal } from './AddMemberModal';
import { useToast } from '../../context/ToastContext';

export const TeamMembersSection = ({ members = [], onAddMember, onRemoveMember }) => {
  const { showSuccess } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRemove = (member) => {
    onRemoveMember(member.id || member.avatar);
    showSuccess(`Removed ${member.name} from project team.`);
  };

  return (
    <>
      <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Project Team Members</h3>
              <p className="text-xs text-slate-400">Assigned engineers & workspace contributors</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-semibold rounded-xl border border-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((m) => (
            <div
              key={m.id || m.avatar}
              className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-400 text-white font-extrabold text-xs flex items-center justify-center shadow-md shrink-0">
                  {m.avatar}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="text-xs font-bold text-slate-100 truncate">{m.name}</div>
                  <div className="text-[11px] text-brand-400 font-medium truncate flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-brand-400 shrink-0" />
                    <span>{m.role}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-slate-600 shrink-0" />
                    <span>{m.email}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRemove(m)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                title="Remove Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMember={onAddMember}
      />
    </>
  );
};
