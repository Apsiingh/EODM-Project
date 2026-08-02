# Enterprise OCR Platform - Deployment & Monorepo Structure Guide

## 1. Executive Summary & Tech Stack Overview

The **Enterprise OCR Platform** is designed as an enterprise-grade monorepo containing microservices built on modern frameworks, containerized with Docker, orchestrated with Kubernetes, and monitored using Prometheus & Grafana.

| Layer | Technology Stack | Description |
| --- | --- | --- |
| **Frontend** | React 19, TypeScript, Mantine UI, Tailwind CSS, Vite | Responsive UI for document management, OCR editing, and validation workflows |
| **API Gateway** | Spring Cloud Gateway (Java 21) | Single Entrypoint, JWT validation, Rate limiting, Routing, Request Logging |
| **Backend Services** | Spring Boot 3 (Java 21) | Domain-driven microservices for Auth, Users, Documents, Validation, Workflow, ERP, Audit |
| **OCR Engine** | Golang (1.22) + Gin + Tesseract OCR | High-throughput asynchronous OCR worker consuming PDF processing jobs |
| **Message Queue** | RabbitMQ | Asynchronous event broker between Document Service, OCR Service, and Validation |
| **Cache & In-Memory** | Redis | Session state, token blacklisting, OCR job caching, and rate limiting |
| **Relational Database** | PostgreSQL 16 | Persistence for users, documents, workflow states, ERP sync logs, and audit trails |
| **Object File Storage** | MinIO / AWS S3 | Encrypted storage for original uploaded PDF files, rendered images, and versioning |
| **Monitoring & Metrics** | Prometheus + Grafana | System telemetry, CPU/Memory metrics, request latencies, and queue depth metrics |
| **Reverse Proxy** | NGINX | Ingress routing, SSL termination, static asset compression |
| **Containerization** | Docker & Docker Compose / Kubernetes | Standardized environment isolation and scalability |

---

## 2. Monorepo Directory & Sub-Folder Structure

Below is the complete monorepo directory tree explaining the role of each directory, sub-folder, and file:

```
c:\Apsingh\EODM Project\
├── backend/                                    # Root Backend Directory
│   ├── pom.xml                                 # Master Maven Parent POM (manages Java 21 & Spring Boot 3 dependencies)
│   ├── gateway-service/                        # Spring Cloud API Gateway (Port 8080)
│   │   ├── src/main/java/com/ocr/gateway/
│   │   │   ├── config/                         # Route definitions, CORS, RateLimiter bean configs
│   │   │   ├── filters/                        # Global JWT validation filters & Request Logging filters
│   │   │   ├── security/                       # Spring Security WebFlux authentication setup
│   │   │   └── routes/                         # Dynamic routing rules mapping /api/v1/* endpoints
│   │   └── Dockerfile                          # Gateway container build file
│   ├── auth-service/                           # Authentication & Security Microservice (Port 8081)
│   │   ├── src/main/java/com/ocr/auth/
│   │   │   ├── controller/                     # Login, Registration, Token Refresh endpoints
│   │   │   ├── service/                        # Password hashing, JWT token generation logic
│   │   │   ├── repository/                     # JPA repositories for users, roles, permissions, refresh_tokens
│   │   │   ├── entity/                         # Database entities (User, Role, Permission, RefreshToken)
│   │   │   ├── security/                       # Spring Security configuration
│   │   │   ├── jwt/                            # Token parser and validator components
│   │   │   └── config/                         # App bean configurations
│   │   └── Dockerfile
│   ├── user-service/                           # User & Team Management Microservice (Port 8082)
│   │   ├── src/main/java/com/ocr/user/
│   │   │   ├── controller/                     # User CRUD, Department, Team management APIs
│   │   │   ├── service/                        # User business logic & profile management
│   │   │   ├── repository/                     # Repositories for users, departments, designations, teams
│   │   │   ├── entity/                         # DB entities for departments, teams, user profiles
│   │   │   └── dto/                            # Data Transfer Objects for Request/Response payloads
│   │   └── Dockerfile
│   ├── document-service/                       # PDF Ingestion & File Storage Microservice (Port 8083)
│   │   ├── src/main/java/com/ocr/document/
│   │   │   ├── controller/                     # File upload, metadata retrieval, document versioning APIs
│   │   │   ├── service/                        # File storage management & RabbitMQ producer service
│   │   │   ├── repository/                     # DB access for documents, document_versions, attachments
│   │   │   ├── entity/                         # Document entity models
│   │   │   ├── storage/                        # MinIO S3 object storage connector
│   │   │   ├── pdf/                            # PDF parsing & rendering utilities
│   │   │   └── upload/                         # Multipart file handler & validator
│   │   └── Dockerfile
│   ├── ocr-service/                            # Golang Asynchronous OCR Processing Engine (Port 8085)
│   │   ├── go.mod                              # Go module dependency file
│   │   ├── cmd/main.go                         # Go service entrypoint (Gin HTTP + RabbitMQ Consumer)
│   │   ├── internal/
│   │   │   ├── api/handlers/                   # HTTP Handlers for health checks and manually triggered OCR
│   │   │   ├── services/ocr/                   # Core OCR pipeline coordinator
│   │   │   ├── pdf/                            # PDF to Image conversion module (poppler / pdf2image)
│   │   │   ├── image/                          # Image preprocessing & enhancement (deskew, binarization)
│   │   │   ├── tesseract/                      # Tesseract OCR engine wrapper
│   │   │   ├── redis/                          # Redis client for caching OCR JSON outputs
│   │   │   ├── rabbitmq/                       # RabbitMQ worker subscriber consuming OCR queues
│   │   │   ├── database/                       # PostgreSQL driver & queries
│   │   │   └── config/                         # Environment & application configuration loader
│   │   └── Dockerfile
│   ├── validation-service/                     # Business Rules Validation Engine (Port 8084)
│   │   ├── src/main/java/com/ocr/validation/
│   │   │   ├── controller/                     # Document validation trigger & result APIs
│   │   │   ├── rules/                          # Rule implementations (Vendor Match, PO Match, GST Check, Duplicate Check, Amount Check)
│   │   │   ├── service/                        # Validation orchestration service
│   │   │   ├── repository/                     # Access for validation_results tables
│   │   │   └── entity/                         # Validation result entities
│   │   └── Dockerfile
│   ├── workflow-service/                       # Multi-stage Approval State Machine (Port 8086)
│   │   ├── src/main/java/com/ocr/workflow/
│   │   │   ├── controller/                     # Approval queue & state transition APIs
│   │   │   ├── approval/                       # Manager & Finance approval handlers
│   │   │   ├── statemachine/                   # Workflow state machine definitions (Upload -> OCR -> Validation -> Manager -> Finance -> ERP)
│   │   │   ├── service/                        # Workflow state management logic
│   │   │   └── repository/                     # Access for workflow & workflow_history tables
│   │   └── Dockerfile
│   ├── erp-connector/                          # ERP Integration Adapter (Port 8087)
│   │   ├── src/main/java/com/ocr/erp/
│   │   │   ├── controller/                     # Sync trigger & status tracking APIs
│   │   │   ├── mapper/                         # JSON to ERP payload transformer
│   │   │   ├── service/                        # ERP synchronization & retry queue manager
│   │   │   ├── sap/                            # SAP BAPI / OData integration module
│   │   │   ├── oracle/                         # Oracle Financials REST integration module
│   │   │   └── dynamics/                       # Microsoft Dynamics 365 Business Central adapter
│   │   └── Dockerfile
│   ├── erp-simulator/                          # SAP & Oracle Environment Simulator (Port 8088)
│   │   ├── src/main/java/com/ocr/erpsim/
│   │   │   ├── controller/                     # Mock ERP endpoints for Vendor, PO, Invoice, Payment, Inventory
│   │   │   ├── vendor/                         # Mock vendor database handlers
│   │   │   ├── po/                             # Mock PO verification endpoints
│   │   │   ├── invoice/                        # Mock invoice posting endpoints
│   │   │   ├── payment/                        # Mock payment status endpoints
│   │   │   ├── inventory/                      # Mock inventory item lookup
│   │   │   └── repository/                     # In-memory mock repositories
│   │   └── Dockerfile
│   ├── notification-service/                   # Real-time Notification Engine (Port 8089)
│   │   ├── src/main/java/com/ocr/notification/
│   │   │   ├── email/                          # SMTP / JavaMail sender
│   │   │   ├── sms/                            # SMS Gateway connector
│   │   │   ├── websocket/                      # STOMP / WebSocket handler for UI live alerts
│   │   │   └── service/                        # Notification dispatcher logic
│   │   └── Dockerfile
│   ├── audit-service/                          # Compliance & Audit Trail Service (Port 8090)
│   │   ├── src/main/java/com/ocr/audit/
│   │   │   ├── controller/                     # Audit log query & export APIs
│   │   │   ├── repository/                     # Access for audit_logs table
│   │   │   └── service/                        # Async log persistence listener
│   │   └── Dockerfile
│   ├── report-service/                         # Dashboard & Analytics Service (Port 8091)
│   │   ├── src/main/java/com/ocr/report/
│   │   │   ├── dashboard/                      # Dashboard KPI metrics endpoints
│   │   │   ├── analytics/                      # Processing throughput & error analysis logic
│   │   │   ├── export/                         # PDF / Excel report generator
│   │   │   └── charts/                         # Aggregated chart data producers
│   │   └── Dockerfile
│   └── common-library/                         # Shared Java Library (NEXUS Dependency)
│       └── src/main/java/com/ocr/common/
│           ├── dto/                            # Shared data transfer objects
│           ├── exception/                      # Global exception handlers & custom errors
│           ├── utils/                          # Common date, string, & crypto helpers
│           ├── security/                       # Common security annotations & utilities
│           └── constants/                      # System constants, enums, & error codes
│
├── frontend/                                   # Root Frontend Directory (React 19 + TypeScript)
│   ├── package.json                            # Node package definition & dependencies
│   ├── vite.config.js                          # Vite bundler configuration
│   ├── tailwind.config.js                      # Tailwind CSS design system rules
│   ├── postcss.config.js                       # CSS post-processing pipeline
│   ├── index.html                              # Root HTML entrypoint
│   ├── public/                                 # Public static assets (favicons, manifest)
│   └── src/                                    # Application source code
│       ├── assets/                             # Logos, branding images, vector graphics
│       ├── components/                         # Atomic & Feature UI Components
│       │   ├── tables/                         # Custom data tables with pagination & filters
│       │   ├── forms/                          # Invoice & User input forms
│       │   ├── charts/                         # Analytics charts (Recharts / Chart.js)
│       │   ├── cards/                          # Summary KPI metric cards
│       │   ├── sidebar/                        # Collapsible navigation drawer
│       │   ├── navbar/                         # Header bar with user profile & notifications
│       │   ├── modal/                          # Dynamic modal dialogs
│       │   ├── buttons/                        # Styled button components
│       │   ├── upload/                         # Drag-and-drop PDF uploader
│       │   ├── pdf-viewer/                     # Interactive PDF document previewer
│       │   ├── ocr-editor/                     # OCR JSON bounding-box editor
│       │   ├── approval/                       # Approval decision action bar
│       │   └── notifications/                  # Toast & popover alert components
│       ├── layouts/                            # Main Layout, Auth Layout, Dashboard Shells
│       ├── pages/                              # Screen Views
│       │   ├── auth/                           # Login & Forgot Password screens
│       │   ├── dashboard/                      # Main KPI Dashboard view
│       │   ├── documents/                      # Document Library & Upload view
│       │   ├── ocr/                            # OCR Review & Processing view
│       │   ├── validation/                     # Validation Exception Queue
│       │   ├── workflow/                       # Approval Workflow state view
│       │   ├── erp/                            # ERP Sync status & logs
│       │   ├── reports/                        # Analytics & Export reports
│       │   ├── audit/                          # Compliance Audit log view
│       │   ├── notifications/                  # Notification Center
│       │   ├── users/                          # User & Department management
│       │   ├── admin/                          # System Configuration view
│       │   └── settings/                       # User settings & preferences
│       ├── routes/                             # React Router v6 route configurations
│       ├── services/                           # Axios API service integrations
│       │   ├── auth.ts                         # Auth endpoints interface
│       │   ├── user.ts                         # User management endpoints
│       │   ├── document.ts                     # Document & Upload endpoints
│       │   ├── ocr.ts                          # OCR trigger & result endpoints
│       │   ├── validation.ts                   # Validation rule trigger endpoints
│       │   ├── workflow.ts                     # Approval workflow endpoints
│       │   ├── erp.ts                          # ERP Sync endpoints
│       │   └── report.ts                       # Dashboard & Analytics endpoints
│       ├── redux/                              # Redux Toolkit store & slices
│       │   ├── auth/                           # Auth state slice
│       │   ├── document/                       # Document list state slice
│       │   ├── workflow/                       # Workflow state slice
│       │   ├── ocr/                            # OCR state slice
│       │   ├── validation/                     # Validation queue state slice
│       │   └── notification/                   # Live alerts state slice
│       ├── hooks/                              # Custom React hooks (useAuth, useNotification)
│       ├── types/                              # TypeScript interfaces & type definitions
│       ├── utils/                              # Formatter & helper functions
│       ├── theme/                              # Mantine & Tailwind theme tokens
│       ├── contexts/                           # React Context providers
│       └── constants/                          # App route strings & API endpoints constants
│
├── infrastructure/                             # Infrastructure & DevOps Assets
│   ├── docker/
│   │   └── docker-compose.yml                  # Docker Compose for PostgreSQL, Redis, RabbitMQ, MinIO, Prometheus, Grafana, Nginx
│   ├── kubernetes/                             # Helm charts & K8s deployment manifests
│   ├── grafana/                                # Grafana dashboards & datasource definitions
│   ├── prometheus/                             # Prometheus scrapers configuration (prometheus.yml)
│   ├── postgres/                               # DB initialization SQL scripts & schema migration
│   ├── redis/                                  # Redis configuration files (redis.conf)
│   ├── rabbitmq/                               # RabbitMQ definitions & queue topography
│   └── nginx/                                  # Reverse proxy & API Gateway NGINX rules (nginx.conf)
│
└── documents/                                  # Technical & Architectural Documentation
    ├── HLD/
    │   └── HLD.md                              # High Level Architecture & Data Flow Diagram specs
    ├── LLD/                                    # Low Level Component & Class Specifications
    ├── API/                                    # OpenAPI / Swagger Specification files
    ├── ERD/
    │   └── ERD.md                              # Complete Database Tables & Schema Specifications
    ├── DFD/                                    # Data Flow Diagrams (Level 0, Level 1, Level 2, Level 3)
    │   ├── EOPM_level_0_DFD.png
    │   ├── EOMP_level_1_DFD.png
    │   ├── EOMP_level_2_DFD.png
    │   └── EOMP_level_3_DFD.png
    ├── UML/                                    # UML Sequence Diagrams & Class Diagrams
    ├── SRS/                                    # Software Requirements Specifications
    ├── UserGuide/                              # User Manuals & Frontend Design Guides
    └── DeploymentGuide/
        └── DeploymentGuide.md                  # System Deployment & Architecture Documentation
```

---

## 3. Microservices Network & Port Mapping

| Service Name | Technology | Container Port | Host Port | Endpoint / Purpose |
| --- | --- | --- | --- | --- |
| **API Gateway** | Java 21 / Spring Cloud | 8080 | 8080 | `http://localhost:8080/api/v1/*` |
| **Auth Service** | Java 21 / Spring Boot | 8081 | 8081 | `http://localhost:8081/api/auth/*` |
| **User Service** | Java 21 / Spring Boot | 8082 | 8082 | `http://localhost:8082/api/users/*` |
| **Document Service** | Java 21 / Spring Boot | 8083 | 8083 | `http://localhost:8083/api/documents/*` |
| **Validation Service** | Java 21 / Spring Boot | 8084 | 8084 | `http://localhost:8084/api/validation/*` |
| **OCR Service** | Golang 1.22 + Gin | 8085 | 8085 | `http://localhost:8085/health` & RabbitMQ Consumer |
| **Workflow Service** | Java 21 / Spring Boot | 8086 | 8086 | `http://localhost:8086/api/workflow/*` |
| **ERP Connector** | Java 21 / Spring Boot | 8087 | 8087 | `http://localhost:8087/api/erp/*` |
| **ERP Simulator** | Java 21 / Spring Boot | 8088 | 8088 | `http://localhost:8088/api/erpsim/*` |
| **Notification Service** | Java 21 / Spring Boot | 8089 | 8089 | `http://localhost:8089/api/notifications/*` |
| **Audit Service** | Java 21 / Spring Boot | 8090 | 8090 | `http://localhost:8090/api/audit/*` |
| **Report Service** | Java 21 / Spring Boot | 8091 | 8091 | `http://localhost:8091/api/reports/*` |
| **PostgreSQL Database** | PostgreSQL 16 | 5432 | 5432 | `jdbc:postgresql://localhost:5432/enterprise_ocr` |
| **Redis Cache** | Redis 7 Alpine | 6379 | 6379 | `redis://localhost:6379` |
| **RabbitMQ Queue** | RabbitMQ 3 Management | 5672 / 15672 | 5672 / 15672 | Management Console: `http://localhost:15672` |
| **MinIO Storage** | MinIO Object Storage | 9000 / 9001 | 9000 / 9001 | Console: `http://localhost:9001` |
| **Prometheus** | Prometheus TSDB | 9090 | 9090 | `http://localhost:9090` |
| **Grafana** | Grafana Dashboard | 3000 | 3000 | `http://localhost:3000` |
| **NGINX Proxy** | NGINX Alpine | 80 / 443 | 80 / 443 | `http://localhost:80` |

---

## 4. Local Deployment Instructions

### Prerequisites
- **Docker Desktop** installed with Docker Compose v2+
- **Node.js** v20+ and **npm** v10+
- **JDK 21** & **Maven** 3.9+
- **Go** 1.22+ (for local OCR engine development)

### Step 1: Start Core Infrastructure Dependencies
Navigate to `infrastructure/docker` and bring up the container stack:
```bash
cd infrastructure/docker
docker-compose up -d postgres redis rabbitmq minio prometheus grafana nginx
```

### Step 2: Start Frontend Application
Navigate to `frontend/`, install dependencies and run Vite dev server:
```bash
cd ../../frontend
npm install
npm run dev
```
The frontend will be accessible at `http://localhost:5173`.

### Step 3: Run Golang OCR Engine
Navigate to `backend/ocr-service` and launch the OCR Gin server:
```bash
cd ../backend/ocr-service
go run cmd/main.go
```
The OCR engine will start on `http://localhost:8085` and connect to RabbitMQ.

### Step 4: Build Java Microservices
Build all Java backend services from the master POM:
```bash
cd ../
mvn clean install -DskipTests
```

---

## 5. Verification Checklist

- [x] Master monorepo directory layout (`backend`, `frontend`, `infrastructure`, `documents`)
- [x] Java Microservices packages initialized (`gateway`, `auth`, `user`, `document`, `validation`, `workflow`, `erp`, `erpsim`, `notification`, `audit`, `report`, `common`)
- [x] Go OCR Service structure with `go.mod` and `cmd/main.go`
- [x] React 19 Frontend structure with Mantine/Tailwind, pages, components, services, and Redux slices
- [x] Docker Compose stack definition (`docker-compose.yml`)
- [x] Architecture & Database documentation (`HLD.md`, `ERD.md`, `DeploymentGuide.md`, DFD images)
