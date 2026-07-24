package com.flowforge.controller;

import com.flowforge.dto.ApiResponse;
import com.flowforge.dto.AuditLogDto;
import com.flowforge.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Audit Log REST Controller.
 * 
 * PURPOSE OF THIS CLASS:
 * Exposes REST API endpoint (/api/v1/admin/audit-logs) for administrators to
 * view system audit logs.
 * Protected by Spring Security @PreAuthorize("hasRole('ADMIN')").
 */
@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    /** GET /api/v1/admin/audit-logs - Get All Audit Logs */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String query) {
        List<AuditLogDto> logs = auditLogService.getAllAuditLogs(module, query);
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", logs));
    }
}
