package com.flowforge.repository;

import com.flowforge.entity.UnifiedComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Unified Comment JPA Repository.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Queries comments by target entity (PROJECT, TASK, ATTACHMENT) and keyword
 * search.
 */
@Repository
public interface UnifiedCommentRepository extends JpaRepository<UnifiedComment, UUID> {

    List<UnifiedComment> findByTargetTypeAndTargetIdOrderByCreatedAtAsc(String targetType, String targetId);

    List<UnifiedComment> findByContentContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);

    long countByTargetTypeAndTargetId(String targetType, String targetId);
}
