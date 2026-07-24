package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Workspace Settings DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers workspace metadata, logo, timezone, currency, and date/time format
 * settings.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceSettingsDto {
    private String workspaceName;
    private String workspaceLogo;
    private String workspaceDescription;
    private String defaultLanguage;
    private String dateFormat;
    private String timeFormat;
    private String currency;
}
