package com.flowforge.dto;

import com.flowforge.entity.ProjectPriority;
import com.flowforge.entity.ProjectStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {

    private UUID id;
    private String projectName;
    private String description;
    private String category;
    private ProjectStatus status;
    private ProjectPriority priority;
    private String projectColor;
    private LocalDate startDate;
    private LocalDate dueDate;
    private int progress;
    private int totalTasks;
    private int completedTasks;
    private int remainingTasks;
    private List<String> members;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
