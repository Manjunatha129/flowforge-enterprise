import api from './api';

/**
 * Profile & User Account Service Client.
 * 
 * WHY THIS SERVICE EXISTS:
 * Intercepts HTTP calls to backend /api/v1/profile REST endpoints for editing personal info,
 * uploading/deleting profile pictures, changing passwords, saving workspace/theme settings, and exporting account data.
 */
export const profileService = {
  // Get Current Profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data.data;
  },

  // Update Profile Info
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data.data;
  },

  // Upload Profile Avatar (Base64)
  uploadAvatar: async (base64Image) => {
    const response = await api.post('/profile/avatar', { image: base64Image });
    return response.data.data;
  },

  // Delete Profile Avatar
  deleteAvatar: async () => {
    const response = await api.delete('/profile/avatar');
    return response.data.data;
  },

  // Change Password
  changePassword: async (data) => {
    const response = await api.post('/profile/change-password', data);
    return response.data;
  },

  // Update Workspace Settings
  updateWorkspace: async (data) => {
    const response = await api.put('/profile/workspace', data);
    return response.data.data;
  },

  // Update Notification Preferences
  updateNotifications: async (data) => {
    const response = await api.put('/profile/notifications', data);
    return response.data.data;
  },

  // Update Appearance Preferences
  updateAppearance: async (data) => {
    const response = await api.put('/profile/appearance', data);
    return response.data.data;
  },

  // Download Account Data JSON
  exportData: async () => {
    const response = await api.get('/profile/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'FlowForge-account-data.json');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Deactivate Account
  deactivateAccount: async () => {
    const response = await api.patch('/profile/deactivate');
    return response.data;
  },

  // Delete Account Permanently
  deleteAccount: async (password) => {
    const response = await api.delete('/profile', { data: { password } });
    return response.data;
  },
};

export default profileService;
