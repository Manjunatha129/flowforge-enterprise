import api from './api';

/**
 * Admin Service.
 * 
 * PURPOSE:
 * Intercepts calls to backend /api/v1/admin endpoints for system stats, user management,
 * promotion/demotion, status toggles, password resets, and system settings.
 */
export const adminService = {
  // Get Admin Dashboard Stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  // Get All Users List
  getUsers: async (search = '', role = '', enabled = '') => {
    const params = {};
    if (search) params.search = search;
    if (role && role !== 'ALL') params.role = role;
    if (enabled !== '' && enabled !== 'ALL') params.enabled = enabled;

    const response = await api.get('/admin/users', { params });
    return response.data.data;
  },

  // Update User Role (Promote / Demote)
  updateRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data.data;
  },

  // Toggle User Status (Activate / Deactivate)
  toggleStatus: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/status`);
    return response.data.data;
  },

  // Admin Reset User Password
  resetPassword: async (userId, newPassword) => {
    const response = await api.post(`/admin/users/${userId}/reset-password`, newPassword, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },

  // Delete User
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Get System Settings
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data.data;
  },

  // Update System Settings
  updateSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data.data;
  },
};

export default adminService;
