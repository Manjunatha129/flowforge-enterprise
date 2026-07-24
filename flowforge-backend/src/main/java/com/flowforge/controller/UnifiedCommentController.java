package com.flowforge.controller;

import com.flowforge.dto.ApiResponse;
import com.flowforge.dto.CommentCreateRequest;
import com.flowforge.dto.UnifiedCommentDto;
import com.flowforge.service.UnifiedCommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Unified Comments REST Controller.
 * 
 * WHY THIS CLASS EXISTS:
 * Exposes REST endpoints (/api/v1/comments/**) for creating comments, fetching
 * nested comment threads,
 * editing, and deleting comments.
 */
@RestController
@RequestMapping("/api/v1/comments")
public class UnifiedCommentController {

    private final UnifiedCommentService commentService;

    public UnifiedCommentController(UnifiedCommentService commentService) {
        this.commentService = commentService;
    }

    /** GET /api/v1/comments?targetType={type}&targetId={id} - Get Comment Thread */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UnifiedCommentDto>>> getComments(
            @RequestParam("targetType") String targetType,
            @RequestParam("targetId") String targetId) {
        List<UnifiedCommentDto> comments = commentService.getCommentsForTarget(targetType, targetId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved successfully", comments));
    }

    /** POST /api/v1/comments - Create New Comment or Nested Reply */
    @PostMapping
    public ResponseEntity<ApiResponse<UnifiedCommentDto>> createComment(
            Authentication authentication,
            @Valid @RequestBody CommentCreateRequest request) {
        UnifiedCommentDto created = commentService.createComment(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Comment posted successfully", created));
    }

    /** PUT /api/v1/comments/{id} - Edit Existing Comment */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UnifiedCommentDto>> editComment(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestBody CommentCreateRequest request) {
        UnifiedCommentDto updated = commentService.editComment(id, authentication.getName(), request.getContent());
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", updated));
    }

    /** DELETE /api/v1/comments/{id} - Delete Comment */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteComment(
            Authentication authentication,
            @PathVariable UUID id) {
        commentService.deleteComment(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", "Comment deleted"));
    }
}
