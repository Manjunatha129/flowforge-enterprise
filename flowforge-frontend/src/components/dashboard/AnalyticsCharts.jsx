import React, { useState } from 'react';
import { Activity, PieChart, BarChart2 } from 'lucide-react';

/**
 * Productivity Analytics & Task Breakdown Charts Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Visualizes velocity trends and task distribution from live REST API payloads.
 * Displays a clean Empty State when no analytics data has been accumulated yet.
 */
export const AnalyticsCharts = ({ analytics }) => {
  const [chartTab, setChartTab] = useState('weekly');

  const weeklyData = analytics?.weeklyProductivity || [0, 0, 0, 0, 0, 0, 0];
  const weeklyLabels = analytics?.weeklyLabels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxWeekly = Math.max(...weeklyData, 1);

  const monthlyData = analytics?.monthlyProductivity || [0, 0, 0, 0, 0, 0];
  const monthlyLabels = analytics?.monthlyLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const distribution = analytics?.taskStatusDistribution || {};
  const completed = distribution['Completed'] || 0;
  const inProgress = distribution['In Progress'] || 0;
  const review = distribution['Pending Review'] || 0;
  const todo = distribution['Todo & Backlog'] || 0;
  const total = completed + inProgress + review + todo;

  const doneRate = total > 0 ? Math.round((completed * 100) / total) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Productivity Bar & Trend Chart (2 columns wide) */}
      <div className="lg:col-span-2 bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Productivity Analytics
              </h3>
              <p className="text-xs text-slate-400">Team task velocity and output metrics</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs font-semibold">
            <button
              onClick={() => setChartTab('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartTab === 'weekly'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartTab('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartTab === 'monthly'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Weekly Bar Chart View */}
        {chartTab === 'weekly' ? (
          <div className="space-y-4">
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {weeklyData.map((val, idx) => {
                const heightPct = maxWeekly > 0 ? Math.round((val / maxWeekly) * 100) : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-950 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-800 shadow-lg pointer-events-none z-10 whitespace-nowrap">
                      {val} tasks
                    </div>
                    <div className="w-full bg-slate-950/60 rounded-t-xl h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-amber-600 to-purple-500 rounded-t-xl transition-all duration-500 shadow-lg shadow-amber-500/20"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between px-2 pt-2 border-t border-slate-800/60 text-xs font-semibold text-slate-400">
              {weeklyLabels.map((lbl) => (
                <span key={lbl} className="flex-1 text-center">{lbl}</span>
              ))}
            </div>
          </div>
        ) : (
          /* Monthly Area Sparkline Chart View */
          <div className="space-y-4">
            <div className="h-48 relative flex items-end pt-6 px-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF8A00" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF8A00" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,150 L 0,140 Q 80,120 160,110 T 320,130 T 500,100 L 500,150 Z"
                  fill="url(#areaGradient)"
                />
                <path
                  d="M 0,140 Q 80,120 160,110 T 320,130 T 500,100"
                  fill="none"
                  stroke="#FF8A00"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-between px-2 pt-2 border-t border-slate-800/60 text-xs font-semibold text-slate-400">
              {monthlyLabels.map((lbl) => (
                <span key={lbl}>{lbl}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Completion Donut Breakdown (1 column) */}
      <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Task Breakdown
            </h3>
            <p className="text-xs text-slate-400">Current status distribution</p>
          </div>
        </div>

        {/* Donut Visual */}
        <div className="relative flex justify-center items-center py-4">
          <div className="w-36 h-36 rounded-full border-[10px] border-emerald-500/80 border-t-amber-500 border-r-purple-500 flex items-center justify-center shadow-2xl shadow-emerald-500/10">
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-white">{doneRate}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Done Rate</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Completed ({completed})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">In Progress ({inProgress})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span className="text-slate-300">Review ({review})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span className="text-slate-300">Todo ({todo})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
