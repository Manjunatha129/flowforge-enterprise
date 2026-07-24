package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * File Attachment JPA Entity.
 * 
 * WHY THIS CLASS EXISTS:
 * Handles file management (uploads, previews, downloads, renames, replacements)
 * across Projects, Tasks, and Comments.
 */
@Entity
@Table(name = "file_attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileAttachment extends BaseEntity {

    /** File display name */
    @Column(name = "file_name", nullable = false)
    private String fileName;

    /** Formatted file size (e.g. "2.4 MB") */
    @Column(name = "file_size", nullable = false)
    private String fileSize;

    /** Raw byte count size */
    @Column(name = "size_bytes")
    private Long sizeBytes;

    /** File MIME type or extension (e.g. "image/png", "application/pdf") */
    @Column(name = "file_type", nullable = false)
    private String fileType;

    /** Target Entity Type: "PROJECT", "TASK", "COMMENT" */
    @Column(name = "target_type", nullable = false)
    private String targetType;

    /** Target Entity Identifier string */
    @Column(name = "target_id", nullable = false)
    private String targetId;

    /** Uploader user email address */
    @Column(name = "uploaded_by", nullable = false)
    private String uploadedBy;

    /** Base64 Data URL or file binary content string */
    @Lob
    @Column(name = "file_data", columnDefinition = "LONGTEXT", nullable = false)
    private String fileData;

    /** Image thumbnail URL for image preview generation */
    @Lob
    @Column(name = "thumbnail_url", columnDefinition = "LONGTEXT")
    private String thumbnailUrl;
}
