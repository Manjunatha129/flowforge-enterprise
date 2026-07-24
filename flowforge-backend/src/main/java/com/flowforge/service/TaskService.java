package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.TaskPriority;
import com.flowforge.entity.TaskStatus;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskDto createTask(TaskCreateRequest request);

    List<TaskDto> getAllTasks(UUID projectId, String sortBy);

    TaskDto getTaskById(UUID id);

    TaskDto updateTask(UUID id, TaskUpdateRequest request);

    TaskDto updateTaskStatus(UUID id, TaskStatus status);

    void deleteTask(UUID id);

    TaskCommentDto addComment(UUID taskId, TaskCommentDto commentDto);

    void deleteComment(UUID commentId);

    TaskAttachmentDto addAttachment(UUID taskId, TaskAttachmentDto attachmentDto);

    TaskDto toggleStarTask(UUID id);

    TaskDto toggleArchiveTask(UUID id);

    TaskDto duplicateTask(UUID id);
}
