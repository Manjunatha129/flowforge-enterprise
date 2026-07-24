package com.flowforge.service;

import com.flowforge.dto.NotificationDto;
import com.flowforge.entity.NotificationPriority;
import com.flowforge.entity.NotificationType;

import java.util.List;
import java.util.UUID;

/**
 * Notification Service Interface.
 * 
 * PURPOSE:
 * Declares business contracts for creating, retrieving, filtering, and managing
 * notifications.
 */
public interface NotificationService {

    List<NotificationDto> getNotifications(String receiver);

    List<NotificationDto> getUnreadNotifications(String receiver);

    long getUnreadCount(String receiver);

    NotificationDto markAsRead(UUID id);

    void markAllAsRead(String receiver);

    void deleteNotification(UUID id);

    void clearAllNotifications(String receiver);

    void createNotification(
            String title,
            String message,
            String icon,
            NotificationType type,
            NotificationPriority priority,
            String sender,
            String receiver,
            String relatedProject,
            String relatedTask,
            String actionUrl);
}
