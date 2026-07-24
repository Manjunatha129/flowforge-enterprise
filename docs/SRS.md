# Software Requirements Specification (SRS) - FlowForge

## 1. Project Overview
**FlowForge** is a modern, enterprise-grade project management application engineered to streamline team workflows, task tracking, sprint analytics, and developer collaboration. It provides real-time visibility into project health using a clean, high-performance web interface backed by a secure RESTful API microservice.

---

## 2. Problem Statement
Traditional project management software often suffers from complex, sluggish user interfaces, high memory footprints, bloated feature sets, and unintuitive navigation. Modern engineering teams require a fast, aesthetic, and reliable platform that presents sprint metrics clearly without distracting clutter.

---

## 3. System Objectives
1. Deliver a responsive Single Page Application (SPA) using React 18 and Vite.
2. Provide stateless, secure authentication using Spring Security 6 and JSON Web Tokens (JWT).
3. Deliver real-time task status tracking, deadline monitoring, and productivity charts.
4. Maintain scalable clean architecture across backend microservices and frontend component layers.

---

## 4. System Scope
The initial version of FlowForge encompasses:
- User registration, login, session management, and password reset flows.
- Modern dashboard with statistical counters, productivity charts, daily task agendas, and activity streams.
- Role-based authorization placeholders (`ROLE_USER`, `ROLE_ADMIN`).

---

## 5. Functional Requirements

### 5.1 Authentication & User Management (FR-AUTH)
- **FR-AUTH-1**: Users must be able to register an account with full name, unique email address, and a password (minimum 8 characters).
- **FR-AUTH-2**: Passwords must be hashed using BCrypt prior to database persistence.
- **FR-AUTH-3**: Registered users must be able to log in with email and password to receive a signed JWT Bearer token.
- **FR-AUTH-4**: Users must be able to request password reset instructions via email and reset their password using a valid reset token.
- **FR-AUTH-5**: Protected routes must restrict unauthorized access and redirect unauthenticated users to `/login`.

### 5.2 Dashboard & Workspace Analytics (FR-DASH)
- **FR-DASH-1**: Display a personalized greeting based on the current time of day.
- **FR-DASH-2**: Display 6 key statistical counter cards (Total Projects, Total Tasks, Completed Tasks, Pending Tasks, Overdue Tasks, Team Members) with trend metrics.
- **FR-DASH-3**: Render interactive productivity charts (Weekly Bar Chart, Monthly Area Chart, Task Completion Donut Chart).
- **FR-DASH-4**: Display a real-time activity stream of project actions.
- **FR-DASH-5**: Display Today's Task Agenda with quick completion toggles.
- **FR-DASH-6**: Provide quick action buttons (Create Project, Create Task, Invite Member, Generate Report) with modal form dialogs.

### 5.3 Notification Center & Activity Feed (FR-NOTIF)
- **FR-NOTIF-1**: The system must record notifications for project creations, updates, task assignments, task completions, overdue alerts, member invites, comments, uploads, and report generation.
- **FR-NOTIF-2**: Each notification must specify id, title, message, icon, event type, priority (HIGH, MEDIUM, LOW), read status, sender, receiver, related project/task, and action URL.
- **FR-NOTIF-3**: Users must be able to view an unread counter badge in the top navigation bar, preview recent notifications in a popover dropdown, and access a dedicated Notification Center (/notifications).
- **FR-NOTIF-4**: The Notification Center must support search, category filtering, priority filtering, newest/oldest sorting, unread-only toggle, mark as read, mark all read, and bulk clear.
- **FR-NOTIF-5**: The system must provide a unified Activity Feed (/activities) audit log timeline tracking all workspace actions.

### 5.4 Enterprise Admin Panel & Role-Based Access Control (FR-ADMIN)
- **FR-ADMIN-1**: The system must enforce Role-Based Access Control (RBAC) with `ROLE_ADMIN` and `ROLE_USER` authorities.
- **FR-ADMIN-2**: Backend `/api/v1/admin/**` endpoints and frontend `/admin/**` routes must be restricted strictly to `ROLE_ADMIN`. Non-admin accounts attempting access receive an Access Denied 403 response.
- **FR-ADMIN-3**: Admins must have access to a 16-metric Admin Dashboard displaying user counts (total, active, online, offline, new this month), project stats, task stats, storage allocation, and reports generated.
- **FR-ADMIN-4**: Admins must be able to search users, filter by role/status, view full user profiles, promote/demote roles (`ROLE_ADMIN` / `ROLE_USER`), activate/deactivate user accounts, reset user passwords, and delete accounts.
- **FR-ADMIN-5**: Admins must have global oversight over all workspace projects and tasks (view, delete, archive, restore).
### 5.5 Reports, Analytics & Export (FR-REPORT)
- **FR-REPORT-1**: The system must compute executive analytics, project completion %, task completion velocity, average completion times, top contributors, and time-series productivity arrays strictly from live database queries.
- **FR-REPORT-2**: Zero hardcoded, fake, demo, or seeded data values may be generated or returned by backend reports endpoints.
- **FR-REPORT-3**: The system must support direct browser binary file exports for PDF, Excel (`.xls`), and CSV (`.csv`) report formats.
### 5.6 User Profile, Workspace & Account Management (FR-PROFILE)
- **FR-PROFILE-1**: Users must be able to view, edit, and update personal profile attributes (display name, bio, phone, designation, department, location, timezone).
- **FR-PROFILE-2**: The system must validate custom avatar image uploads (file type JPEG/PNG/WEBP, size max 5MB) and serve fallback avatar initials when no image exists.
- **FR-PROFILE-3**: Users must be able to change account passwords with current password verification and password strength criteria.
- **FR-PROFILE-4**: Users must be able to manage workspace metadata, notification alert toggles, and appearance customization (Light/Dark/System theme & Accent colors).
- **FR-PROFILE-5**: Users must be able to download a personal account data JSON export and deactivate or delete their account with confirmation modals.

### 5.7 Real-Time Infrastructure & Live Notifications (FR-REALTIME)
- **FR-REALTIME-1**: The system must establish STOMP WebSocket communication over endpoint `/ws` with SockJS fallback and JWT authentication interceptors.
- **FR-REALTIME-2**: Real-time notifications for project CRUD, task assignments/completions, and comments must broadcast instantly to connected clients without page reloads.
- **FR-REALTIME-3**: User presence (ONLINE, OFFLINE, connection times) must update automatically over STOMP topic `/topic/presence`.
- **FR-REALTIME-4**: Dashboard counters, recent activity stream, and recent projects must refresh automatically when STOMP refresh signals are published.

### 5.8 Enterprise Team Chat & Communication (FR-CHAT)
- **FR-CHAT-1**: The system must persist team chat messages in database table `chat_messages` across Workspace (`#general`), Project Channels, and Private Direct Messages.
- **FR-CHAT-2**: Users must be able to send, edit, delete, reply to, and pin messages in real time over STOMP WebSocket topics.
- **FR-CHAT-3**: The system must broadcast live typing indicators (`Alex Chen is typing...`) and support emoji reactions and file attachments.
- **FR-CHAT-4**: The frontend Chat Portal (`/chat`) must provide auto-scrolling message streams, date dividers, glassmorphism chat bubbles, and keyword message search.

### 5.9 Comments, Mentions, File Management & Global Search (FR-COLLAB)
- **FR-COLLAB-1**: The system must persist unified comments (`unified_comments` table) across Projects, Tasks, and Attachments supporting nested parent comment reply hierarchies.
- **FR-COLLAB-2**: The system must parse `@mentions` regex patterns in comments and trigger STOMP `USER_MENTIONED` alerts to tagged team members.
- **FR-COLLAB-3**: The system must support file attachments (`file_attachments` table) allowing upload, image thumbnail preview lightbox, binary download streams, file rename, replacement, and deletion.
- **FR-COLLAB-4**: The system must provide global workspace search (`GET /api/v1/search/global?query={keyword}`) returning categorized matching Projects, Tasks, Messages, Comments, Files, and Users via Command Palette modal (`⌘K`).

### 5.10 Production Readiness, Quality & Health Monitoring (FR-PROD)
- **FR-PROD-1**: The system must generate live OpenAPI 3.0 REST API documentation and Interactive Swagger UI at `/swagger-ui.html` and `/v3/api-docs`.
- **FR-PROD-2**: The system must expose Spring Boot Actuator health, info, and metrics endpoints under `/actuator/**`.
- **FR-PROD-3**: The backend codebase must maintain automated JUnit 5 and Mockito test coverage across Controllers, Services, and Repositories.
- **FR-PROD-4**: The system must support externalized profiles (`dev` and `prod`) allowing seamless transition between zero-config H2 and production MySQL HikariCP connection pools.

### 5.11 Docker, Nginx & CI/CD Deployment (FR-DEVOPS)
- **FR-DEVOPS-1**: The system must provide multi-stage Dockerfiles for Spring Boot backend (`FlowForge-backend/Dockerfile`) and React frontend (`FlowForge-frontend/Dockerfile`).
- **FR-DEVOPS-2**: The system must provide an Nginx reverse proxy configuration (`nginx.conf`) handling SPA client routing, API reverse proxying, STOMP WebSockets proxying, Gzip compression, and HTTP security headers.
- **FR-DEVOPS-3**: The system must provide a master Docker Compose orchestration file (`docker-compose.yml`) linking MySQL 8.0, Spring Boot backend, and Nginx frontend with health checks and persistent volume mounts.
- **FR-DEVOPS-4**: The system must execute automated GitHub Actions CI/CD pipeline (`.github/workflows/ci-cd.yml`) checking JUnit tests, Vite bundling, JAR packaging, and Docker builds on code pushes.

---

## 6. Non-Functional Requirements

### 6.1 Security & Compliance (NFR-SEC)
- Passwords stored strictly using BCrypt hashing algorithm.
- All protected REST endpoints require valid JWT Bearer tokens in the `Authorization` HTTP header.
- CORS policies explicitly configured to permit origin `http://localhost:5173`.

### 6.2 Performance & Scalability (NFR-PERF)
- Client-side initial page load under 1.5 seconds.
- Production bundle size optimized with Vite chunk splitting.
- Backend database queries optimized using JPA indexes on unique columns (e.g. `email`).

### 6.3 Usability & Aesthetics (NFR-USA)
- Premium dark mode default interface with full light mode toggle support.
- Fully responsive design scaling across Desktop (>1024px), Tablet (768px - 1023px), and Mobile (<767px).

---

## 7. System Architecture
FlowForge follows a decoupled Client-Server REST Architecture:

```text
[ React 18 Frontend SPA ]  <--- (JSON / HTTP REST) --->  [ Spring Boot 3 Backend ]  <--- (JPA / SQL) --->  [ MySQL Database ]
```

---

## 8. Database Design Summary
- **`users` Table**: Stores user credentials, name, role (`ROLE_USER`, `ROLE_ADMIN`), and timestamps.
- **`password_reset_tokens` Table**: Stores single-use tokens mapped to users for password recovery.

---

## 9. Future Enhancements
- Full Kanban Board with drag-and-drop task card movement.
- Real-time WebSocket notifications using Spring WebSocket & STOMP.
- Enterprise role-based access control (RBAC) granular permissions.
