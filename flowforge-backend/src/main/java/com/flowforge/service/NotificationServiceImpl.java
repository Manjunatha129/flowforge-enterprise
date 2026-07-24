package com.flowforge.service;

import com.flowforge.dto.NotificationDto;
import com.flowforge.entity.Notification;
import com.flowforge.entity.NotificationPriority;
import com.flowforge.entity.NotificationType;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Notification Service Implementation.
 * 
 * PURPOSE:
 * Implements notification business logic, database queries, and initial seed
 * notification data.
 * 
 * ANNOTATION EXPLAINED:
 * - @Service: Marks this class as a Spring Service bean for injection into
 * controllers.
 * - @Transactional: Ensures database transactions commit atomically.
 */
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final WebSocketPublisher webSocketPublisher;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            WebSocketPublisher webSocketPublisher) {
        this.notificationRepository = notificationRepository;
        this.webSocketPublisher = webSocketPublisher;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getNotifications(String receiver) {
        String targetUser = (receiver == null || receiver.isBlank()) ? "admin@FlowForge.com" : receiver;
        return notificationRepository.findByReceiverOrderByCreatedAtDesc(targetUser)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getUnreadNotifications(String receiver) {
        String targetUser = (receiver == null || receiver.isBlank()) ? "admin@FlowForge.com" : receiver;
        return notificationRepository.findByReceiverAndReadStatusOrderByCreatedAtDesc(targetUser, false)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String receiver) {
        String targetUser = (receiver == null || receiver.isBlank()) ? "admin@FlowForge.com" : receiver;
        return notificationRepository.countByReceiverAndReadStatus(targetUser, false);
    }

    @Override
    @Transactional
    public NotificationDto markAsRead(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notification.setReadStatus(true);
        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = mapToDto(saved);
        webSocketPublisher.publishNotification(dto);
        return dto;
    }

    @Override
    @Transactional
    public void markAllAsRead(String receiver) {
        String targetUser = (receiver == null || receiver.isBlank()) ? "admin@FlowForge.com" : receiver;
        notificationRepository.markAllAsReadForReceiver(targetUser);
        webSocketPublisher.publishDashboardSignal("NOTIFICATIONS_READ_ALL", targetUser);
    }

    @Override
    @Transactional
    public void deleteNotification(UUID id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification", "id", id);
        }
        notificationRepository.deleteById(id);
        webSocketPublisher.publishDashboardSignal("NOTIFICATION_DELETED", null);
    }

    @Override
    @Transactional
    public void clearAllNotifications(String receiver) {
        String targetUser = (receiver == null || receiver.isBlank()) ? "admin@FlowForge.com" : receiver;
        notificationRepository.deleteAllByReceiver(targetUser);
        webSocketPublisher.publishDashboardSignal("NOTIFICATIONS_CLEARED", targetUser);
    }

    @Override
    @Transactional
    public void createNotification(
            String title,
            String message,
            String icon,
            NotificationType type,
            NotificationPriority priority,
            String sender,
            String receiver,
            String relatedProject,
            String relatedTask,
            String actionUrl) {
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .icon(icon != null ? icon : "bell")
                .type(type)
                .priority(priority != null ? priority : NotificationPriority.MEDIUM)
                .readStatus(false)
                .sender(sender != null ? sender : "System")
                .receiver(receiver != null ? receiver : "admin@FlowForge.com")
                .relatedProject(relatedProject)
                .relatedTask(relatedTask)
                .actionUrl(actionUrl)
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = mapToDto(saved);
        webSocketPublisher.publishNotification(dto);
    }

    private NotificationDto mapToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .icon(notification.getIcon())
                .type(notification.getType())
                .priority(notification.getPriority())
                .readStatus(notification.isReadStatus())
                .sender(notification.getSender())
                .receiver(notification.getReceiver())
                .relatedProject(notification.getRelatedProject())
                .relatedTask(notification.getRelatedTask())
                .actionUrl(notification.getActionUrl())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    /** Pre-seeds initial realistic notification records if table is empty */
    private void initSeedNotifications() {
        if (notificationRepository.count() == 0) {
            String defaultUser = "admin@FlowForge.com";

            createNotification(
                    "New High-Priority Task Assigned",
                    "Alex Chen assigned 'Build React Glassmorphism Kanban Drag & Drop Engine' to you.",
                    "check-circle",
                    NotificationType.TASK_ASSIGNED,
                    NotificationPriority.HIGH,
                    "Alex Chen",
                    defaultUser,
                    "FlowForge SaaS Workspace",
                    "Build React Glassmorphism Kanban Drag & Drop Engine",
                    "/tasks");

            createNotification(
                    "Project Status Updated",
                    "Elena Rostova updated 'Mobile Native Engine (iOS/Android)' status to ACTIVE.",
                    "folder-plus",
                    NotificationType.PROJECT_UPDATED,
                    NotificationPriority.MEDIUM,
                    "Elena Rostova",
                    defaultUser,
                    "Mobile Native Engine",
                    null,
                    "/projects");

            createNotification(
                    "Task Overdue Warning",
                    "Task 'Configure Production MySQL Master Cluster' reached due date without completion.",
                    "alert-triangle",
                    NotificationType.TASK_OVERDUE,
                    NotificationPriority.HIGH,
                    "System Monitor",
                    defaultUser,
                    "High-Availability Database Cluster",
                    "Configure Production MySQL Master Cluster",
                    "/tasks");

            createNotification(
                    "New Team Member Joined",
                    "Marcus Vance accepted workspace invitation and joined as DevOps Specialist.",
                    "user-plus",
                    NotificationType.MEMBER_JOINED,
                    NotificationPriority.LOW,
                    "Marcus Vance",
                    defaultUser,
                    "FlowForge SaaS Workspace",
                    null,
                    "/projects");

            createNotification(
                    "New Comment Posted",
                    "Sophia Lin commented: 'Verified JWT bearer authentication filter with Postman suite.'",
                    "message-square",
                    NotificationType.COMMENT_ADDED,
                    NotificationPriority.LOW,
                    "Sophia Lin",
                    defaultUser,
                    "FlowForge SaaS Workspace",
                    "Spring Security 6 Stateless JWT Filter",
                    "/tasks");
        }
    }
}
