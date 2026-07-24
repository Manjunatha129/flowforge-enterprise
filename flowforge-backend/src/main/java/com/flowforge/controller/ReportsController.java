package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.service.ExportService;
import com.flowforge.service.ReportsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Reports & Analytics REST Controller.
 * 
 * PURPOSE OF THIS CLASS:
 * Exposes REST endpoints (/api/v1/reports/**) providing executive dashboards,
 * project & task reports,
 * team productivity analytics, and multi-format document exports (PDF, Excel,
 * CSV) directly downloadable in the browser.
 */
@RestController
@RequestMapping("/api/v1/reports")
public class ReportsController {

    private final ReportsService reportsService;
    private final ExportService exportService;

    public ReportsController(ReportsService reportsService, ExportService exportService) {
        this.reportsService = reportsService;
        this.exportService = exportService;
    }

    /** GET /api/v1/reports/dashboard - Get Reports Executive Dashboard Overview */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<ReportsOverviewDto>> getDashboardReports() {
        ReportsOverviewDto overview = reportsService.getReportsOverview();
        return ResponseEntity.ok(ApiResponse.success("Reports overview retrieved", overview));
    }

    /** GET /api/v1/reports/projects - Get Project Analytics Reports */
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectReportDto>>> getProjectReports() {
        List<ProjectReportDto> reports = reportsService.getProjectReports();
        return ResponseEntity.ok(ApiResponse.success("Project reports retrieved", reports));
    }

    /** GET /api/v1/reports/tasks - Get Task Analytics Reports */
    @GetMapping("/tasks")
    public ResponseEntity<ApiResponse<List<TaskReportDto>>> getTaskReports() {
        List<TaskReportDto> reports = reportsService.getTaskReports();
        return ResponseEntity.ok(ApiResponse.success("Task reports retrieved", reports));
    }

    /** GET /api/v1/reports/users - Get User Productivity Reports */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserReportDto>>> getUserReports() {
        List<UserReportDto> reports = reportsService.getUserReports();
        return ResponseEntity.ok(ApiResponse.success("User productivity reports retrieved", reports));
    }

    /** GET /api/v1/reports/productivity - Get Productivity Analytics */
    @GetMapping("/productivity")
    public ResponseEntity<ApiResponse<ProductivityReportDto>> getProductivityReports() {
        ProductivityReportDto productivity = reportsService.getProductivityReports();
        return ResponseEntity.ok(ApiResponse.success("Productivity reports retrieved", productivity));
    }

    /** GET /api/v1/reports/weekly - Get Weekly Productivity Analytics */
    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<ProductivityReportDto>> getWeeklyReports() {
        ProductivityReportDto weekly = reportsService.getWeeklyReports();
        return ResponseEntity.ok(ApiResponse.success("Weekly productivity reports retrieved", weekly));
    }

    /** GET /api/v1/reports/monthly - Get Monthly Productivity Analytics */
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<ProductivityReportDto>> getMonthlyReports() {
        ProductivityReportDto monthly = reportsService.getMonthlyReports();
        return ResponseEntity.ok(ApiResponse.success("Monthly productivity reports retrieved", monthly));
    }

    /** GET /api/v1/reports/yearly - Get Yearly Productivity Analytics */
    @GetMapping("/yearly")
    public ResponseEntity<ApiResponse<ProductivityReportDto>> getYearlyReports() {
        ProductivityReportDto yearly = reportsService.getYearlyReports();
        return ResponseEntity.ok(ApiResponse.success("Yearly productivity reports retrieved", yearly));
    }

    /** POST /api/v1/reports/export/pdf - Export PDF Executive Report File */
    @PostMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdfReport(@RequestBody(required = false) ReportExportRequest request) {
        if (request == null)
            request = new ReportExportRequest();
        byte[] pdfBytes = exportService.exportPdfReport(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"FlowForge-executive-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    /** POST /api/v1/reports/export/excel - Export Excel XML Report File */
    @PostMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcelReport(@RequestBody(required = false) ReportExportRequest request) {
        if (request == null)
            request = new ReportExportRequest();
        byte[] excelBytes = exportService.exportExcelReport(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"FlowForge-analytics-report.xls\"")
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(excelBytes);
    }

    /** POST /api/v1/reports/export/csv - Export CSV Report File */
    @PostMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsvReport(@RequestBody(required = false) ReportExportRequest request) {
        if (request == null)
            request = new ReportExportRequest();
        byte[] csvBytes = exportService.exportCsvReport(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"FlowForge-tasks-report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }
}
