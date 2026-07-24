package com.flowforge.config;

import com.flowforge.security.JwtUtils;
import com.flowforge.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

/**
 * Spring Boot WebSocket & STOMP Message Broker Configuration.
 * 
 * WHY THIS CLASS EXISTS:
 * Enables real-time pub/sub messaging over WebSockets using STOMP protocol and
 * SockJS fallback.
 * Configures topics (/topic/notifications, /topic/presence, /topic/dashboard),
 * user queues (/user/queue),
 * application prefixes (/app), and secures incoming STOMP connections using JWT
 * Bearer authentication.
 * 
 * KEY CONCEPTS EXPLAINED:
 * - @EnableWebSocketMessageBroker: Activates Spring's high-level WebSocket
 * message handling backed by a STOMP broker.
 * - STOMP (Simple Text Oriented Messaging Protocol): Message framing protocol
 * over raw WebSocket connections.
 * - SockJS Fallback: Provides alternative transport options (HTTP streaming,
 * polling) when WebSockets are blocked by proxies/firewalls.
 * - ChannelInterceptor: Intercepts STOMP CONNECT frames to parse JWT tokens and
 * set security principal prior to session establishment.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String[] allowedOrigins;

    public WebSocketConfig(JwtUtils jwtUtils, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Configure Message Broker destinations.
     * /topic -> Public broadcast topics (notifications, presence, dashboard
     * events).
     * /queue -> Private user point-to-point queues.
     * /app -> Client application destination prefix for routing incoming messages
     * to @MessageMapping handlers.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    /**
     * Register STOMP WebSocket endpoints.
     * Endpoint /ws is registered with SockJS fallback for web browser
     * compatibility.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    /**
     * Intercept inbound STOMP client frames to enforce JWT Security Authentication.
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> authorization = accessor.getNativeHeader("Authorization");
                    String token = null;

                    if (authorization != null && !authorization.isEmpty()) {
                        String bearerToken = authorization.get(0);
                        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                            token = bearerToken.substring(7);
                        }
                    }

                    // Fallback to query parameter if header not supplied
                    if (token == null) {
                        List<String> tokenParam = accessor.getNativeHeader("token");
                        if (tokenParam != null && !tokenParam.isEmpty()) {
                            token = tokenParam.get(0);
                        }
                    }

                    if (token != null && jwtUtils.validateJwtToken(token)) {
                        String email = jwtUtils.getEmailFromJwtToken(token);
                        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                        accessor.setUser(authentication);
                    }
                }
                return message;
            }
        });
    }
}
