package com.flowforge.service;

import com.flowforge.dto.*;
import com.flowforge.entity.PasswordResetToken;
import com.flowforge.entity.Role;
import com.flowforge.entity.User;
import com.flowforge.exception.EmailAlreadyExistsException;
import com.flowforge.exception.InvalidTokenException;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.PasswordResetTokenRepository;
import com.flowforge.repository.UserRepository;
import com.flowforge.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Authentication Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Handles user registration, authentication, JWT generation, password resets,
 * system admin initialization, last login timestamps, and audit trail logging.
 */
@Service
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepository;
        private final PasswordResetTokenRepository passwordResetTokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtUtils jwtUtils;
        private final AuditLogService auditLogService;

        public AuthServiceImpl(
                        UserRepository userRepository,
                        PasswordResetTokenRepository passwordResetTokenRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtUtils jwtUtils,
                        AuditLogService auditLogService) {
                this.userRepository = userRepository;
                this.passwordResetTokenRepository = passwordResetTokenRepository;
                this.passwordEncoder = passwordEncoder;
                this.authenticationManager = authenticationManager;
                this.jwtUtils = jwtUtils;
                this.auditLogService = auditLogService;
                initDefaultAdmin();
        }

        @Override
        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new EmailAlreadyExistsException(request.getEmail());
                }

                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail().toLowerCase().trim())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.ROLE_USER)
                                .enabled(true)
                                .lastLoginAt(LocalDateTime.now())
                                .build();

                User savedUser = userRepository.save(user);

                // Audit log registration event
                auditLogService.logAction(savedUser.getEmail(), "Registered new user account", "AUTH", "SUCCESS");

                // Authenticate new user automatically to generate JWT
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwtToken = jwtUtils.generateJwtToken(authentication);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .tokenType("Bearer")
                                .user(mapToUserDto(savedUser))
                                .build();
        }

        @Override
        @Transactional
        public AuthResponse login(LoginRequest request) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail().toLowerCase().trim(),
                                                request.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwtToken = jwtUtils.generateJwtToken(authentication);

                User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

                // Update last login timestamp
                user.setLastLoginAt(LocalDateTime.now());
                User updated = userRepository.save(user);

                // Audit log login event
                auditLogService.logAction(updated.getEmail(), "User logged into workspace", "AUTH", "SUCCESS");

                return AuthResponse.builder()
                                .token(jwtToken)
                                .tokenType("Bearer")
                                .user(mapToUserDto(updated))
                                .build();
        }

        @Override
        @Transactional
        public String forgotPassword(ForgotPasswordRequest request) {
                User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

                // Delete any existing reset tokens for this user
                passwordResetTokenRepository.deleteByUser(user);

                String token = UUID.randomUUID().toString();
                PasswordResetToken resetToken = PasswordResetToken.builder()
                                .token(token)
                                .user(user)
                                .expiryDate(LocalDateTime.now().plusHours(24))
                                .build();

                passwordResetTokenRepository.save(resetToken);

                auditLogService.logAction(user.getEmail(), "Requested password reset token", "AUTH", "SUCCESS");

                return token;
        }

        @Override
        @Transactional
        public void resetPassword(ResetPasswordRequest request) {
                PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                                .orElseThrow(() -> new InvalidTokenException(
                                                "Invalid or expired password reset token"));

                if (resetToken.isExpired()) {
                        passwordResetTokenRepository.delete(resetToken);
                        throw new InvalidTokenException("Password reset token has expired. Please request a new link.");
                }

                User user = resetToken.getUser();
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userRepository.save(user);

                passwordResetTokenRepository.delete(resetToken);

                auditLogService.logAction(user.getEmail(), "Successfully reset password using token", "AUTH",
                                "SUCCESS");
        }

        @Override
        public UserDto getCurrentUser(String emailOrName) {
                User user = userRepository.findByEmailOrName(emailOrName, emailOrName)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email or username", emailOrName));
                return mapToUserDto(user);
        }

        private UserDto mapToUserDto(User user) {
                return UserDto.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .createdAt(user.getCreatedAt())
                                .build();
        }

        private void initDefaultAdmin() {
                if (userRepository.count() == 0) {
                        User admin = User.builder()
                                        .name("admin")
                                        .email("admin@flowforge.com")
                                        .password(passwordEncoder.encode("admin123"))
                                        .role(Role.ROLE_ADMIN)
                                        .enabled(true)
                                        .designation("System Administrator")
                                        .department("IT Infrastructure")
                                        .location("Global")
                                        .bio("Master System Administrator account for FlowForge enterprise.")
                                        .lastLoginAt(LocalDateTime.now())
                                        .build();
                        userRepository.save(admin);
                }
        }
}

