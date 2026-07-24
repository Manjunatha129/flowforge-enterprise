package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Unified Comment JPA Entity.
 * 
 * WHY THIS CLASS EXISTS:
 * Serves as the central entity for comments across Projects, Tasks, and
 * Attachments.
 * Supports nested parent comment replies, @mentions, rich text formatting, and
 * edit history.
 */
@Entity
@Table(name = "unified_comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnifiedComment extends BaseEntity {

    /** Target Entity Type: "PROJECT", "TASK", "ATTACHMENT" */
    @Column(name = "target_type", nullable = false)
    private String targetType;

    /** Target Entity Identifier string */
    @Column(name = "target_id", nullable = false)
    private String targetId;

    /** Optional parent comment ID for nested threaded replies */
    @Column(name = "parent_comment_id")
    private String parentCommentId;

    /** Author user email address */
    @Column(name = "author_email", nullable = false)
    private String authorEmail;

    /** Author display name */
    @Column(name = "author_name", nullable = false)
    private String authorName;

    /** Author avatar URL or initial string */
    @Column(name = "author_avatar")
    private String authorAvatar;

    /** Comment text content */
    @Column(name = "content", length = 4000, nullable = false)
    private String content;

    /** Flag indicating whether comment text was edited */
    @Column(name = "edited")
    @Builder.Default
    private boolean edited = false;

    /** Flag indicating soft deletion */
    @Column(name = "deleted")
    @Builder.Default
    private boolean deleted = false;

    /** List of user emails @mentioned in this comment */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "unified_comment_mentions", joinColumns = @JoinColumn(name = "comment_id"))
    @Column(name = "mentioned_user_email")
    @Builder.Default
    private List<String> mentionedEmails = new ArrayList<>();
}
