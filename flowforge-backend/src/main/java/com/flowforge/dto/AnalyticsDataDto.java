package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDataDto {

    private List<String> weeklyLabels;
    private List<Integer> weeklyProductivity;

    private List<String> monthlyLabels;
    private List<Integer> monthlyProductivity;

    private Map<String, Integer> taskStatusDistribution;
    private List<Map<String, Object>> projectProgressOverview;
}
