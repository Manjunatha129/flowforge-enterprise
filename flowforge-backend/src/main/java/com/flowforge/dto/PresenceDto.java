package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Presence Status DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates real-time user online presence, connection state, last seen
 * timestamps, and active status.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresenceDto {
    private String userEmail;
    private String userName;
    private String userAvatar;
    private String status; // "ONLINE", "OFFLINE"
    private LocalDateTime lastSeen;
    private LocalDateTime connectionTime;
    private LocalDateTime disconnectTime;
}
