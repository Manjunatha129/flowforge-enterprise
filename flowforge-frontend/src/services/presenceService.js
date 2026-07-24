import api from './api';

/**
 * Presence REST Client Service.
 * 
 * WHY THIS SERVICE EXISTS:
 * Intercepts HTTP requests to /api/v1/presence endpoints for querying online users list, counts, and status.
 */
export const presenceService = {
  // Get List of Online Users
  getOnlineUsers: async () => {
    const response = await api.get('/presence/online');
    return response.data.data;
  },

  // Get Online Count
  getOnlineCount: async () => {
    const response = await api.get('/presence/count');
    return response.data.data;
  },

  // Get User Presence Status
  getUserPresence: async (email) => {
    const response = await api.get(`/presence/users/${encodeURIComponent(email)}`);
    return response.data.data;
  },
};

export default presenceService;
