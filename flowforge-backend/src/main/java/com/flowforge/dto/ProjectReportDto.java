package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Project Performance Report DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Carries project analytics for project status, completion %, tasks count, and
 * owner info.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectReportDto {
    private UUID projectId;
    private String projectName;
    private String category;
    private String status;
    private int progress;
    private int totalTasks;
    private int completedTasks;
    private int pendingTasks;
    private String owner;
}
