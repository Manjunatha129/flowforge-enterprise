import api from './api';

/**
 * Notification Frontend API Service.
 * 
 * WHY THIS MODULE EXISTS:
 * Encapsulates all HTTP REST API calls (/api/v1/notifications/*) between the React frontend
 * and Spring Boot backend for fetching notifications, unread counts, marking read, and clearing.
 */
export const notificationService = {
  /** Fetch all notifications for current user */
  async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  },

  /** Fetch unread notifications */
  async getUnreadNotifications() {
    const response = await api.get('/notifications/unread');
    return response.data;
  },

  /** Fetch unread count for badge */
  async getUnreadCount() {
    const response = await api.get('/notifications/count');
    return response.data;
  },

  /** Mark single notification as read */
  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  /** Mark all notifications as read */
  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  /** Delete single notification */
  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  /** Clear all notifications */
  async clearAllNotifications() {
    const response = await api.delete('/notifications/clear');
    return response.data;
  },
};
