# 🚗 Smart Campus Operations Hub
## Vehicle Parking & Bike Helmets Management System
### IT3030 – Programming Applications and Frameworks | Assignment 2026 (Semester 1)
### Faculty of Computing – SLIIT

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Assignment Requirements Mapping](#2-assignment-requirements-mapping)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Architecture](#5-system-architecture)
6. [Database Design (MySQL)](#6-database-design-mysql)
7. [REST API Endpoint List](#7-rest-api-endpoint-list)
8. [Module Breakdown & Team Allocation](#8-module-breakdown--team-allocation)
9. [React Frontend Structure](#9-react-frontend-structure)
10. [Spring Boot Backend Structure](#10-spring-boot-backend-structure)
11. [Security Design](#11-security-design)
12. [GitHub Actions CI/CD Workflow](#12-github-actions-cicd-workflow)
13. [Testing Strategy](#13-testing-strategy)
14. [Setup & Installation Guide](#14-setup--installation-guide)
15. [Optional Innovation Features](#15-optional-innovation-features)

---

## 1. Project Overview

### Business Scenario (Customized)
A university campus requires a unified web platform to manage:
- **Vehicle Parking System** – Manage campus parking slots, vehicle registrations, slot bookings, and entry/exit tracking.
- **Bike Helmets Management System** – Manage a pool of rental helmets, track availability, issue helmets to users, and handle maintenance/damage reports.

This system replaces the manual/paper-based processes currently in place and enforces role-based workflows with full auditability.

### Tech Stack
| Layer | Technology |
|---|---|
| Backend | Java 17 + Spring Boot 3.x |
| Frontend | React 18 (Vite) |
| Database | MySQL 8.x |
| Authentication | Spring Security + OAuth 2.0 (Google) + JWT |
| File Storage | Local filesystem / AWS S3 (optional) |
| Version Control | GitHub |
| CI/CD | GitHub Actions |
| API Testing | Postman |

### Key Dates
| Event | Date |
|---|---|
| Assignment Release | 24th March 2026 |
| Viva / Demo | From 11th April 2026 |
| Submission Deadline | 27th April 2026, 11:45 PM (GMT +5:30) |

---

## 2. Assignment Requirements Mapping

The original assignment defines **Modules A–E**. Below is how each module maps to the parking/helmet system:

| Assignment Module | Original Description | This Project Mapping |
|---|---|---|
| **Module A** | Facilities & Assets Catalogue | Parking Slot Catalogue + Helmet Inventory |
| **Module B** | Booking Management | Parking Slot Booking + Helmet Borrowing/Return |
| **Module C** | Maintenance & Incident Ticketing | Damage/Fault Reports for Slots & Helmets |
| **Module D** | Notifications | Booking confirmations, ticket updates, due-return reminders |
| **Module E** | Authentication & Authorization | OAuth 2.0 Google Login + Role-based Access (USER, ADMIN, TECHNICIAN) |

---

## 3. Functional Requirements

### Module A – Asset Catalogue

#### Parking Slots
- FR-A01: The system shall maintain a catalogue of all campus parking slots.
- FR-A02: Each slot shall have: slot number, zone/location, type (two-wheeler / four-wheeler / EV / handicapped), status (AVAILABLE / OCCUPIED / RESERVED / OUT_OF_SERVICE).
- FR-A03: Admins can add, update, and deactivate parking slots.
- FR-A04: Users can search/filter slots by zone, type, and availability.

#### Helmet Inventory
- FR-A05: The system shall maintain a catalogue of rental helmets.
- FR-A06: Each helmet shall have: helmet ID, brand, size (S/M/L/XL), condition (GOOD / FAIR / DAMAGED), status (AVAILABLE / BORROWED / IN_MAINTENANCE).
- FR-A07: Admins can add, update, and retire helmets from inventory.
- FR-A08: Users can search/filter helmets by size, condition, and availability.

---

### Module B – Booking Management

#### Parking Bookings
- FR-B01: Authenticated users can book an available parking slot for a specific date and time range.
- FR-B02: Booking workflow: `PENDING → APPROVED / REJECTED`. Approved bookings can be `CANCELLED`.
- FR-B03: The system shall prevent double-booking of the same slot for overlapping time ranges.
- FR-B04: Users can view their own booking history.
- FR-B05: Admins can view, approve, reject, and cancel any booking.
- FR-B06: Booking requests must include: vehicle number, vehicle type, purpose, and time range.

#### Helmet Borrowing
- FR-B07: Authenticated users can borrow an available helmet by selecting size and preferred return time.
- FR-B08: Helmet borrow workflow: `REQUESTED → ISSUED / REJECTED → RETURNED`.
- FR-B09: The system shall prevent the same helmet from being borrowed by two users at the same time.
- FR-B10: Admins can issue helmets to users and mark them as returned.
- FR-B11: Users can view their borrowing history.

---

### Module C – Maintenance & Incident Ticketing

- FR-C01: Users can raise an incident/damage ticket for a parking slot or a helmet.
- FR-C02: Each ticket shall include: resource type, resource ID, category (DAMAGE / FAULT / CLEANLINESS / OTHER), description, priority (LOW / MEDIUM / HIGH / CRITICAL), and reporter contact.
- FR-C03: Tickets support up to 3 image attachments (photo of damage/fault).
- FR-C04: Ticket workflow: `OPEN → IN_PROGRESS → RESOLVED → CLOSED`. Admin can set `REJECTED` with reason.
- FR-C05: Admins can assign a technician to a ticket.
- FR-C06: Technicians can update ticket status and add resolution notes.
- FR-C07: Users and staff can add comments on tickets.
- FR-C08: Comment ownership rules: users can edit/delete only their own comments; admins can delete any comment.

---

### Module D – Notifications

- FR-D01: Users receive a notification when their parking/helmet booking is APPROVED or REJECTED.
- FR-D02: Users receive a notification when their incident ticket status changes.
- FR-D03: Users receive a notification when a new comment is added to their ticket.
- FR-D04: Users receive a reminder notification before their parking booking time.
- FR-D05: Notification panel accessible from the web UI header (bell icon with unread count badge).
- FR-D06: Users can mark individual notifications as read or clear all.

---

### Module E – Authentication & Authorization

- FR-E01: Users can register/login via Google OAuth 2.0.
- FR-E02: System supports at minimum three roles: `USER`, `ADMIN`, `TECHNICIAN`.
- FR-E03: `USER` can: browse catalogue, create bookings, borrow helmets, raise tickets, add comments.
- FR-E04: `ADMIN` can: manage catalogue, approve/reject bookings, assign tickets, manage roles.
- FR-E05: `TECHNICIAN` can: view assigned tickets, update status, add resolution notes.
- FR-E06: All REST API endpoints are secured with JWT token validation.
- FR-E07: React frontend routes are protected based on user role.

---

## 4. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Security | All API endpoints must require valid JWT tokens (except login/register). |
| NFR-02 | Security | Passwords (if any local auth) must be bcrypt-hashed. |
| NFR-03 | Security | File uploads validated by type (JPEG/PNG only) and size (max 5 MB per file). |
| NFR-04 | Performance | API responses for list endpoints must complete within 2 seconds for up to 1,000 records. |
| NFR-05 | Scalability | Layered architecture (Controller → Service → Repository) to allow horizontal scaling. |
| NFR-06 | Usability | UI must be responsive and work on desktop and mobile browsers. |
| NFR-07 | Reliability | The system must handle invalid inputs gracefully with meaningful error messages. |
| NFR-08 | Auditability | All booking approvals/rejections must store who actioned them and when (audit fields). |
| NFR-09 | Maintainability | Code must follow consistent naming conventions and be documented with Javadoc/JSDoc. |
| NFR-10 | CI/CD | GitHub Actions must run on every push: compile, test, and report pass/fail. |

---

## 5. System Architecture

### 5.1 Overall System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                          │
│   ┌──────────────────────────────────────────────────┐    │
│   │         React Web Application (Vite + React 18)          │    │
│   │  (runs in user's browser, served via Nginx) │    │
│   └───────────────────┬──────────────────────────────┘    │
└───────────────────────┼────────────────────────────────────┘
                        │ HTTPS / REST (JSON)
                        │ Bearer JWT Token
┌───────────────────────▼────────────────────────────────────┐
│                    API GATEWAY LAYER                        │
│   ┌──────────────────────────────────────────────────┐    │
│   │     Spring Boot REST API (Port 8080)             │    │
│   │  ┌────────┐ ┌─────────┐ ┌──────────┐ ┌───────┐  │    │
│   │  │ Auth   │ │ Parking │ │ Helmets  │ │Tickets│  │    │
│   │  │ Filter │ │ Module  │ │ Module   │ │Module │  │    │
│   │  └────────┘ └─────────┘ └──────────┘ └───────┘  │    │
│   └───────────────────┬──────────────────────────────┘    │
└───────────────────────┼────────────────────────────────────┘
                        │ JDBC / JPA (Hibernate)
┌───────────────────────▼────────────────────────────────────┐
│                    DATA LAYER                               │
│   ┌──────────────────────────────────────────────────┐    │
│   │             MySQL 8.x Database                   │    │
│   └──────────────────────────────────────────────────┘    │
│   ┌──────────────────────────────────────────────────┐    │
│   │         Local File System (image uploads)        │    │
│   └──────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│                 EXTERNAL SERVICES                           │
│   ┌──────────────────────────────────────────────────┐    │
│   │          Google OAuth 2.0 Provider               │    │
│   └──────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### 5.2 Spring Boot REST API Architecture (Layered)

```
┌─────────────────────────────────────────────────┐
│            Controller Layer                      │
│   (REST Controllers – handle HTTP, validation)   │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│             Service Layer                        │
│   (Business logic, workflow, conflict checks)    │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│           Repository Layer                       │
│   (Spring Data JPA – MySQL queries)              │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              Entity/Model Layer                  │
│   (JPA Entities mapped to MySQL tables)          │
└─────────────────────────────────────────────────┘
│
Cross-cutting concerns:
├── Security (Spring Security + JWT Filter)
├── Exception Handling (@ControllerAdvice)
├── Validation (Bean Validation / JSR-380)
└── DTOs (Request/Response objects, MapStruct)
```

### 5.3 React Frontend Architecture (Vite)

```
smart-campus-frontend/
├── index.html        ← Vite HTML root (references /src/main.jsx)
├── vite.config.js    ← Vite config (proxy, alias, plugins)
└── src/
    ├── main.jsx      ← ReactDOM.createRoot entry point
    ├── App.jsx       ← Router + layout
    ├── api/          ← Axios instances + API call functions
    ├── components/   ← Reusable UI components
    │   ├── common/   ← Navbar, Sidebar, Notification Bell, etc.
    │   ├── parking/  ← Parking-specific components
    │   ├── helmets/  ← Helmet-specific components
    │   └── tickets/  ← Incident ticket components
    ├── pages/        ← Route-level page components
    ├── context/      ← AuthContext, NotificationContext
    ├── hooks/        ← Custom hooks (useAuth, useBooking, etc.)
    ├── routes/       ← Protected route wrappers
    └── utils/        ← Helper functions, formatters
```

---

## 6. Database Design (MySQL)

### Entity Relationship Overview

```
users ──< bookings >── parking_slots
users ──< helmet_borrowings >── helmets
users ──< incident_tickets >── parking_slots / helmets
incident_tickets ──< ticket_comments
incident_tickets ──< ticket_attachments
users ──< notifications
users ──< user_roles >── roles
```

### Table Definitions

#### `users`
```sql
CREATE TABLE users (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    google_id    VARCHAR(255) UNIQUE,
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) UNIQUE NOT NULL,
    profile_pic  VARCHAR(500),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `roles`
```sql
CREATE TABLE roles (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('USER', 'ADMIN', 'TECHNICIAN') UNIQUE NOT NULL
);
```

#### `user_roles` (join table)
```sql
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

#### `parking_slots`
```sql
CREATE TABLE parking_slots (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_number  VARCHAR(20) UNIQUE NOT NULL,
    zone         VARCHAR(100) NOT NULL,
    slot_type    ENUM('TWO_WHEELER','FOUR_WHEELER','EV','HANDICAPPED') NOT NULL,
    capacity     INT DEFAULT 1,
    status       ENUM('AVAILABLE','OCCUPIED','RESERVED','OUT_OF_SERVICE') DEFAULT 'AVAILABLE',
    description  TEXT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `helmets`
```sql
CREATE TABLE helmets (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    helmet_code  VARCHAR(50) UNIQUE NOT NULL,
    brand        VARCHAR(100),
    size         ENUM('S','M','L','XL') NOT NULL,
    color        VARCHAR(50),
    condition_status ENUM('GOOD','FAIR','DAMAGED') DEFAULT 'GOOD',
    status       ENUM('AVAILABLE','BORROWED','IN_MAINTENANCE') DEFAULT 'AVAILABLE',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `parking_bookings`
```sql
CREATE TABLE parking_bookings (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    slot_id         BIGINT NOT NULL,
    vehicle_number  VARCHAR(20) NOT NULL,
    vehicle_type    ENUM('TWO_WHEELER','FOUR_WHEELER','EV') NOT NULL,
    purpose         VARCHAR(255),
    start_time      DATETIME NOT NULL,
    end_time        DATETIME NOT NULL,
    status          ENUM('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING',
    rejection_reason VARCHAR(500),
    actioned_by     BIGINT,
    actioned_at     DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id),
    FOREIGN KEY (actioned_by) REFERENCES users(id)
);
```

#### `helmet_borrowings`
```sql
CREATE TABLE helmet_borrowings (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    helmet_id       BIGINT NOT NULL,
    expected_return DATETIME NOT NULL,
    actual_return   DATETIME,
    status          ENUM('REQUESTED','ISSUED','REJECTED','RETURNED') DEFAULT 'REQUESTED',
    rejection_reason VARCHAR(500),
    issued_by       BIGINT,
    issued_at       DATETIME,
    returned_at     DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (helmet_id) REFERENCES helmets(id)
);
```

#### `incident_tickets`
```sql
CREATE TABLE incident_tickets (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_id     BIGINT NOT NULL,
    resource_type   ENUM('PARKING_SLOT','HELMET') NOT NULL,
    resource_id     BIGINT NOT NULL,
    category        ENUM('DAMAGE','FAULT','CLEANLINESS','OTHER') NOT NULL,
    description     TEXT NOT NULL,
    priority        ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'LOW',
    contact_info    VARCHAR(255),
    status          ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED','REJECTED') DEFAULT 'OPEN',
    rejection_reason VARCHAR(500),
    assigned_to     BIGINT,
    resolution_notes TEXT,
    resolved_at     DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

#### `ticket_attachments`
```sql
CREATE TABLE ticket_attachments (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id   BIGINT NOT NULL,
    file_name   VARCHAR(255) NOT NULL,
    file_path   VARCHAR(500) NOT NULL,
    file_size   BIGINT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES incident_tickets(id)
);
```

#### `ticket_comments`
```sql
CREATE TABLE ticket_comments (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id   BIGINT NOT NULL,
    author_id   BIGINT NOT NULL,
    content     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES incident_tickets(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

#### `notifications`
```sql
CREATE TABLE notifications (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    type        ENUM('BOOKING_APPROVED','BOOKING_REJECTED','BOOKING_CANCELLED',
                     'HELMET_ISSUED','HELMET_REJECTED','TICKET_STATUS_CHANGED',
                     'TICKET_COMMENT_ADDED','BOOKING_REMINDER') NOT NULL,
    title       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 7. REST API Endpoint List

> Base URL: `http://localhost:8080/api/v1`

### Auth Endpoints

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/auth/google` | Redirect to Google OAuth | Public |
| GET | `/auth/callback` | OAuth callback, return JWT | Public |
| GET | `/auth/me` | Get current user info | USER+ |
| POST | `/auth/logout` | Invalidate token | USER+ |

---

### Module A – Parking Slots (Member 1)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/parking-slots` | List all slots (filter: zone, type, status) | USER+ |
| GET | `/parking-slots/{id}` | Get slot details | USER+ |
| POST | `/parking-slots` | Create new parking slot | ADMIN |
| PUT | `/parking-slots/{id}` | Update slot details | ADMIN |
| PATCH | `/parking-slots/{id}/status` | Update slot status only | ADMIN |
| DELETE | `/parking-slots/{id}` | Deactivate a slot | ADMIN |

---

### Module A – Helmets (Member 1)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/helmets` | List all helmets (filter: size, status, condition) | USER+ |
| GET | `/helmets/{id}` | Get helmet details | USER+ |
| POST | `/helmets` | Add new helmet to inventory | ADMIN |
| PUT | `/helmets/{id}` | Update helmet details | ADMIN |
| PATCH | `/helmets/{id}/status` | Update helmet status | ADMIN |
| DELETE | `/helmets/{id}` | Retire helmet from inventory | ADMIN |

---

### Module B – Parking Bookings (Member 2)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/parking-bookings` | Get all bookings (admin: all; user: own) | USER+ |
| GET | `/parking-bookings/{id}` | Get booking details | USER+ |
| POST | `/parking-bookings` | Create a new parking booking | USER |
| PATCH | `/parking-bookings/{id}/approve` | Approve a booking | ADMIN |
| PATCH | `/parking-bookings/{id}/reject` | Reject a booking with reason | ADMIN |
| PATCH | `/parking-bookings/{id}/cancel` | Cancel an approved booking | USER/ADMIN |
| GET | `/parking-bookings/check-conflict` | Check slot availability for time range | USER+ |

---

### Module B – Helmet Borrowings (Member 2)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/helmet-borrowings` | Get all borrowings (admin: all; user: own) | USER+ |
| GET | `/helmet-borrowings/{id}` | Get borrowing details | USER+ |
| POST | `/helmet-borrowings` | Request to borrow a helmet | USER |
| PATCH | `/helmet-borrowings/{id}/issue` | Issue helmet to user | ADMIN |
| PATCH | `/helmet-borrowings/{id}/reject` | Reject borrowing request | ADMIN |
| PATCH | `/helmet-borrowings/{id}/return` | Mark helmet as returned | ADMIN |

---

### Module C – Incident Tickets (Member 3)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/tickets` | Get all tickets (admin: all; user: own) | USER+ |
| GET | `/tickets/{id}` | Get ticket details | USER+ |
| POST | `/tickets` | Create new incident ticket | USER |
| PATCH | `/tickets/{id}/assign` | Assign technician to ticket | ADMIN |
| PATCH | `/tickets/{id}/status` | Update ticket status | ADMIN/TECH |
| PATCH | `/tickets/{id}/reject` | Reject ticket with reason | ADMIN |
| DELETE | `/tickets/{id}` | Delete a ticket (soft delete) | ADMIN |
| POST | `/tickets/{id}/attachments` | Upload image attachments | USER |
| GET | `/tickets/{id}/attachments/{fileId}` | Download attachment | USER+ |
| DELETE | `/tickets/{id}/attachments/{fileId}` | Delete attachment | USER/ADMIN |
| GET | `/tickets/{id}/comments` | List comments on a ticket | USER+ |
| POST | `/tickets/{id}/comments` | Add a comment | USER+ |
| PUT | `/tickets/{id}/comments/{commentId}` | Edit own comment | USER |
| DELETE | `/tickets/{id}/comments/{commentId}` | Delete comment (own or admin) | USER/ADMIN |

---

### Module D – Notifications (Member 4)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/notifications` | Get all notifications for current user | USER+ |
| GET | `/notifications/unread-count` | Get unread notification count | USER+ |
| PATCH | `/notifications/{id}/read` | Mark notification as read | USER+ |
| PATCH | `/notifications/read-all` | Mark all notifications as read | USER+ |
| DELETE | `/notifications/{id}` | Delete a notification | USER+ |

---

### Module E – User & Role Management (Member 4)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/users` | List all users | ADMIN |
| GET | `/users/{id}` | Get user details | ADMIN |
| PATCH | `/users/{id}/role` | Assign/change user role | ADMIN |
| DELETE | `/users/{id}` | Deactivate user account | ADMIN |

---

## 8. Recommended Work Allocation (Individual Assessment)

> To make individual contribution visible, modules are allocated clearly as per the university guidelines.
> Each member must implement at least **4 REST API endpoints** using different HTTP methods (GET, POST, PUT/PATCH, DELETE).
> The final repository and report must clearly indicate which member implemented which endpoints and UI components.

### Summary

| Member | Primary Responsibility | Modules Covered |
|---|---|---|
| **Member 1** | Facilities catalogue + resource management endpoints | Module A – Parking Slots & Helmets |
| **Member 2** | Booking workflow + conflict checking | Module B – Parking Bookings & Helmet Borrowings |
| **Member 3** | Incident tickets + attachments + technician updates | Module C – Tickets, Comments, Attachments |
| **Member 4** | Notifications + role management + OAuth integration improvements | Module D + Module E |

---

### 👤 Member 1 – Facilities Catalogue & Resource Management Endpoints

**Responsibility:** Build and manage the complete catalogue of bookable resources — parking slots and helmets. This is the foundation layer that all other modules depend on.

#### 📌 Assigned Modules
- **Module A** – Facilities & Assets Catalogue (Parking Slots + Helmets)

#### 🔧 REST API Endpoints (Backend – Spring Boot)

**Parking Slots:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 1 | `GET` | `/api/v1/parking-slots` | List all slots with optional filters (zone, type, status) | 200 |
| 2 | `GET` | `/api/v1/parking-slots/{id}` | Get single parking slot by ID | 200 / 404 |
| 3 | `POST` | `/api/v1/parking-slots` | Create a new parking slot (Admin only) | 201 |
| 4 | `PUT` | `/api/v1/parking-slots/{id}` | Update full parking slot details (Admin only) | 200 |
| 5 | `PATCH` | `/api/v1/parking-slots/{id}/status` | Update slot status only (Admin only) | 200 |
| 6 | `DELETE` | `/api/v1/parking-slots/{id}` | Deactivate/remove a parking slot (Admin only) | 204 |

**Helmets:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 7 | `GET` | `/api/v1/helmets` | List all helmets with optional filters (size, status, condition) | 200 |
| 8 | `GET` | `/api/v1/helmets/{id}` | Get single helmet by ID | 200 / 404 |
| 9 | `POST` | `/api/v1/helmets` | Add a new helmet to inventory (Admin only) | 201 |
| 10 | `PUT` | `/api/v1/helmets/{id}` | Update helmet details (Admin only) | 200 |
| 11 | `PATCH` | `/api/v1/helmets/{id}/status` | Update helmet status only (Admin only) | 200 |
| 12 | `DELETE` | `/api/v1/helmets/{id}` | Retire helmet from inventory (Admin only) | 204 |

#### 🗄️ Database Tables Owned
- `parking_slots`
- `helmets`

#### 🧩 Spring Boot Components to Implement
- `ParkingSlotController.java` — REST controller
- `ParkingSlotService.java` — business logic (availability calculation, status management)
- `ParkingSlotRepository.java` — JPA queries with filters
- `ParkingSlot.java` — JPA entity
- `ParkingSlotRequest.java` / `ParkingSlotResponse.java` — DTOs
- `HelmetController.java`, `HelmetService.java`, `HelmetRepository.java`, `Helmet.java` — same structure for helmets

#### 🎨 React UI Components to Implement
- `pages/parking/ParkingCataloguePage.jsx` — grid/list view of all parking slots
- `pages/helmets/HelmetCataloguePage.jsx` — grid/list view of all helmets
- `components/parking/SlotCard.jsx` — individual slot display card
- `components/parking/SlotFilterBar.jsx` — filter by zone, type, status
- `components/helmets/HelmetCard.jsx` — individual helmet display card
- `components/helmets/HelmetFilterBar.jsx` — filter by size, condition
- Admin forms: Add/Edit Parking Slot modal, Add/Edit Helmet modal (inside `pages/admin/ResourceManagementPage.jsx`)

#### ✅ Minimum HTTP Methods Used
`GET` ✅ `POST` ✅ `PUT` ✅ `PATCH` ✅ `DELETE` ✅ *(exceeds minimum of 4)*

---

### 👤 Member 2 – Booking Workflow & Conflict Checking

**Responsibility:** Implement the complete booking lifecycle for parking slots and helmet borrowings, including the critical **scheduling conflict detection** logic to prevent double-bookings.

#### 📌 Assigned Modules
- **Module B** – Booking Management (Parking Bookings + Helmet Borrowings)

#### 🔧 REST API Endpoints (Backend – Spring Boot)

**Parking Bookings:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 1 | `GET` | `/api/v1/parking-bookings` | Get bookings (own for USER; all for ADMIN, with filters) | 200 |
| 2 | `GET` | `/api/v1/parking-bookings/{id}` | Get single booking details | 200 / 404 |
| 3 | `POST` | `/api/v1/parking-bookings` | Create a new parking booking request | 201 / 409 (conflict) |
| 4 | `PATCH` | `/api/v1/parking-bookings/{id}/approve` | Admin approves a pending booking | 200 |
| 5 | `PATCH` | `/api/v1/parking-bookings/{id}/reject` | Admin rejects with reason | 200 |
| 6 | `PATCH` | `/api/v1/parking-bookings/{id}/cancel` | User/Admin cancels an approved booking | 200 |
| 7 | `GET` | `/api/v1/parking-bookings/check-conflict` | Check slot availability for a time range | 200 |

**Helmet Borrowings:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 8 | `GET` | `/api/v1/helmet-borrowings` | Get borrowings (own for USER; all for ADMIN) | 200 |
| 9 | `GET` | `/api/v1/helmet-borrowings/{id}` | Get single borrowing details | 200 / 404 |
| 10 | `POST` | `/api/v1/helmet-borrowings` | Request to borrow a helmet | 201 |
| 11 | `PATCH` | `/api/v1/helmet-borrowings/{id}/issue` | Admin issues helmet to user | 200 |
| 12 | `PATCH` | `/api/v1/helmet-borrowings/{id}/reject` | Admin rejects borrow request with reason | 200 |
| 13 | `PATCH` | `/api/v1/helmet-borrowings/{id}/return` | Admin marks helmet as returned | 200 |

#### 🗄️ Database Tables Owned
- `parking_bookings`
- `helmet_borrowings`

#### 🧩 Spring Boot Components to Implement
- `ParkingBookingController.java`
- `ParkingBookingService.java` — **must include overlap/conflict check logic:**
  ```java
  // Key query in ParkingBookingRepository
  @Query("SELECT COUNT(b) > 0 FROM ParkingBooking b WHERE b.slot.id = :slotId
          AND b.status = 'APPROVED'
          AND b.startTime < :endTime AND b.endTime > :startTime")
  boolean existsConflictingBooking(Long slotId, LocalDateTime startTime, LocalDateTime endTime);
  ```
- `ParkingBookingRepository.java`
- `ParkingBooking.java` — JPA entity
- `ParkingBookingRequest.java` / `ParkingBookingResponse.java` — DTOs
- `HelmetBorrowingController.java`, `HelmetBorrowingService.java`, `HelmetBorrowingRepository.java`, `HelmetBorrowing.java`
- `BookingConflictException.java` — custom exception for 409 Conflict responses

#### 🎨 React UI Components to Implement
- `pages/parking/MyBookingsPage.jsx` — user's own booking history with status badges
- `pages/parking/AdminBookingsPage.jsx` — admin table with approve/reject/cancel actions
- `components/parking/BookingForm.jsx` — booking request form with date/time pickers
- `pages/helmets/MyBorrowingsPage.jsx` — user's borrow history
- `pages/helmets/AdminBorrowingsPage.jsx` — admin helmet issue/return management
- `components/helmets/BorrowForm.jsx` — helmet borrow request form

#### ✅ Minimum HTTP Methods Used
`GET` ✅ `POST` ✅ `PATCH` ✅ *(minimum 4 endpoints met; 13 total)*

---

### 👤 Member 3 – Incident Tickets, Attachments & Technician Updates

**Responsibility:** Build the full maintenance and incident reporting module — from ticket creation with image evidence, through technician assignment and status updates, to comment threads with ownership rules.

#### 📌 Assigned Modules
- **Module C** – Maintenance & Incident Ticketing

#### 🔧 REST API Endpoints (Backend – Spring Boot)

**Incident Tickets:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 1 | `GET` | `/api/v1/tickets` | List tickets (own for USER; all for ADMIN/TECH, with filters) | 200 |
| 2 | `GET` | `/api/v1/tickets/{id}` | Get full ticket details | 200 / 404 |
| 3 | `POST` | `/api/v1/tickets` | Create new incident ticket | 201 |
| 4 | `PATCH` | `/api/v1/tickets/{id}/assign` | Admin assigns a technician to ticket | 200 |
| 5 | `PATCH` | `/api/v1/tickets/{id}/status` | Technician/Admin updates ticket status + notes | 200 |
| 6 | `PATCH` | `/api/v1/tickets/{id}/reject` | Admin rejects ticket with reason | 200 |
| 7 | `DELETE` | `/api/v1/tickets/{id}` | Admin soft-deletes a ticket | 204 |

**Ticket Attachments:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 8 | `POST` | `/api/v1/tickets/{id}/attachments` | Upload up to 3 image attachments | 201 |
| 9 | `GET` | `/api/v1/tickets/{id}/attachments/{fileId}` | Download/view an attachment | 200 |
| 10 | `DELETE` | `/api/v1/tickets/{id}/attachments/{fileId}` | Delete an attachment | 204 |

**Ticket Comments:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 11 | `GET` | `/api/v1/tickets/{id}/comments` | List all comments on a ticket | 200 |
| 12 | `POST` | `/api/v1/tickets/{id}/comments` | Add a comment (USER/ADMIN/TECH) | 201 |
| 13 | `PUT` | `/api/v1/tickets/{id}/comments/{commentId}` | Edit own comment only | 200 |
| 14 | `DELETE` | `/api/v1/tickets/{id}/comments/{commentId}` | Delete own comment (or any if ADMIN) | 204 |

#### 🗄️ Database Tables Owned
- `incident_tickets`
- `ticket_attachments`
- `ticket_comments`

#### 🧩 Spring Boot Components to Implement
- `IncidentTicketController.java`
- `IncidentTicketService.java` — status transition rules, technician assignment logic
- `FileStorageService.java` — file upload validation (JPEG/PNG only, max 5MB, max 3 files per ticket)
- `IncidentTicketRepository.java`
- `TicketAttachmentRepository.java`
- `TicketCommentRepository.java`
- `IncidentTicket.java`, `TicketAttachment.java`, `TicketComment.java` — JPA entities
- `IncidentTicketRequest.java` / `TicketResponse.java` / `CommentRequest.java` — DTOs
- `FileStorageException.java` — custom exception

#### 🎨 React UI Components to Implement
- `pages/tickets/TicketListPage.jsx` — filterable ticket list for all roles
- `pages/tickets/CreateTicketPage.jsx` — report incident form with resource selector and image upload
- `pages/tickets/TicketDetailPage.jsx` — full ticket view with status, assignee, comments
- `components/tickets/TicketCard.jsx` — compact ticket summary card
- `components/tickets/TicketStatusStepper.jsx` — visual workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- `components/tickets/AttachmentUploader.jsx` — drag-and-drop image upload (max 3 files)
- `components/tickets/CommentThread.jsx` — threaded comments with edit/delete for own comments

#### ✅ Minimum HTTP Methods Used
`GET` ✅ `POST` ✅ `PUT` ✅ `PATCH` ✅ `DELETE` ✅ *(exceeds minimum of 4)*

---

### 👤 Member 4 – Notifications + Role Management + OAuth Integration

**Responsibility:** Implement the complete authentication system (Google OAuth 2.0 + JWT), role-based access control across all modules, the in-app notification system, and user/role management for admins.

#### 📌 Assigned Modules
- **Module D** – Notifications
- **Module E** – Authentication & Authorization

#### 🔧 REST API Endpoints (Backend – Spring Boot)

**Authentication:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 1 | `GET` | `/api/v1/auth/google` | Redirect to Google OAuth consent screen | 302 |
| 2 | `GET` | `/api/v1/auth/callback` | Handle OAuth callback, return JWT token | 200 |
| 3 | `GET` | `/api/v1/auth/me` | Get currently authenticated user's profile | 200 |
| 4 | `POST` | `/api/v1/auth/logout` | Invalidate session/token | 200 |

**Notifications:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 5 | `GET` | `/api/v1/notifications` | Get all notifications for current user | 200 |
| 6 | `GET` | `/api/v1/notifications/unread-count` | Get count of unread notifications | 200 |
| 7 | `PATCH` | `/api/v1/notifications/{id}/read` | Mark a single notification as read | 200 |
| 8 | `PATCH` | `/api/v1/notifications/read-all` | Mark all notifications as read | 200 |
| 9 | `DELETE` | `/api/v1/notifications/{id}` | Delete a notification | 204 |

**User & Role Management:**

| # | Method | Endpoint | Description | HTTP Status |
|---|---|---|---|---|
| 10 | `GET` | `/api/v1/users` | List all users (Admin only) | 200 |
| 11 | `GET` | `/api/v1/users/{id}` | Get user details (Admin only) | 200 / 404 |
| 12 | `PATCH` | `/api/v1/users/{id}/role` | Assign or change user role (Admin only) | 200 |
| 13 | `DELETE` | `/api/v1/users/{id}` | Deactivate a user account (Admin only) | 204 |

#### 🗄️ Database Tables Owned
- `users`
- `roles`
- `user_roles`
- `notifications`

#### 🧩 Spring Boot Components to Implement
- `AuthController.java`
- `AuthService.java` — Google token exchange, user creation/lookup
- `JwtUtil.java` — JWT generation and validation
- `JwtAuthFilter.java` — Spring Security filter (runs on every request)
- `OAuth2SuccessHandler.java` — post-OAuth callback logic
- `SecurityConfig.java` — filter chain, CORS, endpoint security rules, `@PreAuthorize`
- `NotificationController.java`
- `NotificationService.java` — notification creation (called by other modules' services), read/delete logic
- `NotificationRepository.java`
- `UserController.java`, `UserService.java`, `UserRepository.java`
- `User.java`, `Role.java`, `Notification.java` — JPA entities
- `NotificationResponse.java` — DTO

> **Note:** `NotificationService` is used by **all other members' services** to dispatch notifications. Coordinate with Members 1–3 to inject and call this service when booking/ticket status changes occur.

#### 🎨 React UI Components to Implement
- `pages/LoginPage.jsx` — Google OAuth login button and landing page
- `context/AuthContext.jsx` — global auth state (user, token, login/logout)
- `context/NotificationContext.jsx` — global notification state (unread count, fetch)
- `routes/ProtectedRoute.jsx` — redirects unauthenticated users to login
- `routes/AdminRoute.jsx` — redirects non-admin users to dashboard
- `components/common/NotificationBell.jsx` — header bell icon with unread badge
- `pages/notifications/NotificationsPage.jsx` — full notification list with mark-read/delete
- `pages/admin/UserManagementPage.jsx` — admin table to view users and change roles
- `pages/admin/AdminDashboardPage.jsx` — summary cards (total bookings, open tickets, etc.)

#### ✅ Minimum HTTP Methods Used
`GET` ✅ `POST` ✅ `PATCH` ✅ `DELETE` ✅ *(exceeds minimum of 4)*

---

### 📊 Team Contribution Summary Table

> Include this table in your **Final Report** contribution section.

| Component | Member 1 | Member 2 | Member 3 | Member 4 |
|---|---|---|---|---|
| **Parking Slot CRUD** | ✅ Primary | — | — | — |
| **Helmet Inventory CRUD** | ✅ Primary | — | — | — |
| **Parking Booking Workflow** | — | ✅ Primary | — | — |
| **Booking Conflict Check** | — | ✅ Primary | — | — |
| **Helmet Borrowing Workflow** | — | ✅ Primary | — | — |
| **Incident Ticket CRUD** | — | — | ✅ Primary | — |
| **File Upload (Attachments)** | — | — | ✅ Primary | — |
| **Comment Thread** | — | — | ✅ Primary | — |
| **Technician Assignment** | — | — | ✅ Primary | — |
| **OAuth 2.0 / JWT Auth** | — | — | — | ✅ Primary |
| **Role-Based Access Control** | — | — | — | ✅ Primary |
| **Notification System** | — | — | — | ✅ Primary |
| **User Role Management** | — | — | — | ✅ Primary |
| **DB: parking_slots, helmets** | ✅ | — | — | — |
| **DB: parkingbookings, helmetborrowings** | — | ✅ | — | — |
| **DB: tickets, attachments, comments** | — | — | ✅ | — |
| **DB: users, roles, notifications** | — | — | — | ✅ |

---

## 9. React Frontend Structure

```
smart-campus-frontend/
├── index.html                     ← Vite HTML entry point (root)
├── vite.config.js                 ← Vite configuration
├── src/
│   ├── main.jsx                   ← Entry point (Vite)
│   ├── App.jsx                    ← Route definitions
│   ├── api/
│   │   ├── axiosInstance.js       ← Base Axios config with JWT interceptor
│   │   ├── authApi.js
│   │   ├── parkingApi.js
│   │   ├── helmetApi.js
│   │   ├── bookingApi.js
│   │   ├── ticketApi.js
│   │   └── notificationApi.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        ← Current user, login/logout
│   │   └── NotificationContext.jsx← Unread count, fetch notifications
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBooking.js
│   │   └── useNotifications.js
│   │
│   ├── routes/
│   │   ├── ProtectedRoute.jsx     ← Redirect to login if not authed
│   │   └── AdminRoute.jsx         ← Redirect if not ADMIN
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── ConfirmModal.jsx
│   │   ├── parking/
│   │   │   ├── SlotCard.jsx
│   │   │   ├── SlotFilterBar.jsx
│   │   │   └── BookingForm.jsx
│   │   ├── helmets/
│   │   │   ├── HelmetCard.jsx
│   │   │   ├── HelmetFilterBar.jsx
│   │   │   └── BorrowForm.jsx
│   │   └── tickets/
│   │       ├── TicketCard.jsx
│   │       ├── TicketStatusStepper.jsx
│   │       ├── AttachmentUploader.jsx
│   │       └── CommentThread.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── parking/
│   │   │   ├── ParkingCataloguePage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   └── AdminBookingsPage.jsx
│   │   ├── helmets/
│   │   │   ├── HelmetCataloguePage.jsx
│   │   │   ├── MyBorrowingsPage.jsx
│   │   │   └── AdminBorrowingsPage.jsx
│   │   ├── tickets/
│   │   │   ├── TicketListPage.jsx
│   │   │   ├── TicketDetailPage.jsx
│   │   │   └── CreateTicketPage.jsx
│   │   ├── notifications/
│   │   │   └── NotificationsPage.jsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.jsx
│   │       ├── UserManagementPage.jsx
│   │       └── ResourceManagementPage.jsx
│   │
│   └── utils/
│       ├── dateFormatter.js
│       ├── roleHelper.js
│       └── constants.js
│
├── .env
└── package.json
```

### Key Page → Role Mapping

| Page | USER | ADMIN | TECHNICIAN |
|---|---|---|---|
| Login Page | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Parking Catalogue | ✅ | ✅ | ✅ |
| My Bookings | ✅ | ✅ | — |
| Admin Bookings | — | ✅ | — |
| Helmet Catalogue | ✅ | ✅ | ✅ |
| My Borrowings | ✅ | ✅ | — |
| Admin Borrowings | — | ✅ | — |
| Create Ticket | ✅ | ✅ | — |
| Ticket Detail | ✅ | ✅ | ✅ |
| Admin Dashboard | — | ✅ | — |
| User Management | — | ✅ | — |
| Resource Management | — | ✅ | — |
| Notifications | ✅ | ✅ | ✅ |

---

## 10. Spring Boot Backend Structure

```
smart-campus-api/
├── src/main/java/com/sliit/smartcampus/
│   ├── SmartCampusApplication.java
│   │
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   ├── JwtConfig.java
│   │   └── FileStorageConfig.java
│   │
│   ├── security/
│   │   ├── JwtAuthFilter.java
│   │   ├── JwtUtil.java
│   │   ├── OAuth2SuccessHandler.java
│   │   └── CustomUserDetailsService.java
│   │
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java     ← @ControllerAdvice
│   │   ├── ResourceNotFoundException.java
│   │   ├── BookingConflictException.java
│   │   ├── UnauthorizedException.java
│   │   └── FileStorageException.java
│   │
│   ├── entity/
│   │   ├── User.java
│   │   ├── Role.java
│   │   ├── ParkingSlot.java
│   │   ├── Helmet.java
│   │   ├── ParkingBooking.java
│   │   ├── HelmetBorrowing.java
│   │   ├── IncidentTicket.java
│   │   ├── TicketAttachment.java
│   │   ├── TicketComment.java
│   │   └── Notification.java
│   │
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ParkingSlotRepository.java
│   │   ├── HelmetRepository.java
│   │   ├── ParkingBookingRepository.java
│   │   ├── HelmetBorrowingRepository.java
│   │   ├── IncidentTicketRepository.java
│   │   ├── TicketAttachmentRepository.java
│   │   ├── TicketCommentRepository.java
│   │   └── NotificationRepository.java
│   │
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ParkingSlotService.java
│   │   ├── HelmetService.java
│   │   ├── ParkingBookingService.java
│   │   ├── HelmetBorrowingService.java
│   │   ├── IncidentTicketService.java
│   │   ├── FileStorageService.java
│   │   ├── NotificationService.java
│   │   └── UserService.java
│   │
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ParkingSlotController.java
│   │   ├── HelmetController.java
│   │   ├── ParkingBookingController.java
│   │   ├── HelmetBorrowingController.java
│   │   ├── IncidentTicketController.java
│   │   ├── NotificationController.java
│   │   └── UserController.java
│   │
│   └── dto/
│       ├── request/
│       │   ├── ParkingSlotRequest.java
│       │   ├── HelmetRequest.java
│       │   ├── ParkingBookingRequest.java
│       │   ├── HelmetBorrowingRequest.java
│       │   ├── IncidentTicketRequest.java
│       │   └── CommentRequest.java
│       └── response/
│           ├── ApiResponse.java
│           ├── ParkingSlotResponse.java
│           ├── HelmetResponse.java
│           ├── BookingResponse.java
│           ├── TicketResponse.java
│           └── NotificationResponse.java
│
├── src/main/resources/
│   ├── application.yml
│   └── application-dev.yml
│
├── src/test/java/com/sliit/smartcampus/
│   ├── service/
│   │   ├── ParkingBookingServiceTest.java
│   │   ├── HelmetBorrowingServiceTest.java
│   │   └── IncidentTicketServiceTest.java
│   └── controller/
│       ├── ParkingSlotControllerTest.java
│       └── AuthControllerTest.java
│
├── pom.xml
└── README.md
```

### `application.yml` (Template)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smart_campus_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate.dialect: org.hibernate.dialect.MySQL8Dialect
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: email, profile

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000 # 24 hours

file:
  upload-dir: ./uploads

server:
  port: 8080
```

---

## 11. Security Design

### Authentication Flow

```
User clicks "Login with Google"
        ↓
React redirects to → Spring Boot /auth/google
        ↓
Spring Boot redirects to → Google OAuth Consent Screen
        ↓
User approves → Google returns auth code to /auth/callback
        ↓
Spring Boot exchanges code for Google ID token
        ↓
Spring Boot creates/updates User in DB, generates JWT
        ↓
JWT returned to React frontend → stored in memory/httpOnly cookie
        ↓
React attaches JWT in Authorization: Bearer <token> header on every API call
        ↓
Spring Security JwtAuthFilter validates token on each request
```

### Authorization Rules Summary

| Endpoint Pattern | USER | ADMIN | TECHNICIAN |
|---|---|---|---|
| GET /parking-slots | ✅ | ✅ | ✅ |
| POST /parking-slots | ❌ | ✅ | ❌ |
| POST /parking-bookings | ✅ | ✅ | ❌ |
| PATCH /parking-bookings/{id}/approve | ❌ | ✅ | ❌ |
| POST /helmets | ❌ | ✅ | ❌ |
| PATCH /helmet-borrowings/{id}/issue | ❌ | ✅ | ❌ |
| POST /tickets | ✅ | ✅ | ❌ |
| PATCH /tickets/{id}/status | ❌ | ✅ | ✅ |
| PATCH /tickets/{id}/assign | ❌ | ✅ | ❌ |
| GET /users | ❌ | ✅ | ❌ |

### Input Validation Rules
- All `@RequestBody` objects annotated with `@Valid` and JSR-380 annotations (`@NotNull`, `@Size`, `@Pattern`).
- Vehicle numbers validated against regex pattern.
- Date ranges validated: `start_time` must be before `end_time` and in the future.
- File uploads: MIME type must be `image/jpeg` or `image/png`; max size 5MB per file, max 3 files per ticket.

### Error Response Format
```json
{
  "timestamp": "2026-03-28T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "start_time must be before end_time",
  "path": "/api/v1/parking-bookings"
}
```

---

## 12. GitHub Actions CI/CD Workflow

### Repository Naming
`it3030-paf-2026-smart-campus-groupXX`

### Workflow File: `.github/workflows/build-and-test.yml`

```yaml
name: Smart Campus CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-build-test:
    name: Spring Boot Build & Test
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: smart_campus_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cache Maven packages
        uses: actions/cache@v4
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}

      - name: Build and Test (Spring Boot)
        working-directory: ./smart-campus-api
        env:
          DB_USERNAME: root
          DB_PASSWORD: root
          JWT_SECRET: test-secret-key-for-ci
          GOOGLE_CLIENT_ID: test-client-id
          GOOGLE_CLIENT_SECRET: test-client-secret
        run: mvn clean verify

  frontend-build:
    name: Vite React Build
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: ./smart-campus-frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./smart-campus-frontend
        run: npm ci

      - name: Build Vite App
        working-directory: ./smart-campus-frontend
        env:
          VITE_API_BASE_URL: http://localhost:8080/api/v1
        run: npm run build
```

### Branch Strategy
```
main       ← Production-ready, protected
develop    ← Integration branch
feature/*  ← Each member's feature branches (e.g., feature/parking-booking)
```

### Commit Convention
```
feat(parking): add conflict check for overlapping bookings
fix(helmet): correct status transition validation
docs(readme): update setup instructions
test(ticket): add unit tests for ticket service
```

---

## 13. Testing Strategy

### Unit Tests (JUnit 5 + Mockito)

Each member must write unit tests for their service layer:

```java
// Example: ParkingBookingServiceTest.java
@ExtendWith(MockitoExtension.class)
class ParkingBookingServiceTest {

    @Mock ParkingBookingRepository bookingRepo;
    @Mock ParkingSlotRepository slotRepo;
    @Mock NotificationService notificationService;

    @InjectMocks ParkingBookingService bookingService;

    @Test
    void shouldThrowExceptionWhenBookingConflictExists() {
        // Given
        when(bookingRepo.existsConflictingBooking(...)).thenReturn(true);
        // When/Then
        assertThrows(BookingConflictException.class,
            () -> bookingService.createBooking(request, userId));
    }

    @Test
    void shouldApproveBookingSuccessfully() { ... }

    @Test
    void shouldRejectBookingWithReason() { ... }
}
```

### Integration Tests (Spring Boot Test)

```java
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ParkingSlotControllerTest {

    @Autowired MockMvc mockMvc;

    @Test
    void shouldReturn200WhenFetchingAllSlots() throws Exception {
        mockMvc.perform(get("/api/v1/parking-slots")
                .header("Authorization", "Bearer " + testJwt))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.content").isArray());
    }
}
```

### Postman Collection (API Testing Evidence)

Create a Postman collection with:
- Environment variables: `base_url`, `jwt_token`
- Folders per module: Auth, Parking Slots, Helmets, Bookings, Tickets, Notifications
- Tests on each request checking status codes and response body fields
- Export as `SmartCampus_Postman_Collection.json` and include in the report

### Test Coverage Target
| Module | Unit Tests | Integration Tests |
|---|---|---|
| Parking Slots | CRUD operations | Controller endpoints |
| Helmets | CRUD operations | Controller endpoints |
| Parking Bookings | Conflict check, status transitions | Booking flow |
| Helmet Borrowings | Availability check, status transitions | Borrow flow |
| Incident Tickets | File validation, comment ownership | Ticket lifecycle |
| Notifications | Trigger dispatch | — |

---

## 14. Setup & Installation Guide

### Prerequisites
- Java 17+
- Node.js 20+
- MySQL 8.x
- Maven 3.9+
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/it3030-paf-2026-smart-campus-groupXX.git
cd it3030-paf-2026-smart-campus-groupXX
```

### Step 2: Create MySQL Database
```sql
CREATE DATABASE smart_campus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Configure Backend Environment
```bash
cd smart-campus-api
cp src/main/resources/application.yml.example src/main/resources/application.yml
# Edit application.yml with your DB credentials, Google OAuth credentials, and JWT secret
```

### Step 4: Run Backend
```bash
mvn spring-boot:run
# API available at http://localhost:8080
```

### Step 5: Configure Frontend Environment
```bash
cd ../smart-campus-frontend
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Step 6: Run Frontend
```bash
npm install
npm run dev
# App available at http://localhost:5173
```

### Step 7: Access the App
1. Go to `http://localhost:5173`
2. Click **Login with Google**
3. Complete OAuth flow
4. First user can be manually set as ADMIN via direct DB update:
   ```sql
   INSERT INTO user_roles (user_id, role_id) VALUES (1, 2); -- role_id 2 = ADMIN
   ```

---

## 15. Optional Innovation Features

These features add extra value and may earn bonus marks:

### 🔲 QR Code Check-in for Parking Bookings
- Generate a QR code for each approved booking
- Scan at entry to mark `CHECKED_IN` status
- Library: `qrcode` (npm) for React, ZXing for Java

### 📊 Admin Analytics Dashboard
- Top 5 most-booked parking zones
- Peak booking hours (bar chart)
- Helmet utilization rate
- Ticket resolution time average
- Library: `recharts` or `Chart.js` in React

### ⏱ Service-Level Timer for Tickets
- Track: time-to-first-response, time-to-assignment, time-to-resolution
- Display SLA status (ON_TRACK / AT_RISK / BREACHED) on ticket cards

### 🔔 Notification Preferences
- Users can enable/disable specific notification types
- Stored in a `notification_preferences` table per user

---

## 📝 Submission Checklist

- [ ] GitHub repository is public and named correctly: `it3030-paf-2026-smart-campus-groupXX`
- [ ] README.md includes setup steps, team members, and module ownership
- [ ] Commit history shows gradual, individual contributions (no bulk commits)
- [ ] GitHub Actions workflow passes (build + test green)
- [ ] MySQL schema is finalized and all entities are implemented
- [ ] All Module A–E minimum requirements are implemented
- [ ] Each member has ≥ 4 REST API endpoints using different HTTP methods
- [ ] Role-based access control enforced on both API and React routes
- [ ] OAuth 2.0 Google login works end-to-end
- [ ] Image upload for tickets works with type/size validation
- [ ] Notification panel functional in React UI
- [ ] Postman collection exported and included
- [ ] Final PDF report: `IT3030_PAF_Assignment_2026_GroupXX.pdf`
- [ ] Report contains: requirements, architecture diagrams, endpoint list, testing evidence, contribution summary
- [ ] No `node_modules`, `target`, or `.env` files in submission ZIP

---
