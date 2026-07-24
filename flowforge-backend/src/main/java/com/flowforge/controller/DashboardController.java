package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Dashboard REST Controller.
 * 
 * WHY THIS CLASS EXISTS:
 * Exposes endpoints (/api/v1/dashboard/*) providing statistics, analytics,
 * activities,
 * and workspace metrics for the FlowForge SaaS dashboard.
 */
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    /** Constructor Injection: Injecting DashboardService */
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /** Returns full aggregated dashboard overview payload */
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<DashboardOverviewDto>> getOverview() {
        DashboardOverviewDto overview = dashboardService.getDashboardOverview();
        return ResponseEntity.ok(ApiResponse.success("Dashboard overview retrieved successfully", overview));
    }

    /** Returns key statistics metrics counters */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        DashboardStatsDto stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", stats));
    }

    /** Returns weekly and monthly productivity chart data */
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsDataDto>> getAnalytics() {
        AnalyticsDataDto analytics = dashboardService.getAnalyticsData();
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved successfully", analytics));
    }

    /** Returns recent activity timeline stream */
    @GetMapping("/activities")
    public ResponseEntity<ApiResponse<List<RecentActivityDto>>> getRecentActivities() {
        List<RecentActivityDto> activities = dashboardService.getRecentActivities();
        return ResponseEntity.ok(ApiResponse.success("Recent activities retrieved successfully", activities));
    }
}
