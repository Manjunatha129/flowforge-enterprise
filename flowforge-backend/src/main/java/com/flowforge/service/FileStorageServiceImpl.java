package com.flowforge.service;

import com.flowforge.dto.FileAttachmentDto;
import com.flowforge.entity.FileAttachment;
import com.flowforge.entity.User;
import com.flowforge.exception.ResourceNotFoundException;
import com.flowforge.repository.FileAttachmentRepository;
import com.flowforge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * File Storage Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates file attachment management, Base64 encoding/validation, file
 * sizing,
 * image thumbnail generation, and database CRUD.
 */
@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final FileAttachmentRepository fileRepository;
    private final UserRepository userRepository;

    public FileStorageServiceImpl(FileAttachmentRepository fileRepository, UserRepository userRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public FileAttachmentDto uploadFile(
            String uploaderEmail,
            String targetType,
            String targetId,
            String fileName,
            String fileType,
            String fileData) {
        String email = uploaderEmail.toLowerCase().trim();

        // Calculate approximate byte size from Base64 string length
        long rawBytes = fileData != null ? (long) (fileData.length() * 0.75) : 0L;
        String formattedSize = formatBytes(rawBytes);

        String thumbnailUrl = (fileType != null && fileType.startsWith("image/")) ? fileData : null;

        FileAttachment file = FileAttachment.builder()
                .fileName(fileName)
                .fileSize(formattedSize)
                .sizeBytes(rawBytes)
                .fileType(fileType != null ? fileType : "application/octet-stream")
                .targetType(targetType.toUpperCase())
                .targetId(targetId)
                .uploadedBy(email)
                .fileData(fileData)
                .thumbnailUrl(thumbnailUrl)
                .build();

        FileAttachment saved = fileRepository.save(file);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FileAttachmentDto> getFilesForTarget(String targetType, String targetId) {
        return fileRepository.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType.toUpperCase(), targetId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FileAttachmentDto getFileById(UUID fileId) {
        FileAttachment file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("FileAttachment", "id", fileId));
        return mapToDto(file);
    }

    @Override
    @Transactional
    public FileAttachmentDto renameFile(UUID fileId, String uploaderEmail, String newName) {
        FileAttachment file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("FileAttachment", "id", fileId));

        file.setFileName(newName);
        FileAttachment updated = fileRepository.save(file);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public FileAttachmentDto replaceFile(UUID fileId, String uploaderEmail, String newFileData) {
        FileAttachment file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("FileAttachment", "id", fileId));

        long rawBytes = (long) (newFileData.length() * 0.75);
        file.setFileData(newFileData);
        file.setSizeBytes(rawBytes);
        file.setFileSize(formatBytes(rawBytes));

        if (file.getFileType() != null && file.getFileType().startsWith("image/")) {
            file.setThumbnailUrl(newFileData);
        }

        FileAttachment updated = fileRepository.save(file);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteFile(UUID fileId, String uploaderEmail) {
        FileAttachment file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("FileAttachment", "id", fileId));
        fileRepository.delete(file);
    }

    private FileAttachmentDto mapToDto(FileAttachment f) {
        String uploaderName = userRepository.findByEmail(f.getUploadedBy())
                .map(User::getName)
                .orElse(f.getUploadedBy());

        String formattedTime = f.getCreatedAt() != null
                ? f.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a"))
                : "Just now";

        return FileAttachmentDto.builder()
                .id(f.getId())
                .fileName(f.getFileName())
                .fileSize(f.getFileSize())
                .sizeBytes(f.getSizeBytes())
                .fileType(f.getFileType())
                .targetType(f.getTargetType())
                .targetId(f.getTargetId())
                .uploadedBy(f.getUploadedBy())
                .uploadedByName(uploaderName)
                .fileData(f.getFileData())
                .thumbnailUrl(f.getThumbnailUrl())
                .createdAt(f.getCreatedAt())
                .timeFormatted(formattedTime)
                .build();
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024)
            return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char pre = "KMGTPE".charAt(exp - 1);
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
