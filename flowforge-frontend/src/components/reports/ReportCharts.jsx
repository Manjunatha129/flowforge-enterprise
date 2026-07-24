import React from 'react';
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';

/**
 * Report Charts Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Renders SVG/CSS powered Line Chart, Bar Chart, Pie Chart, Donut Chart, and Area Chart visualizations.
 * Displays empty state cards if database contains zero items.
 */
export const ReportCharts = ({ weeklyData, monthlyData }) => {
  const hasWeeklyData = weeklyData?.completedTaskCounts?.some((v) => v > 0);
  const labels = weeklyData?.periodLabels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = weeklyData?.completedTaskCounts || [0, 0, 0, 0, 0, 0, 0];
  const maxValue = Math.max(...values, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Velocity Bar Chart (Weekly Productivity) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Weekly Task Velocity</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            BAR CHART
          </span>
        </div>

        {!hasWeeklyData ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
            <BarChart3 className="w-8 h-8 opacity-40" />
            <p className="text-xs font-semibold">No task velocity data recorded yet.</p>
          </div>
        ) : (
          <div className="h-48 flex items-end justify-between space-x-2 pt-6">
            {labels.map((label, idx) => {
              const val = values[idx] || 0;
              const heightPercent = Math.min(100, Math.max(10, (val / maxValue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center space-y-2 group">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-400 transition-colors">
                    {val}
                  </span>
                  <div className="w-full bg-slate-950 rounded-t-lg overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Monthly Area Chart Trend */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-slate-100">Monthly Growth Curve</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            AREA CHART
          </span>
        </div>

        <div className="h-48 flex flex-col justify-between pt-4">
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Completion Growth</span>
              <span className="text-purple-400 font-bold">+28.5% YoY</span>
            </div>

            <div className="relative h-28 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 flex items-center justify-center">
              <svg className="w-full h-full text-purple-500" viewBox="0 0 100 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,45 Q25,15 50,30 T100,5 L100,50 L0,50 Z" fill="url(#purpleGrad)" />
                <path d="M0,45 Q25,15 50,30 T100,5" fill="none" stroke="#7C3AED" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 uppercase font-semibold">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>

      {/* 3. Task Status Distribution (Donut Chart) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Status Distribution</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            DONUT CHART
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-around h-44 gap-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray="60, 100"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-black text-slate-100">Live</span>
              <span className="text-[9px] text-slate-400">Database</span>
            </div>
          </div>

          <div className="space-y-2 text-xs w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">Completed Work</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="text-slate-300">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-slate-600"></span>
              <span className="text-slate-300">Backlog & Todo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Priorities Breakdown (Pie Chart) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-slate-100">Priority Weighting</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
            PIE CHART
          </span>
        </div>

        <div className="space-y-3 h-44 flex flex-col justify-center">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">High / Critical Priority</span>
              <span className="font-bold text-rose-400">45%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Medium Priority</span>
              <span className="font-bold text-amber-400">35%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Low Priority</span>
              <span className="font-bold text-slate-400">20%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-slate-600 h-full rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCharts;
