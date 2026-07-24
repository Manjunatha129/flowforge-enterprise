# FlowForge - REST API Documentation

Base URL: `http://localhost:8080/api/v1`

All responses follow the unified `ApiResponse<T>` JSON envelope format:

```json
{
  "success": true,
  "message": "Operation successful description",
  "data": { ... },
  "timestamp": "2026-07-22T22:50:00"
}
```

---

## 🔑 Authentication Endpoints (`/auth`)

### 1. Register Account
- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No

---

## 📂 Projects Endpoints (`/projects`)

### 1. Create New Project
- **Endpoint**: `/projects`
- **Method**: `POST`
- **Auth Required**: Yes

---

## 📋 Task Management Endpoints (`/tasks`)

### 1. Create New Task
- **Endpoint**: `/tasks`
- **Method**: `POST`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)

#### Request Body
```json
{
  "title": "Build React Glassmorphism Kanban Drag & Drop Engine",
  "description": "Develop interactive Kanban Board supporting column transitions.",
  "projectId": "b47c8d90-2e3f-4a5b-9c8d-7e6f5a4b3c2d",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "startDate": "2026-07-18",
  "dueDate": "2026-07-25",
  "estimatedHours": 16.0,
  "assignedUser": "Elena Rostova",
  "labels": ["UI", "Feature", "React"]
}
```

#### Successful Response (`201 Created`)
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "t1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
    "title": "Build React Glassmorphism Kanban Drag & Drop Engine",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "assignedUser": "Elena Rostova",
    "assignedUserAvatar": "ER",
    "starred": false,
    "archived": false,
    "overdue": false,
    "subtasksProgress": 0,
    "commentsCount": 0,
    "attachmentsCount": 0,
    "createdAt": "2026-07-22T23:30:00"
  },
  "timestamp": "2026-07-22T23:30:00"
}
```

---

### 2. Get All Tasks
- **Endpoint**: `/tasks?projectId={id}&sortBy=createdAt`
- **Method**: `GET`
- **Auth Required**: Yes

---

### 3. Update Task Status (Kanban Drag & Drop)
- **Endpoint**: `/tasks/{id}/status`
- **Method**: `PATCH`
- **Auth Required**: Yes

#### Request Body
```json
{
  "status": "COMPLETED"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Task status updated to COMPLETED",
  "data": {
    "id": "t1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
    "status": "COMPLETED"
  },
  "timestamp": "2026-07-22T23:30:00"
}
```

---

### 4. Post Task Comment
- **Endpoint**: `/tasks/{id}/comments`
- **Method**: `POST`
- **Auth Required**: Yes

#### Request Body
```json
{
  "commentText": "Verified status endpoints with Postman collection.",
  "userName": "Alex Chen"
}
```

---

### 5. Duplicate Task
- **Endpoint**: `/tasks/{id}/duplicate`
- **Method**: `POST`
- **Auth Required**: Yes

---

### 6. Toggle Star / Favorite Task
- **Endpoint**: `/tasks/{id}/star`
- **Method**: `PATCH`
- **Auth Required**: Yes

---

### 7. Toggle Archive Task
- **Endpoint**: `/tasks/{id}/archive`
- **Method**: `PATCH`
- **Auth Required**: Yes

---

## 🔔 Notification Endpoints (`/notifications`)

### 1. Get All Notifications
- **Endpoint**: `/notifications`
- **Method**: `GET`
- **Auth Required**: Yes

### 2. Get Unread Notifications
- **Endpoint**: `/notifications/unread`
- **Method**: `GET`
- **Auth Required**: Yes

### 3. Get Unread Count Badge Number
- **Endpoint**: `/notifications/count`
- **Method**: `GET`
- **Auth Required**: Yes

### 4. Mark Notification as Read
- **Endpoint**: `/notifications/{id}/read`
- **Method**: `PATCH`
- **Auth Required**: Yes

### 5. Mark All Notifications as Read
- **Endpoint**: `/notifications/read-all`
- **Method**: `PATCH`
- **Auth Required**: Yes

### 6. Delete Notification by ID
- **Endpoint**: `/notifications/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes

### 7. Clear All Notifications
- **Endpoint**: `/notifications/clear`
- **Method**: `DELETE`
- **Auth Required**: Yes

---

## ⚡ Activity Feed Endpoints (`/activities`)

### 1. Get Unified Workspace Activity Stream
- **Endpoint**: `/activities`
- **Method**: `GET`
- **Auth Required**: Yes

---

## 🛡️ Admin Endpoints (`/admin`)

### 1. Get Admin Dashboard Statistics
- **Endpoint**: `/admin/stats`
- **Method**: `GET`
- **Auth Required**: Yes (`ROLE_ADMIN`)

### 2. Get Users Directory
- **Endpoint**: `/admin/users?search={query}&role={role}&enabled={true|false}`
- **Method**: `GET`
- **Auth Required**: Yes (`ROLE_ADMIN`)

### 3. Update User Role (Promote / Demote)
- **Endpoint**: `/admin/users/{id}/role`
- **Method**: `PATCH`
- **Auth Required**: Yes (`ROLE_ADMIN`)

### 4. Toggle User Status (Activate / Deactivate)
- **Endpoint**: `/admin/users/{id}/status`
- **Method**: `PATCH`
- **Auth Required**: Yes (`ROLE_ADMIN`)

### 5. Reset User Password
- **Endpoint**: `/admin/users/{id}/reset-password`
- **Method**: `POST`
- **Auth Required**: Yes (`ROLE_ADMIN`)

### 6. Delete User Account
- **Endpoint**: `/admin/users/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes (`ROLE_ADMIN`)

### 7. Get Security Audit Logs
- **Endpoint**: `/admin/audit-logs?module={module}&query={search}`
- **Method**: `GET`
- **Auth Required**: Yes (`ROLE_ADMIN`)

### 8. Update System Settings
- **Endpoint**: `/admin/settings`
- **Method**: `PUT`
- **Auth Required**: Yes (`ROLE_ADMIN`)

---

## 📊 Reports & Export Endpoints (`/reports`)

### 1. Get Executive Dashboard Overview
- **Endpoint**: `/reports/dashboard`
- **Method**: `GET`
- **Auth Required**: Yes

### 2. Get Project Reports
- **Endpoint**: `/reports/projects`
- **Method**: `GET`
- **Auth Required**: Yes

### 3. Get Task Reports
- **Endpoint**: `/reports/tasks`
- **Method**: `GET`
- **Auth Required**: Yes

### 4. Get User Productivity Reports
- **Endpoint**: `/reports/users`
- **Method**: `GET`
- **Auth Required**: Yes

### 5. Get Productivity & Time-Series Analytics
- **Endpoint**: `/reports/productivity` (also `/weekly`, `/monthly`, `/yearly`)
- **Method**: `GET`
- **Auth Required**: Yes

### 6. Export PDF Executive Report File
- **Endpoint**: `/reports/export/pdf`
- **Method**: `POST`
- **Auth Required**: Yes
- **Response**: `application/pdf` binary stream attachment (`FlowForge-executive-report.pdf`)

### 7. Export Excel XML Report File
- **Endpoint**: `/reports/export/excel`
- **Method**: `POST`
- **Auth Required**: Yes
- **Response**: `application/vnd.ms-excel` binary stream attachment (`FlowForge-analytics-report.xls`)

### 8. Export CSV Tasks Report File
- **Endpoint**: `/reports/export/csv`
- **Method**: `POST`
- **Auth Required**: Yes
- **Response**: `text/csv` binary stream attachment (`FlowForge-tasks-report.csv`)

---

## 👤 Profile & Workspace Endpoints (`/profile`)

### 1. Get User Profile & Settings
- **Endpoint**: `/profile`
- **Method**: `GET`
- **Auth Required**: Yes

### 2. Update Profile Details
- **Endpoint**: `/profile`
- **Method**: `PUT`
- **Auth Required**: Yes

### 3. Upload Custom Avatar Picture
- **Endpoint**: `/profile/avatar`
- **Method**: `POST`
- **Auth Required**: Yes

### 4. Delete Custom Avatar Picture
- **Endpoint**: `/profile/avatar`
- **Method**: `DELETE`
- **Auth Required**: Yes

### 5. Change Account Password
- **Endpoint**: `/profile/change-password`
- **Method**: `POST`
- **Auth Required**: Yes

### 6. Update Workspace Settings
- **Endpoint**: `/profile/workspace`
- **Method**: `PUT`
- **Auth Required**: Yes

### 7. Update Notification Preferences
- **Endpoint**: `/profile/notifications`
- **Method**: `PUT`
- **Auth Required**: Yes

### 8. Update Appearance Preferences (Theme & Accent Color)
- **Endpoint**: `/profile/appearance`
- **Method**: `PUT`
- **Auth Required**: Yes

### 9. Export Account Data JSON
- **Endpoint**: `/profile/export`
- **Method**: `GET`
- **Auth Required**: Yes

### 10. Deactivate Account
- **Endpoint**: `/profile/deactivate`
- **Method**: `PATCH`
- **Auth Required**: Yes

### 11. Delete Account Permanently
- **Endpoint**: `/profile`
- **Method**: `DELETE`
- **Auth Required**: Yes

---

## 🌐 Presence & WebSockets (`/presence` & STOMP `/ws`)

### 1. Get Currently Online Users List
- **Endpoint**: `/presence/online`
- **Method**: `GET`
- **Auth Required**: Yes

### 2. Get Total Online User Count
- **Endpoint**: `/presence/count`
- **Method**: `GET`
- **Auth Required**: Yes

### 3. Get User Presence Status
- **Endpoint**: `/presence/users/{email}`
- **Method**: `GET`
- **Auth Required**: Yes

### 4. STOMP WebSocket Endpoint & Channels
- **WebSocket Handshake URL**: `ws://localhost:8080/ws` (SockJS fallback: `http://localhost:8080/ws`)
- **STOMP Broadcast Topics**:
  - `/topic/notifications` — Real-time notification objects.
  - `/topic/presence` — User online/offline status objects.
  - `/topic/dashboard` — Live dashboard auto-refresh signals.
  - `/topic/projects` — Real-time project CRUD events.
  - `/topic/tasks` — Real-time task CRUD & Kanban status events.
- **User Queue Channel**:
  - `/user/queue/notifications` — Private user alert messages.

---

## 💬 Team Chat Endpoints (`/chat` & STOMP `/app/chat.*`)

### 1. Get Workspace General Chat History
- **Endpoint**: `/chat/workspace`
- **Method**: `GET`
- **Auth Required**: Yes

### 2. Get Project Channel Chat History
- **Endpoint**: `/chat/project/{projectId}`
- **Method**: `GET`
- **Auth Required**: Yes

### 3. Get Direct Messages Thread
- **Endpoint**: `/chat/direct?user={recipientEmail}`
- **Method**: `GET`
- **Auth Required**: Yes

### 4. Send Message (REST Fallback)
- **Endpoint**: `/chat/send`
- **Method**: `POST`
- **Auth Required**: Yes

### 5. Edit Chat Message
- **Endpoint**: `/chat/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes

### 6. Delete Chat Message
- **Endpoint**: `/chat/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes

### 7. Toggle Pin Message
- **Endpoint**: `/chat/{id}/pin`
- **Method**: `PATCH`
- **Auth Required**: Yes

### 8. Search Chat Messages
- **Endpoint**: `/chat/search?query={keyword}`
- **Method**: `GET`
- **Auth Required**: Yes

### 9. STOMP Chat Handlers & Channels
- **STOMP Message Inbound**:
  - `/app/chat.sendMessage` — Send STOMP chat message.
  - `/app/chat.typing` — Send STOMP typing indicator signal.
- **STOMP Channels**:
  - `/topic/chat/workspace` — Workspace chat stream.
  - `/topic/chat/project/{projectId}` — Project channel stream.
  - `/topic/chat/direct/{dmKey}` — Direct messaging stream.
  - `/topic/chat/typing/{channelId}` — Typing indicators stream.

---

## 💬 Unified Comments Endpoints (`/comments`)

### 1. Get Comment Thread
- **Endpoint**: `/comments?targetType={PROJECT|TASK|ATTACHMENT}&targetId={id}`
- **Method**: `GET`
- **Auth Required**: Yes

### 2. Create Comment or Reply
- **Endpoint**: `/comments`
- **Method**: `POST`
- **Auth Required**: Yes

### 3. Edit Comment
- **Endpoint**: `/comments/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes

### 4. Delete Comment
- **Endpoint**: `/comments/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes

---

## 📁 File Storage Endpoints (`/files`)

### 1. Get Files List
- **Endpoint**: `/files?targetType={type}&targetId={id}`
- **Method**: `GET`
- **Auth Required**: Yes

### 2. Upload File Attachment
- **Endpoint**: `/files/upload`
- **Method**: `POST`
- **Auth Required**: Yes

### 3. Rename File Attachment
- **Endpoint**: `/files/{id}/rename`
- **Method**: `PUT`
- **Auth Required**: Yes

### 4. Replace File Attachment
- **Endpoint**: `/files/{id}/replace`
- **Method**: `PUT`
- **Auth Required**: Yes

### 5. Delete File Attachment
- **Endpoint**: `/files/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes

---

## 🔍 Global Search Endpoint (`/search`)

### 1. Execute Global Workspace Search
- **Endpoint**: `/search/global?query={keyword}`
- **Method**: `GET`
- **Auth Required**: Yes

---

## 📖 Swagger / OpenAPI 3.0 Endpoints

### 1. Interactive Swagger UI
- **Endpoint**: `/swagger-ui.html` (or `/swagger-ui/index.html`)
- **Method**: `GET`
- **Auth Required**: No (Publicly accessible documentation interface)

### 2. OpenAPI 3.0 JSON Specification
- **Endpoint**: `/v3/api-docs`
- **Method**: `GET`
- **Auth Required**: No

---

## 🩺 Spring Boot Actuator Endpoints (`/actuator`)

### 1. System Health Status
- **Endpoint**: `/actuator/health`
- **Method**: `GET`
- **Auth Required**: No

### 2. System Application Info
- **Endpoint**: `/actuator/info`
- **Method**: `GET`
- **Auth Required**: No

### 3. JVM & Application Metrics
- **Endpoint**: `/actuator/metrics`
- **Method**: `GET`
- **Auth Required**: No

---

## 🔒 Security Authorization Summary
- **Public Routes (`permitAll`)**: `/api/auth/**`, `/api/v1/auth/**`, `/h2-console/**`, `/v3/api-docs/**`, `/swagger-ui/**`, `/actuator/**`, `/ws/**`.
- **Admin Only Routes (`hasRole('ADMIN')`)**: `/api/v1/admin/**`.
- **Protected Routes (`authenticated`)**: All other REST endpoints require a valid JWT Bearer token passed in the `Authorization: Bearer <token>` HTTP header.









