package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectActivityDto {

    private UUID id;
    private String activity;
    private String userName;
    private String userAvatar;
    private String statusBadge;
    private LocalDateTime timestamp;
    private String timeAgo;
}
