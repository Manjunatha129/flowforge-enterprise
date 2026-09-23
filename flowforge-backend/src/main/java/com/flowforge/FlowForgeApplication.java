package com.flowforge;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application Entry Point for FlowForge Backend.
 * 
 * PURPOSE:
 * Bootstraps the Spring ApplicationContext, initializes Spring Data JPA,
 * Spring Security, WebSocket brokers, and REST Controllers.
 * Also normalizes cloud environment variables (such as DB_URL) to ensure
 * standard JDBC compliance across Render, Vercel, and cloud hosting providers.
 */
@SpringBootApplication
public class FlowForgeApplication {

    private static final Logger log = LoggerFactory.getLogger(FlowForgeApplication.class);

    public static void main(String[] args) {
        // Sanitize and normalize DB_URL environment variable for cloud host compatibility
        normalizeDatabaseUrl();
        SpringApplication.run(FlowForgeApplication.class, args);
    }

    /**
     * Normalizes DB_URL environment variable to guarantee proper jdbc:mysql:// prefix
     * and driver configurations across cloud deployment environments.
     */
    private static void normalizeDatabaseUrl() {
        String dbUrl = System.getenv("DB_URL");
        if (dbUrl != null && !dbUrl.isBlank()) {
            String trimmedUrl = dbUrl.trim();
            if (trimmedUrl.startsWith("mysql://")) {
                trimmedUrl = "jdbc:" + trimmedUrl;
            }
            if (!trimmedUrl.contains("useSSL")) {
                trimmedUrl += (trimmedUrl.contains("?") ? "&" : "?") + "useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&connectTimeout=5000&socketTimeout=5000";
            }
            log.info("Normalized JDBC Connection URL configured from DB_URL environment variable.");
            System.setProperty("spring.datasource.url", trimmedUrl);
            System.setProperty("spring.datasource.driver-class-name", "com.mysql.cj.jdbc.Driver");
        }
    }
}

