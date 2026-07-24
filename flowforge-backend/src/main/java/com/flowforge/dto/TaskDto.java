package com.flowforge.dto;

import com.flowforge.entity.TaskPriority;
import com.flowforge.entity.TaskStatus;
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
public class TaskDto {

    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Double estimatedHours;
    private String assignedUser;
    private String assignedUserAvatar;
    private boolean starred;
    private boolean archived;
    private boolean overdue;
    private UUID projectId;
    private String projectName;
    private List<String> labels;
    private List<SubtaskDto> subtasks;
    private List<TaskCommentDto> comments;
    private List<TaskAttachmentDto> attachments;
    private int commentsCount;
    private int attachmentsCount;
    private int subtasksProgress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
