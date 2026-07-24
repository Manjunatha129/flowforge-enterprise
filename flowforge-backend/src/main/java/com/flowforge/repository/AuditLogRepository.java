package com.flowforge.repository;

import com.flowforge.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * AuditLog Spring Data JPA Repository.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Supplies queries for system audit log logs, searching, and filtering.
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findByModule(String module);

    List<AuditLog> findByUserEmailContainingIgnoreCaseOrActionContainingIgnoreCase(String email, String action);
}
