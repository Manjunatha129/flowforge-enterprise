package com.flowforge.controller;

import com.flowforge.dto.ApiResponse;
import com.flowforge.dto.FileAttachmentDto;
import com.flowforge.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * File Storage REST Controller.
 * 
 * WHY THIS CLASS EXISTS:
 * Exposes REST endpoints (/api/v1/files/**) for file uploads, downloads,
 * previews, renames, replacements, and deletions.
 */
@RestController
@RequestMapping("/api/v1/files")
public class FileStorageController {

    private final FileStorageService fileService;

    public FileStorageController(FileStorageService fileService) {
        this.fileService = fileService;
    }

    /** GET /api/v1/files?targetType={type}&targetId={id} - Get Attachments List */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FileAttachmentDto>>> getFiles(
            @RequestParam("targetType") String targetType,
            @RequestParam("targetId") String targetId) {
        List<FileAttachmentDto> files = fileService.getFilesForTarget(targetType, targetId);
        return ResponseEntity.ok(ApiResponse.success("Files retrieved successfully", files));
    }

    /** GET /api/v1/files/{id} - Get Single File Details */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FileAttachmentDto>> getFileById(@PathVariable UUID id) {
        FileAttachmentDto file = fileService.getFileById(id);
        return ResponseEntity.ok(ApiResponse.success("File details retrieved", file));
    }

    /** POST /api/v1/files/upload - Upload File Attachment */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<FileAttachmentDto>> uploadFile(
            Authentication authentication,
            @RequestBody Map<String, String> payload) {
        String targetType = payload.getOrDefault("targetType", "PROJECT");
        String targetId = payload.get("targetId");
        String fileName = payload.get("fileName");
        String fileType = payload.get("fileType");
        String fileData = payload.get("fileData");

        if (fileName == null || fileData == null || targetId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing required file upload parameters"));
        }

        FileAttachmentDto uploaded = fileService.uploadFile(
                authentication.getName(), targetType, targetId, fileName, fileType, fileData);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", uploaded));
    }

    /** PUT /api/v1/files/{id}/rename - Rename File */
    @PutMapping("/{id}/rename")
    public ResponseEntity<ApiResponse<FileAttachmentDto>> renameFile(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {
        String newName = payload.get("fileName");
        if (newName == null || newName.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("New file name is required"));
        }

        FileAttachmentDto updated = fileService.renameFile(id, authentication.getName(), newName);
        return ResponseEntity.ok(ApiResponse.success("File renamed successfully", updated));
    }

    /** PUT /api/v1/files/{id}/replace - Replace File Data */
    @PutMapping("/{id}/replace")
    public ResponseEntity<ApiResponse<FileAttachmentDto>> replaceFile(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {
        String fileData = payload.get("fileData");
        if (fileData == null || fileData.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File data payload is required"));
        }

        FileAttachmentDto updated = fileService.replaceFile(id, authentication.getName(), fileData);
        return ResponseEntity.ok(ApiResponse.success("File replaced successfully", updated));
    }

    /** DELETE /api/v1/files/{id} - Delete File Attachment */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFile(
            Authentication authentication,
            @PathVariable UUID id) {
        fileService.deleteFile(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", "File deleted"));
    }
}
