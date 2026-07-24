package com.flowforge.service;

import com.flowforge.dto.ReportExportRequest;

/**
 * Report Export Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines methods for converting database metrics and task reports into
 * downloadable PDF, Excel, and CSV binary streams.
 */
public interface ExportService {

    byte[] exportPdfReport(ReportExportRequest request);

    byte[] exportExcelReport(ReportExportRequest request);

    byte[] exportCsvReport(ReportExportRequest request);
}
