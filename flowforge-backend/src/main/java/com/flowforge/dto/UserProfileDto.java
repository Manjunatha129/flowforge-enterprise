package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Full User Profile DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates the complete user profile, security stats, preferences, and
 * workspace settings payload.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private UUID id;
    private String name;
    private String email;
    private String role;
    private boolean enabled;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;

    // Profile Details
    private String bio;
    private String phoneNumber;
    private String designation;
    private String department;
    private String location;
    private String timezone;
    private String profilePictureUrl;

    // Security Details
    private int failedLoginAttempts;
    private boolean accountLocked;

    // Preferences
    private String themePreference;
    private String accentColor;
    private String layoutMode;

    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean browserNotifications;
    private boolean projectUpdateAlerts;
    private boolean taskAssignmentAlerts;
    private boolean dueDateAlerts;
    private boolean weeklySummary;
    private boolean monthlySummary;

    // Workspace Settings
    private String workspaceName;
    private String workspaceLogo;
    private String workspaceDescription;
    private String defaultLanguage;
    private String dateFormat;
    private String timeFormat;
    private String currency;
}
