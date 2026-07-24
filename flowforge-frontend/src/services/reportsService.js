import api from './api';

/**
 * Reports & Analytics Client Service.
 * 
 * WHY THIS SERVICE EXISTS:
 * Handles HTTP GET requests for live database report metrics and POST requests for direct
 * binary file downloads (PDF, Excel, CSV) using HTML5 Blob URLs.
 */
export const reportsService = {
  // Get Executive Dashboard Overview
  getDashboard: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data.data;
  },

  // Get Project Analytics Reports
  getProjects: async () => {
    const response = await api.get('/reports/projects');
    return response.data.data;
  },

  // Get Task Analytics Reports
  getTasks: async () => {
    const response = await api.get('/reports/tasks');
    return response.data.data;
  },

  // Get User Productivity Reports
  getUsers: async () => {
    const response = await api.get('/reports/users');
    return response.data.data;
  },

  // Get Weekly Analytics
  getWeekly: async () => {
    const response = await api.get('/reports/weekly');
    return response.data.data;
  },

  // Get Monthly Analytics
  getMonthly: async () => {
    const response = await api.get('/reports/monthly');
    return response.data.data;
  },

  // Get Yearly Analytics
  getYearly: async () => {
    const response = await api.get('/reports/yearly');
    return response.data.data;
  },

  // Helper method to trigger direct browser binary file download
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Export PDF Report File
  exportPdf: async (filters = {}) => {
    const response = await api.post('/reports/export/pdf', filters, {
      responseType: 'blob',
    });
    reportsService.downloadBlob(new Blob([response.data], { type: 'application/pdf' }), 'FlowForge-executive-report.pdf');
  },

  // Export Excel Report File
  exportExcel: async (filters = {}) => {
    const response = await api.post('/reports/export/excel', filters, {
      responseType: 'blob',
    });
    reportsService.downloadBlob(new Blob([response.data], { type: 'application/vnd.ms-excel' }), 'FlowForge-analytics-report.xls');
  },

  // Export CSV Report File
  exportCsv: async (filters = {}) => {
    const response = await api.post('/reports/export/csv', filters, {
      responseType: 'blob',
    });
    reportsService.downloadBlob(new Blob([response.data], { type: 'text/csv' }), 'FlowForge-tasks-report.csv');
  },
};

export default reportsService;
