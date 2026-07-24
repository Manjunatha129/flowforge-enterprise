package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDto {

    private String id;
    private String projectName;
    private String activity;
    private String userAvatar;
    private String userName;
    private String statusBadge;
    private LocalDateTime timestamp;
    private String timeAgo;
}
