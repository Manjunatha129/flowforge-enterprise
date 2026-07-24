package com.flowforge.dto;

import com.flowforge.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Role Update Request DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Validates role promotion/demotion payloads (`ROLE_ADMIN` / `ROLE_USER`).
 */
@Data
public class RoleUpdateRequest {
    @NotNull(message = "Role must not be null")
    private Role role;
}
