import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Plus, LayoutGrid, List, Sparkles } from 'lucide-react';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { DeleteTaskModal } from '../components/tasks/DeleteTaskModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';

export const TasksPage = () => {
  const { showSuccess, showError } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [labelFilter, setLabelFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');

  // Modals & Drawer State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [defaultStatusForNewTask, setDefaultStatusForNewTask] = useState('TODO');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks(null, sortBy);
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
      showError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sortBy]);

  // Client-side Filter Processing
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query)) ||
        (t.labels && t.labels.some((l) => l.toLowerCase().includes(query)));

      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      const matchesLabel = labelFilter === 'ALL' || (t.labels && t.labels.includes(labelFilter));

      return matchesSearch && matchesStatus && matchesPriority && matchesLabel;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, labelFilter]);

  // Handlers
  const handleOpenCreateModal = (status = 'TODO') => {
    setSelectedTaskForEdit(null);
    setDefaultStatusForNewTask(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTaskForEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    await taskService.updateTaskStatus(taskId, newStatus);
    showSuccess(`Task moved to ${newStatus.replace('_', ' ')}`);
  };

  const handleToggleStar = async (taskId) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, starred: !t.starred } : t)));
    await taskService.toggleStar(taskId);
  };

  const handleToggleArchive = async (taskId) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, archived: !t.archived } : t)));
    await taskService.toggleArchive(taskId);
    showSuccess('Task archive status toggled.');
  };

  const handleDuplicateTask = async (taskId) => {
    const duplicated = await taskService.duplicateTask(taskId);
    setTasks((prev) => [duplicated, ...prev]);
    showSuccess('Task duplicated successfully.');
  };

  const handleSaveTask = async (payload, existingId) => {
    if (existingId) {
      const updated = await taskService.updateTask(existingId, payload);
      setTasks((prev) => prev.map((t) => (t.id === existingId ? { ...t, ...updated } : t)));
    } else {
      const created = await taskService.createTask(payload);
      setTasks((prev) => [created, ...prev]);
    }
  };

  const handleConfirmDelete = async (id) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskForDetails?.id === id) {
      setSelectedTaskForDetails(null);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    if (selectedTaskForDetails?.id === updatedTask.id) {
      setSelectedTaskForDetails(updatedTask);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-2">
            <span>Task Management & Kanban Board</span>
            <Sparkles className="w-5 h-5 text-brand-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize team tasks, drag & drop status columns, track subtask velocity, and resolve issues
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenCreateModal('TODO')}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, description, or labels..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-brand-400" />
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

          <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <select
              value={labelFilter}
              onChange={(e) => setLabelFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Labels</option>
              <option value="Backend">Backend</option>
              <option value="Feature">Feature</option>
              <option value="UI">UI</option>
              <option value="Database">Database</option>
              <option value="API">API</option>
              <option value="Testing">Testing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Board / List View */}
      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner label="Loading Kanban board tasks..." />
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          onSelectTask={(task) => setSelectedTaskForDetails(task)}
          onToggleStar={handleToggleStar}
          onStatusChange={handleStatusChange}
          onCreateTask={(status) => handleOpenCreateModal(status)}
        />
      )}

      {/* Task Form Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        task={selectedTaskForEdit}
        defaultStatus={defaultStatusForNewTask}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmitSuccess={handleSaveTask}
      />

      {/* Task Details Side Drawer */}
      <TaskDetailDrawer
        isOpen={!!selectedTaskForDetails}
        task={selectedTaskForDetails}
        onClose={() => setSelectedTaskForDetails(null)}
        onEdit={(task) => {
          setSelectedTaskForDetails(null);
          handleOpenEditModal(task);
        }}
        onDelete={(task) => setTaskToDelete(task)}
        onToggleStar={handleToggleStar}
        onToggleArchive={handleToggleArchive}
        onDuplicate={handleDuplicateTask}
        onTaskUpdated={handleTaskUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTaskModal
        isOpen={!!taskToDelete}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default TasksPage;
