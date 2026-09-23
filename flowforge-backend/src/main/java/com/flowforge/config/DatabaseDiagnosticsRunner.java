package com.flowforge.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

/**
 * Database Diagnostics Runner (DatabaseDiagnosticsRunner).
 * 
 * PURPOSE:
 * Diagnostic component that executes on application startup to verify relational
 * database connectivity, print database product/version details, and alert administrators
 * if the production database is unreachable.
 * 
 * WHO CALLS IT:
 * Automatically executed by Spring Boot after application context initialization.
 * 
 * ANNOTATION EXPLANATIONS:
 * - @Component: Registers this class as a Spring-managed bean.
 * - CommandLineRunner: Spring Boot interface executing the run() method after context startup.
 * 
 * SECURITY NOTE:
 * Never logs raw database passwords, JWT secrets, or sensitive credentials.
 */
@Component
public class DatabaseDiagnosticsRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseDiagnosticsRunner.class);

    private final DataSource dataSource;

    /**
     * Constructor Injection for DataSource dependency.
     * 
     * @param dataSource Configured Spring Boot JDBC DataSource (HikariCP).
     */
    public DatabaseDiagnosticsRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Callback method executed on application startup.
     * Tests database connectivity and logs metadata safely without exposing credentials.
     * 
     * @param args Command line arguments passed to application.
     */
    @Override
    public void run(String... args) {
        log.info("==================================================================");
        log.info("FlowForge Production Database Connectivity Diagnostic");
        log.info("==================================================================");

        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            // Mask password if present in URL string for safe logging
            String sanitizedUrl = sanitizeDbUrl(metaData.getURL());

            log.info("Database Connection Status : SUCCESS [CONNECTED]");
            log.info("Database Product Name      : {}", metaData.getDatabaseProductName());
            log.info("Database Product Version   : {}", metaData.getDatabaseProductVersion());
            log.info("Database Driver Name       : {}", metaData.getDriverName());
            log.info("Database Driver Version    : {}", metaData.getDriverVersion());
            log.info("Sanitized JDBC URL         : {}", sanitizedUrl);
            log.info("==================================================================");
        } catch (Exception e) {
            log.error("==================================================================");
            log.error("CRITICAL: FlowForge Database Connectivity Failure!");
            log.error("Unable to establish JDBC Connection to configured Database.");
            log.error("Error Message: {}", e.getMessage());
            log.error("Troubleshooting Step: Verify DB_URL, DB_USER, DB_PASSWORD, and DB_HOST environment variables on Render.");
            log.error("==================================================================");
        }
    }

    /**
     * Sanitizes JDBC connection URLs by stripping inline passwords or credentials.
     * 
     * @param url Raw JDBC URL string.
     * @return Sanitized string safe for system logs.
     */
    private String sanitizeDbUrl(String url) {
        if (url == null) {
            return "N/A";
        }
        // Mask passwords in query parameters like password=secret or :password@
        return url.replaceAll("(?i)(password=)[^&]*", "$1******")
                  .replaceAll("(?i)(:[^:@/]+@)", ":******@");
    }
}
