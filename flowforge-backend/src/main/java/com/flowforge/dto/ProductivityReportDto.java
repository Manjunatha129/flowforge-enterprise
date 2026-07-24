package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Productivity Analytics Report DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Supplies time-series data arrays (weekly, monthly, yearly) and status
 * breakdowns for interactive SVG charts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductivityReportDto {
    private List<String> periodLabels;
    private List<Integer> completedTaskCounts;
    private List<Integer> createdTaskCounts;
    private Map<String, Integer> statusDistribution;
    private Map<String, Integer> priorityDistribution;
}
