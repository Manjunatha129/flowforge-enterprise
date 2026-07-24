package com.flowforge.controller;

import com.flowforge.dto.ApiResponse;
import com.flowforge.dto.PresenceDto;
import com.flowforge.service.PresenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Real-Time User Presence REST Controller.
 * 
 * PURPOSE OF THIS CLASS:
 * Exposes REST endpoints (/api/v1/presence/**) for querying active online user
 * sessions,
 * checking specific user presence statuses, and retrieving live connection
 * counts.
 */
@RestController
@RequestMapping("/api/v1/presence")
public class PresenceController {

    private final PresenceService presenceService;

    public PresenceController(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    /** GET /api/v1/presence/online - Get List of Currently Online Users */
    @GetMapping("/online")
    public ResponseEntity<ApiResponse<List<PresenceDto>>> getOnlineUsers() {
        List<PresenceDto> onlineUsers = presenceService.getOnlineUsers();
        return ResponseEntity.ok(ApiResponse.success("Online users retrieved", onlineUsers));
    }

    /** GET /api/v1/presence/count - Get Total Count of Online Users */
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getOnlineCount() {
        long count = presenceService.getOnlineCount();
        return ResponseEntity.ok(ApiResponse.success("Online count retrieved", count));
    }

    /** GET /api/v1/presence/users/{email} - Get Specific User Presence Status */
    @GetMapping("/users/{email}")
    public ResponseEntity<ApiResponse<PresenceDto>> getUserPresence(@PathVariable String email) {
        PresenceDto presence = presenceService.getUserPresence(email);
        return ResponseEntity.ok(ApiResponse.success("User presence status retrieved", presence));
    }
}
