package com.flowforge.controller;

import com.flowforge.dto.*;
import com.flowforge.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication REST Controller.
 * 
 * WHY THIS CLASS EXISTS:
 * Serves as the entry point for authentication HTTP requests (/api/v1/auth/*).
 * It receives JSON request bodies from the React frontend, validates input
 * fields using @Valid,
 * delegates execution to AuthService, and returns standard HTTP responses.
 * 
 * ANNOTATIONS:
 * - @RestController: Combines @Controller and @ResponseBody so returned data is automatically serialized into JSON responses.
 * - @RequestMapping: Configures the base URI paths ("/api/auth", "/api/v1/auth", and "/auth") for all endpoints in this controller.
 */
@RestController
@RequestMapping({"/api/auth", "/api/v1/auth", "/auth"})
public class AuthController {

    private final AuthService authService;

    /** Constructor Injection: Injecting AuthService dependency cleanly. */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Handles User Registration.
     * 
     * @Valid triggers Jakarta Bean Validation (@NotBlank, @Email) on
     *        RegisterRequest.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.success("Account registered successfully", authResponse),
                HttpStatus.CREATED);
    }

    /**
     * Handles User Login and returns JWT Bearer token payload.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    /**
     * Generates password reset instructions and token for requested email.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        String resetToken = authService.forgotPassword(request);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("resetToken", resetToken);
        responseData.put("message", "Password reset token generated. Use this token to reset your password.");

        return ResponseEntity.ok(ApiResponse.success("Reset instructions sent", responseData));
    }

    /**
     * Resets password given a valid token and new password.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(
                ApiResponse.success("Password reset successfully. You can now login with your new password.", null));
    }

    /**
     * Fetches current authenticated user details using the validated Bearer token.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        UserDto userDto = authService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", userDto));
    }
}
