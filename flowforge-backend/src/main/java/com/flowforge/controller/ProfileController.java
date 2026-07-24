package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * User Profile REST Controller.
 * 
 * PURPOSE OF THIS CLASS:
 * Exposes REST endpoints (/api/v1/profile/**) for fetching user profile
 * details, editing personal info,
 * uploading/removing avatar pictures, changing passwords, configuring workspace
 * & notification preferences,
 * customizing appearance themes, downloading personal account JSON data
 * exports, and account management.
 */
@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /** GET /api/v1/profile - Get Current User Profile */
    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(Authentication authentication) {
        UserProfileDto profile = profileService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    /** PUT /api/v1/profile - Update User Profile Information */
    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        UserProfileDto updated = profileService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    /** POST /api/v1/profile/avatar - Upload Custom Profile Picture */
    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<UserProfileDto>> uploadAvatar(
            Authentication authentication,
            @RequestBody Map<String, String> payload) {
        String base64Image = payload.get("image");
        UserProfileDto updated = profileService.uploadAvatar(authentication.getName(), base64Image);
        return ResponseEntity.ok(ApiResponse.success("Profile picture updated", updated));
    }

    /** DELETE /api/v1/profile/avatar - Delete Custom Profile Picture */
    @DeleteMapping("/avatar")
    public ResponseEntity<ApiResponse<UserProfileDto>> deleteAvatar(Authentication authentication) {
        UserProfileDto updated = profileService.deleteAvatar(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile picture removed", updated));
    }

    /** POST /api/v1/profile/change-password - Change Account Password */
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", "Password updated"));
    }

    /** PUT /api/v1/profile/workspace - Update Workspace Settings */
    @PutMapping("/workspace")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateWorkspaceSettings(
            Authentication authentication,
            @RequestBody WorkspaceSettingsDto dto) {
        UserProfileDto updated = profileService.updateWorkspaceSettings(authentication.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Workspace settings updated", updated));
    }

    /** PUT /api/v1/profile/notifications - Update Notification Preferences */
    @PutMapping("/notifications")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateNotificationPreferences(
            Authentication authentication,
            @RequestBody NotificationPreferencesDto dto) {
        UserProfileDto updated = profileService.updateNotificationPreferences(authentication.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Notification preferences updated", updated));
    }

    /** PUT /api/v1/profile/appearance - Update Appearance Preferences */
    @PutMapping("/appearance")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateAppearancePreferences(
            Authentication authentication,
            @RequestBody AppearancePreferencesDto dto) {
        UserProfileDto updated = profileService.updateAppearancePreferences(authentication.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Appearance preferences updated", updated));
    }

    /** GET /api/v1/profile/export - Download Account Data JSON */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportUserData(Authentication authentication) {
        byte[] data = profileService.exportUserData(authentication.getName());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"FlowForge-account-data.json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(data);
    }

    /** PATCH /api/v1/profile/deactivate - Deactivate Account */
    @PatchMapping("/deactivate")
    public ResponseEntity<ApiResponse<String>> deactivateAccount(Authentication authentication) {
        profileService.deactivateAccount(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Account deactivated successfully", "Account deactivated"));
    }

    /** DELETE /api/v1/profile - Delete Account Permanently */
    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> deleteAccount(
            Authentication authentication,
            @RequestBody(required = false) Map<String, String> payload) {
        String password = payload != null ? payload.get("password") : null;
        profileService.deleteAccount(authentication.getName(), password);
        return ResponseEntity.ok(ApiResponse.success("Account permanently deleted", "Account deleted"));
    }
}
