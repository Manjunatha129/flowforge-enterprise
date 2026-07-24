import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, PlusCircle } from 'lucide-react';

/**
 * Upcoming Deadlines Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Displays critical task deadlines or a clean Empty State card when no deadlines are approaching.
 */
export const UpcomingDeadlines = ({ deadlines }) => {
  const navigate = useNavigate();
  const list = deadlines || [];

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Upcoming Deadlines
            </h3>
            <p className="text-xs text-slate-400">Critical deliverables due soon</p>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="p-6 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-center space-y-2">
          <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">No Upcoming Deadlines</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All tasks are on track. Create a task with a due date to set milestone deadlines.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl space-x-3"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="text-xs font-bold text-slate-200 truncate">{item.task}</div>
                <div className="text-[11px] text-slate-400 truncate">{item.project}</div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-500/10 text-amber-300 border-amber-500/20">
                  {item.priority || 'MEDIUM'}
                </span>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-400">{item.remainingDays} days</span>
                  <span className="block text-[10px] text-slate-500">remaining</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
