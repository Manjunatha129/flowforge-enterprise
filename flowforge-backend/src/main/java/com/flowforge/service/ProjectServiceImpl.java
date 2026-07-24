package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.NotificationPriority;
import com.flowforge.entity.NotificationType;
import com.flowforge.entity.Project;
import com.flowforge.entity.ProjectPriority;
import com.flowforge.entity.ProjectStatus;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.ProjectRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Project Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Handles production project operations without generating fake seed data.
 * When a user creates a project, it triggers real notifications and activity
 * logs.
 */
@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;
    private final WebSocketPublisher webSocketPublisher;

    public ProjectServiceImpl(
            ProjectRepository projectRepository,
            NotificationService notificationService,
            WebSocketPublisher webSocketPublisher) {
        this.projectRepository = projectRepository;
        this.notificationService = notificationService;
        this.webSocketPublisher = webSocketPublisher;
    }

    @Override
    @Transactional
    public ProjectDto createProject(ProjectCreateRequest request, String createdBy) {
        String owner = (createdBy != null && !createdBy.isBlank()) ? createdBy : "admin@FlowForge.com";

        Project project = Project.builder()
                .projectName(request.getProjectName())
                .description(request.getDescription())
                .category(request.getCategory() != null ? request.getCategory() : "Engineering")
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.ACTIVE)
                .priority(request.getPriority() != null ? request.getPriority() : ProjectPriority.MEDIUM)
                .projectColor(request.getProjectColor() != null ? request.getProjectColor() : "#FF8A00")
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now())
                .dueDate(request.getDueDate() != null ? request.getDueDate() : LocalDate.now().plusMonths(1))
                .progress(0)
                .totalTasks(0)
                .completedTasks(0)
                .members(request.getMembers() != null && !request.getMembers().isEmpty() ? request.getMembers()
                        : Arrays.asList(getAvatarForUser(owner)))
                .createdBy(owner)
                .build();

        Project saved = projectRepository.save(project);
        ProjectDto dto = mapToDto(saved);

        // Generate real system notification for project creation
        notificationService.createNotification(
                "New Project Created",
                "Project '" + saved.getProjectName() + "' was created successfully.",
                "folder-plus",
                NotificationType.PROJECT_CREATED,
                NotificationPriority.MEDIUM,
                owner,
                owner,
                saved.getProjectName(),
                null,
                "/projects/" + saved.getId());

        webSocketPublisher.publishProjectEvent("PROJECT_CREATED", dto);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects(String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("name".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "projectName");
        } else if ("dueDate".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "dueDate");
        } else if ("progress".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "progress");
        }

        return projectRepository.findAll(sort)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDto getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return mapToDto(project);
    }

    @Override
    @Transactional
    public ProjectDto updateProject(UUID id, ProjectUpdateRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        if (request.getProjectName() != null)
            project.setProjectName(request.getProjectName());
        if (request.getDescription() != null)
            project.setDescription(request.getDescription());
        if (request.getCategory() != null)
            project.setCategory(request.getCategory());
        if (request.getStatus() != null)
            project.setStatus(request.getStatus());
        if (request.getPriority() != null)
            project.setPriority(request.getPriority());
        if (request.getProjectColor() != null)
            project.setProjectColor(request.getProjectColor());
        if (request.getStartDate() != null)
            project.setStartDate(request.getStartDate());
        if (request.getDueDate() != null)
            project.setDueDate(request.getDueDate());
        if (request.getProgress() != null)
            project.setProgress(request.getProgress());
        if (request.getMembers() != null)
            project.setMembers(request.getMembers());

        Project updated = projectRepository.save(project);
        ProjectDto dto = mapToDto(updated);

        notificationService.createNotification(
                "Project Updated",
                "Project '" + updated.getProjectName() + "' details were updated.",
                "folder-plus",
                NotificationType.PROJECT_UPDATED,
                NotificationPriority.LOW,
                "System",
                updated.getCreatedBy(),
                updated.getProjectName(),
                null,
                "/projects/" + updated.getId());

        webSocketPublisher.publishProjectEvent("PROJECT_UPDATED", dto);

        return dto;
    }

    @Override
    @Transactional
    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        ProjectDto dto = mapToDto(project);
        projectRepository.delete(project);
        webSocketPublisher.publishProjectEvent("PROJECT_DELETED", dto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> searchProjects(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProjects("createdAt");
        }
        return projectRepository.findByProjectNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> filterProjects(ProjectStatus status, ProjectPriority priority, String category) {
        return projectRepository.filterProjects(status, priority, category)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectStatsDto getProjectStats() {
        long total = projectRepository.count();
        long active = projectRepository.countByStatus(ProjectStatus.ACTIVE);
        long completed = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        long archived = projectRepository.countByStatus(ProjectStatus.ARCHIVED);

        return ProjectStatsDto.builder()
                .totalProjects(total)
                .activeProjects(active)
                .completedProjects(completed)
                .archivedProjects(archived)
                .build();
    }

    private ProjectDto mapToDto(Project p) {
        int remaining = Math.max(0, p.getTotalTasks() - p.getCompletedTasks());
        return ProjectDto.builder()
                .id(p.getId())
                .projectName(p.getProjectName())
                .description(p.getDescription())
                .category(p.getCategory())
                .status(p.getStatus())
                .priority(p.getPriority())
                .projectColor(p.getProjectColor())
                .startDate(p.getStartDate())
                .dueDate(p.getDueDate())
                .progress(p.getProgress())
                .totalTasks(p.getTotalTasks())
                .completedTasks(p.getCompletedTasks())
                .remainingTasks(remaining)
                .members(p.getMembers())
                .createdBy(p.getCreatedBy())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private String getAvatarForUser(String user) {
        if (user == null || user.isBlank())
            return "U";
        String[] parts = user.split(" ");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return user.length() >= 2 ? user.substring(0, 2).toUpperCase() : "U";
    }
}
