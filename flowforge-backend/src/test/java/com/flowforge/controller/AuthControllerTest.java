package com.flowforge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowforge.dto.AuthResponse;
import com.flowforge.dto.LoginRequest;
import com.flowforge.dto.RegisterRequest;
import com.flowforge.dto.UserDto;
import com.flowforge.entity.Role;
import com.flowforge.security.JwtAuthenticationFilter;
import com.flowforge.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Authentication REST Controller MockMvc Test Suite.
 * 
 * PURPOSE:
 * Verifies AuthController REST API HTTP endpoints (/api/v1/auth/register and
 * /api/v1/auth/login)
 * using Spring Boot MockMvc framework.
 */
@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private AuthService authService;

        @MockBean
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        private RegisterRequest registerRequest;
        private LoginRequest loginRequest;
        private AuthResponse mockAuthResponse;

        @BeforeEach
        void setUp() {
                registerRequest = new RegisterRequest("Alex Chen", "alex@flowforge.com", "Password123!");
                loginRequest = new LoginRequest("alex@flowforge.com", "Password123!");

                UserDto userDto = UserDto.builder()
                                .name("Alex Chen")
                                .email("alex@flowforge.com")
                                .role(Role.ROLE_USER)
                                .build();

                mockAuthResponse = AuthResponse.builder()
                                .token("mock.jwt.token")
                                .user(userDto)
                                .build();
        }

        @Test
        @DisplayName("POST /api/v1/auth/register - Should return 201 Created on valid registration")
        void register_ReturnsCreated() throws Exception {
                when(authService.register(any(RegisterRequest.class))).thenReturn(mockAuthResponse);

                mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @DisplayName("POST /api/v1/auth/login - Should return 200 OK with AuthResponse JSON payload")
        void login_ReturnsOk() throws Exception {
                when(authService.login(any(LoginRequest.class))).thenReturn(mockAuthResponse);

                mockMvc.perform(post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data.token").value("mock.jwt.token"))
                                .andExpect(jsonPath("$.data.user.email").value("alex@flowforge.com"));
        }
}
