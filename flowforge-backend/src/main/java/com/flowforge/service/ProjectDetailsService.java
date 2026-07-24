package com.flowforge.service;

import com.flowforge.dto.*;

import java.util.List;
import java.util.UUID;

public interface ProjectDetailsService {

    ProjectDetailsDto getProjectDetails(UUID projectId);

    List<ProjectActivityDto> getProjectActivities(UUID projectId);

    List<ProjectMemberDto> getProjectMembers(UUID projectId);

    ProjectMemberDto addProjectMember(UUID projectId, ProjectMemberDto memberDto);

    void removeProjectMember(UUID projectId, String memberId);
}
