package com.flowforge.dto;

import com.flowforge.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * User Admin Management DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Exposes detailed user profile, role, status, project count, and task counts
 * to the Admin User Management UI.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDto {
    private UUID id;
    private String name;
    private String email;
    private String avatar;
    private Role role;
    private boolean enabled;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private int ownedProjectsCount;
    private int assignedTasksCount;
    private boolean online;
}
