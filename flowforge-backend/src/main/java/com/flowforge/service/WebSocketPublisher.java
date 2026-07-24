package com.flowforge.service;

import com.flowforge.dto.NotificationDto;
import com.flowforge.dto.ProjectDto;
import com.flowforge.dto.TaskDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * WebSocket Real-Time Event Publisher Service.
 * 
 * WHY THIS CLASS EXISTS:
 * Serves as the central real-time event broadcasting service across the
 * backend.
 * Uses SimpMessagingTemplate to broadcast instant STOMP events for
 * notifications,
 * dashboard metric updates, task column changes, project CRUD events, and
 * activity stream items
 * so connected web clients refresh UI elements live without page reloads.
 */
@Service
public class WebSocketPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Broadcast instant notification payload to public topic and private receiver
     * queue.
     */
    public void publishNotification(NotificationDto notification) {
        if (notification == null)
            return;

        // Public notifications broadcast channel
        messagingTemplate.convertAndSend("/topic/notifications", notification);

        // Private user-specific queue broadcast
        if (notification.getReceiver() != null && !notification.getReceiver().isBlank()) {
            messagingTemplate.convertAndSendToUser(
                    notification.getReceiver().toLowerCase().trim(),
                    "/queue/notifications",
                    notification);
        }

        // Trigger dashboard auto-refresh signal
        publishDashboardSignal("NOTIFICATION_CREATED", notification.getReceiver());
    }

    /**
     * Broadcast Project CRUD event (CREATE, UPDATE, DELETE).
     */
    public void publishProjectEvent(String action, ProjectDto project) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("action", action); // "PROJECT_CREATED", "PROJECT_UPDATED", "PROJECT_DELETED"
        payload.put("project", project);
        payload.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend("/topic/projects", payload);
        publishDashboardSignal(action, project != null ? project.getCreatedBy() : null);
    }

    /**
     * Broadcast Task CRUD event (CREATE, UPDATE, COMPLETED, DELETED).
     */
    public void publishTaskEvent(String action, TaskDto task) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("action", action); // "TASK_CREATED", "TASK_UPDATED", "TASK_COMPLETED", "TASK_DELETED"
        payload.put("task", task);
        payload.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend("/topic/tasks", payload);
        publishDashboardSignal(action, task != null ? task.getAssignedUser() : null);
    }

    /**
     * Broadcast Live Dashboard Refresh Signal (/topic/dashboard).
     */
    public void publishDashboardSignal(String eventType, String userEmail) {
        Map<String, Object> signal = new HashMap<>();
        signal.put("eventType", eventType);
        signal.put("userEmail", userEmail);
        signal.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend("/topic/dashboard", signal);
    }
}
