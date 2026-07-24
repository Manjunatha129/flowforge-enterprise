package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Chat Message DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers persistent chat message payloads between backend REST/STOMP
 * controllers and frontend clients.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private UUID id;
    private String senderEmail;
    private String senderName;
    private String senderAvatar;
    private String recipientEmail;
    private String projectId;
    private String channelType; // "WORKSPACE", "PROJECT", "DIRECT"
    private String content;
    private String attachmentUrl;
    private String replyToId;
    private String replyToSender;
    private String replyToContent;
    private boolean edited;
    private boolean pinned;
    private boolean deleted;
    private List<String> readBy;
    private LocalDateTime createdAt;
    private String timeFormatted;
}
