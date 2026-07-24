package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * File Attachment DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Transfers file metadata, preview URLs, size, and uploader info for file
 * management operations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileAttachmentDto {
    private UUID id;
    private String fileName;
    private String fileSize;
    private Long sizeBytes;
    private String fileType;
    private String targetType;
    private String targetId;
    private String uploadedBy;
    private String uploadedByName;
    private String fileData;
    private String thumbnailUrl;
    private LocalDateTime createdAt;
    private String timeFormatted;
}
