package com.flowforge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Comment Create Request DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Validates request payload when posting a comment or nested reply to a
 * project, task, or attachment.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateRequest {
    @NotBlank(message = "Target type is required")
    private String targetType; // "PROJECT", "TASK", "ATTACHMENT"

    @NotBlank(message = "Target ID is required")
    private String targetId;

    @NotBlank(message = "Comment content cannot be blank")
    private String content;

    private String parentCommentId;
}
