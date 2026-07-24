package com.flowforge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Profile Update Request DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Validates payload fields for editing user profile information (display name,
 * bio, phone, designation, etc.).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    @NotBlank(message = "Name cannot be empty")
    private String name;

    private String bio;
    private String phoneNumber;
    private String designation;
    private String department;
    private String location;
    private String timezone;
}
