package com.flowforge.dto;

import com.flowforge.entity.TaskPriority;
import com.flowforge.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskCreateRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    @NotNull(message = "Project ID is required")
    private UUID projectId;

    private TaskStatus status;

    private TaskPriority priority;

    private LocalDate startDate;

    private LocalDate dueDate;

    private Double estimatedHours;

    private String assignedUser;

    private List<String> labels;

    private List<SubtaskDto> subtasks;
}
