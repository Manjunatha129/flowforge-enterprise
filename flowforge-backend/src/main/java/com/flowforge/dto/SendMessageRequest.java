package com.flowforge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Send Message Request DTO.
 * 
 * PURPOSE OF THIS CLASS:
 * Validates request payload for sending a chat message to workspace, project
 * channel, or private DM via REST API or STOMP WebSockets.
 * 
 * Annotations used:
 * - @Data: Generates getters, setters, toString, equals, and hashCode.
 * - @Builder: Implements the Builder design pattern.
 * - @NoArgsConstructor: Generates default no-argument constructor for JSON deserialization.
 * - @AllArgsConstructor: Generates constructor with all fields.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    @NotBlank(message = "Message content cannot be blank")
    private String content;

    private String channelType; // "WORKSPACE", "PROJECT", "DIRECT"
    private String projectId;
    private String recipientEmail;
    private String senderEmail;

    private String attachmentUrl;
    private String replyToId;
}

