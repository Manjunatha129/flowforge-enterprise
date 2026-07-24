# ⚡ FlowForge - Enterprise Full-Stack Project Management & Real-Time SaaS Platform

[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite 5](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

**FlowForge** is a production-grade, full-stack enterprise project management web application built with a high-performance **Java 21 Spring Boot 3** backend and a modern **React 18 + Vite** frontend styled with **Tailwind CSS**.

Designed as both a commercial-ready SaaS platform and an educational reference architecture, FlowForge features clean architecture, Spring Security 6 stateless JWT authentication, Spring Boot STOMP WebSockets for real-time collaboration, SpringDoc OpenAPI 3.0 (Swagger UI), Spring Boot Actuator health monitoring, Docker containerization, Nginx reverse proxying, and GitHub Actions CI/CD automation.

---

## 🚀 Key Modules Implemented

1. **Core Scaffold & Clean Architecture**: Multi-layer backend setup (`controller`, `service`, `repository`, `entity`, `dto`, `config`, `security`, `exception`, `util`) and modular React frontend structure.
2. **Authentication & Authorization Module**:
   - Register, Login, Forgot Password, and Reset Password workflows.
   - BCrypt password hashing & JWT Bearer token generation.
   - Dynamic Password Strength Indicator & Vercel-style Toast Notifications.
3. **Modern SaaS Dashboard Module**:
   - Greeting Banner with dynamic time-of-day calculation.
   - 6 Animated Statistics Counter Cards (Projects, Tasks, Completed, Pending, Overdue, Team Members).
   - Weekly & Monthly Productivity Charts + Task Completion Donut.
   - Today's Task Agenda with quick status check toggles.
4. **Notification Center & Activity Feed Module**:
   - Real-time Spring Boot REST APIs (`/api/v1/notifications`, `/api/v1/activities`).
   - Top navigation bell icon unread counter badge & popover preview.
   - Workspace Activity Feed timeline (`/activities`) auditing project actions, completions, comments, uploads, and logins.
5. **Enterprise Admin Panel Module**:
   - Spring Security Method Security (`@PreAuthorize("hasRole('ADMIN')")`) protecting `/api/v1/admin/**`.
   - 16 Live Admin Metrics Dashboard (`/admin`).
   - User Management page (`/admin/users`) with role promotion/demotion, account activation/deactivation, password reset, delete user.
6. **Reports, Analytics & Export Module**:
   - REST APIs under `/api/v1/reports/**` (`/dashboard`, `/projects`, `/tasks`, `/users`, `/productivity`, `/weekly`, `/monthly`, `/yearly`).
   - Direct browser binary file exporting for PDF, Excel (`.xls`), and CSV (`.csv`) documents (`POST /export/pdf`, `/excel`, `/csv`).
7. **User Profile, Workspace & Account Management Module**:
   - User Settings & Profile Hub (`/settings` & `/profile`) with tabbed navigation: My Profile, Account Security, Workspace Settings, Notification Preferences, Appearance (Light/Dark/System theme & Accent colors), and Account Management.
8. **Real-Time Infrastructure & Live Notifications Module (Module 12A)**:
   - Spring Boot STOMP WebSocket message broker configuration (`/ws` endpoint with SockJS fallback & JWT authentication interceptor).
   - Real-time pub/sub event broadcasting for notifications (`/topic/notifications`), project/task CRUD events (`/topic/projects`, `/topic/tasks`), dashboard auto-refresh signals (`/topic/dashboard`), and user presence tracking (`/topic/presence`).
9. **Enterprise Team Chat & Premium UI/UX Redesign Module (Module 12B)**:
   - Persistent team chat architecture (`ChatMessage.java` entity, `ChatMessageRepository`, `ChatService`, `ChatServiceImpl`, `ChatController`).
   - Real-time communication features: Workspace General Chat (`#general`), Project Channels, Private Direct Messages, STOMP typing signals (`Alex Chen is typing...`), thread replies, message editing/deletion/pinning, emoji reactions, and file attachments.
10. **Comments, Mentions, File Management & Live Collaboration Module (Module 12C)**:
    - Unified comment architecture (`UnifiedComment.java` entity, `UnifiedCommentRepository`, `UnifiedCommentService`).
    - `@mentions` regex parser triggering real-time `USER_MENTIONED` STOMP alert notifications.
    - File storage engine (`FileAttachment.java` entity, `FileAttachmentRepository`, `FileStorageService`) enabling upload, preview lightbox, download stream, rename, replace, and delete.
    - Global Command Palette (`GlobalSearchService`, `GlobalSearchController` under `GET /api/v1/search/global?query={keyword}`) and `GlobalSearchModal.jsx` keyboard shortcut (`⌘K`).
11. **Production Readiness, Quality, Security & Performance Module (Module 13A)**:
    - Integrated SpringDoc OpenAPI 3.0 (`springdoc-openapi-starter-webmvc-ui` v2.5.0) generating Swagger UI documentation at `/swagger-ui.html` and OpenAPI specification at `/v3/api-docs`.
    - Spring Boot Actuator integration (`spring-boot-starter-actuator`) exposing `/actuator/health`, `/actuator/info`, and `/actuator/metrics`.
    - JUnit 5 + Mockito + MockMvc unit and integration test suite (`AuthServiceImplTest`, `ProjectServiceImplTest`, `TaskServiceImplTest`, `AuthControllerTest`) executing 8 automated tests with 100% pass rate.
12. **Docker, CI/CD, Deployment & Final Production Polish (Module 13B)**:
    - Multi-stage Dockerfiles for backend (`FlowForge-backend/Dockerfile`) and frontend (`FlowForge-frontend/Dockerfile`).
    - Production Nginx server configuration (`nginx.conf`) handling SPA fallback routing, API reverse proxying, STOMP WebSocket proxying (`/ws`), Gzip compression, and HTTP security headers.
    - Master Docker Compose orchestration (`docker-compose.yml`) managing MySQL 8.0, Spring Boot backend, and Nginx frontend with health checks and persistent volume mounts.
    - GitHub Actions automated CI/CD workflow (`.github/workflows/ci-cd.yml`) executing JUnit tests, Vite bundling, JAR packaging, and Docker build verification.

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Language** | Java 21 (LTS) | Modern Java runtime with record classes & virtual threads support |
| **Backend Framework** | Spring Boot 3.3.0 | REST API engine, dependency injection, and auto-configuration |
| **Security** | Spring Security 6 + JJWT | Stateless JWT authentication filter chain & CORS enforcement |
| **Database ORM** | Spring Data JPA / Hibernate | Object-Relational Mapping & persistence abstraction |
| **Database** | MySQL 8.x | Relational database storage |
| **Documentation & Health** | SpringDoc OpenAPI & Actuator | Swagger UI (`/swagger-ui.html`) & `/actuator/health` |
| **Frontend Library** | React 18 | Declarative component UI engine |
| **Build Tool** | Vite 5 | Fast HMR dev server & ESBuild production bundler |
| **Styling** | Tailwind CSS 3 | Utility-first CSS with dark/light mode token support |
| **Containerization** | Docker & Docker Compose | Containerization & service orchestration |
| **Web Server / Proxy** | Nginx 1.25-alpine | SPA client routing, API reverse proxying, and Gzip compression |
| **CI/CD** | GitHub Actions | Automated build, test, package, and Docker validation pipeline |
