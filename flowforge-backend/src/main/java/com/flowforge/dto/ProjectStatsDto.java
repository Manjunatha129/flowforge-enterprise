package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStatsDto {

    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long archivedProjects;
}
