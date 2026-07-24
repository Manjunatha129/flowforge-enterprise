package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Report Export Request DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers filtering criteria (date range, project, user, status, priority,
 * category) for report document generation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportExportRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private UUID projectId;
    private String userEmail;
    private String status;
    private String priority;
    private String category;
    private String format; // "PDF", "EXCEL", "CSV"
}
