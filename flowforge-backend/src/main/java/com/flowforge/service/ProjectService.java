package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.ProjectPriority;
import com.flowforge.entity.ProjectStatus;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    ProjectDto createProject(ProjectCreateRequest request, String createdBy);

    List<ProjectDto> getAllProjects(String sortBy);

    ProjectDto getProjectById(UUID id);

    ProjectDto updateProject(UUID id, ProjectUpdateRequest request);

    void deleteProject(UUID id);

    List<ProjectDto> searchProjects(String query);

    List<ProjectDto> filterProjects(ProjectStatus status, ProjectPriority priority, String category);

    ProjectStatsDto getProjectStats();
}
