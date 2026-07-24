package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * User Productivity & Performance Report DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Carries user task output, completion rates, and active contribution metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReportDto {
    private UUID userId;
    private String userName;
    private String userEmail;
    private String userAvatar;
    private int assignedTasks;
    private int completedTasks;
    private int pendingTasks;
    private int completionRate;
}
