package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDetailsDto {

    private ProjectDto project;
    private List<ProjectActivityDto> activities;
    private List<ProjectMemberDto> teamMembers;
    private int pendingTasks;
    private int overdueTasks;
}
