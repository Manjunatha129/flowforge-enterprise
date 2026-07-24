package com.flowforge.repository;

import com.flowforge.entity.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * File Attachment JPA Repository.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Queries file attachments mapped to target entities (PROJECT, TASK, COMMENT)
 * and keyword search.
 */
@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, UUID> {

    List<FileAttachment> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, String targetId);

    List<FileAttachment> findByFileNameContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);

    long countByTargetTypeAndTargetId(String targetType, String targetId);
}
