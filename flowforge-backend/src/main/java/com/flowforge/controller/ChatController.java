package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

/**
 * Enterprise Team Chat REST & STOMP Controller.
 * 
 * PURPOSE OF THIS CLASS:
 * Exposes REST endpoints (/api/v1/chat/**) for chat history queries, workspace
 * user lists, direct messaging, read receipts, search, and message
 * edits/deletions.
 * Handles STOMP WebSocket @MessageMapping frames (/app/chat.sendMessage,
 * /app/chat.typing) for instant messaging and typing signals.
 */
@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    // --- STOMP WEBSOCKET MESSAGE HANDLERS ---

    /** STOMP Handler: /app/chat.sendMessage */
    @MessageMapping("/chat.sendMessage")
    public void processStompMessage(@Payload SendMessageRequest request, Principal principal) {
        String senderEmail = (principal != null && principal.getName() != null && !principal.getName().isBlank())
                ? principal.getName()
                : request.getSenderEmail();

        if (senderEmail != null && !senderEmail.isBlank()) {
            chatService.sendMessage(senderEmail, request);
        }
    }

    /** STOMP Handler: /app/chat.typing */
    @MessageMapping("/chat.typing")
    public void processTypingSignal(@Payload TypingSignalDto signal, Principal principal) {
        if (principal != null && signal != null && signal.getChannelId() != null) {
            signal.setSenderEmail(principal.getName());
            messagingTemplate.convertAndSend("/topic/chat/typing/" + signal.getChannelId(), signal);
        }
    }

    // --- REST API ENDPOINTS ---

    /** GET /api/v1/chat/users - Get Registered Workspace Users */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<ChatUserDto>>> getWorkspaceUsers() {
        List<ChatUserDto> users = chatService.getWorkspaceUsers();
        return ResponseEntity.ok(ApiResponse.success("Workspace users retrieved", users));
    }

    /** GET /api/v1/chat/workspace - Get Workspace Chat Messages */
    @GetMapping("/workspace")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getWorkspaceMessages() {
        List<ChatMessageDto> messages = chatService.getWorkspaceMessages();
        return ResponseEntity.ok(ApiResponse.success("Workspace messages retrieved", messages));
    }

    /** GET /api/v1/chat/project/{projectId} - Get Project Channel Messages */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getProjectMessages(@PathVariable String projectId) {
        List<ChatMessageDto> messages = chatService.getProjectMessages(projectId);
        return ResponseEntity.ok(ApiResponse.success("Project messages retrieved", messages));
    }

    /** GET /api/v1/chat/direct?user={recipientEmail} - Get Direct Message Thread */
    @GetMapping("/direct")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getDirectMessages(
            Authentication authentication,
            @RequestParam("user") String recipientEmail) {
        List<ChatMessageDto> messages = chatService.getDirectMessages(authentication.getName(), recipientEmail);
        return ResponseEntity.ok(ApiResponse.success("Direct messages retrieved", messages));
    }

    /** POST /api/v1/chat/send - Send Chat Message via REST */
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ChatMessageDto>> sendMessage(
            Authentication authentication,
            @Valid @RequestBody SendMessageRequest request) {
        ChatMessageDto sent = chatService.sendMessage(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", sent));
    }

    /** POST /api/v1/chat/{id}/read - Mark Chat Message as Read */
    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResponse<ChatMessageDto>> markAsRead(
            Authentication authentication,
            @PathVariable UUID id) {
        ChatMessageDto updated = chatService.markAsRead(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", updated));
    }

    /** PUT /api/v1/chat/{id} - Edit Sent Chat Message */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChatMessageDto>> editMessage(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody EditMessageRequest request) {
        ChatMessageDto updated = chatService.editMessage(id, authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Message updated", updated));
    }

    /** DELETE /api/v1/chat/{id} - Delete Sent Chat Message */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMessage(
            Authentication authentication,
            @PathVariable UUID id) {
        chatService.deleteMessage(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Message deleted", "Message deleted"));
    }

    /** PATCH /api/v1/chat/{id}/pin - Pin or Unpin Message */
    @PatchMapping("/{id}/pin")
    public ResponseEntity<ApiResponse<ChatMessageDto>> togglePinMessage(
            Authentication authentication,
            @PathVariable UUID id) {
        ChatMessageDto updated = chatService.togglePinMessage(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Message pin status updated", updated));
    }

    /** GET /api/v1/chat/search?query={keyword} - Search Chat History */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> searchMessages(@RequestParam("query") String query) {
        List<ChatMessageDto> matches = chatService.searchMessages(query);
        return ResponseEntity.ok(ApiResponse.success("Search matches retrieved", matches));
    }
}
