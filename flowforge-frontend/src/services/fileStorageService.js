import api from './api';

/**
 * File Storage Service Client.
 * 
 * WHY THIS SERVICE EXISTS:
 * Handles REST API calls (/api/v1/files/**) for file uploads, downloads, previews, renames, replacements, and deletions.
 */
export const fileStorageService = {
  // Get File Attachments List for Target
  getFiles: async (targetType, targetId) => {
    const response = await api.get(`/files?targetType=${targetType}&targetId=${targetId}`);
    return response.data.data;
  },

  // Get Single File Details
  getFileById: async (id) => {
    const response = await api.get(`/files/${id}`);
    return response.data.data;
  },

  // Upload File
  uploadFile: async (payload) => {
    const response = await api.post('/files/upload', payload);
    return response.data.data;
  },

  // Rename File
  renameFile: async (id, fileName) => {
    const response = await api.put(`/files/${id}/rename`, { fileName });
    return response.data.data;
  },

  // Replace File Data
  replaceFile: async (id, fileData) => {
    const response = await api.put(`/files/${id}/replace`, { fileData });
    return response.data.data;
  },

  // Delete File
  deleteFile: async (id) => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },
};

export default fileStorageService;
