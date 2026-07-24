package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingDeadlineDto {

    private String id;
    private String project;
    private String task;
    private int remainingDays;
    private String priority;
}
