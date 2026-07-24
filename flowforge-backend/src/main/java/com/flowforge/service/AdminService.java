package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.Role;

import java.util.List;
import java.util.UUID;

/**
 * Admin Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines administrative business logic for user management, system statistics,
 * project/task oversight, and settings.
 */
public interface AdminService {

    AdminDashboardStatsDto getAdminDashboardStats();

    List<UserAdminDto> getAllUsers(String search, Role role, Boolean enabled);

    UserAdminDto updateUserRole(UUID userId, Role newRole, String adminEmail);

    UserAdminDto toggleUserStatus(UUID userId, String adminEmail);

    void resetUserPassword(UUID userId, String newPassword, String adminEmail);

    void deleteUser(UUID userId, String adminEmail);

    SystemSettingsDto getSystemSettings();

    SystemSettingsDto updateSystemSettings(SystemSettingsDto settings, String adminEmail);
}
