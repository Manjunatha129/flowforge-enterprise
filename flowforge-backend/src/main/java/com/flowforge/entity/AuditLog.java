package com.flowforge.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * AuditLog JPA Entity.
 * 
 * WHY THIS CLASS EXISTS:
 * Records critical user and admin actions (login, logout, register, project
 * created/deleted,
 * task created/updated, role changed, password reset, settings updated) for
 * security auditing.
 */
@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    /** Email of the user performing the action */
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    /** Action description (e.g. "User Logged In", "Promoted Alex to ADMIN") */
    @Column(name = "action", nullable = false)
    private String action;

    /**
     * Functional module category (e.g. "AUTH", "PROJECTS", "TASKS", "ADMIN",
     * "SETTINGS")
     */
    @Column(name = "module", nullable = false)
    private String module;

    /** Client IP address placeholder */
    @Column(name = "ip_address")
    @Builder.Default
    private String ipAddress = "127.0.0.1";

    /** Outcome status ("SUCCESS", "FAILED", "WARNING") */
    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "SUCCESS";
}
