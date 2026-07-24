package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Notification JPA Entity.
 * 
 * PURPOSE OF THIS CLASS:
 * Represents system notification records persisted in the "notifications"
 * database table.
 * It tracks user alert messages, urgency priority, read/unread status, and
 * related project/task metadata.
 * 
 * WHERE IT IS USED:
 * Managed by NotificationRepository and NotificationServiceImpl to provide
 * notification center feeds.
 * 
 * ANNOTATIONS EXPLAINED:
 * - @Entity: Tells JPA/Hibernate to map this class to a database table.
 * - @Table(name = "notifications"): Specifies the physical SQL table name.
 * - @Enumerated(EnumType.STRING): Stores enum values as readable string names
 * ('HIGH', 'TASK_ASSIGNED').
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    /** Short title summary of the notification */
    @Column(name = "title", nullable = false)
    private String title;

    /** Detailed message description */
    @Column(name = "message", length = 1000, nullable = false)
    private String message;

    /** Icon identifier string (e.g. 'folder-plus', 'check-circle', 'user-plus') */
    @Column(name = "icon")
    private String icon;

    /** Categorized event type */
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private NotificationType type;

    /** Urgency priority (HIGH, MEDIUM, LOW) */
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    @Builder.Default
    private NotificationPriority priority = NotificationPriority.MEDIUM;

    /** Read or unread status boolean flag */
    @Column(name = "read_status", nullable = false)
    @Builder.Default
    private boolean readStatus = false;

    /** Sender user name or system entity */
    @Column(name = "sender")
    private String sender;

    /** Receiver user email address */
    @Column(name = "receiver", nullable = false)
    private String receiver;

    /** Optional related project name or ID */
    @Column(name = "related_project")
    private String relatedProject;

    /** Optional related task title or ID */
    @Column(name = "related_task")
    private String relatedTask;

    /** Optional navigation action URL */
    @Column(name = "action_url")
    private String actionUrl;
}
