package com.flowforge.service;

import com.flowforge.dto.ProjectCreateRequest;
import com.flowforge.dto.ProjectDto;
import com.flowforge.entity.Project;
import com.flowforge.entity.ProjectPriority;
import com.flowforge.entity.ProjectStatus;
import com.flowforge.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Project Service Unit Test Suite.
 * 
 * PURPOSE:
 * Verifies project creation, retrieval, and progress calculations using JUnit 5
 * and Mockito.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private WebSocketPublisher webSocketPublisher;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private ProjectCreateRequest createRequest;
    private Project testProject;
    private UUID projectId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();

        createRequest = new ProjectCreateRequest();
        createRequest.setProjectName("FlowForge AI Assistant");
        createRequest.setDescription("Build agentic coding assistant engine.");
        createRequest.setCategory("AI/ML");
        createRequest.setPriority(ProjectPriority.HIGH);
        createRequest.setProjectColor("#FF8A00");

        testProject = Project.builder()
                .projectName("FlowForge AI Assistant")
                .description("Build agentic coding assistant engine.")
                .category("AI/ML")
                .status(ProjectStatus.ACTIVE)
                .priority(ProjectPriority.HIGH)
                .projectColor("#FF8A00")
                .createdBy("admin@FlowForge.com")
                .progress(25)
                .totalTasks(4)
                .completedTasks(1)
                .build();
        testProject.setId(projectId);
    }

    @Test
    @DisplayName("Should successfully create new project repository")
    void createProject_Success() {
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        ProjectDto result = projectService.createProject(createRequest, "admin@FlowForge.com");

        assertNotNull(result);
        assertEquals("FlowForge AI Assistant", result.getProjectName());
        assertEquals("AI/ML", result.getCategory());
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    @DisplayName("Should retrieve all workspace projects")
    void getAllProjects_Success() {
        when(projectRepository.findAll(any(Sort.class))).thenReturn(List.of(testProject));

        List<ProjectDto> results = projectService.getAllProjects(null);

        assertEquals(1, results.size());
        assertEquals("FlowForge AI Assistant", results.get(0).getProjectName());
    }
}
