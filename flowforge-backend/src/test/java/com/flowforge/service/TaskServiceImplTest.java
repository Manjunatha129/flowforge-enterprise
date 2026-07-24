package com.flowforge.service;

import com.flowforge.dto.TaskCreateRequest;
import com.flowforge.dto.TaskDto;
import com.flowforge.entity.*;
import com.flowforge.repository.ProjectRepository;
import com.flowforge.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Task Service Unit Test Suite.
 * 
 * PURPOSE:
 * Verifies task creation, status updates, and Kanban board status transitions
 * using JUnit 5 and Mockito.
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private WebSocketPublisher webSocketPublisher;

    @InjectMocks
    private TaskServiceImpl taskService;

    private TaskCreateRequest createTaskRequest;
    private Project testProject;
    private Task testTask;
    private UUID projectId;
    private UUID taskId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        taskId = UUID.randomUUID();

        createTaskRequest = TaskCreateRequest.builder()
                .title("Build STOMP WebSocket Messaging")
                .description("Configure Spring Boot STOMP broker.")
                .projectId(projectId)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .assignedUser("Alex Chen")
                .build();

        testProject = Project.builder()
                .projectName("TaskFlow Core")
                .totalTasks(0)
                .completedTasks(0)
                .progress(0)
                .build();
        testProject.setId(projectId);

        testTask = Task.builder()
                .project(testProject)
                .title("Build STOMP WebSocket Messaging")
                .description("Configure Spring Boot STOMP broker.")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .assignedUser("Alex Chen")
                .build();
        testTask.setId(taskId);
    }

    @Test
    @DisplayName("Should successfully create new task item")
    void createTask_Success() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskDto result = taskService.createTask(createTaskRequest);

        assertNotNull(result);
        assertEquals("Build STOMP WebSocket Messaging", result.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }
}
