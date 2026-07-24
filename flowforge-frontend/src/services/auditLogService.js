import api from './api';

/**
 * Audit Log Service.
 * 
 * PURPOSE:
 * Intercepts calls to backend /api/v1/admin/audit-logs REST endpoints.
 */
export const auditLogService = {
  getLogs: async (module = '', query = '') => {
    const params = {};
    if (module && module !== 'ALL') params.module = module;
    if (query) params.query = query;

    const response = await api.get('/admin/audit-logs', { params });
    return response.data.data;
  },
};

export default auditLogService;
