package com.flowforge.service;

import com.flowforge.dto.AuditLogDto;

import java.util.List;

/**
 * AuditLog Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines methods for recording system audit actions and retrieving audit
 * timelines for admins.
 */
public interface AuditLogService {

    void logAction(String userEmail, String action, String module, String status);

    List<AuditLogDto> getAllAuditLogs(String module, String query);
}
