package com.flowforge.service;

import com.flowforge.dto.*;

import java.util.List;

/**
 * Reports & Analytics Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines methods for computing executive dashboard reports, project metrics,
 * task velocity,
 * team productivity, and time-series analytics purely from database queries.
 */
public interface ReportsService {

    ReportsOverviewDto getReportsOverview();

    List<ProjectReportDto> getProjectReports();

    List<TaskReportDto> getTaskReports();

    List<UserReportDto> getUserReports();

    ProductivityReportDto getProductivityReports();

    ProductivityReportDto getWeeklyReports();

    ProductivityReportDto getMonthlyReports();

    ProductivityReportDto getYearlyReports();
}
