package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Typing Signal DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates real-time typing indicators ("Alex Chen is typing...") sent over
 * STOMP WebSockets.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingSignalDto {
    private String channelId; // Channel or DM identifier
    private String senderEmail;
    private String senderName;
    private boolean typing; // true when user starts typing, false when stopped
}
