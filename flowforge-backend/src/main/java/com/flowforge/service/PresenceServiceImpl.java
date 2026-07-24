package com.flowforge.service;

import com.flowforge.dto.PresenceDto;
import com.flowforge.entity.User;
import com.flowforge.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Presence Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Tracks connected user WebSocket sessions in memory using ConcurrentHashMap,
 * updates DB timestamps,
 * and broadcasts presence state changes (/topic/presence) in real time to
 * connected web clients.
 * 
 * KEY CONCEPTS EXPLAINED:
 * - ConcurrentHashMap: Thread-safe map storing active connected user presence
 * sessions without blocking.
 * - SimpMessagingTemplate: Spring STOMP messaging client used to push presence
 * updates to clients.
 */
@Service
public class PresenceServiceImpl implements PresenceService {

    private final Map<String, PresenceDto> activeSessions = new ConcurrentHashMap<>();
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public PresenceServiceImpl(UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    @Transactional
    public void userConnected(String email) {
        if (email == null || email.isBlank())
            return;

        String key = email.toLowerCase().trim();
        LocalDateTime now = LocalDateTime.now();

        User user = userRepository.findByEmail(key).orElse(null);
        String name = user != null ? user.getName() : email;
        String avatar = getAvatarInitials(name);

        PresenceDto dto = PresenceDto.builder()
                .userEmail(key)
                .userName(name)
                .userAvatar(avatar)
                .status("ONLINE")
                .lastSeen(now)
                .connectionTime(now)
                .disconnectTime(null)
                .build();

        activeSessions.put(key, dto);

        // Update last login in database
        if (user != null) {
            user.setLastLoginAt(now);
            userRepository.save(user);
        }

        // Broadcast to STOMP presence topic
        messagingTemplate.convertAndSend("/topic/presence", dto);
    }

    @Override
    @Transactional
    public void userDisconnected(String email) {
        if (email == null || email.isBlank())
            return;

        String key = email.toLowerCase().trim();
        LocalDateTime now = LocalDateTime.now();

        PresenceDto existing = activeSessions.get(key);
        String name = existing != null ? existing.getUserName() : email;

        PresenceDto dto = PresenceDto.builder()
                .userEmail(key)
                .userName(name)
                .userAvatar(getAvatarInitials(name))
                .status("OFFLINE")
                .lastSeen(now)
                .connectionTime(existing != null ? existing.getConnectionTime() : null)
                .disconnectTime(now)
                .build();

        activeSessions.remove(key);

        // Broadcast presence disconnect event
        messagingTemplate.convertAndSend("/topic/presence", dto);
    }

    @Override
    public List<PresenceDto> getOnlineUsers() {
        return new ArrayList<>(activeSessions.values());
    }

    @Override
    public PresenceDto getUserPresence(String email) {
        if (email == null)
            return null;
        String key = email.toLowerCase().trim();
        return activeSessions.getOrDefault(key, PresenceDto.builder()
                .userEmail(key)
                .status("OFFLINE")
                .lastSeen(LocalDateTime.now().minusHours(1))
                .build());
    }

    @Override
    public long getOnlineCount() {
        return activeSessions.size();
    }

    private String getAvatarInitials(String name) {
        if (name == null || name.isBlank())
            return "U";
        String[] parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return name.length() >= 2 ? name.substring(0, 2).toUpperCase() : "U";
    }
}
