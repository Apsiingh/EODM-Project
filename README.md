# Enterprise Optical Document Management (EODM) Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3.2](https://img.shields.io/badge/Spring_Boot-3.2.2-green.svg)](https://spring.io/projects/spring-boot)
[![Go 1.22](https://img.shields.io/badge/Go-1.22-00ADD8.svg)](https://golang.org/)
[![React 18/19](https://img.shields.io/badge/React-18/19-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Supported-326CE5.svg)](https://kubernetes.io/)

---

## 📌 Executive Summary

The **Enterprise Optical Document Management (EODM) Platform** is an enterprise-grade, distributed microservices solution designed to automate end-to-end document processing, Optical Character Recognition (OCR), business validation rules execution, approval workflows, and ERP enterprise integration (SAP, Oracle, Dynamics).

It handles high-volume PDF document ingestion (invoices, purchase orders, shipping manifests), performs asynchronous OCR extraction using Go and Tesseract, executes 5-stage automated business validations, facilitates human-in-the-loop review/approval, and synchronizes validated data directly into target ERP environments.

---

## ✨ Key Features & Capabilities

- 📄 **Multi-Format Document Ingestion**: Secure PDF and image uploads with versioning, metadata indexing, and encrypted MinIO S3 object storage.
- ⚡ **Asynchronous High-Throughput OCR Pipeline**: Golang & Tesseract powered OCR service processing incoming document queues via RabbitMQ messaging with image enhancement (deskewing, binarization).
- ✔️ **Automated Business Validation Engine**: Multi-tiered rules engine performing:
  - Vendor verification & PO matching
  - GST / Tax identification validation
  - Duplicate document check
  - Mathematical amount and line-item auditing
- 🔄 **Human-in-the-Loop Workflow Engine**: State machine orchestrating document states (`UPLOAD` → `OCR_PROCESSING` → `VALIDATION` → `MANAGER_APPROVAL` → `FINANCE_APPROVAL` → `ERP_SYNCED`).
- 🔗 **ERP Connector & Simulator**: Extensible connector framework mapping JSON payloads to enterprise ERP structures with dedicated mock/simulator service for integration testing.
- 🔒 **Enterprise Security & RBAC**: Centralized Authentication Gateway using JWT tokens, Spring Security WebFlux, token revocation via Redis, and fine-grained Role-Based Access Control.
- 📊 **Real-Time Analytics & Audit Trail**: Comprehensive audit logging for all document actions and system telemetry integration via Prometheus & Grafana dashboards.

---

## 🏗️ System Architecture & Data Flow

```
                           React Frontend (Vite + Tailwind / Mantine)
                                        │
                                        ▼
                         API Gateway (Spring Cloud Gateway - :8080)
                                        │
 ┌──────────────┬───────────────┼───────────────┬─────────────────┬──────────────┐
 │              │               │               │                 │              │
Auth        User Service   Document Service  Workflow        Notification      Audit & Report
Service      (Port 8082)     (Port 8083)     Service          Service         Services
(Port 8081)                     │          (Port 8086)      (Port 8089)     (Port 8090/8091)
                                │
                          RabbitMQ Queue
                                │
                         OCR Service (Go + Gin + Tesseract - :8085)
                                │
                        Validation Service (Port 8084)
                                │
                         ERP Connector (Port 8087)
                                │
                         ERP Simulator (Port 8088)
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
          PostgreSQL Database          Redis Cache & MinIO S3
              (Port 5432)              (Ports 6379 / 9000)
```

### End-to-End Processing Workflow

1. **Upload**: User uploads PDF invoice via React Frontend through API Gateway (`gateway-service`).
2. **Ingestion**: `document-service` saves raw files to MinIO object storage and metadata to PostgreSQL.
3. **Queueing**: `document-service` emits an OCR processing event to RabbitMQ.
4. **Extraction**: `ocr-service` (Go) consumes the message, pre-processes images, performs OCR, caches result in Redis, and stores extracted JSON data.
5. **Validation**: `validation-service` executes business logic rules (Vendor match, PO match, GST validation, Duplicate check, Amount check).
6. **Workflow State**: `workflow-service` advances document state based on validation status.
7. **Approval**: Human reviewer inspects and approves document via Frontend UI.
8. **ERP Sync**: `erp-connector` transforms validated JSON payload and sends to target ERP (or `erp-simulator`).
9. **Notification & Audit**: `notification-service` emits real-time updates while `audit-service` logs immutable operational history.

---

## 🛠️ Technology Stack

| Layer | Technology / Tool | Version / Details |
| --- | --- | --- |
| **Frontend Framework** | React, Vite, TypeScript | React 18/19, Vite 5.4 |
| **Frontend UI / Styling** | Tailwind CSS, Mantine, Lucide Icons | Responsive modern enterprise design |
| **API Gateway** | Spring Cloud Gateway | Reactive Java 21, Spring Boot 3.2 |
| **Backend Framework** | Spring Boot | Java 21, Spring Boot 3.2.2, Spring Cloud 2023.0.0 |
| **OCR Processing Engine** | Golang, Gin framework, Tesseract OCR | Go 1.22 high-concurrency worker |
| **Message Broker** | RabbitMQ | Async queue for OCR and event processing |
| **Relational Storage** | PostgreSQL | Version 16 Alpine |
| **Cache & Session** | Redis | Session state, token revocation, OCR caching |
| **Object File Storage** | MinIO / AWS S3 | Encrypted PDF file and rendered image storage |
| **Containerization & Orchestration** | Docker, Docker Compose, Kubernetes | Multi-container compose & Helm/K8s manifests |
| **Monitoring & Metrics** | Prometheus & Grafana | Real-time service telemetry & operational dashboards |
| **Reverse Proxy** | NGINX | Ingress traffic routing and SSL termination |

---

## 🧩 Microservices Inventory & Port Mapping

| Service Name | Port | Directory Path | Description |
| --- | --- | --- | --- |
| **API Gateway** | `8080` | `[backend/gateway-service](file:///C:/Apsingh/EODM%20Project/backend/gateway-service)` | Central routing gateway, JWT authorization filter, rate-limiting |
| **Auth Service** | `8081` | `[backend/auth-service](file:///C:/Apsingh/EODM%20Project/backend/auth-service)` | Authentication, token issuance, password hashing |
| **User Service** | `8082` | `[backend/user-service](file:///C:/Apsingh/EODM%20Project/backend/user-service)` | User profiles, team management, roles, & departments |
| **Document Service** | `8083` | `[backend/document-service](file:///C:/Apsingh/EODM%20Project/backend/document-service)` | PDF ingestion, MinIO storage client, version management |
| **Validation Service** | `8084` | `[backend/validation-service](file:///C:/Apsingh/EODM%20Project/backend/validation-service)` | Business rules validation engine (Vendor/PO/GST/Duplicate/Amount) |
| **OCR Service** | `8085` | `[backend/ocr-service](file:///C:/Apsingh/EODM%20Project/backend/ocr-service)` | High-throughput Go + Tesseract OCR extraction engine |
| **Workflow Service** | `8086` | `[backend/workflow-service](file:///C:/Apsingh/EODM%20Project/backend/workflow-service)` | State machine for multi-stage approval workflow |
| **ERP Connector** | `8087` | `[backend/erp-connector](file:///C:/Apsingh/EODM%20Project/backend/erp-connector)` | SAP/Oracle/Dynamics ERP integration transformation module |
| **ERP Simulator** | `8088` | `[backend/erp-simulator](file:///C:/Apsingh/EODM%20Project/backend/erp-simulator)` | Mock ERP target service for integration & end-to-end testing |
| **Notification Service** | `8089` | `[backend/notification-service](file:///C:/Apsingh/EODM%20Project/backend/notification-service)` | Real-time WebSocket, Email, and SMS notifications |
| **Audit Service** | `8090` | `[backend/audit-service](file:///C:/Apsingh/EODM%20Project/backend/audit-service)` | Centralized audit log tracking and compliance persistence |
| **Report Service** | `8091` | `[backend/report-service](file:///C:/Apsingh/EODM%20Project/backend/report-service)` | Business intelligence analytics and reporting backend |
| **Common Library** | N/A | `[backend/common-library](file:///C:/Apsingh/EODM%20Project/backend/common-library)` | Shared models, DTOs, security utilities, and exception handlers |
| **Frontend Application** | `5173` | `[frontend](file:///C:/Apsingh/EODM%20Project/frontend)` | React + Vite UI dashboard for document review and administration |

---

## 📂 Repository Directory Structure

```
EODM Project/
├── backend/                                  # Java Maven Parent & Microservices
│   ├── pom.xml                               # Master Maven build configuration
│   ├── gateway-service/                      # Spring Cloud API Gateway (Port 8080)
│   ├── auth-service/                         # Authentication & JWT Service (Port 8081)
│   ├── user-service/                         # User & Organization Management (Port 8082)
│   ├── document-service/                     # PDF Upload & MinIO S3 Integration (Port 8083)
│   ├── validation-service/                   # Business Rule Validation Engine (Port 8084)
│   ├── ocr-service/                          # Go + Gin + Tesseract OCR Engine (Port 8085)
│   ├── workflow-service/                     # Approval State Machine (Port 8086)
│   ├── erp-connector/                        # ERP Integration Adapter (Port 8087)
│   ├── erp-simulator/                        # Target ERP Mock Simulator (Port 8088)
│   ├── notification-service/                 # Alerts & WebSocket Notifications (Port 8089)
│   ├── audit-service/                        # Compliance & Audit Trail (Port 8090)
│   ├── report-service/                       # Analytics & Reporting Service (Port 8091)
│   └── common-library/                       # Shared DTOs & Common Utilities
├── frontend/                                 # Single Page React Application
│   ├── src/                                  # Components, views, state management, & API services
│   ├── public/                               # Static web assets
│   ├── package.json                          # Node dependencies & npm scripts
│   ├── vite.config.js                        # Vite bundler configuration
│   └── tailwind.config.js                    # Tailwind styling tokens
├── infrastructure/                           # Deployment & DevOps Manifests
│   ├── docker/                               # Docker Compose environment setup
│   ├── kubernetes/                           # K8s Deployment & Service manifests
│   ├── postgres/                             # Database initialization scripts
│   ├── redis/                                # Redis config files
│   ├── rabbitmq/                             # RabbitMQ queue topology definitions
│   ├── minio/                                # MinIO bucket setup scripts
│   ├── nginx/                                # Reverse proxy server configuration
│   ├── prometheus/                           # Monitoring scrape targets setup
│   └── grafana/                              # Dashboards and visualization setups
└── documents/                                # Architecture & Project Documentation
    ├── HLD/                                  # High-Level Architecture Design
    ├── LLD/                                  # Low-Level Component Design
    ├── DeploymentGuide/                      # Comprehensive Infrastructure Deployment Guide
    ├── SRS/                                  # Software Requirements Specification
    ├── ERD/                                  # Entity Relationship Diagrams
    ├── DFD/                                  # Data Flow Diagrams
    ├── API/                                  # OpenAPI / Swagger Specifications
    ├── UML/                                  # Sequence & Class Diagrams
    ├── UserGuide/                            # End-User Manual & Workflow Docs
    └── Frontend/                             # Frontend Design Specs & Wireframes
```

---

## ⚡ Prerequisites & System Requirements

Before running the project locally or deploying to an environment, ensure the following are installed:

- **JDK 21** or later (`java --version`)
- **Maven 3.9+** (`mvn --version`)
- **Go 1.22+** (for OCR Service) (`go version`)
- **Node.js 20+** & **npm 10+** (`node -v`, `npm -v`)
- **Docker Desktop** / **Docker Engine 24+** & **Docker Compose v2** (`docker compose version`)
- **Tesseract OCR Engine** (for running OCR engine natively outside Docker)

---

## 🚀 Local Development Setup Guide

### 1. Launch Core Infrastructure Services

Start PostgreSQL, Redis, RabbitMQ, MinIO, Prometheus, and Grafana using Docker Compose:

```bash
cd "infrastructure/docker"
docker compose up -d
```

Verify service container health:
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **RabbitMQ Management**: `http://localhost:15672` (Guest / Guest)
- **MinIO Console**: `http://localhost:9001` (minioadmin / minioadminpassword)
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3000`

---

### 2. Build & Run Backend Microservices

#### Step 2A: Build Common Library & Master Maven Project
```bash
cd "../../backend"
mvn clean install -DskipTests
```

#### Step 2B: Run Microservices Individually
Run services in separate terminals or via your preferred Java IDE (IntelliJ IDEA / Eclipse / VS Code):

```bash
# 1. API Gateway
cd gateway-service && mvn spring-boot:run

# 2. Auth Service
cd auth-service && mvn spring-boot:run

# 3. User Service
cd user-service && mvn spring-boot:run

# 4. Document Service
cd document-service && mvn spring-boot:run

# 5. Validation Service
cd validation-service && mvn spring-boot:run

# 6. Workflow Service
cd workflow-service && mvn spring-boot:run

# 7. ERP Connector & Simulator
cd erp-connector && mvn spring-boot:run
cd erp-simulator && mvn spring-boot:run

# 8. Notification, Audit, & Report Services
cd notification-service && mvn spring-boot:run
cd audit-service && mvn spring-boot:run
cd report-service && mvn spring-boot:run
```

#### Step 2C: Run Go OCR Processing Service
```bash
cd backend/ocr-service
go run cmd/main.go
```

---

### 3. Build & Run Frontend Application

```bash
cd frontend
npm install
npm run dev
```

The frontend client will be accessible at `http://localhost:5173`.

---

## 🔑 Environment Configuration Parameters

Key infrastructure defaults used across development environments:

| Environment Variable | Default Value | Description |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/enterprise_ocr` | PostgreSQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `postgrespassword` | Database password |
| `SPRING_REDIS_HOST` | `localhost` | Redis host |
| `SPRING_REDIS_PORT` | `6379` | Redis port |
| `SPRING_RABBITMQ_HOST` | `localhost` | RabbitMQ host |
| `SPRING_RABBITMQ_PORT` | `5672` | RabbitMQ port |
| `MINIO_ENDPOINT` | `http://localhost:9000` | Object storage S3 endpoint |
| `MINIO_ACCESS_KEY` | `minioadmin` | MinIO root access key |
| `MINIO_SECRET_KEY` | `minioadminpassword` | MinIO root secret key |
| `JWT_SECRET` | `EnterpriseOcrJwtSecretKey32BytesLongMinimum!!` | Secret key for JWT signing |

---

## 📚 Project Documentation Index

For detailed architectural and deployment documentation, refer to the documents directory:

- 📖 **High-Level Architecture**: `[documents/HLD/HLD.md](file:///C:/Apsingh/EODM%20Project/documents/HLD/HLD.md)`
- 🚀 **Deployment & Infrastructure Guide**: `[documents/DeploymentGuide/DeploymentGuide.md](file:///C:/Apsingh/EODM%20Project/documents/DeploymentGuide/DeploymentGuide.md)`

---

## 🧪 Testing & Verification

Run Maven unit & integration tests across all microservices:

```bash
cd backend
mvn test
```

For frontend testing:

```bash
cd frontend
npm run build
```

---

## 📄 License & Distribution

Internal Enterprise Software — All Rights Reserved.  
*Enterprise Optical Document Management (EODM) Team*