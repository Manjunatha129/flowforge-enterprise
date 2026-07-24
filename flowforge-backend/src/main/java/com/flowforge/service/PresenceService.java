package com.flowforge.service;

import com.flowforge.dto.PresenceDto;

import java.util.List;

/**
 * Presence Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines business operations for tracking real-time WebSocket connection
 * sessions,
 * marking users online/offline, and querying online presence status.
 */
public interface PresenceService {

    void userConnected(String email);

    void userDisconnected(String email);

    List<PresenceDto> getOnlineUsers();

    PresenceDto getUserPresence(String email);

    long getOnlineCount();
}
