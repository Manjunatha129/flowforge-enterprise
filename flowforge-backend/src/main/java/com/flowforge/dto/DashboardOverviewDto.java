package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewDto {

    private DashboardStatsDto stats;
    private AnalyticsDataDto analytics;
    private List<RecentActivityDto> recentActivities;
    private List<TodayTaskDto> todayTasks;
    private List<UpcomingDeadlineDto> upcomingDeadlines;
    private List<ProjectSummaryDto> recentProjects;
}
