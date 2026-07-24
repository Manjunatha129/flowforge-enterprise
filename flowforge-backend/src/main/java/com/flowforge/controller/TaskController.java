package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.entity.TaskStatus;
import com.flowforge.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Task Management REST Controller.
 * 
 * WHY THIS CLASS EXISTS:
 * Exposes REST endpoints under /api/v1/tasks for creating, fetching, updating,
 * deleting, status transitioning (Kanban drag-and-drop), commenting, uploading
 * attachments,
 * starring, archiving, and duplicating FlowForge tasks.
 */
@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /** POST /api/v1/tasks - Create New Task */
    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@Valid @RequestBody TaskCreateRequest request) {
        TaskDto created = taskService.createTask(request);
        return new ResponseEntity<>(
                ApiResponse.success("Task created successfully", created),
                HttpStatus.CREATED);
    }

    /**
     * GET /api/v1/tasks - Get All Tasks (Optional filter by projectId and sortBy)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDto>>> getAllTasks(
            @RequestParam(value = "projectId", required = false) UUID projectId,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy) {
        List<TaskDto> tasks = taskService.getAllTasks(projectId, sortBy);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", tasks));
    }

    /** GET /api/v1/tasks/{id} - Get Task Details by ID */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto>> getTaskById(@PathVariable("id") UUID id) {
        TaskDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Task details retrieved", task));
    }

    /** PUT /api/v1/tasks/{id} - Full Task Update */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @PathVariable("id") UUID id,
            @RequestBody TaskUpdateRequest request) {
        TaskDto updated = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    /** PATCH /api/v1/tasks/{id}/status - Quick Status Patch (Kanban Drag & Drop) */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskDto>> updateTaskStatus(
            @PathVariable("id") UUID id,
            @Valid @RequestBody TaskStatusUpdateRequest request) {
        TaskDto updated = taskService.updateTaskStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Task status updated to " + request.getStatus(), updated));
    }

    /** DELETE /api/v1/tasks/{id} - Delete Task */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable("id") UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    /** POST /api/v1/tasks/{id}/comments - Add Comment to Task */
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<TaskCommentDto>> addComment(
            @PathVariable("id") UUID id,
            @RequestBody TaskCommentDto commentDto) {
        TaskCommentDto added = taskService.addComment(id, commentDto);
        return new ResponseEntity<>(
                ApiResponse.success("Comment added successfully", added),
                HttpStatus.CREATED);
    }

    /** DELETE /api/v1/comments/{id} - Delete Comment */
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable("id") UUID id) {
        taskService.deleteComment(id);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }

    /** POST /api/v1/tasks/{id}/attachments - Add Attachment to Task */
    @PostMapping("/{id}/attachments")
    public ResponseEntity<ApiResponse<TaskAttachmentDto>> addAttachment(
            @PathVariable("id") UUID id,
            @RequestBody TaskAttachmentDto attachmentDto) {
        TaskAttachmentDto added = taskService.addAttachment(id, attachmentDto);
        return new ResponseEntity<>(
                ApiResponse.success("Attachment uploaded successfully", added),
                HttpStatus.CREATED);
    }

    /** PATCH /api/v1/tasks/{id}/star - Toggle Favorite/Star */
    @PatchMapping("/{id}/star")
    public ResponseEntity<ApiResponse<TaskDto>> toggleStarTask(@PathVariable("id") UUID id) {
        TaskDto updated = taskService.toggleStarTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task favorite toggled", updated));
    }

    /** PATCH /api/v1/tasks/{id}/archive - Toggle Archive */
    @PatchMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<TaskDto>> toggleArchiveTask(@PathVariable("id") UUID id) {
        TaskDto updated = taskService.toggleArchiveTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task archive status toggled", updated));
    }

    /** POST /api/v1/tasks/{id}/duplicate - Duplicate Task */
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<ApiResponse<TaskDto>> duplicateTask(@PathVariable("id") UUID id) {
        TaskDto duplicated = taskService.duplicateTask(id);
        return new ResponseEntity<>(
                ApiResponse.success("Task duplicated successfully", duplicated),
                HttpStatus.CREATED);
    }
}
