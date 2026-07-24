# ⚡ FlowForge - Enterprise Full-Stack Project Management & Real-Time SaaS Platform

[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite 5](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![Build Status](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

FlowForge is a production-ready enterprise project management and team collaboration platform built with Spring Boot, React, JWT Authentication, WebSockets, MySQL, Docker, and CI/CD. It enables project planning, Kanban task management, real-time collaboration, reporting, and role-based administration.

**FlowForge** is a production-grade, full-stack enterprise project management web application built with a high-performance **Java 21 Spring Boot 3** backend and a modern **React 18 + Vite** frontend styled with **Tailwind CSS**.

Designed as both a commercial-ready SaaS platform and an educational reference architecture, FlowForge features clean architecture, Spring Security 6 stateless JWT authentication, Spring Boot STOMP WebSockets for real-time collaboration, SpringDoc OpenAPI 3.0 (Swagger UI), Spring Boot Actuator health monitoring, Docker containerization, Nginx reverse proxying, and GitHub Actions CI/CD automation.

---

## 📸 Key Application Features & Modules

FlowForge implements 13 comprehensive production modules:

1. **Authentication & Authorization**: JWT Bearer authentication, BCrypt password hashing, role-based access control (`ROLE_ADMIN`, `ROLE_USER`), password strength analyzer, and account recovery.
2. **Modern SaaS Analytics Dashboard**: Time-of-day greeting, 6 live metric cards, productivity charts, Today's Task agenda, and quick action modals.
3. **Project Management & Kanban Board**: Full project CRUD, status tracking (`PLANNING`, `ACTIVE`, `IN_REVIEW`, `COMPLETED`, `ARCHIVED`), progress calculation, category tags, and color coding.
4. **Task Management Engine**: Task assignments, priority levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), due dates, quick status toggles, star/archive flags, and task duplication.
5. **Notification Center & Activity Feed**: Real-time STOMP pub/sub notifications (`/topic/notifications`), filterable notification center, and complete workspace audit trail (`/activities`).
6. **Enterprise Admin Panel**: Protected under `@PreAuthorize("hasRole('ADMIN')")`, featuring 16 live system metrics, user role promotion/demotion, activation toggles, project/task oversight, and security audit logs.
7. **Reports, Analytics & Data Export**: Interactive Line, Bar, Pie, and Donut charts, plus direct binary document exporting for **PDF**, **Excel (.xls)**, and **CSV (.csv)** files.
8. **User Profile & Workspace Settings**: Profile avatar upload/preview/removal, password changing, workspace settings, notification preferences, dark/light theme switching, and account data JSON export.
9. **Real-Time WebSockets & Presence Tracking**: STOMP WebSocket message broker (`/ws` with SockJS fallback and JWT interceptor), live user presence indicators (`/topic/presence`), and online status widgets.
10. **Enterprise Team Chat Portal**: Persistent channels (`#general`, project channels, private DMs), STOMP typing signals (`Alex Chen is typing...`), thread replies, message editing, pinning, and reactions.
11. **Comments, Mentions & File Storage**: Unified comment threads across Projects, Tasks, and Attachments, regex `@mentions` parser triggering real-time STOMP alerts, Base64 image lightbox previews, download streams, and `GlobalSearchModal` (`⌘K`).
12. **Production Readiness, Quality & Security**: SpringDoc OpenAPI 3.0 (Swagger UI at `/swagger-ui.html`), Spring Boot Actuator monitoring (`/actuator/health`), HTTP Security Headers, externalized `dev`/`prod` profiles, and 8 automated JUnit 5 & Mockito test cases.
13. **Docker, CI/CD & Deployment**: Multi-stage Dockerfiles for backend & frontend, production Nginx reverse proxy configuration (`nginx.conf`), master `docker-compose.yml`, `.env.example`, and GitHub Actions workflow.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Language** | Java (LTS) | Java 21 | Modern runtime with record classes & virtual threads |
| **Backend Framework** | Spring Boot | 3.3.0 | REST API engine, auto-configuration & DI container |
| **Security** | Spring Security 6 + JJWT | 0.12.5 | Stateless JWT authentication filter chain & RBAC |
| **Persistence / ORM** | Spring Data JPA / Hibernate | 6.x | Relational object mapping & persistence layer |
| **Database** | MySQL | 8.0 | Relational database datastore |
| **Documentation & Health** | SpringDoc OpenAPI & Actuator | 2.5.0 | Swagger UI (`/swagger-ui.html`) & `/actuator/health` |
| **Frontend Framework** | React | 18.3 | Declarative component UI library |
| **Build Tool** | Vite | 5.4 | Fast HMR development server & production bundler |
| **Styling** | Tailwind CSS | 3.4 | Utility-first styling with dark/light mode tokens |
| **Containerization** | Docker & Docker Compose | 3.8 | Multi-stage image build & container orchestration |
| **Web Server / Proxy** | Nginx | 1.25-alpine | SPA routing, API reverse proxying, Gzip & Security |
| **CI/CD** | GitHub Actions | v4 | Automated testing, bundling & Docker verification |

---

## 📂 Project Directory Structure

```text
TaskFlow/
├── README.md                           # Master Portfolio Documentation
├── docker-compose.yml                  # Docker Compose Orchestration (MySQL + Backend + Frontend)
├── .env.example                        # Environment Variables Template
├── .github/workflows/ci-cd.yml         # GitHub Actions Automated CI/CD Pipeline
├── docs/                               # 7-File Synchronized Documentation Suite
│   ├── README.md
│   ├── SRS.md
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE.md
│   ├── LEARNING_NOTES.md
│   └── DEVELOPER_JOURNAL.md
│
├── FlowForge-backend/                  # Java 21 Spring Boot Backend
│   ├── Dockerfile                      # Multi-Stage Backend Docker Build (Java 21 JRE)
│   ├── pom.xml                         # Maven build configuration & dependencies
│   └── src/
│       ├── main/java/com/FlowForge/
│       │   ├── config/                 # Security, CORS, WebSocket, OpenAPI Configs
│       │   ├── controller/             # REST API Controllers Layer
│       │   ├── dto/                    # Request/Response DTO Payloads
│       │   ├── entity/                 # JPA Database Entities
│       │   ├── exception/              # Global Exception Handler & Custom Errors
│       │   ├── repository/             # Spring Data JPA Repositories
│       │   ├── security/               # JWT Utilities & Auth Filters
│       │   ├── service/                # Business Logic Services & Implementations
│       │   └── util/                   # App Constants & Helper Utilities
│       └── test/java/com/FlowForge/    # JUnit 5, Mockito & MockMvc Test Suite
│
└── FlowForge-frontend/                 # React 18 + Vite Frontend
    ├── Dockerfile                      # Multi-Stage Frontend Docker Build (Nginx Alpine)
    ├── nginx.conf                      # Production Nginx SPA & Reverse Proxy Config
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/                 # UI Components (Header, Sidebar, Modals, Chat, Comments)
        ├── context/                    # Auth, Theme, Toast Context Providers
        ├── hooks/                      # Custom React Hooks
        ├── pages/                      # Application Route Pages
        └── services/                   # Axios & WebSocket STOMP API Services
```

---

## ⚡ Quick Start & Deployment Guide

### Option 1: Run via Docker Compose (Recommended - Zero Dependencies)

Make sure Docker Desktop is installed and running:

```bash
# 1. Clone Repository
git clone https://github.com/FlowForge/taskflow.git
cd taskflow

# 2. Copy Environment Template
cp .env.example .env

# 3. Launch Container Stack (MySQL + Spring Boot Backend + Nginx Frontend)
docker-compose up --build -d
```

- **Frontend Application**: `http://localhost`
- **Spring Boot Backend REST API**: `http://localhost:8080/api/v1`
- **Interactive Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Spring Boot Actuator Health**: `http://localhost:8080/actuator/health`

---

### Option 2: Run Locally for Development

#### Prerequisites
- Java 21 JDK (`java -version`)
- Node.js v18+ & npm (`node -v`, `npm -v`)
- MySQL 8.0 server (`localhost:3306`)

#### 1. Database Creation
```sql
CREATE DATABASE FlowForge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. Run Spring Boot Backend
```bash
cd FlowForge-backend
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8080`.

#### 3. Run React Frontend
```bash
cd FlowForge-frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🧪 Testing Strategy & Execution

Run backend unit and integration test suite:

```bash
cd FlowForge-backend
./mvnw test
```

### Test Coverage Highlights:
- `AuthServiceImplTest`: Verifies registration, password hashing, duplicate email prevention, and JWT token authentication.
- `ProjectServiceImplTest`: Verifies project CRUD, sorting, and progress calculation.
- `TaskServiceImplTest`: Verifies task creation and Kanban board status transitions.
- `AuthControllerTest`: Spring Boot `MockMvc` integration test verifying `/api/v1/auth/register` and `/api/v1/auth/login` HTTP payloads.

---

## 📄 License & Attribution

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

FlowForge — Built with ❤️ for scalable team productivity.
