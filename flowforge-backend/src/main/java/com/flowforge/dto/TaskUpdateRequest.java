package com.flowforge.dto;

import com.flowforge.entity.TaskPriority;
import com.flowforge.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateRequest {

    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Double estimatedHours;
    private String assignedUser;
    private List<String> labels;
    private List<SubtaskDto> subtasks;
    private Boolean starred;
    private Boolean archived;
}
