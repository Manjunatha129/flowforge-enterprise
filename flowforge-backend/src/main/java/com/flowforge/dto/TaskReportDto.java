package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Task Analytics Report DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Carries individual task analytics for report tables and velocity charts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskReportDto {
    private UUID taskId;
    private String title;
    private String projectName;
    private String assignedUser;
    private String status;
    private String priority;
    private boolean overdue;
    private double estimatedHours;
}
