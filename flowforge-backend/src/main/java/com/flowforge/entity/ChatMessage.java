package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Chat Message JPA Entity.
 * 
 * WHY THIS CLASS EXISTS:
 * Represents persistent team chat messages mapped directly to the
 * "chat_messages" database table.
 * Supports 3 channel types (WORKSPACE, PROJECT, DIRECT), message replies,
 * edits, pinning, file attachments, and read receipts.
 */
@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage extends BaseEntity {

    /** Sender user email address */
    @Column(name = "sender_email", nullable = false)
    private String senderEmail;

    /** Sender display name */
    @Column(name = "sender_name", nullable = false)
    private String senderName;

    /** Sender avatar initial or image URL */
    @Column(name = "sender_avatar")
    private String senderAvatar;

    /** Recipient user email (for DIRECT private chats) */
    @Column(name = "recipient_email")
    private String recipientEmail;

    /** Associated Project ID string (for PROJECT channels) */
    @Column(name = "project_id")
    private String projectId;

    /** Channel type: WORKSPACE, PROJECT, DIRECT */
    @Column(name = "channel_type", nullable = false)
    @Builder.Default
    private String channelType = "WORKSPACE";

    /** Text message content */
    @Column(name = "content", length = 4000, nullable = false)
    private String content;

    /** Optional file attachment URL or Base64 stream */
    @Lob
    @Column(name = "attachment_url", columnDefinition = "LONGTEXT")
    private String attachmentUrl;

    /** Optional parent message ID for threaded replies */
    @Column(name = "reply_to_id")
    private String replyToId;

    /** Parent reply sender name snippet */
    @Column(name = "reply_to_sender")
    private String replyToSender;

    /** Parent reply text content snippet */
    @Column(name = "reply_to_content", length = 500)
    private String replyToContent;

    /** Flag indicating whether the message text was edited */
    @Column(name = "edited")
    @Builder.Default
    private boolean edited = false;

    /** Flag indicating whether the message is pinned to channel header */
    @Column(name = "pinned")
    @Builder.Default
    private boolean pinned = false;

    /** Flag indicating whether the message was deleted */
    @Column(name = "deleted")
    @Builder.Default
    private boolean deleted = false;

    /** List of user emails who have read this message */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "chat_message_read_by", joinColumns = @JoinColumn(name = "message_id"))
    @Column(name = "user_email")
    @Builder.Default
    private List<String> readBy = new ArrayList<>();
}
