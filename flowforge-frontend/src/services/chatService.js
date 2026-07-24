import api from './api';
import { websocketService } from './websocketService';

/**
 * Enterprise Team Chat Service Client.
 * 
 * WHY THIS SERVICE EXISTS:
 * Handles REST API requests (/api/v1/chat/**) and STOMP WebSocket frame dispatches
 * for sending messages, typing signals, editing, deleting, pinning messages, and fetching channel histories & users.
 */
export const chatService = {
  // Fetch Workspace General Chat History
  getWorkspaceMessages: async () => {
    const response = await api.get('/chat/workspace');
    return response.data.data;
  },

  // Fetch Project Channel Chat History
  getProjectMessages: async (projectId) => {
    const response = await api.get(`/chat/project/${projectId}`);
    return response.data.data;
  },

  // Fetch Direct Message Thread with User
  getDirectMessages: async (arg1, arg2) => {
    const recipientEmail = arg2 || arg1;
    if (!recipientEmail) return [];
    const response = await api.get(`/chat/direct?user=${encodeURIComponent(recipientEmail)}`);
    return response.data.data;
  },

  // Fetch Registered Workspace Users for Direct Messages
  getWorkspaceUsers: async () => {
    const response = await api.get('/chat/users');
    return response.data.data;
  },

  // Mark Message as Read
  markAsRead: async (id) => {
    const response = await api.post(`/chat/${id}/read`);
    return response.data.data;
  },

  // Send Message via REST Fallback
  sendMessage: async (data) => {
    const response = await api.post('/chat/send', data);
    return response.data.data;
  },

  // Send Message via STOMP Frame
  sendStompMessage: async (data) => {
    if (websocketService.client && websocketService.client.connected) {
      websocketService.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(data),
      });
      return null;
    } else {
      // Fallback to REST API if WebSocket not connected
      return await chatService.sendMessage(data);
    }
  },

  // Send STOMP Typing Signal
  sendTypingSignal: (channelId, isTyping) => {
    if (websocketService.client && websocketService.client.connected) {
      websocketService.client.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          channelId,
          typing: isTyping,
        }),
      });
    }
  },

  // Edit Message
  editMessage: async (id, content) => {
    const response = await api.put(`/chat/${id}`, { content });
    return response.data.data;
  },

  // Delete Message
  deleteMessage: async (id) => {
    const response = await api.delete(`/chat/${id}`);
    return response.data;
  },

  // Toggle Pin Message
  togglePinMessage: async (id) => {
    const response = await api.patch(`/chat/${id}/pin`);
    return response.data.data;
  },

  // Search Messages by Keyword
  searchMessages: async (query) => {
    const response = await api.get(`/chat/search?query=${encodeURIComponent(query)}`);
    return response.data.data;
  },
};

export default chatService;
