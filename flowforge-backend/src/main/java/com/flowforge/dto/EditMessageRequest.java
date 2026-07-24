package com.flowforge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Edit Message Request DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Validates request payload when a user edits their sent message text.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditMessageRequest {
    @NotBlank(message = "Message content cannot be blank")
    private String content;
}
