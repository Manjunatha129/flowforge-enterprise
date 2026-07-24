package com.flowforge.service;

import com.flowforge.dto.AuthResponse;
import com.flowforge.dto.LoginRequest;
import com.flowforge.dto.RegisterRequest;
import com.flowforge.entity.Role;
import com.flowforge.entity.User;
import com.flowforge.exception.EmailAlreadyExistsException;
import com.flowforge.repository.UserRepository;
import com.flowforge.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Authentication Service Unit Test Suite.
 * 
 * PURPOSE:
 * Verifies core authentication business logic using JUnit 5 and Mockito.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("Alex Chen", "alex@flowforge.com", "Password123!");
        loginRequest = new LoginRequest("alex@flowforge.com", "Password123!");

        testUser = User.builder()
                .name("Alex Chen")
                .email("alex@flowforge.com")
                .password("encoded_hash")
                .role(Role.ROLE_USER)
                .enabled(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully register new user account")
    void register_Success() {
        when(userRepository.existsByEmail("alex@flowforge.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encoded_hash");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        AuthResponse result = authService.register(registerRequest);

        assertNotNull(result);
        assertEquals("alex@flowforge.com", result.getUser().getEmail());
    }

    @Test
    @DisplayName("Should throw EmailAlreadyExistsException when registering duplicate email")
    void register_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("alex@flowforge.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(registerRequest));
    }

    @Test
    @DisplayName("Should successfully authenticate user login and return JWT token")
    void login_Success() {
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("mock.jwt.token");
        when(userRepository.findByEmail("alex@flowforge.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("alex@flowforge.com", response.getUser().getEmail());
    }
}
