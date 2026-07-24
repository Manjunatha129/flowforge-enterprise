package com.flowforge.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowforge.dto.*;
import com.flowforge.entity.User;
import com.flowforge.exception.InvalidTokenException;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;

/**
 * Profile Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates core business rules for updating user profiles, verifying BCrypt
 * passwords,
 * handling avatar picture persistence, saving notification/appearance
 * preferences,
 * exporting account JSON data, and deactivating/deleting accounts.
 */
@Service
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public ProfileServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuditLogService auditLogService,
            ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String email) {
        User user = findUserByEmail(email);
        return mapToUserProfileDto(user);
    }

    @Override
    @Transactional
    public UserProfileDto updateProfile(String email, ProfileUpdateRequest request) {
        User user = findUserByEmail(email);

        user.setName(request.getName());
        user.setBio(request.getBio());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDesignation(request.getDesignation());
        user.setDepartment(request.getDepartment());
        user.setLocation(request.getLocation());
        if (request.getTimezone() != null && !request.getTimezone().isBlank()) {
            user.setTimezone(request.getTimezone());
        }

        User updated = userRepository.save(user);
        auditLogService.logAction(email, "Updated profile details", "PROFILE", "SUCCESS");
        return mapToUserProfileDto(updated);
    }

    @Override
    @Transactional
    public UserProfileDto uploadAvatar(String email, String base64Image) {
        User user = findUserByEmail(email);
        user.setProfilePictureUrl(base64Image);
        User updated = userRepository.save(user);
        auditLogService.logAction(email, "Uploaded custom profile picture", "PROFILE", "SUCCESS");
        return mapToUserProfileDto(updated);
    }

    @Override
    @Transactional
    public UserProfileDto deleteAvatar(String email) {
        User user = findUserByEmail(email);
        user.setProfilePictureUrl(null);
        User updated = userRepository.save(user);
        auditLogService.logAction(email, "Removed profile picture", "PROFILE", "SUCCESS");
        return mapToUserProfileDto(updated);
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findUserByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            auditLogService.logAction(email, "Failed password change attempt: Incorrect current password", "SECURITY",
                    "FAILED");
            throw new InvalidTokenException(
                    "Current password verification failed. Please enter your correct current password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        auditLogService.logAction(email, "Successfully changed account password", "SECURITY", "SUCCESS");
    }

    @Override
    @Transactional
    public UserProfileDto updateWorkspaceSettings(String email, WorkspaceSettingsDto dto) {
        User user = findUserByEmail(email);

        if (dto.getWorkspaceName() != null)
            user.setWorkspaceName(dto.getWorkspaceName());
        if (dto.getWorkspaceLogo() != null)
            user.setWorkspaceLogo(dto.getWorkspaceLogo());
        if (dto.getWorkspaceDescription() != null)
            user.setWorkspaceDescription(dto.getWorkspaceDescription());
        if (dto.getDefaultLanguage() != null)
            user.setDefaultLanguage(dto.getDefaultLanguage());
        if (dto.getDateFormat() != null)
            user.setDateFormat(dto.getDateFormat());
        if (dto.getTimeFormat() != null)
            user.setTimeFormat(dto.getTimeFormat());
        if (dto.getCurrency() != null)
            user.setCurrency(dto.getCurrency());

        User updated = userRepository.save(user);
        auditLogService.logAction(email, "Updated workspace settings", "SETTINGS", "SUCCESS");
        return mapToUserProfileDto(updated);
    }

    @Override
    @Transactional
    public UserProfileDto updateNotificationPreferences(String email, NotificationPreferencesDto dto) {
        User user = findUserByEmail(email);

        user.setEmailNotifications(dto.isEmailNotifications());
        user.setPushNotifications(dto.isPushNotifications());
        user.setBrowserNotifications(dto.isBrowserNotifications());
        user.setProjectUpdateAlerts(dto.isProjectUpdateAlerts());
        user.setTaskAssignmentAlerts(dto.isTaskAssignmentAlerts());
        user.setDueDateAlerts(dto.isDueDateAlerts());
        user.setWeeklySummary(dto.isWeeklySummary());
        user.setMonthlySummary(dto.isMonthlySummary());

        User updated = userRepository.save(user);
        auditLogService.logAction(email, "Updated notification preferences", "SETTINGS", "SUCCESS");
        return mapToUserProfileDto(updated);
    }

    @Override
    @Transactional
    public UserProfileDto updateAppearancePreferences(String email, AppearancePreferencesDto dto) {
        User user = findUserByEmail(email);

        if (dto.getThemePreference() != null)
            user.setThemePreference(dto.getThemePreference());
        if (dto.getAccentColor() != null)
            user.setAccentColor(dto.getAccentColor());
        if (dto.getLayoutMode() != null)
            user.setLayoutMode(dto.getLayoutMode());

        User updated = userRepository.save(user);
        auditLogService.logAction(email, "Updated appearance theme & accent color", "SETTINGS", "SUCCESS");
        return mapToUserProfileDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportUserData(String email) {
        User user = findUserByEmail(email);
        UserProfileDto dto = mapToUserProfileDto(user);

        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(dto);
            auditLogService.logAction(email, "Exported personal account data JSON", "PROFILE", "SUCCESS");
            return json.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate user data export JSON", e);
        }
    }

    @Override
    @Transactional
    public void deactivateAccount(String email) {
        User user = findUserByEmail(email);
        user.setEnabled(false);
        userRepository.save(user);
        auditLogService.logAction(email, "Deactivated account", "ACCOUNT", "WARNING");
    }

    @Override
    @Transactional
    public void deleteAccount(String email, String confirmPassword) {
        User user = findUserByEmail(email);

        if (confirmPassword != null && !passwordEncoder.matches(confirmPassword, user.getPassword())) {
            auditLogService.logAction(email, "Failed account deletion attempt: Incorrect password", "SECURITY",
                    "FAILED");
            throw new InvalidTokenException(
                    "Password verification failed. Please enter your correct password to confirm account deletion.");
        }

        userRepository.delete(user);
        auditLogService.logAction(email, "Permanently deleted user account", "ACCOUNT", "WARNING");
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private UserProfileDto mapToUserProfileDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .bio(user.getBio())
                .phoneNumber(user.getPhoneNumber())
                .designation(user.getDesignation())
                .department(user.getDepartment())
                .location(user.getLocation())
                .timezone(user.getTimezone())
                .profilePictureUrl(user.getProfilePictureUrl())
                .failedLoginAttempts(user.getFailedLoginAttempts())
                .accountLocked(user.isAccountLocked())
                .themePreference(user.getThemePreference())
                .accentColor(user.getAccentColor())
                .layoutMode(user.getLayoutMode())
                .emailNotifications(user.isEmailNotifications())
                .pushNotifications(user.isPushNotifications())
                .browserNotifications(user.isBrowserNotifications())
                .projectUpdateAlerts(user.isProjectUpdateAlerts())
                .taskAssignmentAlerts(user.isTaskAssignmentAlerts())
                .dueDateAlerts(user.isDueDateAlerts())
                .weeklySummary(user.isWeeklySummary())
                .monthlySummary(user.isMonthlySummary())
                .workspaceName(user.getWorkspaceName())
                .workspaceLogo(user.getWorkspaceLogo())
                .workspaceDescription(user.getWorkspaceDescription())
                .defaultLanguage(user.getDefaultLanguage())
                .dateFormat(user.getDateFormat())
                .timeFormat(user.getTimeFormat())
                .currency(user.getCurrency())
                .build();
    }
}
