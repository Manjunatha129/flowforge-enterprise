package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodayTaskDto {

    private String id;
    private String taskName;
    private String projectName;
    private String priority; // HIGH, MEDIUM, LOW
    private String dueTime;
    private String status; // IN_PROGRESS, TODO, COMPLETED
}
