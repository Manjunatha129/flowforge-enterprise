package com.flowforge.service;

import com.flowforge.dto.ChatMessageDto;
import com.flowforge.dto.ChatUserDto;
import com.flowforge.dto.EditMessageRequest;
import com.flowforge.dto.SendMessageRequest;

import java.util.List;
import java.util.UUID;

/**
 * Chat Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines business operations for sending chat messages, querying
 * workspace/project/DM chat histories,
 * fetching registered workspace users, read receipt tracking, editing/deleting
 * messages, replying to messages,
 * pinning messages, and searching chat text.
 */
public interface ChatService {

    ChatMessageDto sendMessage(String senderEmail, SendMessageRequest request);

    List<ChatMessageDto> getWorkspaceMessages();

    List<ChatMessageDto> getProjectMessages(String projectId);

    List<ChatMessageDto> getDirectMessages(String userA, String userB);

    List<ChatUserDto> getWorkspaceUsers();

    ChatMessageDto markAsRead(UUID messageId, String userEmail);

    ChatMessageDto editMessage(UUID messageId, String senderEmail, EditMessageRequest request);

    void deleteMessage(UUID messageId, String senderEmail);

    ChatMessageDto togglePinMessage(UUID messageId, String userEmail);

    List<ChatMessageDto> searchMessages(String keyword);
}
