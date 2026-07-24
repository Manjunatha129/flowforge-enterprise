import React, { useState, useEffect, useMemo } from 'react';
import { CheckSquare, Search, Filter, Trash2, Archive, RotateCcw, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

/**
 * Admin Task Oversight Page.
 * 
 * WHY THIS PAGE EXISTS:
 * Gives system administrators complete oversight over tasks across all projects,
 * workload distributions by engineer, overdue items, and task archives.
 */
export const AdminTasksPage = () => {
  const { showSuccess, showError } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks(null, 'createdAt');
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to fetch admin tasks:', err);
      showError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || t.title.toLowerCase().includes(q) || (t.assignedUser && t.assignedUser.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const handleToggleArchive = async (task) => {
    try {
      const updated = await taskService.toggleArchive(task.id);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, archived: updated.archived } : t)));
      showSuccess(`Task '${task.title}' archive status updated.`);
    } catch (err) {
      showError('Failed to update task archive status.');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      showSuccess(`Task '${taskToDelete.title}' deleted.`);
      setTaskToDelete(null);
    } catch (err) {
      showError('Failed to delete task.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-3">
            <span>Task Oversight & Workload Admin</span>
            <CheckSquare className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global administrative control over tasks, assigned workloads, overdue items, and task archives
          </p>
        </div>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or assigned engineer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="BACKLOG">Backlog</option>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <LoadingSpinner label="Loading workspace tasks..." />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
          <CheckSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Tasks Found</h3>
          <p className="text-xs text-slate-400">No tasks match your search or filter query.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Task Details</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Assigned Engineer</th>
                  <th className="py-3.5 px-4">Status & Priority</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{t.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{t.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-amber-400 font-semibold">{t.projectName}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-300 font-bold text-[10px] flex items-center justify-center border border-slate-700">
                          {t.assignedUserAvatar || 'U'}
                        </div>
                        <span className="text-slate-200 font-medium">{t.assignedUser}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-500/10 text-amber-300 border-amber-500/20">
                          {t.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border bg-slate-800 text-slate-400 border-slate-700">
                          {t.priority}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleArchive(t)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title={t.archived ? 'Restore Task' : 'Archive Task'}
                        >
                          {t.archived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setTaskToDelete(t)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {taskToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-rose-400">Admin Delete Task</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete task <span className="text-slate-100 font-bold">{taskToDelete.title}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setTaskToDelete(null)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl">Cancel</button>
              <button onClick={handleDeleteTask} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20">Delete Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasksPage;
