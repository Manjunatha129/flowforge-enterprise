import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Clock, CheckCircle2, PlusCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

/**
 * Today's Tasks Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Displays today's tasks or a clean Empty State card with [ Create Task ] CTA when empty.
 */
export const TodayTasks = ({ initialTasks }) => {
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks || []);

  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
          showSuccess(`Task updated to ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Today's Task Agenda
            </h3>
            <p className="text-xs text-slate-400">Scheduled action items for your shift</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="text-xs text-amber-400 font-semibold hover:underline"
        >
          View Kanban
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">No Tasks Scheduled for Today</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Create your first task to start tracking work items on your Kanban board.
            </p>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 mx-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                task.status === 'COMPLETED'
                  ? 'bg-slate-950/20 border-slate-800/40 opacity-75'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-white'
                  }`}
                  title="Toggle Task Status"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="min-w-0 space-y-0.5">
                  <div
                    className={`text-xs font-semibold text-slate-100 truncate ${
                      task.status === 'COMPLETED' ? 'line-through text-slate-500' : ''
                    }`}
                  >
                    {task.taskName}
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="text-amber-400 font-medium">{task.projectName}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{task.dueTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-500/10 text-amber-300 border-amber-500/20">
                  {task.priority || 'MEDIUM'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
