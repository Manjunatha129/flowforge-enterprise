package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.entity.Role;
import com.flowforge.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin REST Controller.
 * 
 * PURPOSE OF THIS CLASS:
 * Exposes REST API endpoints under /api/v1/admin/** for system administrators.
 * Protected strictly by Spring Security @PreAuthorize("hasRole('ADMIN')").
 * Non-admin user accounts will receive HTTP 403 Forbidden Access Denied errors.
 */
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /** GET /api/v1/admin/stats - Admin Dashboard Statistics */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getAdminStats() {
        AdminDashboardStatsDto stats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics retrieved", stats));
    }

    /** GET /api/v1/admin/users - User Management List with Search & Filters */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserAdminDto>>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean enabled) {
        List<UserAdminDto> users = adminService.getAllUsers(search, role, enabled);
        return ResponseEntity.ok(ApiResponse.success("Users list retrieved", users));
    }

    /** PATCH /api/v1/admin/users/{id}/role - Promote / Demote User Role */
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserAdminDto>> updateUserRole(
            @PathVariable UUID id,
            @Valid @RequestBody RoleUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "admin@FlowForge.com";
        UserAdminDto updated = adminService.updateUserRole(id, request.getRole(), adminEmail);
        return ResponseEntity.ok(ApiResponse.success("User role updated to " + request.getRole(), updated));
    }

    /** PATCH /api/v1/admin/users/{id}/status - Activate / Deactivate User */
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserAdminDto>> toggleUserStatus(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "admin@FlowForge.com";
        UserAdminDto updated = adminService.toggleUserStatus(id, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("User status toggled", updated));
    }

    /** POST /api/v1/admin/users/{id}/reset-password - Admin Reset Password */
    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<ApiResponse<String>> resetUserPassword(
            @PathVariable UUID id,
            @RequestBody String newPassword,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "admin@FlowForge.com";
        adminService.resetUserPassword(id, newPassword, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("User password reset successfully", "Password updated"));
    }

    /** DELETE /api/v1/admin/users/{id} - Delete User Account */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "admin@FlowForge.com";
        adminService.deleteUser(id, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    /** GET /api/v1/admin/settings - Get System Settings */
    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSettingsDto>> getSystemSettings() {
        SystemSettingsDto settings = adminService.getSystemSettings();
        return ResponseEntity.ok(ApiResponse.success("System settings retrieved", settings));
    }

    /** PUT /api/v1/admin/settings - Update System Settings */
    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSettingsDto>> updateSystemSettings(
            @RequestBody SystemSettingsDto settings,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "admin@FlowForge.com";
        SystemSettingsDto updated = adminService.updateSystemSettings(settings, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("System settings updated successfully", updated));
    }
}
