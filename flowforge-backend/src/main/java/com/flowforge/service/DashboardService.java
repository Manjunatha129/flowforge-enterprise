package com.flowforge.service;

import com.flowforge.dto.*;

import java.util.List;

public interface DashboardService {

    DashboardOverviewDto getDashboardOverview();

    DashboardStatsDto getDashboardStats();

    AnalyticsDataDto getAnalyticsData();

    List<RecentActivityDto> getRecentActivities();
}
