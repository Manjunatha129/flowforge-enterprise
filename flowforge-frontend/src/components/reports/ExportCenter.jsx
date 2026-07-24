import React, { useState } from 'react';
import { FileText, FileSpreadsheet, FileCode, Download, Loader2 } from 'lucide-react';
import { reportsService } from '../../services/reportsService';
import { useToast } from '../../context/ToastContext';

/**
 * Export Center Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Provides direct document export controls (PDF, Excel, CSV) with loading animation spinners and toast alerts.
 */
export const ExportCenter = ({ filters }) => {
  const { showSuccess, showError } = useToast();

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);

  const handleExportPdf = async () => {
    try {
      setLoadingPdf(true);
      await reportsService.exportPdf(filters);
      showSuccess('PDF Executive Report downloaded successfully.');
    } catch (err) {
      console.error('PDF export error:', err);
      showError('Failed to export PDF report.');
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoadingExcel(true);
      await reportsService.exportExcel(filters);
      showSuccess('Excel Spreadsheet Report downloaded successfully.');
    } catch (err) {
      console.error('Excel export error:', err);
      showError('Failed to export Excel report.');
    } finally {
      setLoadingExcel(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setLoadingCsv(true);
      await reportsService.exportCsv(filters);
      showSuccess('CSV Tasks Report downloaded successfully.');
    } catch (err) {
      console.error('CSV export error:', err);
      showError('Failed to export CSV report.');
    } finally {
      setLoadingCsv(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <span>Report Export Center</span>
            <Download className="w-4 h-4 text-amber-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Export workspace reports directly to PDF, Excel, or CSV documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export PDF Button */}
        <button
          onClick={handleExportPdf}
          disabled={loadingPdf}
          className="p-5 bg-slate-950 border border-slate-800 hover:border-rose-500/40 rounded-xl flex items-center space-x-4 group transition-all text-left shadow-md disabled:opacity-50"
        >
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 group-hover:scale-105 transition-transform">
            {loadingPdf ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
          </div>
          <div>
            <div className="font-bold text-slate-100 text-xs sm:text-sm">Export PDF</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Formatted Executive PDF Report</div>
          </div>
        </button>

        {/* Export Excel Button */}
        <button
          onClick={handleExportExcel}
          disabled={loadingExcel}
          className="p-5 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl flex items-center space-x-4 group transition-all text-left shadow-md disabled:opacity-50"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-105 transition-transform">
            {loadingExcel ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileSpreadsheet className="w-6 h-6" />}
          </div>
          <div>
            <div className="font-bold text-slate-100 text-xs sm:text-sm">Export Excel</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Multi-Worksheet Spreadsheet</div>
          </div>
        </button>

        {/* Export CSV Button */}
        <button
          onClick={handleExportCsv}
          disabled={loadingCsv}
          className="p-5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl flex items-center space-x-4 group transition-all text-left shadow-md disabled:opacity-50"
        >
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-105 transition-transform">
            {loadingCsv ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileCode className="w-6 h-6" />}
          </div>
          <div>
            <div className="font-bold text-slate-100 text-xs sm:text-sm">Export CSV</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Raw Tabular Data Stream</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ExportCenter;
