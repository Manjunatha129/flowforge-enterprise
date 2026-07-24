package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Reports Overview Data Transfer Object.
 * 
 * WHY THIS CLASS EXISTS:
 * Carries high-level executive report summaries computed dynamically from live
 * database records.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportsOverviewDto {
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long archivedProjects;

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long overdueTasks;

    private long totalUsers;
    private long activeUsers;
    private long onlineUsers;

    private int averageProjectCompletion;
    private String averageTaskCompletionTime;

    private String topContributor;
    private String mostActiveProject;
    private String mostActiveUser;

    private long tasksCompletedToday;
    private long tasksCompletedThisWeek;
    private long tasksCompletedThisMonth;

    private List<UserReportDto> userPerformance;
    private List<ProjectReportDto> projectPerformance;
}
