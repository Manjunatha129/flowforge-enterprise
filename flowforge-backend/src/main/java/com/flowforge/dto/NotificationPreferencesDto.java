package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Notification Preferences DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers notification toggle preferences (email, push, browser, project/task
 * alerts, digests).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferencesDto {
    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean browserNotifications;
    private boolean projectUpdateAlerts;
    private boolean taskAssignmentAlerts;
    private boolean dueDateAlerts;
    private boolean weeklySummary;
    private boolean monthlySummary;
}
