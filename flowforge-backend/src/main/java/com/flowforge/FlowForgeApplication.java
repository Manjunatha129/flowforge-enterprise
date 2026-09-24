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
        String dbHost = System.getenv("DB_HOST");

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
        } else if (dbHost != null && !dbHost.isBlank()) {
            String user = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : "root";
            String pass = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : "";
            String port = System.getenv("DB_PORT") != null ? System.getenv("DB_PORT") : "3306";
            String dbName = System.getenv("DB_NAME") != null ? System.getenv("DB_NAME") : "flowforge_db";
            
            String constructedUrl = "jdbc:mysql://" + dbHost + ":" + port + "/" + dbName + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&connectTimeout=5000&socketTimeout=5000";
            log.info("Constructed MySQL JDBC URL from DB_HOST environment variable.");
            System.setProperty("spring.datasource.url", constructedUrl);
            System.setProperty("spring.datasource.username", user);
            System.setProperty("spring.datasource.password", pass);
            System.setProperty("spring.datasource.driver-class-name", "com.mysql.cj.jdbc.Driver");
        } else {
            log.info("No external DB_URL/DB_HOST specified. Initializing resilient in-memory datastore fallback.");
            System.setProperty("spring.datasource.url", "jdbc:h2:mem:flowforge_prod_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL");
            System.setProperty("spring.datasource.username", "sa");
            System.setProperty("spring.datasource.password", "");
            System.setProperty("spring.datasource.driver-class-name", "org.h2.Driver");
        }
    }

}

