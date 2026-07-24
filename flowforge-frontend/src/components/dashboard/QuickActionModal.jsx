import React, { useState } from 'react';
import { X, Sparkles, FolderPlus, PlusCircle, UserPlus, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const QuickActionModal = ({ isOpen, type, onClose }) => {
  const { showSuccess } = useToast();
  const [inputValue, setInputValue] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const config = {
    project: {
      title: 'Create New Project',
      icon: FolderPlus,
      field1: 'Project Title',
      placeholder1: 'e.g. Mobile App Redesign 2026',
      field2: 'Department / Key',
      placeholder2: 'e.g. ENG-MOBILE',
      button: 'Create Project',
    },
    task: {
      title: 'Create New Task',
      icon: PlusCircle,
      field1: 'Task Description',
      placeholder1: 'e.g. Implement GraphQL Caching Layer',
      field2: 'Assignee Email',
      placeholder2: 'e.g. alex@FlowForge.dev',
      button: 'Create Task',
    },
    invite: {
      title: 'Invite Team Member',
      icon: UserPlus,
      field1: 'Member Email Address',
      placeholder1: 'e.g. sarah@company.com',
      field2: 'Role',
      placeholder2: 'e.g. Senior Frontend Engineer',
      button: 'Send Invitation',
    },
    report: {
      title: 'Generate Workspace Report',
      icon: FileSpreadsheet,
      field1: 'Report Title',
      placeholder1: 'e.g. Q3 Sprint Productivity Summary',
      field2: 'Format',
      placeholder2: 'PDF / CSV Export',
      button: 'Generate Report',
    },
  };

  const currentConfig = config[type] || config.project;
  const ModalIcon = currentConfig.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showSuccess(`${currentConfig.title} successful: "${inputValue}"`);
      setInputValue('');
      setSecondaryInput('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
            <ModalIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{currentConfig.title}</h3>
            <p className="text-xs text-slate-400">FlowForge Instant Action Workflow</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {currentConfig.field1}
            </label>
            <input
              type="text"
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentConfig.placeholder1}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {currentConfig.field2}
            </label>
            <input
              type="text"
              value={secondaryInput}
              onChange={(e) => setSecondaryInput(e.target.value)}
              placeholder={currentConfig.placeholder2}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/20 flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentConfig.button}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
