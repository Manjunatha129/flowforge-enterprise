package com.flowforge.service;

import com.flowforge.dto.*;

/**
 * Profile Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines business operations for user profile updates, password changes,
 * avatar uploads/deletions,
 * workspace settings, notification toggles, appearance preferences, JSON data
 * exports, and account management.
 */
public interface ProfileService {

    UserProfileDto getProfile(String email);

    UserProfileDto updateProfile(String email, ProfileUpdateRequest request);

    UserProfileDto uploadAvatar(String email, String base64Image);

    UserProfileDto deleteAvatar(String email);

    void changePassword(String email, ChangePasswordRequest request);

    UserProfileDto updateWorkspaceSettings(String email, WorkspaceSettingsDto dto);

    UserProfileDto updateNotificationPreferences(String email, NotificationPreferencesDto dto);

    UserProfileDto updateAppearancePreferences(String email, AppearancePreferencesDto dto);

    byte[] exportUserData(String email);

    void deactivateAccount(String email);

    void deleteAccount(String email, String confirmPassword);
}
