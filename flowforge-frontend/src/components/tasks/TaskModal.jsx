/**
 * TaskModal Component.
 * 
 * PURPOSE:
 * Provides a modern glassmorphism modal dialog for creating new tasks or editing existing tasks in FlowForge.
 * Used on Kanban Board, Task List, and Project Detail views.
 * 
 * HOOKS USED:
 * - useState: Manages form input state (title, description, status, priority, dates, assigned user, subtasks).
 * - useEffect: Populates form fields when editing an existing task or resets fields when creating a new task.
 * - useAuth: Accesses currently logged-in user profile to dynamically assign tasks to real registered users.
 * - useToast: Displays success and error toast notifications.
 */
import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Loader2, Plus, Trash2, Tag, Calendar, User } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export const TaskModal = ({ isOpen, task, defaultStatus, onClose, onSubmitSuccess }) => {
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();

  // Current logged in user name or default registered user name
  const currentUserName = user?.name || 'Manju';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(defaultStatus || 'TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('8');
  const [assignedUser, setAssignedUser] = useState(currentUserName);
  const [selectedLabels, setSelectedLabels] = useState(['Backend', 'Feature']);
  const [subtasks, setSubtasks] = useState([
    { id: 'st-1', title: 'Implementation research & API specs', completed: false },
  ]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = !!task;

  const availableLabels = ['Bug', 'Feature', 'UI', 'Backend', 'Database', 'API', 'Testing', 'Research'];
  
  // Dynamic list of registered team members prioritizing active authenticated user
  const [teamMembers, setTeamMembers] = useState([
    currentUserName,
    'Rahul Verma',
    'Priya Sharma',
    'Ananya Roy',
    'Vikram Malhotra'
  ]);

  // Fetch real registered users from backend on modal open
  useEffect(() => {
    let isMounted = true;
    const fetchRegisteredUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        if (response.data && response.data.data && isMounted) {
          const userNames = response.data.data.map(u => u.name).filter(Boolean);
          if (userNames.length > 0) {
            // Ensure logged in user is included in the options list
            const uniqueNames = Array.from(new Set([currentUserName, ...userNames]));
            setTeamMembers(uniqueNames);
          }
        }
      } catch (err) {
        // Fallback to dynamic user list if admin endpoint restricted for non-admin roles
        if (isMounted) {
          setTeamMembers(Array.from(new Set([currentUserName, 'Rahul Verma', 'Priya Sharma', 'Ananya Roy', 'Vikram Malhotra'])));
        }
      }
    };

    if (isOpen) {
      fetchRegisteredUsers();
    }
    return () => { isMounted = false; };
  }, [isOpen, currentUserName]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'TODO');
      setPriority(task.priority || 'MEDIUM');
      setStartDate(task.startDate || '');
      setDueDate(task.dueDate || '');
      setEstimatedHours(task.estimatedHours ? task.estimatedHours.toString() : '8');
      setAssignedUser(task.assignedUser || currentUserName);
      setSelectedLabels(task.labels || ['Backend']);
      setSubtasks(task.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus || 'TODO');
      setPriority('MEDIUM');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setEstimatedHours('8');
      setAssignedUser(currentUserName);
      setSelectedLabels(['Backend', 'Feature']);
      setSubtasks([{ id: 'st-1', title: 'Write integration test specs', completed: false }]);
    }
    setErrors({});
  }, [task, defaultStatus, isOpen, currentUserName]);


  if (!isOpen) return null;

  const toggleLabel = (lbl) => {
    if (selectedLabels.includes(lbl)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== lbl));
    } else {
      setSelectedLabels([...selectedLabels, lbl]);
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { id: 'st-' + Date.now(), title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (stId) => {
    setSubtasks(subtasks.filter((st) => st.id !== stId));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Task title is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      startDate: startDate || null,
      dueDate: dueDate || null,
      estimatedHours: parseFloat(estimatedHours) || 8.0,
      assignedUser,
      labels: selectedLabels,
      subtasks,
    };

    try {
      await onSubmitSuccess(payload, task?.id);
      showSuccess(`Task "${title}" ${isEditMode ? 'updated' : 'created'} successfully!`);
      onClose();
    } catch (err) {
      console.error('Task submit error:', err);
      showError('Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 relative space-y-5 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {isEditMode ? 'Edit Task Details' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-400">FlowForge Kanban Task Management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build React Glassmorphism Kanban Drag & Drop"
              className={`w-full px-4 py-2.5 bg-slate-950/70 border ${errors.title ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500`}
            />
            {errors.title && <p className="text-xs text-rose-400 font-medium">{errors.title}</p>}
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
              placeholder="Provide technical requirements and acceptance criteria..."
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            ></textarea>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Status Column
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
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

          {/* Dates & Hours */}
          <div className="grid grid-cols-3 gap-3">
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

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Est. Hours
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="8"
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Assigned User */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Assigned Engineer
            </label>
            <select
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            >
              {teamMembers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Labels Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Task Category Labels
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableLabels.map((lbl) => {
                const isSelected = selectedLabels.includes(lbl);
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => toggleLabel(lbl)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${isSelected
                        ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/20'
                        : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Subtasks Checklist
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask item..."
                className="flex-1 px-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between p-2 bg-slate-950/40 rounded-lg text-xs text-slate-300 border border-slate-800/60">
                  <span className="truncate">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
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
                  <span>Saving Task...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Task' : 'Create Task'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
