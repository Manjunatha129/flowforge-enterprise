package com.flowforge.config;

import com.flowforge.service.PresenceService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * WebSocket Session Event Listener.
 * 
 * WHY THIS CLASS EXISTS:
 * Listens to Spring ApplicationEvents emitted during STOMP session lifecycle
 * (SessionConnectedEvent, SessionDisconnectEvent)
 * to automatically trigger presence tracking online/offline updates without
 * manual client signals.
 */
@Component
public class WebSocketEventListener {

    private final PresenceService presenceService;

    public WebSocketEventListener(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Authentication user = (Authentication) headerAccessor.getUser();
        if (user != null && user.getName() != null) {
            presenceService.userConnected(user.getName());
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Authentication user = (Authentication) headerAccessor.getUser();
        if (user != null && user.getName() != null) {
            presenceService.userDisconnected(user.getName());
        }
    }
}
