package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.Project;
import com.flowforge.entity.ProjectActivity;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.ProjectActivityRepository;
import com.flowforge.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Project Details Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Handles assembling complex project overview details, activity timeline items,
 * and team member assignments for a specific project.
 */
@Service
public class ProjectDetailsServiceImpl implements ProjectDetailsService {

    private final ProjectRepository projectRepository;
    private final ProjectActivityRepository projectActivityRepository;
    private final ProjectService projectService;

    public ProjectDetailsServiceImpl(
            ProjectRepository projectRepository,
            ProjectActivityRepository projectActivityRepository,
            ProjectService projectService) {
        this.projectRepository = projectRepository;
        this.projectActivityRepository = projectActivityRepository;
        this.projectService = projectService;
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDetailsDto getProjectDetails(UUID projectId) {
        ProjectDto projectDto = projectService.getProjectById(projectId);
        List<ProjectActivityDto> activities = getProjectActivities(projectId);
        List<ProjectMemberDto> members = getProjectMembers(projectId);

        int pendingTasks = Math.max(0, projectDto.getTotalTasks() - projectDto.getCompletedTasks());
        int overdueTasks = Math.min(3, pendingTasks);

        return ProjectDetailsDto.builder()
                .project(projectDto)
                .activities(activities)
                .teamMembers(members)
                .pendingTasks(pendingTasks)
                .overdueTasks(overdueTasks)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectActivityDto> getProjectActivities(UUID projectId) {
        List<ProjectActivity> activities = projectActivityRepository.findByProjectIdOrderByCreatedAtDesc(projectId);

        if (activities.isEmpty()) {
            // Seed initial activity events for demo/learning
            return Arrays.asList(
                    ProjectActivityDto.builder()
                            .id(UUID.randomUUID())
                            .activity("created project workspace repository")
                            .userName("Sarah Connor")
                            .userAvatar("SC")
                            .statusBadge("Created")
                            .timestamp(LocalDateTime.now().minusDays(5))
                            .timeAgo("5d ago")
                            .build(),
                    ProjectActivityDto.builder()
                            .id(UUID.randomUUID())
                            .activity("updated milestone target sprint due date")
                            .userName("Alex Chen")
                            .userAvatar("AC")
                            .statusBadge("Updated")
                            .timestamp(LocalDateTime.now().minusDays(2))
                            .timeAgo("2d ago")
                            .build(),
                    ProjectActivityDto.builder()
                            .id(UUID.randomUUID())
                            .activity("added new team member Alex Chen to repository")
                            .userName("David Miller")
                            .userAvatar("DM")
                            .statusBadge("Member Added")
                            .timestamp(LocalDateTime.now().minusHours(4))
                            .timeAgo("4h ago")
                            .build());
        }

        return activities.stream().map(a -> ProjectActivityDto.builder()
                .id(a.getId())
                .activity(a.getActivity())
                .userName(a.getUserName())
                .userAvatar(a.getUserAvatar())
                .statusBadge(a.getStatusBadge())
                .timestamp(a.getCreatedAt())
                .timeAgo("Recently")
                .build()).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberDto> getProjectMembers(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        List<ProjectMemberDto> memberDtos = new ArrayList<>();
        List<String> initials = project.getMembers();

        if (initials == null || initials.isEmpty()) {
            initials = Arrays.asList("SC", "AC", "DM");
        }

        for (String init : initials) {
            memberDtos.add(mapInitialToMemberDto(init));
        }

        return memberDtos;
    }

    @Override
    @Transactional
    public ProjectMemberDto addProjectMember(UUID projectId, ProjectMemberDto memberDto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        String avatar = (memberDto.getAvatar() != null && !memberDto.getAvatar().isEmpty())
                ? memberDto.getAvatar().toUpperCase()
                : (memberDto.getName() != null && memberDto.getName().length() >= 2
                        ? memberDto.getName().substring(0, 2).toUpperCase()
                        : "TM");

        if (!project.getMembers().contains(avatar)) {
            project.getMembers().add(avatar);
            projectRepository.save(project);
        }

        // Log Activity
        ProjectActivity activity = ProjectActivity.builder()
                .project(project)
                .activity(
                        "added new member " + (memberDto.getName() != null ? memberDto.getName() : avatar) + " to team")
                .userName("System Admin")
                .userAvatar("SA")
                .statusBadge("Member Added")
                .build();
        projectActivityRepository.save(activity);

        return ProjectMemberDto.builder()
                .id(UUID.randomUUID().toString())
                .name(memberDto.getName() != null ? memberDto.getName() : "Team Member " + avatar)
                .avatar(avatar)
                .role(memberDto.getRole() != null ? memberDto.getRole() : "Developer")
                .email(memberDto.getEmail() != null ? memberDto.getEmail() : avatar.toLowerCase() + "@FlowForge.dev")
                .build();
    }

    @Override
    @Transactional
    public void removeProjectMember(UUID projectId, String memberId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        project.getMembers().removeIf(m -> m.equalsIgnoreCase(memberId));
        projectRepository.save(project);
    }

    private ProjectMemberDto mapInitialToMemberDto(String init) {
        switch (init.toUpperCase()) {
            case "SC":
                return ProjectMemberDto.builder().id("mem-1").name("Sarah Connor").avatar("SC")
                        .role("Engineering Director").email("sarah@FlowForge.dev").build();
            case "AC":
                return ProjectMemberDto.builder().id("mem-2").name("Alex Chen").avatar("AC")
                        .role("Senior Full Stack Developer").email("alex@FlowForge.dev").build();
            case "DM":
                return ProjectMemberDto.builder().id("mem-3").name("David Miller").avatar("DM")
                        .role("DevOps & Cloud Lead").email("david@FlowForge.dev").build();
            case "ER":
                return ProjectMemberDto.builder().id("mem-4").name("Elena Rostova").avatar("ER")
                        .role("Product Designer").email("elena@FlowForge.dev").build();
            default:
                return ProjectMemberDto.builder().id("mem-" + init).name("Member " + init).avatar(init)
                        .role("Team Contributor").email(init.toLowerCase() + "@FlowForge.dev").build();
        }
    }
}
