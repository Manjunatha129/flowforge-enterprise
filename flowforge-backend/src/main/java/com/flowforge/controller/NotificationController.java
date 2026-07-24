package com.flowforge.controller;

import com.flowforge.dto.ApiResponse;
import com.flowforge.dto.NotificationDto;
import com.flowforge.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Notification REST Controller.
 * 
 * PURPOSE OF THIS CLASS:
 * Exposes REST API endpoints (/api/v1/notifications) for fetching user
 * notifications, unread counts,
 * marking notifications as read, and deleting or clearing notification feeds.
 * 
 * ANNOTATIONS EXPLAINED:
 * - @RestController: Marks this class as a Spring REST Controller that
 * serializes responses into JSON.
 * - @RequestMapping("/api/v1/notifications"): Base path for all notification
 * endpoints.
 */
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equalsIgnoreCase("anonymousUser")) {
            return auth.getName();
        }
        return "admin@FlowForge.com";
    }

    /** GET /api/v1/notifications - Get All Notifications for Authenticated User */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications() {
        String receiver = getCurrentUserEmail();
        List<NotificationDto> notifications = notificationService.getNotifications(receiver);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", notifications));
    }

    /** GET /api/v1/notifications/unread - Get Only Unread Notifications */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUnreadNotifications() {
        String receiver = getCurrentUserEmail();
        List<NotificationDto> unread = notificationService.getUnreadNotifications(receiver);
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved", unread));
    }

    /** GET /api/v1/notifications/count - Get Unread Counter Badge Number */
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        String receiver = getCurrentUserEmail();
        long unreadCount = notificationService.getUnreadCount(receiver);
        Map<String, Long> data = new HashMap<>();
        data.put("unreadCount", unreadCount);
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved", data));
    }

    /**
     * PATCH /api/v1/notifications/{id}/read - Mark Specific Notification as Read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(@PathVariable("id") UUID id) {
        NotificationDto updated = notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", updated));
    }

    /** PATCH /api/v1/notifications/read-all - Mark All Notifications as Read */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        String receiver = getCurrentUserEmail();
        notificationService.markAllAsRead(receiver);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    /** DELETE /api/v1/notifications/{id} - Delete Notification by ID */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable("id") UUID id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully", null));
    }

    /** DELETE /api/v1/notifications/clear - Clear All Notifications */
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearAllNotifications() {
        String receiver = getCurrentUserEmail();
        notificationService.clearAllNotifications(receiver);
        return ResponseEntity.ok(ApiResponse.success("All notifications cleared successfully", null));
    }
}
