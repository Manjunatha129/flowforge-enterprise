package com.flowforge.entity;

/**
 * Notification Type Enum.
 * 
 * PURPOSE:
 * Categorizes system events triggered across projects, tasks, workspace
 * members, and documents.
 * 
 * WHERE USED:
 * Used in Notification entity and DTO payloads to determine icon rendering and
 * category filtering.
 */
public enum NotificationType {
    PROJECT_CREATED,
    PROJECT_UPDATED,
    TASK_ASSIGNED,
    TASK_COMPLETED,
    TASK_DUE_SOON,
    TASK_OVERDUE,
    MEMBER_INVITED,
    MEMBER_JOINED,
    MEMBER_REMOVED,
    COMMENT_ADDED,
    USER_MENTIONED,
    FILE_UPLOADED,
    REPORT_GENERATED
}
