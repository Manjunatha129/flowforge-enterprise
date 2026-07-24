package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * User JPA Entity.
 * 
 * WHY THIS CLASS EXISTS:
 * Represents a registered user in the FlowForge platform mapped directly to the
 * "users" database table.
 * Contains user profile attributes, security counters, notification
 * preferences, appearance settings,
 * and workspace configurations.
 */
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    /** Full name of the user (e.g., Alex Johnson) */
    @Column(name = "name", nullable = false)
    private String name;

    /** Unique email address used for authenticating into FlowForge */
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /** BCrypt hashed password string (never stored in plaintext) */
    @Column(name = "password", nullable = false)
    private String password;

    /**
     * Authorization role determining workspace permissions (ROLE_USER, ROLE_ADMIN)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private Role role = Role.ROLE_USER;

    /** Flag indicating whether the account is enabled for login */
    @Column(name = "enabled", nullable = false)
    @Builder.Default
    private boolean enabled = true;

    /** Timestamp of the user's last successful login */
    @Column(name = "last_login_at")
    private java.time.LocalDateTime lastLoginAt;

    // --- USER PROFILE FIELDS ---
    @Column(name = "bio", length = 1000)
    private String bio;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "designation")
    private String designation;

    @Column(name = "department")
    private String department;

    @Column(name = "location")
    private String location;

    @Column(name = "timezone")
    @Builder.Default
    private String timezone = "UTC+05:30";

    @Lob
    @Column(name = "profile_picture_url", columnDefinition = "LONGTEXT")
    private String profilePictureUrl;

    // --- ACCOUNT SECURITY FIELDS ---
    @Column(name = "failed_login_attempts")
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "account_locked")
    @Builder.Default
    private boolean accountLocked = false;

    // --- APPEARANCE PREFERENCES ---
    @Column(name = "theme_preference")
    @Builder.Default
    private String themePreference = "DARK";

    @Column(name = "accent_color")
    @Builder.Default
    private String accentColor = "ORANGE";

    @Column(name = "layout_mode")
    @Builder.Default
    private String layoutMode = "COMFORTABLE";

    // --- NOTIFICATION PREFERENCES ---
    @Column(name = "email_notifications")
    @Builder.Default
    private boolean emailNotifications = true;

    @Column(name = "push_notifications")
    @Builder.Default
    private boolean pushNotifications = true;

    @Column(name = "browser_notifications")
    @Builder.Default
    private boolean browserNotifications = true;

    @Column(name = "project_update_alerts")
    @Builder.Default
    private boolean projectUpdateAlerts = true;

    @Column(name = "task_assignment_alerts")
    @Builder.Default
    private boolean taskAssignmentAlerts = true;

    @Column(name = "due_date_alerts")
    @Builder.Default
    private boolean dueDateAlerts = true;

    @Column(name = "weekly_summary")
    @Builder.Default
    private boolean weeklySummary = true;

    @Column(name = "monthly_summary")
    @Builder.Default
    private boolean monthlySummary = true;

    // --- WORKSPACE SETTINGS ---
    @Column(name = "workspace_name")
    @Builder.Default
    private String workspaceName = "FlowForge Workspace";

    @Lob
    @Column(name = "workspace_logo", columnDefinition = "LONGTEXT")
    private String workspaceLogo;

    @Column(name = "workspace_description", length = 500)
    private String workspaceDescription;

    @Column(name = "default_language")
    @Builder.Default
    private String defaultLanguage = "English (US)";

    @Column(name = "date_format")
    @Builder.Default
    private String dateFormat = "YYYY-MM-DD";

    @Column(name = "time_format")
    @Builder.Default
    private String timeFormat = "24-Hour";

    @Column(name = "currency")
    @Builder.Default
    private String currency = "USD ($)";
}
