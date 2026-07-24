package com.flowforge.service;

import com.flowforge.dto.ChatMessageDto;
import com.flowforge.dto.ChatUserDto;
import com.flowforge.dto.EditMessageRequest;
import com.flowforge.dto.SendMessageRequest;
import com.flowforge.entity.ChatMessage;
import com.flowforge.entity.User;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.ChatMessageRepository;
import com.flowforge.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Chat Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates team chat business logic, message persistence in MySQL/H2
 * database,
 * workspace user listing, read receipts, message edits/deletions/pins, and
 * real-time STOMP topic broadcasting.
 */
@Service
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatServiceImpl(
            ChatMessageRepository chatMessageRepository,
            UserRepository userRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    @Transactional
    public ChatMessageDto sendMessage(String senderEmail, SendMessageRequest request) {
        String email = senderEmail.toLowerCase().trim();
        User sender = userRepository.findByEmail(email).orElse(null);

        String senderName = sender != null ? sender.getName() : email;
        String senderAvatar = sender != null && sender.getProfilePictureUrl() != null ? sender.getProfilePictureUrl()
                : getInitials(senderName);

        String replyToSender = null;
        String replyToContent = null;

        if (request.getReplyToId() != null && !request.getReplyToId().isBlank()) {
            try {
                UUID parentId = UUID.fromString(request.getReplyToId());
                ChatMessage parent = chatMessageRepository.findById(parentId).orElse(null);
                if (parent != null) {
                    replyToSender = parent.getSenderName();
                    replyToContent = parent.getContent().length() > 80 ? parent.getContent().substring(0, 77) + "..."
                            : parent.getContent();
                }
            } catch (Exception ignored) {
            }
        }

        String channelType = (request.getChannelType() != null && !request.getChannelType().isBlank())
                ? request.getChannelType().toUpperCase()
                : "WORKSPACE";

        ChatMessage message = ChatMessage.builder()
                .senderEmail(email)
                .senderName(senderName)
                .senderAvatar(senderAvatar)
                .recipientEmail(
                        request.getRecipientEmail() != null ? request.getRecipientEmail().toLowerCase().trim() : null)
                .projectId(request.getProjectId())
                .channelType(channelType)
                .content(request.getContent())
                .attachmentUrl(request.getAttachmentUrl())
                .replyToId(request.getReplyToId())
                .replyToSender(replyToSender)
                .replyToContent(replyToContent)
                .edited(false)
                .pinned(false)
                .deleted(false)
                .readBy(new ArrayList<>(Collections.singletonList(email)))
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        ChatMessageDto dto = mapToDto(saved);

        // Broadcast STOMP Message Frame
        broadcastMessage(dto);

        // Send Live Notification alert for Direct Messages
        if ("DIRECT".equalsIgnoreCase(channelType) && request.getRecipientEmail() != null) {
            Map<String, Object> notif = new HashMap<>();
            notif.put("title", "New Chat Message from " + senderName);
            notif.put("message", request.getContent());
            notif.put("sender", senderName);
            notif.put("type", "CHAT");
            notif.put("createdAt", LocalDateTime.now().toString());
            messagingTemplate.convertAndSend("/topic/notifications", notif);
        }

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDto> getWorkspaceMessages() {
        return chatMessageRepository.findByChannelTypeOrderByCreatedAtAsc("WORKSPACE")
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDto> getProjectMessages(String projectId) {
        return chatMessageRepository.findByChannelTypeAndProjectIdOrderByCreatedAtAsc("PROJECT", projectId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDto> getDirectMessages(String userA, String userB) {
        return chatMessageRepository.findDirectMessages(userA, userB)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatUserDto> getWorkspaceUsers() {
        return userRepository.findAll().stream()
                .map(u -> ChatUserDto.builder()
                        .id(u.getId().toString())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole() != null ? u.getRole().name() : "ROLE_USER")
                        .profilePictureUrl(u.getProfilePictureUrl())
                        .designation(u.getDesignation())
                        .department(u.getDepartment())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatMessageDto markAsRead(UUID messageId, String userEmail) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatMessage", "id", messageId));

        String email = userEmail.toLowerCase().trim();
        if (message.getReadBy() == null) {
            message.setReadBy(new ArrayList<>());
        }
        if (!message.getReadBy().contains(email)) {
            message.getReadBy().add(email);
            message = chatMessageRepository.save(message);
            ChatMessageDto dto = mapToDto(message);
            broadcastMessage(dto);
            return dto;
        }
        return mapToDto(message);
    }

    @Override
    @Transactional
    public ChatMessageDto editMessage(UUID messageId, String senderEmail, EditMessageRequest request) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatMessage", "id", messageId));

        if (!message.getSenderEmail().equalsIgnoreCase(senderEmail)) {
            throw new IllegalArgumentException("You can only edit your own chat messages.");
        }

        message.setContent(request.getContent());
        message.setEdited(true);

        ChatMessage updated = chatMessageRepository.save(message);
        ChatMessageDto dto = mapToDto(updated);
        broadcastMessage(dto);

        return dto;
    }

    @Override
    @Transactional
    public void deleteMessage(UUID messageId, String senderEmail) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatMessage", "id", messageId));

        if (!message.getSenderEmail().equalsIgnoreCase(senderEmail)) {
            throw new IllegalArgumentException("You can only delete your own chat messages.");
        }

        message.setContent("This message was deleted.");
        message.setDeleted(true);
        ChatMessage updated = chatMessageRepository.save(message);
        ChatMessageDto dto = mapToDto(updated);
        broadcastMessage(dto);
    }

    @Override
    @Transactional
    public ChatMessageDto togglePinMessage(UUID messageId, String userEmail) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatMessage", "id", messageId));

        message.setPinned(!message.isPinned());
        ChatMessage updated = chatMessageRepository.save(message);
        ChatMessageDto dto = mapToDto(updated);
        broadcastMessage(dto);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDto> searchMessages(String keyword) {
        if (keyword == null || keyword.isBlank())
            return new ArrayList<>();
        return chatMessageRepository.findByContentContainingIgnoreCaseOrderByCreatedAtDesc(keyword)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private void broadcastMessage(ChatMessageDto dto) {
        if ("WORKSPACE".equalsIgnoreCase(dto.getChannelType())) {
            messagingTemplate.convertAndSend("/topic/chat/workspace", dto);
        } else if ("PROJECT".equalsIgnoreCase(dto.getChannelType()) && dto.getProjectId() != null) {
            messagingTemplate.convertAndSend("/topic/chat/project/" + dto.getProjectId(), dto);
        } else if ("DIRECT".equalsIgnoreCase(dto.getChannelType()) && dto.getRecipientEmail() != null) {
            String dmKey = getDmKey(dto.getSenderEmail(), dto.getRecipientEmail());
            messagingTemplate.convertAndSend("/topic/chat/direct/" + dmKey, dto);
        }
    }

    private String getDmKey(String userA, String userB) {
        List<String> list = Arrays.asList(userA.toLowerCase().trim(), userB.toLowerCase().trim());
        Collections.sort(list);
        return list.get(0) + "_" + list.get(1);
    }

    private ChatMessageDto mapToDto(ChatMessage m) {
        String formattedTime = m.getCreatedAt() != null
                ? m.getCreatedAt().format(DateTimeFormatter.ofPattern("hh:mm a"))
                : "Just now";

        return ChatMessageDto.builder()
                .id(m.getId())
                .senderEmail(m.getSenderEmail())
                .senderName(m.getSenderName())
                .senderAvatar(m.getSenderAvatar())
                .recipientEmail(m.getRecipientEmail())
                .projectId(m.getProjectId())
                .channelType(m.getChannelType())
                .content(m.getContent())
                .attachmentUrl(m.getAttachmentUrl())
                .replyToId(m.getReplyToId())
                .replyToSender(m.getReplyToSender())
                .replyToContent(m.getReplyToContent())
                .edited(m.isEdited())
                .pinned(m.isPinned())
                .deleted(m.isDeleted())
                .readBy(m.getReadBy())
                .createdAt(m.getCreatedAt())
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
