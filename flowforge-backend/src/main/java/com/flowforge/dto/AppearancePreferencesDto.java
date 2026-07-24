package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Appearance Preferences DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers theme preferences (LIGHT, DARK, SYSTEM), accent color (ORANGE,
 * EMERALD, PURPLE, ROSE), and layout mode.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppearancePreferencesDto {
    private String themePreference;
    private String accentColor;
    private String layoutMode;
}
