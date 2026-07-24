import React from 'react';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

export const KanbanBoard = ({ tasks = [], onSelectTask, onToggleStar, onStatusChange, onCreateTask }) => {
  const columns = [
    { key: 'BACKLOG', label: 'Backlog', color: 'bg-slate-500', headerBg: 'border-slate-700' },
    { key: 'TODO', label: 'Todo', color: 'bg-brand-500', headerBg: 'border-brand-500/40' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-cyan-500', headerBg: 'border-cyan-500/40' },
    { key: 'REVIEW', label: 'Review', color: 'bg-purple-500', headerBg: 'border-purple-500/40' },
    { key: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500', headerBg: 'border-emerald-500/40' },
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key && !t.archived);

        return (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.key)}
            className="flex flex-col bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100/80 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 rounded-2xl p-3 min-h-[600px] shadow-inner space-y-3"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border-t-2 ${col.headerBg} border-x border-b border-slate-800/90 shadow`}>
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  {col.label}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-extrabold text-[10px] rounded-full border border-slate-700">
                {columnTasks.length}
              </span>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => onCreateTask(col.key)}
              className="w-full py-1.5 border border-dashed border-slate-800 hover:border-brand-500/50 hover:bg-brand-500/5 rounded-xl text-slate-500 hover:text-brand-400 text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>

            {/* Tasks Cards Stack */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl text-slate-600 text-xs">
                  Drop tasks here
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={onSelectTask}
                    onToggleStar={onToggleStar}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
