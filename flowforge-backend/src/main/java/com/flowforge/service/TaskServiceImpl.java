package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.*;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Task Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Handles production task operations without fake seed tasks.
 * When tasks are created or updated, parent project statistics and real
 * notifications update automatically.
 */
@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final TaskAttachmentRepository taskAttachmentRepository;
    private final NotificationService notificationService;
    private final WebSocketPublisher webSocketPublisher;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            TaskCommentRepository taskCommentRepository,
            TaskAttachmentRepository taskAttachmentRepository,
            NotificationService notificationService,
            WebSocketPublisher webSocketPublisher) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.taskCommentRepository = taskCommentRepository;
        this.taskAttachmentRepository = taskAttachmentRepository;
        this.notificationService = notificationService;
        this.webSocketPublisher = webSocketPublisher;
    }

    @Override
    @Transactional
    public TaskDto createTask(TaskCreateRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseGet(() -> projectRepository.findAll().stream().findFirst().orElse(null));

        if (project == null) {
            throw new ResourceNotFoundException("Project", "id", request.getProjectId());
        }

        String assignedUser = (request.getAssignedUser() != null && !request.getAssignedUser().isBlank())
                ? request.getAssignedUser()
                : "Assigned Engineer";

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now())
                .dueDate(request.getDueDate() != null ? request.getDueDate() : LocalDate.now().plusDays(7))
                .estimatedHours(request.getEstimatedHours() != null ? request.getEstimatedHours() : 8.0)
                .assignedUser(assignedUser)
                .assignedUserAvatar(getAvatarForUser(assignedUser))
                .starred(false)
                .archived(false)
                .project(project)
                .labels(request.getLabels() != null ? request.getLabels() : new ArrayList<>())
                .build();

        Task saved = taskRepository.save(task);

        // Update project total task count
        int currentTotal = project.getTotalTasks();
        project.setTotalTasks(currentTotal + 1);
        if (saved.getStatus() == TaskStatus.COMPLETED) {
            int currentCompleted = project.getCompletedTasks();
            project.setCompletedTasks(currentCompleted + 1);
        }
        recalculateProjectProgress(project);
        projectRepository.save(project);

        // Trigger real notification
        notificationService.createNotification(
                "New Task Created",
                "Task '" + saved.getTitle() + "' was added to project '" + project.getProjectName() + "'.",
                "check-circle",
                NotificationType.TASK_ASSIGNED,
                NotificationPriority.MEDIUM,
                "System",
                "admin@FlowForge.com",
                project.getProjectName(),
                saved.getTitle(),
                "/tasks");

        TaskDto dto = mapToDto(saved);
        webSocketPublisher.publishTaskEvent("TASK_CREATED", dto);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks(UUID projectId, String sortBy) {
        List<Task> tasks;
        if (projectId != null) {
            tasks = taskRepository.findByProjectId(projectId);
        } else {
            tasks = taskRepository.findByArchivedFalse();
        }

        return tasks.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDto getTaskById(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return mapToDto(task);
    }

    @Override
    @Transactional
    public TaskDto updateTask(UUID id, TaskUpdateRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (request.getTitle() != null)
            task.setTitle(request.getTitle());
        if (request.getDescription() != null)
            task.setDescription(request.getDescription());
        if (request.getStatus() != null)
            task.setStatus(request.getStatus());
        if (request.getPriority() != null)
            task.setPriority(request.getPriority());
        if (request.getStartDate() != null)
            task.setStartDate(request.getStartDate());
        if (request.getDueDate() != null)
            task.setDueDate(request.getDueDate());
        if (request.getEstimatedHours() != null)
            task.setEstimatedHours(request.getEstimatedHours());
        if (request.getAssignedUser() != null) {
            task.setAssignedUser(request.getAssignedUser());
            task.setAssignedUserAvatar(getAvatarForUser(request.getAssignedUser()));
        }
        if (request.getLabels() != null)
            task.setLabels(request.getLabels());
        if (request.getStarred() != null)
            task.setStarred(request.getStarred());
        if (request.getArchived() != null)
            task.setArchived(request.getArchived());

        Task updated = taskRepository.save(task);

        if (updated.getProject() != null) {
            updateProjectTaskStats(updated.getProject());
        }

        TaskDto dto = mapToDto(updated);
        webSocketPublisher.publishTaskEvent("TASK_UPDATED", dto);

        return dto;
    }

    @Override
    @Transactional
    public TaskDto updateTaskStatus(UUID id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(status);
        Task updated = taskRepository.save(task);

        if (updated.getProject() != null) {
            updateProjectTaskStats(updated.getProject());
        }

        if (status == TaskStatus.COMPLETED && oldStatus != TaskStatus.COMPLETED) {
            notificationService.createNotification(
                    "Task Completed",
                    "Task '" + updated.getTitle() + "' was marked as completed.",
                    "check-circle",
                    NotificationType.TASK_COMPLETED,
                    NotificationPriority.HIGH,
                    updated.getAssignedUser(),
                    "admin@FlowForge.com",
                    updated.getProject() != null ? updated.getProject().getProjectName() : null,
                    updated.getTitle(),
                    "/tasks");
        }

        TaskDto dto = mapToDto(updated);
        String action = status == TaskStatus.COMPLETED ? "TASK_COMPLETED" : "TASK_UPDATED";
        webSocketPublisher.publishTaskEvent(action, dto);

        return dto;
    }

    @Override
    @Transactional
    public void deleteTask(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = task.getProject();
        TaskDto dto = mapToDto(task);
        taskRepository.delete(task);

        if (project != null) {
            updateProjectTaskStats(project);
        }

        webSocketPublisher.publishTaskEvent("TASK_DELETED", dto);
    }

    @Override
    @Transactional
    public TaskCommentDto addComment(UUID taskId, TaskCommentDto commentDto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        TaskComment comment = TaskComment.builder()
                .task(task)
                .commentText(commentDto.getCommentText())
                .userName(commentDto.getUserName() != null ? commentDto.getUserName() : "User")
                .userAvatar(commentDto.getUserAvatar() != null ? commentDto.getUserAvatar() : "U")
                .build();

        TaskComment saved = taskCommentRepository.save(comment);

        notificationService.createNotification(
                "Comment Added",
                saved.getUserName() + " commented on task '" + task.getTitle() + "'.",
                "message-square",
                NotificationType.COMMENT_ADDED,
                NotificationPriority.LOW,
                saved.getUserName(),
                "admin@FlowForge.com",
                task.getProject() != null ? task.getProject().getProjectName() : null,
                task.getTitle(),
                "/tasks");

        return TaskCommentDto.builder()
                .id(saved.getId())
                .commentText(saved.getCommentText())
                .userName(saved.getUserName())
                .userAvatar(saved.getUserAvatar())
                .createdAt(saved.getCreatedAt())
                .timeAgo("Just now")
                .build();
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId) {
        TaskComment comment = taskCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("TaskComment", "id", commentId));
        taskCommentRepository.delete(comment);
    }

    @Override
    @Transactional
    public TaskAttachmentDto addAttachment(UUID taskId, TaskAttachmentDto attachmentDto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        TaskAttachment attachment = TaskAttachment.builder()
                .task(task)
                .fileName(attachmentDto.getFileName())
                .fileSize(attachmentDto.getFileSize() != null ? attachmentDto.getFileSize() : "1.2 MB")
                .fileType(attachmentDto.getFileType() != null ? attachmentDto.getFileType() : "FILE")
                .build();

        TaskAttachment saved = taskAttachmentRepository.save(attachment);

        notificationService.createNotification(
                "File Uploaded",
                "File '" + saved.getFileName() + "' was attached to task '" + task.getTitle() + "'.",
                "file-text",
                NotificationType.FILE_UPLOADED,
                NotificationPriority.LOW,
                "System",
                "admin@FlowForge.com",
                task.getProject() != null ? task.getProject().getProjectName() : null,
                task.getTitle(),
                "/tasks");

        return TaskAttachmentDto.builder()
                .id(saved.getId())
                .fileName(saved.getFileName())
                .fileSize(saved.getFileSize())
                .fileType(saved.getFileType())
                .uploadedAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public TaskDto toggleStarTask(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        task.setStarred(!task.isStarred());
        Task updated = taskRepository.save(task);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public TaskDto toggleArchiveTask(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        task.setArchived(!task.isArchived());
        Task updated = taskRepository.save(task);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public TaskDto duplicateTask(UUID id) {
        Task original = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        Task copy = Task.builder()
                .title(original.getTitle() + " (Copy)")
                .description(original.getDescription())
                .status(original.getStatus())
                .priority(original.getPriority())
                .startDate(LocalDate.now())
                .dueDate(
                        original.getDueDate() != null ? original.getDueDate().plusDays(7) : LocalDate.now().plusDays(7))
                .estimatedHours(original.getEstimatedHours())
                .assignedUser(original.getAssignedUser())
                .assignedUserAvatar(original.getAssignedUserAvatar())
                .starred(false)
                .archived(false)
                .project(original.getProject())
                .labels(original.getLabels() != null ? new ArrayList<>(original.getLabels()) : new ArrayList<>())
                .build();

        Task saved = taskRepository.save(copy);
        if (saved.getProject() != null) {
            updateProjectTaskStats(saved.getProject());
        }
        return mapToDto(saved);
    }

    private void updateProjectTaskStats(Project project) {
        List<Task> projectTasks = taskRepository.findByProjectId(project.getId());
        project.setTotalTasks(projectTasks.size());
        long completed = projectTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        project.setCompletedTasks((int) completed);
        recalculateProjectProgress(project);
        projectRepository.save(project);
    }

    private void recalculateProjectProgress(Project project) {
        if (project.getTotalTasks() == 0) {
            project.setProgress(0);
        } else {
            int total = project.getTotalTasks();
            int completed = project.getCompletedTasks();
            project.setProgress((completed * 100) / total);
        }
    }

    private TaskDto mapToDto(Task t) {
        boolean isOverdue = t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now())
                && t.getStatus() != TaskStatus.COMPLETED;

        List<TaskCommentDto> commentDtos = t.getComments() != null ? t.getComments().stream()
                .map(c -> TaskCommentDto.builder()
                        .id(c.getId())
                        .commentText(c.getCommentText())
                        .userName(c.getUserName())
                        .userAvatar(c.getUserAvatar())
                        .createdAt(c.getCreatedAt())
                        .timeAgo("Recently")
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        List<TaskAttachmentDto> attachmentDtos = t.getAttachments() != null ? t.getAttachments().stream()
                .map(a -> TaskAttachmentDto.builder()
                        .id(a.getId())
                        .fileName(a.getFileName())
                        .fileSize(a.getFileSize())
                        .fileType(a.getFileType())
                        .uploadedAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        return TaskDto.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .status(t.getStatus())
                .priority(t.getPriority())
                .startDate(t.getStartDate())
                .dueDate(t.getDueDate())
                .estimatedHours(t.getEstimatedHours())
                .assignedUser(t.getAssignedUser())
                .assignedUserAvatar(t.getAssignedUserAvatar() != null ? t.getAssignedUserAvatar()
                        : getAvatarForUser(t.getAssignedUser()))
                .starred(t.isStarred())
                .archived(t.isArchived())
                .overdue(isOverdue)
                .projectId(t.getProject() != null ? t.getProject().getId() : null)
                .projectName(t.getProject() != null ? t.getProject().getProjectName() : "Workspace")
                .labels(t.getLabels() != null ? t.getLabels() : new ArrayList<>())
                .subtasks(new ArrayList<>())
                .comments(commentDtos)
                .attachments(attachmentDtos)
                .commentsCount(commentDtos.size())
                .attachmentsCount(attachmentDtos.size())
                .subtasksProgress(t.getStatus() == TaskStatus.COMPLETED ? 100 : 0)
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
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
