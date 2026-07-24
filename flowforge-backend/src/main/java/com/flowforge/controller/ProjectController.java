package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.entity.ProjectPriority;
import com.flowforge.entity.ProjectStatus;
import com.flowforge.service.ProjectService;
import com.flowforge.service.ProjectDetailsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Projects REST Controller.
 * 
 * WHY THIS CLASS EXISTS:
 * Exposes REST endpoints (/api/v1/projects) for creating, reading, updating,
 * deleting, searching, filtering, and sorting FlowForge projects.
 */
@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectDetailsService projectDetailsService;

    public ProjectController(ProjectService projectService, ProjectDetailsService projectDetailsService) {
        this.projectService = projectService;
        this.projectDetailsService = projectDetailsService;
    }

    /** POST /api/v1/projects - Create New Project */
    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String createdBy = (auth != null && auth.isAuthenticated()) ? auth.getName() : "System User";

        ProjectDto projectDto = projectService.createProject(request, createdBy);
        return new ResponseEntity<>(
                ApiResponse.success("Project created successfully", projectDto),
                HttpStatus.CREATED);
    }

    /** GET /api/v1/projects - Get All Projects (with optional sort parameter) */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getAllProjects(
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy) {
        List<ProjectDto> projects = projectService.getAllProjects(sortBy);
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projects));
    }

    /** GET /api/v1/projects/{id} - Get Project by ID */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(@PathVariable("id") UUID id) {
        ProjectDto projectDto = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success("Project details retrieved", projectDto));
    }

    /** PUT /api/v1/projects/{id} - Update Project */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable("id") UUID id,
            @Valid @RequestBody ProjectUpdateRequest request) {
        ProjectDto updated = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    /** DELETE /api/v1/projects/{id} - Delete Project */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable("id") UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }

    /**
     * GET /api/v1/projects/search - Instant Search Projects by Name or Description
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> searchProjects(
            @RequestParam("query") String query) {
        List<ProjectDto> results = projectService.searchProjects(query);
        return ResponseEntity.ok(ApiResponse.success("Search completed", results));
    }

    /**
     * GET /api/v1/projects/filter - Filter Projects by Status, Priority, Category
     */
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> filterProjects(
            @RequestParam(value = "status", required = false) ProjectStatus status,
            @RequestParam(value = "priority", required = false) ProjectPriority priority,
            @RequestParam(value = "category", required = false) String category) {
        List<ProjectDto> filtered = projectService.filterProjects(status, priority, category);
        return ResponseEntity.ok(ApiResponse.success("Filter applied", filtered));
    }

    /** GET /api/v1/projects/stats - Get Project Counter Statistics */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ProjectStatsDto>> getProjectStats() {
        ProjectStatsDto stats = projectService.getProjectStats();
        return ResponseEntity.ok(ApiResponse.success("Project statistics retrieved", stats));
    }

    /** GET /api/v1/projects/{id}/details - Get Aggregated Project Details */
    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<ProjectDetailsDto>> getProjectDetails(@PathVariable("id") UUID id) {
        ProjectDetailsDto details = projectDetailsService.getProjectDetails(id);
        return ResponseEntity.ok(ApiResponse.success("Project details retrieved successfully", details));
    }

    /** GET /api/v1/projects/{id}/activities - Get Project Activity Timeline */
    @GetMapping("/{id}/activities")
    public ResponseEntity<ApiResponse<List<ProjectActivityDto>>> getProjectActivities(@PathVariable("id") UUID id) {
        List<ProjectActivityDto> activities = projectDetailsService.getProjectActivities(id);
        return ResponseEntity.ok(ApiResponse.success("Project activities retrieved", activities));
    }

    /** GET /api/v1/projects/{id}/members - Get Project Team Members */
    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<List<ProjectMemberDto>>> getProjectMembers(@PathVariable("id") UUID id) {
        List<ProjectMemberDto> members = projectDetailsService.getProjectMembers(id);
        return ResponseEntity.ok(ApiResponse.success("Project team members retrieved", members));
    }

    /** POST /api/v1/projects/{id}/members - Add Team Member to Project */
    @PostMapping("/{id}/members")
    public ResponseEntity<ApiResponse<ProjectMemberDto>> addProjectMember(
            @PathVariable("id") UUID id,
            @RequestBody ProjectMemberDto memberDto) {
        ProjectMemberDto added = projectDetailsService.addProjectMember(id, memberDto);
        return new ResponseEntity<>(
                ApiResponse.success("Team member added successfully", added),
                HttpStatus.CREATED);
    }

    /**
     * DELETE /api/v1/projects/{id}/members/{memberId} - Remove Member from Project
     */
    @DeleteMapping("/{id}/members/{memberId}")
    public ResponseEntity<ApiResponse<Void>> removeProjectMember(
            @PathVariable("id") UUID id,
            @PathVariable("memberId") String memberId) {
        projectDetailsService.removeProjectMember(id, memberId);
        return ResponseEntity.ok(ApiResponse.success("Team member removed from project", null));
    }
}
