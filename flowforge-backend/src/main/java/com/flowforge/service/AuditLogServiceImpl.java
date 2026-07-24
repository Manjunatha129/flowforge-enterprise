package com.flowforge.service;

import com.flowforge.dto.AuditLogDto;
import com.flowforge.entity.AuditLog;
import com.flowforge.repository.AuditLogRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * AuditLog Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Handles writing security audit logs and fetching formatted DTO lists for the
 * Admin Panel.
 */
@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional
    public void logAction(String userEmail, String action, String module, String status) {
        AuditLog log = AuditLog.builder()
                .userEmail(userEmail != null && !userEmail.isBlank() ? userEmail : "system@FlowForge.com")
                .action(action)
                .module(module != null ? module : "SYSTEM")
                .ipAddress("127.0.0.1")
                .status(status != null ? status : "SUCCESS")
                .build();

        auditLogRepository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDto> getAllAuditLogs(String module, String query) {
        List<AuditLog> logs;
        if (query != null && !query.isBlank()) {
            logs = auditLogRepository.findByUserEmailContainingIgnoreCaseOrActionContainingIgnoreCase(query, query);
        } else if (module != null && !module.isBlank() && !"ALL".equalsIgnoreCase(module)) {
            logs = auditLogRepository.findByModule(module);
        } else {
            logs = auditLogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        return logs.stream().map(l -> AuditLogDto.builder()
                .id(l.getId())
                .userEmail(l.getUserEmail())
                .userAvatar(getAvatarForUser(l.getUserEmail()))
                .action(l.getAction())
                .module(l.getModule())
                .ipAddress(l.getIpAddress())
                .status(l.getStatus())
                .createdAt(l.getCreatedAt())
                .timeAgo("Recently")
                .build()).collect(Collectors.toList());
    }

    private String getAvatarForUser(String user) {
        if (user == null || user.isBlank())
            return "U";
        String[] parts = user.split("@")[0].split("\\.");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return user.length() >= 2 ? user.substring(0, 2).toUpperCase() : "U";
    }
}
