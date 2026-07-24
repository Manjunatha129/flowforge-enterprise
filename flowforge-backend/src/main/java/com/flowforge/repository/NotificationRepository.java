package com.flowforge.repository;

import com.flowforge.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Notification Spring Data JPA Repository.
 * 
 * PURPOSE:
 * Provides automated CRUD database access for Notification entities.
 * 
 * ANNOTATION EXPLAINED:
 * - @Repository: Marks this interface as a Spring Data bean component for
 * database operations.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    /** Find all notifications for a receiver ordered by creation time descending */
    List<Notification> findByReceiverOrderByCreatedAtDesc(String receiver);

    /** Find unread notifications for a receiver */
    List<Notification> findByReceiverAndReadStatusOrderByCreatedAtDesc(String receiver, boolean readStatus);

    /** Count unread notifications for a receiver badge counter */
    long countByReceiverAndReadStatus(String receiver, boolean readStatus);

    /** Bulk update mark all notifications as read for a receiver */
    @Modifying
    @Query("UPDATE Notification n SET n.readStatus = true WHERE n.receiver = :receiver AND n.readStatus = false")
    int markAllAsReadForReceiver(@Param("receiver") String receiver);

    /** Bulk delete all notifications for a receiver */
    void deleteAllByReceiver(String receiver);
}
