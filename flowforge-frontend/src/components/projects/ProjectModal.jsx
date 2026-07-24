import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProjectModal = ({ isOpen, project, onClose, onSubmitSuccess }) => {
  const { showSuccess, showError } = useToast();

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [status, setStatus] = useState('ACTIVE');
  const [priority, setPriority] = useState('MEDIUM');
  const [projectColor, setProjectColor] = useState('#0c93e7');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [membersStr, setMembersStr] = useState('SC, AC, DM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = !!project;

  useEffect(() => {
    if (project) {
      setProjectName(project.projectName || '');
      setDescription(project.description || '');
      setCategory(project.category || 'Engineering');
      setStatus(project.status || 'ACTIVE');
      setPriority(project.priority || 'MEDIUM');
      setProjectColor(project.projectColor || '#0c93e7');
      setStartDate(project.startDate || '');
      setDueDate(project.dueDate || '');
      setMembersStr(project.members ? project.members.join(', ') : 'SC, AC');
    } else {
      setProjectName('');
      setDescription('');
      setCategory('Engineering');
      setStatus('ACTIVE');
      setPriority('MEDIUM');
      setProjectColor('#0c93e7');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setMembersStr('SC, AC, DM');
    }
    setErrors({});
  }, [project, isOpen]);

  if (!isOpen) return null;

  const colorPresets = [
    '#0c93e7', // Brand Blue
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Rose
    '#8b5cf6', // Purple
    '#ec4899', // Pink
  ];

  const validate = () => {
    const errs = {};
    if (!projectName.trim()) {
      errs.projectName = 'Project name is required';
    } else if (projectName.trim().length < 2) {
      errs.projectName = 'Project name must be at least 2 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const membersArray = membersStr.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);

    const payload = {
      projectName: projectName.trim(),
      description: description.trim(),
      category,
      status,
      priority,
      projectColor,
      startDate: startDate || null,
      dueDate: dueDate || null,
      members: membersArray.length > 0 ? membersArray : ['SC', 'AC'],
    };

    try {
      await onSubmitSuccess(payload, project?.id);
      showSuccess(`Project "${projectName}" ${isEditMode ? 'updated' : 'created'} successfully!`);
      onClose();
    } catch (err) {
      console.error('Project submit error:', err);
      showError('Failed to save project. Please verify inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative space-y-5 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div
            className="p-3 rounded-xl shadow-md text-white flex items-center justify-center"
            style={{ backgroundColor: projectColor }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {isEditMode ? 'Edit Project Details' : 'Create New Project'}
            </h3>
            <p className="text-xs text-slate-400">FlowForge Workspace Management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Name *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Mobile SDK Engine v2"
              className={`w-full px-4 py-2.5 bg-slate-950/70 border ${errors.projectName ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
            />
            {errors.projectName && <p className="text-xs text-rose-400 font-medium">{errors.projectName}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe project objectives and scope..."
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            ></textarea>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Mobile">Mobile</option>
                <option value="Security">Security</option>
                <option value="AI / ML">AI / ML</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Status & Project Cover Color Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Cover Accent Color
              </label>
              <div className="flex items-center space-x-1.5 pt-1">
                {colorPresets.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setProjectColor(c)}
                    className={`w-6 h-6 rounded-full border transition-transform ${projectColor === c ? 'scale-125 border-white ring-2 ring-brand-400' : 'border-transparent hover:scale-110'
                      }`}
                    style={{ backgroundColor: c }}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Assigned Team Members (Initials comma separated)
            </label>
            <input
              type="text"
              value={membersStr}
              onChange={(e) => setMembersStr(e.target.value)}
              placeholder="e.g. SC, AC, DM"
              className="w-full px-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          {/* Submit Controls */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
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
              className="px-5 py-2.5 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/20 flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Project...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEditMode ? 'Update Project' : 'Create Project'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
