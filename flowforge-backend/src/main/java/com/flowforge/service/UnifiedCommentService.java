package com.flowforge.service;

import com.flowforge.dto.CommentCreateRequest;
import com.flowforge.dto.UnifiedCommentDto;

import java.util.List;
import java.util.UUID;

/**
 * Unified Comment Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines business operations for creating, editing, deleting comments,
 * building nested thread trees,
 * parsing @mentions, and notifying tagged team members.
 */
public interface UnifiedCommentService {

    UnifiedCommentDto createComment(String authorEmail, CommentCreateRequest request);

    List<UnifiedCommentDto> getCommentsForTarget(String targetType, String targetId);

    UnifiedCommentDto editComment(UUID commentId, String authorEmail, String content);

    void deleteComment(UUID commentId, String authorEmail);
}
