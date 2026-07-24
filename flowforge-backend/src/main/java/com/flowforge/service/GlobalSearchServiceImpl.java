package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.Project;
import com.flowforge.entity.Task;
import com.flowforge.entity.User;
import com.flowforge.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Global Search Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Executes unified multi-entity keyword queries across database tables
 * (Projects, Tasks, Messages, Comments, Files, Users)
 * and aggregates matching resources into a structured GlobalSearchResultDto
 * payload.
 */
@Service
public class GlobalSearchServiceImpl implements GlobalSearchService {

        private final ProjectRepository projectRepository;
        private final TaskRepository taskRepository;
        private final ChatService chatService;
        private final FileAttachmentRepository fileRepository;
        private final UserRepository userRepository;

        public GlobalSearchServiceImpl(
                        ProjectRepository projectRepository,
                        TaskRepository taskRepository,
                        ChatService chatService,
                        FileAttachmentRepository fileRepository,
                        UserRepository userRepository) {
                this.projectRepository = projectRepository;
                this.taskRepository = taskRepository;
                this.chatService = chatService;
                this.fileRepository = fileRepository;
                this.userRepository = userRepository;
        }

        @Override
        @Transactional(readOnly = true)
        public GlobalSearchResultDto searchGlobal(String query) {
                if (query == null || query.trim().isBlank()) {
                        return GlobalSearchResultDto.builder().query("").totalMatches(0).build();
                }

                String keyword = query.trim();

                // 1. Projects
                List<ProjectDto> projectMatches = projectRepository
                                .findByProjectNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword,
                                                keyword)
                                .stream()
                                .map(p -> ProjectDto.builder()
                                                .id(p.getId())
                                                .projectName(p.getProjectName())
                                                .description(p.getDescription())
                                                .category(p.getCategory())
                                                .status(p.getStatus() != null ? p.getStatus() : null)
                                                .priority(p.getPriority() != null ? p.getPriority() : null)
                                                .build())
                                .collect(Collectors.toList());

                // 2. Tasks
                List<TaskDto> taskMatches = taskRepository
                                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword)
                                .stream()
                                .map(t -> TaskDto.builder()
                                                .id(t.getId())
                                                .title(t.getTitle())
                                                .description(t.getDescription())
                                                .status(t.getStatus() != null ? t.getStatus() : null)
                                                .priority(t.getPriority() != null ? t.getPriority() : null)
                                                .assignedUser(t.getAssignedUser())
                                                .build())
                                .collect(Collectors.toList());

                // 3. Chat Messages
                List<ChatMessageDto> chatMatches = chatService.searchMessages(keyword);

                // 4. File Attachments
                List<FileAttachmentDto> fileMatches = fileRepository
                                .findByFileNameContainingIgnoreCaseOrderByCreatedAtDesc(keyword)
                                .stream()
                                .map(f -> FileAttachmentDto.builder()
                                                .id(f.getId())
                                                .fileName(f.getFileName())
                                                .fileSize(f.getFileSize())
                                                .fileType(f.getFileType())
                                                .targetType(f.getTargetType())
                                                .targetId(f.getTargetId())
                                                .build())
                                .collect(Collectors.toList());

                // 5. Users
                List<UserDto> userMatches = userRepository
                                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword)
                                .stream()
                                .map(u -> UserDto.builder()
                                                .id(u.getId())
                                                .name(u.getName())
                                                .email(u.getEmail())
                                                .role(u.getRole() != null ? u.getRole()
                                                                : com.flowforge.entity.Role.ROLE_USER)
                                                .createdAt(u.getCreatedAt())
                                                .build())
                                .collect(Collectors.toList());

                int total = projectMatches.size() + taskMatches.size() + chatMatches.size() + fileMatches.size()
                                + userMatches.size();

                return GlobalSearchResultDto.builder()
                                .query(keyword)
                                .totalMatches(total)
                                .projects(projectMatches)
                                .tasks(taskMatches)
                                .chatMessages(chatMatches)
                                .files(fileMatches)
                                .users(userMatches)
                                .build();
        }
}
