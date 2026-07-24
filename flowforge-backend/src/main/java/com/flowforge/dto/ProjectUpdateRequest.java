package com.flowforge.dto;

import com.flowforge.entity.ProjectPriority;
import com.flowforge.entity.ProjectStatus;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectUpdateRequest {

    @Size(min = 2, max = 100, message = "Project name must be between 2 and 100 characters")
    private String projectName;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private String category;
    private ProjectStatus status;
    private ProjectPriority priority;
    private String projectColor;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Integer progress;
    private List<String> members;
}
