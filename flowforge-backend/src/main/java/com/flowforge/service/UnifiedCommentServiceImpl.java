package com.flowforge.service;

import com.flowforge.dto.CommentCreateRequest;
import com.flowforge.dto.NotificationDto;
import com.flowforge.dto.UnifiedCommentDto;
import com.flowforge.entity.*;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.NotificationRepository;
import com.flowforge.repository.UnifiedCommentRepository;
import com.flowforge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Unified Comment Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Handles comment creation, nested reply tree assembly, regex @mention
 * extraction,
 * DB persistence, and real-time notification alerts.
 */
@Service
public class UnifiedCommentServiceImpl implements UnifiedCommentService {

    private final UnifiedCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final WebSocketPublisher webSocketPublisher;

    public UnifiedCommentServiceImpl(
            UnifiedCommentRepository commentRepository,
            UserRepository userRepository,
            NotificationRepository notificationRepository,
            WebSocketPublisher webSocketPublisher) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.webSocketPublisher = webSocketPublisher;
    }

    @Override
    @Transactional
    public UnifiedCommentDto createComment(String authorEmail, CommentCreateRequest request) {
        String email = authorEmail.toLowerCase().trim();
        User author = userRepository.findByEmail(email).orElse(null);

        String authorName = author != null ? author.getName() : email;
        String authorAvatar = author != null && author.getProfilePictureUrl() != null
                ? author.getProfilePictureUrl()
                : getInitials(authorName);

        // Extract @mentions (e.g. @alex@FlowForge.com)
        List<String> mentions = extractMentions(request.getContent());

        UnifiedComment comment = UnifiedComment.builder()
                .targetType(request.getTargetType().toUpperCase())
                .targetId(request.getTargetId())
                .parentCommentId(request.getParentCommentId())
                .authorEmail(email)
                .authorName(authorName)
                .authorAvatar(authorAvatar)
                .content(request.getContent())
                .mentionedEmails(mentions)
                .edited(false)
                .deleted(false)
                .build();

        UnifiedComment saved = commentRepository.save(comment);

        // Send notifications to mentioned users
        for (String mentionedEmail : mentions) {
            if (!mentionedEmail.equalsIgnoreCase(email)) {
                Notification notif = Notification.builder()
                        .title("You were mentioned in a comment")
                        .message(authorName + " mentioned you in a comment on " + request.getTargetType().toLowerCase())
                        .type(NotificationType.USER_MENTIONED)
                        .priority(NotificationPriority.HIGH)
                        .readStatus(false)
                        .sender(authorName)
                        .receiver(mentionedEmail)
                        .actionUrl("/" + request.getTargetType().toLowerCase() + "s")
                        .build();
                Notification savedNotif = notificationRepository.save(notif);

                NotificationDto dto = NotificationDto.builder()
                        .id(savedNotif.getId())
                        .title(savedNotif.getTitle())
                        .message(savedNotif.getMessage())
                        .type(savedNotif.getType() != null ? savedNotif.getType() : NotificationType.USER_MENTIONED)
                        .priority(
                                savedNotif.getPriority() != null ? savedNotif.getPriority() : NotificationPriority.HIGH)
                        .readStatus(savedNotif.isReadStatus())
                        .sender(savedNotif.getSender())
                        .receiver(savedNotif.getReceiver())
                        .actionUrl(savedNotif.getActionUrl())
                        .createdAt(savedNotif.getCreatedAt())
                        .build();

                webSocketPublisher.publishNotification(dto);
            }
        }

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnifiedCommentDto> getCommentsForTarget(String targetType, String targetId) {
        List<UnifiedComment> allComments = commentRepository
                .findByTargetTypeAndTargetIdOrderByCreatedAtAsc(targetType.toUpperCase(), targetId);

        Map<String, UnifiedCommentDto> dtoMap = new HashMap<>();
        List<UnifiedCommentDto> rootComments = new ArrayList<>();

        for (UnifiedComment c : allComments) {
            UnifiedCommentDto dto = mapToDto(c);
            dto.setReplies(new ArrayList<>());
            dtoMap.put(c.getId().toString(), dto);
        }

        for (UnifiedComment c : allComments) {
            UnifiedCommentDto dto = dtoMap.get(c.getId().toString());
            if (c.getParentCommentId() != null && dtoMap.containsKey(c.getParentCommentId())) {
                dtoMap.get(c.getParentCommentId()).getReplies().add(dto);
            } else {
                rootComments.add(dto);
            }
        }

        return rootComments;
    }

    @Override
    @Transactional
    public UnifiedCommentDto editComment(UUID commentId, String authorEmail, String content) {
        UnifiedComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("UnifiedComment", "id", commentId));

        if (!comment.getAuthorEmail().equalsIgnoreCase(authorEmail)) {
            throw new IllegalArgumentException("You can only edit your own comments.");
        }

        comment.setContent(content);
        comment.setEdited(true);
        UnifiedComment updated = commentRepository.save(comment);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId, String authorEmail) {
        UnifiedComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("UnifiedComment", "id", commentId));

        if (!comment.getAuthorEmail().equalsIgnoreCase(authorEmail)) {
            throw new IllegalArgumentException("You can only delete your own comments.");
        }

        comment.setContent("This comment was deleted.");
        comment.setDeleted(true);
        commentRepository.save(comment);
    }

    private List<String> extractMentions(String content) {
        if (content == null || !content.contains("@"))
            return new ArrayList<>();
        List<String> mentions = new ArrayList<>();
        Matcher matcher = Pattern.compile("@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})").matcher(content);
        while (matcher.find()) {
            mentions.add(matcher.group(1).toLowerCase());
        }
        return mentions;
    }

    private UnifiedCommentDto mapToDto(UnifiedComment c) {
        String formattedTime = c.getCreatedAt() != null
                ? c.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a"))
                : "Just now";

        return UnifiedCommentDto.builder()
                .id(c.getId())
                .targetType(c.getTargetType())
                .targetId(c.getTargetId())
                .parentCommentId(c.getParentCommentId())
                .authorEmail(c.getAuthorEmail())
                .authorName(c.getAuthorName())
                .authorAvatar(c.getAuthorAvatar())
                .content(c.getContent())
                .edited(c.isEdited())
                .deleted(c.isDeleted())
                .mentionedEmails(c.getMentionedEmails())
                .createdAt(c.getCreatedAt())
                .timeFormatted(formattedTime)
                .build();
    }

    private String getInitials(String name) {
        if (name == null || name.isBlank())
            return "U";
        String[] parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return name.length() >= 2 ? name.substring(0, 2).toUpperCase() : "U";
    }
}
