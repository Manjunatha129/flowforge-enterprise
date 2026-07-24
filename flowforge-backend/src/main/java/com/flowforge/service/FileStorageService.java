package com.flowforge.service;

import com.flowforge.dto.FileAttachmentDto;

import java.util.List;
import java.util.UUID;

/**
 * File Storage Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines business operations for uploading, previewing, downloading, renaming,
 * replacing, and deleting file attachments.
 */
public interface FileStorageService {

    FileAttachmentDto uploadFile(String uploaderEmail, String targetType, String targetId, String fileName,
            String fileType, String fileData);

    List<FileAttachmentDto> getFilesForTarget(String targetType, String targetId);

    FileAttachmentDto getFileById(UUID fileId);

    FileAttachmentDto renameFile(UUID fileId, String uploaderEmail, String newName);

    FileAttachmentDto replaceFile(UUID fileId, String uploaderEmail, String newFileData);

    void deleteFile(UUID fileId, String uploaderEmail);
}
