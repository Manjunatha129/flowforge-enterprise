package com.flowforge.repository;

import com.flowforge.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Chat Message Spring Data JPA Repository.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Handles database operations for chat messages, channel history queries,
 * direct message thread filtering,
 * keyword searching, and pinned message retrieval.
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    List<ChatMessage> findByChannelTypeOrderByCreatedAtAsc(String channelType);

    List<ChatMessage> findByChannelTypeAndProjectIdOrderByCreatedAtAsc(String channelType, String projectId);

    @Query("SELECT c FROM ChatMessage c WHERE c.channelType = 'DIRECT' AND " +
            "((LOWER(c.senderEmail) = LOWER(:userA) AND LOWER(c.recipientEmail) = LOWER(:userB)) OR " +
            "(LOWER(c.senderEmail) = LOWER(:userB) AND LOWER(c.recipientEmail) = LOWER(:userA))) " +
            "ORDER BY c.createdAt ASC")
    List<ChatMessage> findDirectMessages(@Param("userA") String userA, @Param("userB") String userB);

    List<ChatMessage> findByContentContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);

    List<ChatMessage> findByChannelTypeAndPinnedTrue(String channelType);
}
