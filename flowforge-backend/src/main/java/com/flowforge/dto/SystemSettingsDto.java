package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * System Settings Configuration DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Holds global system settings (appName, companyName, timezone, JWT timeout,
 * session timeout, password policy, maintenance mode).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingsDto {
    private String applicationName;
    private String companyName;
    private String logoUrl;
    private String theme;
    private String timezone;
    private String emailSender;
    private int jwtExpirationHours;
    private int sessionTimeoutMinutes;
    private String passwordPolicy;
    private boolean maintenanceMode;
}
