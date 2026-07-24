package com.flowforge.dto;

import com.flowforge.entity.NotificationPriority;
import com.flowforge.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Notification Data Transfer Object (DTO).
 * 
 * PURPOSE:
 * Encapsulates notification properties returned to the React frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private UUID id;
    private String title;
    private String message;
    private String icon;
    private NotificationType type;
    private NotificationPriority priority;
    private boolean readStatus;
    private String sender;
    private String receiver;
    private String relatedProject;
    private String relatedTask;
    private String actionUrl;
    private LocalDateTime createdAt;
}
