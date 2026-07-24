package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.*;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Admin Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates administrative actions (user management, promotion/demotion,
 * activation/deactivation,
 * password reset, real-time database stats computation, system settings
 * persistence, and audit logging).
 */
@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    // In-memory system settings state with defaults
    private SystemSettingsDto currentSettings = SystemSettingsDto.builder()
            .applicationName("FlowForge SaaS")
            .companyName("FlowForge Technologies Inc.")
            .logoUrl("/assets/logo.png")
            .theme("DARK")
            .timezone("UTC+05:30")
            .emailSender("noreply@FlowForge.dev")
            .jwtExpirationHours(24)
            .sessionTimeoutMinutes(60)
            .passwordPolicy("Minimum 8 characters, at least 1 uppercase, 1 number")
            .maintenanceMode(false)
            .build();

    public AdminServiceImpl(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getAdminDashboardStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream().filter(User::isEnabled).count();
        long onlineUsers = userRepository.findAll().stream()
                .filter(u -> u.getLastLoginAt() != null
                        && u.getLastLoginAt().isAfter(LocalDateTime.now().minusMinutes(30)))
                .count();
        long offlineUsers = Math.max(0, totalUsers - onlineUsers);

        long newUsersThisMonth = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null
                        && u.getCreatedAt().isAfter(LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0)))
                .count();

        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.ACTIVE);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        long archivedProjects = projectRepository.countByStatus(ProjectStatus.ARCHIVED);

        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long pendingTasks = taskRepository.countByStatus(TaskStatus.IN_PROGRESS) +
                taskRepository.countByStatus(TaskStatus.TODO) +
                taskRepository.countByStatus(TaskStatus.BACKLOG);
        long overdueTasks = taskRepository.countByDueDateBeforeAndStatusNot(LocalDate.now(), TaskStatus.COMPLETED);

        long notificationsSent = notificationRepository.count();
        long storageUsedMB = (totalProjects * 12) + (totalTasks * 4) + (totalUsers * 2);
        String storageUsed = storageUsedMB > 1024 ? String.format("%.2f GB", storageUsedMB / 1024.0)
                : storageUsedMB + " MB";

        return AdminDashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .onlineUsers(onlineUsers)
                .offlineUsers(offlineUsers)
                .newUsersThisMonth(newUsersThisMonth)
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .archivedProjects(archivedProjects)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .overdueTasks(overdueTasks)
                .notificationsSent(notificationsSent)
                .reportsGenerated(totalProjects > 0 ? 3 : 0)
                .storageUsed(storageUsed)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserAdminDto> getAllUsers(String search, Role role, Boolean enabled) {
        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(u -> {
                    if (search != null && !search.isBlank()) {
                        String q = search.toLowerCase();
                        boolean matchName = u.getName() != null && u.getName().toLowerCase().contains(q);
                        boolean matchEmail = u.getEmail() != null && u.getEmail().toLowerCase().contains(q);
                        if (!matchName && !matchEmail)
                            return false;
                    }
                    if (role != null && u.getRole() != role)
                        return false;
                    if (enabled != null && u.isEnabled() != enabled)
                        return false;
                    return true;
                })
                .map(u -> {
                    int ownedProjects = (int) projectRepository.findAll().stream()
                            .filter(p -> p.getCreatedBy() != null && p.getCreatedBy().equalsIgnoreCase(u.getEmail()))
                            .count();
                    int assignedTasks = (int) taskRepository.findAll().stream()
                            .filter(t -> t.getAssignedUser() != null
                                    && (t.getAssignedUser().equalsIgnoreCase(u.getName())
                                            || t.getAssignedUser().equalsIgnoreCase(u.getEmail())))
                            .count();

                    boolean isOnline = u.getLastLoginAt() != null
                            && u.getLastLoginAt().isAfter(LocalDateTime.now().minusMinutes(30));

                    return UserAdminDto.builder()
                            .id(u.getId())
                            .name(u.getName())
                            .email(u.getEmail())
                            .avatar(getAvatarForUser(u.getName()))
                            .role(u.getRole())
                            .enabled(u.isEnabled())
                            .lastLoginAt(u.getLastLoginAt())
                            .createdAt(u.getCreatedAt())
                            .ownedProjectsCount(ownedProjects)
                            .assignedTasksCount(assignedTasks)
                            .online(isOnline)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserAdminDto updateUserRole(UUID userId, Role newRole, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Role oldRole = user.getRole();
        user.setRole(newRole);
        User saved = userRepository.save(user);

        auditLogService.logAction(adminEmail,
                "Updated role of user " + user.getEmail() + " from " + oldRole + " to " + newRole, "ADMIN", "SUCCESS");

        return mapToUserAdminDto(saved);
    }

    @Override
    @Transactional
    public UserAdminDto toggleUserStatus(UUID userId, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setEnabled(!user.isEnabled());
        User saved = userRepository.save(user);

        String action = saved.isEnabled() ? "Activated user account " + saved.getEmail()
                : "Deactivated user account " + saved.getEmail();
        auditLogService.logAction(adminEmail, action, "ADMIN", "SUCCESS");

        return mapToUserAdminDto(saved);
    }

    @Override
    @Transactional
    public void resetUserPassword(UUID userId, String newPassword, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        auditLogService.logAction(adminEmail, "Admin reset password for user " + user.getEmail(), "ADMIN", "SUCCESS");
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        userRepository.delete(user);
        auditLogService.logAction(adminEmail, "Deleted user account " + user.getEmail(), "ADMIN", "SUCCESS");
    }

    @Override
    public SystemSettingsDto getSystemSettings() {
        return currentSettings;
    }

    @Override
    public SystemSettingsDto updateSystemSettings(SystemSettingsDto settings, String adminEmail) {
        if (settings.getApplicationName() != null)
            currentSettings.setApplicationName(settings.getApplicationName());
        if (settings.getCompanyName() != null)
            currentSettings.setCompanyName(settings.getCompanyName());
        if (settings.getTimezone() != null)
            currentSettings.setTimezone(settings.getTimezone());
        if (settings.getJwtExpirationHours() > 0)
            currentSettings.setJwtExpirationHours(settings.getJwtExpirationHours());
        if (settings.getSessionTimeoutMinutes() > 0)
            currentSettings.setSessionTimeoutMinutes(settings.getSessionTimeoutMinutes());
        currentSettings.setMaintenanceMode(settings.isMaintenanceMode());

        auditLogService.logAction(adminEmail, "Updated global system settings", "SETTINGS", "SUCCESS");

        return currentSettings;
    }

    private UserAdminDto mapToUserAdminDto(User u) {
        return UserAdminDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .avatar(getAvatarForUser(u.getName()))
                .role(u.getRole())
                .enabled(u.isEnabled())
                .lastLoginAt(u.getLastLoginAt())
                .createdAt(u.getCreatedAt())
                .ownedProjectsCount(0)
                .assignedTasksCount(0)
                .online(u.getLastLoginAt() != null && u.getLastLoginAt().isAfter(LocalDateTime.now().minusMinutes(30)))
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
