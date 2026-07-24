package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dashboard Statistics DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates dynamic database metrics for the dashboard summary cards.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {

    private long totalProjects;
    private String totalProjectsTrend;

    private long totalTasks;
    private String totalTasksTrend;

    private long completedTasks;
    private String completedTasksTrend;

    private long pendingTasks;
    private String pendingTasksTrend;

    private long overdueTasks;
    private String overdueTasksTrend;

    private long teamMembers;
    private String teamMembersTrend;

    private long highPriorityTasks;
    private int sprintHealth;
}
