package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Chat Workspace User Summary DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers real registered workspace user details to the team chat direct
 * message sidebar.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatUserDto {

    private String id;
    private String name;
    private String email;
    private String role;
    private String profilePictureUrl;
    private String designation;
    private String department;
}
