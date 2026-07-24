package com.flowforge.dto;

import com.flowforge.entity.ProjectPriority;
import com.flowforge.entity.ProjectStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Data Transfer Object (DTO) for receiving new project creation requests from clients.
 * This class is used in ProjectController when creating a new project.
 * 
 * Annotations used:
 * - @Data: Generates getters, setters, toString, equals, and hashCode methods automatically.
 * - @Builder: Implements the Builder design pattern for easy object construction.
 * - @NoArgsConstructor: Generates an empty constructor required by frameworks like Jackson.
 * - @AllArgsConstructor: Generates a constructor with all arguments for the builder pattern.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCreateRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 100, message = "Project name must be between 2 and 100 characters")
    private String projectName;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Builder.Default
    private String category = "Engineering";

    @Builder.Default
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @Builder.Default
    private ProjectPriority priority = ProjectPriority.MEDIUM;

    @Builder.Default
    private String projectColor = "#0c93e7";

    private LocalDate startDate;
    private LocalDate dueDate;
    private List<String> members;
}

