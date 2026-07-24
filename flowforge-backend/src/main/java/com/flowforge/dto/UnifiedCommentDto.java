package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Unified Comment DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers comment details, author information, nested reply hierarchy,
 * and @mentions between backend and frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnifiedCommentDto {
    private UUID id;
    private String targetType;
    private String targetId;
    private String parentCommentId;
    private String authorEmail;
    private String authorName;
    private String authorAvatar;
    private String content;
    private boolean edited;
    private boolean deleted;
    private List<String> mentionedEmails;
    private LocalDateTime createdAt;
    private String timeFormatted;
    private List<UnifiedCommentDto> replies;
}
