import api from './api';

/**
 * Unified Comments Service Client.
 * 
 * WHY THIS SERVICE EXISTS:
 * Handles REST API calls (/api/v1/comments/**) for posting comments, fetching nested comment threads,
 * editing, deleting, and parsing @mentions.
 */
export const commentService = {
  // Get Comment Thread for Target (PROJECT, TASK, ATTACHMENT)
  getComments: async (targetType, targetId) => {
    const response = await api.get(`/comments?targetType=${targetType}&targetId=${targetId}`);
    return response.data.data;
  },

  // Create New Comment or Nested Reply
  createComment: async (data) => {
    const response = await api.post('/comments', data);
    return response.data.data;
  },

  // Edit Comment
  editComment: async (id, content) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data.data;
  },

  // Delete Comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};

export default commentService;
