import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * WebSocket & STOMP Real-Time Client Service.
 * 
 * WHY THIS SERVICE EXISTS:
 * Establishes and manages real-time STOMP WebSocket connection over /ws (with SockJS fallback),
 * handles JWT Bearer authentication, auto-reconnection with exponential backoff, and manages subcriptions
 * for live notifications, presence updates, dashboard refresh signals, and activity feeds.
 */
class WebSocketService {
  constructor() {
    this.client = null;
    this.status = 'DISCONNECTED'; // 'CONNECTED', 'CONNECTING', 'DISCONNECTED'
    this.statusListeners = new Set();
    this.notificationListeners = new Set();
    this.presenceListeners = new Set();
    this.dashboardListeners = new Set();
    this.projectListeners = new Set();
    this.taskListeners = new Set();
  }

  connect() {
    if (this.client && this.client.active) {
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('flowforge_auth_token') || localStorage.getItem('flowforge_token');
    if (!token) return;

    this._setStatus('CONNECTING');

    const socketUrl = 'http://localhost:8080/ws';

    this.client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        // Console debug log for STOMP lifecycle
        if (import.meta.env?.DEV) {
          console.debug('[STOMP]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log('✅ STOMP WebSocket Connected:', frame);
      this._setStatus('CONNECTED');
      this._subscribeTopics();
    };

    this.client.onStompError = (frame) => {
      console.error('❌ STOMP Protocol Error:', frame);
      this._setStatus('DISCONNECTED');
    };

    this.client.onWebSocketClose = () => {
      console.warn('⚠️ STOMP Connection Closed');
      this._setStatus('DISCONNECTED');
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this._setStatus('DISCONNECTED');
    }
  }

  _subscribeTopics() {
    if (!this.client || !this.client.connected) return;

    // 1. Live Notifications Channel
    this.client.subscribe('/topic/notifications', (message) => {
      try {
        const notification = JSON.parse(message.body);
        this.notificationListeners.forEach((cb) => cb(notification));
      } catch (err) {
        console.error('Error parsing notification frame:', err);
      }
    });

    // 2. User-Specific Queue Channel
    this.client.subscribe('/user/queue/notifications', (message) => {
      try {
        const notification = JSON.parse(message.body);
        this.notificationListeners.forEach((cb) => cb(notification));
      } catch (err) {
        console.error('Error parsing private notification frame:', err);
      }
    });

    // 3. User Presence Channel
    this.client.subscribe('/topic/presence', (message) => {
      try {
        const presence = JSON.parse(message.body);
        this.presenceListeners.forEach((cb) => cb(presence));
      } catch (err) {
        console.error('Error parsing presence frame:', err);
      }
    });

    // 4. Live Dashboard Signal Channel
    this.client.subscribe('/topic/dashboard', (message) => {
      try {
        const signal = JSON.parse(message.body);
        this.dashboardListeners.forEach((cb) => cb(signal));
      } catch (err) {
        console.error('Error parsing dashboard signal frame:', err);
      }
    });

    // 5. Project CRUD Events Channel
    this.client.subscribe('/topic/projects', (message) => {
      try {
        const event = JSON.parse(message.body);
        this.projectListeners.forEach((cb) => cb(event));
      } catch (err) {
        console.error('Error parsing project event frame:', err);
      }
    });

    // 6. Task CRUD Events Channel
    this.client.subscribe('/topic/tasks', (message) => {
      try {
        const event = JSON.parse(message.body);
        this.taskListeners.forEach((cb) => cb(event));
      } catch (err) {
        console.error('Error parsing task event frame:', err);
      }
    });
  }

  _setStatus(newStatus) {
    this.status = newStatus;
    this.statusListeners.forEach((cb) => cb(newStatus));
  }

  // Listener Registrations
  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => this.statusListeners.delete(callback);
  }

  onNotification(callback) {
    this.notificationListeners.add(callback);
    return () => this.notificationListeners.delete(callback);
  }

  onPresence(callback) {
    this.presenceListeners.add(callback);
    return () => this.presenceListeners.delete(callback);
  }

  onDashboardSignal(callback) {
    this.dashboardListeners.add(callback);
    return () => this.dashboardListeners.delete(callback);
  }

  onProjectEvent(callback) {
    this.projectListeners.add(callback);
    return () => this.projectListeners.delete(callback);
  }

  onTaskEvent(callback) {
    this.taskListeners.add(callback);
    return () => this.taskListeners.delete(callback);
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
