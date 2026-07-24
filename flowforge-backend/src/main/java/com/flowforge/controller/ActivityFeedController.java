package com.flowforge.controller;

import com.flowforge.dto.ApiResponse;
import com.flowforge.dto.ProjectActivityDto;
import com.flowforge.entity.Notification;
import com.flowforge.repository.NotificationRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Production Activity Feed REST Controller.
 * 
 * PURPOSE OF THIS CLASS:
 * Exposes REST API endpoint (/api/v1/activities) providing real workspace
 * activity stream.
 * Queries live notifications table or returns an empty list when no activities
 * exist.
 */
@RestController
@RequestMapping("/api/v1/activities")
public class ActivityFeedController {

    private final NotificationRepository notificationRepository;

    public ActivityFeedController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /** GET /api/v1/activities - Get Unified Workspace Activity Stream */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectActivityDto>>> getWorkspaceActivities() {
        List<Notification> notifications = notificationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        if (notifications.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success("No workspace activities found", Collections.emptyList()));
        }

        List<ProjectActivityDto> activities = notifications.stream().map(n -> ProjectActivityDto.builder()
                .id(n.getId())
                .userName(n.getSender() != null ? n.getSender() : "System")
                .userAvatar(getAvatarForUser(n.getSender()))
                .activity(n.getMessage())
                .statusBadge(n.getType() != null ? n.getType().name() : "EVENT")
                .timestamp(n.getCreatedAt())
                .timeAgo("Recently")
                .build()).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Workspace activities retrieved", activities));
    }

    private String getAvatarForUser(String user) {
        if (user == null || user.isBlank())
            return "U";
        String[] parts = user.split(" ");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return user.length() >= 2 ? user.substring(0, 2).toUpperCase() : "U";
    }
}
