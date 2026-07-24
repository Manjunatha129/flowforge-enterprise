package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Audit Log Data Transfer Object.
 * 
 * WHY THIS CLASS EXISTS:
 * Serializes audit log entries sent to the Admin UI timeline.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDto {
    private UUID id;
    private String userEmail;
    private String userAvatar;
    private String action;
    private String module;
    private String ipAddress;
    private String status;
    private LocalDateTime createdAt;
    private String timeAgo;
}
