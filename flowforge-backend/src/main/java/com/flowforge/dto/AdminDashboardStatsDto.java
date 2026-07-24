package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Admin Dashboard Statistics DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers aggregated live system administration metrics to the Admin Panel.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDto {
    private long totalUsers;
    private long activeUsers;
    private long onlineUsers;
    private long offlineUsers;
    private long newUsersThisMonth;

    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long archivedProjects;

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;

    private long notificationsSent;
    private long reportsGenerated;
    private String storageUsed;
}
