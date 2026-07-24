# ===================================================================
# FlowForge - Spring Boot Backend Multi-Stage Dockerfile
# ===================================================================

# -------------------------------------------------------------------
# STAGE 1: Build Stage using Maven & Java 21 JDK
# -------------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy Maven wrapper & pom.xml first for efficient dependency layer caching
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies offline to optimize build cache
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build production JAR
COPY src src
RUN ./mvnw clean package -DskipTests -B

# -------------------------------------------------------------------
# STAGE 2: Runtime Stage using Minimal Java 21 JRE Alpine
# -------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root application user for production security hardening
RUN addgroup -S flowforge && adduser -S flowforge -G flowforge

# Copy compiled JAR artifact from builder stage
COPY --from=builder /app/target/flowforge-backend-1.0.0-SNAPSHOT.jar app.jar

# Set environment variables with production defaults
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

# Expose Spring Boot REST API port
EXPOSE 8080

# Switch to non-root user
USER flowforge:flowforge

# Healthcheck monitoring Spring Boot Actuator endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Execute Spring Boot production application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
