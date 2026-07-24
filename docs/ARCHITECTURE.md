# FlowForge - Architecture & Design Patterns Guide

This document explains the architectural principles, package responsibilities, execution flows, and design patterns used in FlowForge.

---

## 🏗️ 1. Why Package Layers Exist

Spring Boot follows the **Clean Architecture / Layered Architecture** pattern. Each package has a single, strictly defined responsibility:

```text
[ Client (Browser / React) ]
            │
            ▼
┌─────────────────────────┐
│       Controller        │  <-- Handles HTTP Requests & Validates Payload DTOs
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│        Service          │  <-- Contains Core Business Logic & Transaction Controls
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│       Repository        │  <-- Executes Database Queries (Spring Data JPA)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│         Entity          │  <-- Maps Java Objects to Database Tables (Hibernate)
└─────────────────────────┘
```

| Package Layer | Responsibilities | Key Classes |
| :--- | :--- | :--- |
| **`com.FlowForge.controller`** | Exposes REST endpoints (`@RestController`), parses JSON request bodies, invokes service methods, and returns `ResponseEntity<ApiResponse<T>>`. | `AuthController`, `DashboardController`, `ProjectController`, `TaskController`, `NotificationController`, `ActivityFeedController`, `AdminController`, `AuditLogController`, `ReportsController`, `ProfileController`, `PresenceController`, `ChatController`, `UnifiedCommentController`, `FileStorageController`, `GlobalSearchController` |
| **`com.FlowForge.service`** | Encapsulates core business rules, password encoding, JWT token generation, data assembly, and transaction management (`@Service`, `@Transactional`). | `AuthServiceImpl`, `DashboardServiceImpl`, `ProjectServiceImpl`, `TaskServiceImpl`, `NotificationServiceImpl`, `AdminServiceImpl`, `AuditLogServiceImpl`, `ReportsServiceImpl`, `ExportServiceImpl`, `ProfileServiceImpl`, `PresenceServiceImpl`, `WebSocketPublisher`, `ChatServiceImpl`, `UnifiedCommentServiceImpl`, `FileStorageServiceImpl`, `GlobalSearchServiceImpl` |
| **`com.FlowForge.repository`** | Interfaces extending `JpaRepository` providing CRUD operations and custom derived finder methods (`findByEmail`). | `UserRepository`, `PasswordResetTokenRepository`, `ProjectRepository`, `TaskRepository`, `NotificationRepository`, `AuditLogRepository`, `ChatMessageRepository`, `UnifiedCommentRepository`, `FileAttachmentRepository` |
| **`com.FlowForge.entity`** | JPA Entities mapped to MySQL database tables using `@Entity`, `@Table`, and `@Column`. | `User`, `BaseEntity`, `PasswordResetToken`, `Project`, `Task`, `Notification`, `AuditLog`, `ChatMessage`, `UnifiedComment`, `FileAttachment` |
| **`com.FlowForge.dto`** | Data Transfer Objects used to transfer data between client and server without exposing entity structures or sensitive fields (like passwords). | `LoginRequest`, `RegisterRequest`, `AuthResponse`, `UserDto`, `DashboardOverviewDto`, `ProjectDto`, `TaskDto`, `NotificationDto`, `AdminDashboardStatsDto`, `UserAdminDto`, `AuditLogDto`, `SystemSettingsDto`, `ReportsOverviewDto`, `ProjectReportDto`, `TaskReportDto`, `UserReportDto`, `ProductivityReportDto`, `ReportExportRequest`, `UserProfileDto`, `ProfileUpdateRequest`, `ChangePasswordRequest`, `WorkspaceSettingsDto`, `NotificationPreferencesDto`, `AppearancePreferencesDto`, `PresenceDto`, `ChatMessageDto`, `SendMessageRequest`, `EditMessageRequest`, `TypingSignalDto`, `UnifiedCommentDto`, `CommentCreateRequest`, `FileAttachmentDto`, `GlobalSearchResultDto` |
| **`com.FlowForge.config`** | Spring configuration beans for Security, CORS, OpenAPI Swagger, and MVC interceptors (`@Configuration`). | `WebSecurityConfig`, `CorsConfig`, `WebSocketConfig`, `WebSocketEventListener`, `OpenApiConfig` |
| **`com.FlowForge.security`** | Custom security components handling JWT validation, authentication filters, and Spring Security UserDetails loading. | `JwtUtils`, `JwtAuthenticationFilter`, `UserDetailsImpl`, `JwtAuthEntryPoint` |
| **`com.FlowForge.exception`** | Centralized global exception handler (`@RestControllerAdvice`) converting exceptions into standard error payloads. | `GlobalExceptionHandler`, `EmailAlreadyExistsException` |

---

## 🔄 2. Model-View-Controller (MVC) & Request Execution Flow

When a user submits a login request from the React frontend, the request follows this exact step-by-step execution path:

```text
1. User clicks "Sign In" on LoginPage.jsx
   │
2. Axios client POSTs JSON payload to http://localhost:8080/api/v1/auth/login
   │
3. Spring Security Filter Chain intercepts request
   ├─ Checks CORS permissions via CorsConfigurationSource
   └─ Permits unauthenticated access to /api/v1/auth/** endpoints
   │
4. AuthController.login(@Valid @RequestBody LoginRequest request)
   ├─ Triggers Jakarta Bean Validation (@NotBlank, @Email)
   └─ Invokes authService.login(request)
   │
5. AuthServiceImpl.login(request)
   ├─ Passes credentials to AuthenticationManager.authenticate()
   ├─ UserDetailsServiceImpl loads User from UserRepository by email
   ├─ BCryptPasswordEncoder compares raw password against stored hash
   ├─ JwtUtils generates HMAC-SHA256 JWT Bearer token
   └─ Maps User entity to UserDto and builds AuthResponse
   │
6. AuthController wraps AuthResponse in ApiResponse.success() and returns HTTP 200 OK
   │
7. React Axios response interceptor receives token, updates AuthContext, & saves token to localStorage
   │
8. React Router redirects user to Dashboard (/)
```

---

## 🔒 3. JWT & Spring Security Execution Flow

```text
Incoming HTTP Request with Header: "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
   │
   ▼
[ JwtAuthenticationFilter ] (Extends OncePerRequestFilter)
   │
   ├─ 1. Extracts token from "Authorization" header
   ├─ 2. Calls jwtUtils.validateJwtToken(jwt)
   │     └─ Verifies HMAC-SHA256 signature & expiration
   │
   ├─ 3. Extracts username/email from JWT subject payload
   │
   ├─ 4. Loads UserDetails via userDetailsService.loadUserByUsername(email)
   │
   ├─ 5. Creates UsernamePasswordAuthenticationToken object
   │
   └─ 6. Populates SecurityContextHolder.getContext().setAuthentication(authentication)
   │
   ▼
[ Target REST Controller Method Executed ]
```

---

## 🗄️ 4. Database Persistence Flow (JPA & Hibernate)

1. **Entity Definition**: `User.java` inherits `id` (UUID), `createdAt`, and `updatedAt` from `BaseEntity.java`.
2. **Pre-Persist Auditing**: `@PrePersist` automatically sets `createdAt` and `updatedAt` timestamps before Hibernate issues SQL `INSERT`.
3. **Pre-Update Auditing**: `@PreUpdate` automatically updates `updatedAt` before Hibernate issues SQL `UPDATE`.

---

## 🔐 5. Security Filter Chain Configuration (`WebSecurityConfig.java`)

- **CSRF**: Disabled (`AbstractHttpConfigurer::disable`) for RESTful API execution with JWTs.
- **Permitted Public Routes**: `/api/auth/**`, `/api/v1/auth/**`, `/h2-console/**`, `/v3/api-docs/**`, `/swagger-ui/**`, `/actuator/**`, `/ws/**`.
- **Role-Based Access**: `/api/v1/admin/**` requires `ROLE_ADMIN`.
- **Authenticated Routes**: All other incoming HTTP requests require a valid JWT Bearer token evaluated by `JwtAuthenticationFilter`.

