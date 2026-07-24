import React, { useState, useEffect } from 'react';
import { FileText, Filter, Calendar, RefreshCw, BarChart2 } from 'lucide-react';
import { reportsService } from '../services/reportsService';
import { ReportSummaryCards } from '../components/reports/ReportSummaryCards';
import { ReportCharts } from '../components/reports/ReportCharts';
import { TeamProductivityTable } from '../components/reports/TeamProductivityTable';
import { ExportCenter } from '../components/reports/ExportCenter';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

/**
 * Reports & Analytics Dashboard Page.
 * 
 * WHY THIS PAGE EXISTS:
 * Serves as the central executive hub for workspace analytics, task velocity, team productivity,
 * interactive SVG/CSS charts, and multi-format document exporting.
 * All metrics are calculated dynamically from live database records.
 */
export const ReportsPage = () => {
  const [overview, setOverview] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'ALL',
    priority: 'ALL',
    category: 'ALL',
  });

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [overviewRes, weeklyRes, monthlyRes] = await Promise.all([
        reportsService.getDashboard(),
        reportsService.getWeekly(),
        reportsService.getMonthly(),
      ]);

      setOverview(overviewRes);
      setWeeklyData(weeklyRes);
      setMonthlyData(monthlyRes);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-3">
            <span>Executive Reports & Analytics</span>
            <BarChart2 className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time project completion velocity, team productivity, status weighting, and document exports
          </p>
        </div>

        <button
          onClick={fetchReportData}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Reports</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Report Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="TODO">Todo</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner label="Computing analytics from live database..." />
        </div>
      ) : (
        <>
          {/* Executive Summary Cards */}
          <ReportSummaryCards overview={overview} />

          {/* Export Center Panel */}
          <ExportCenter filters={filters} />

          {/* Interactive SVG/CSS Visual Analytics Charts */}
          <ReportCharts weeklyData={weeklyData} monthlyData={monthlyData} />

          {/* Team Productivity Breakdown Table */}
          <TeamProductivityTable userPerformance={overview?.userPerformance} />
        </>
      )}
    </div>
  );
};

export default ReportsPage;
