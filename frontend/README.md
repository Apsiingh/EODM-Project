# Enterprise Optical Document Management (EODM) - Frontend Platform

[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![Vite 5](https://img.shields.io/badge/Vite-5.4.10-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC.svg)](https://tailwindcss.com/)
[![Lucide React](https://img.shields.io/badge/Lucide_Icons-0.453-F59E0B.svg)](https://lucide.dev/)
[![JavaScript / TypeScript](https://img.shields.io/badge/Language-JS%2FTS-blue.svg)](https://www.typescriptlang.org/)

---

## 📌 Executive Summary

The **EODM Frontend Web Application** is an enterprise-grade, single-page application (SPA) built with **React 18**, **Vite**, and **Tailwind CSS**. It serves as the centralized command center for end-to-end document processing, AI-driven Optical Character Recognition (OCR) extraction, automated business validation rules execution, human-in-the-loop multi-stage approval workflows, and enterprise ERP integration (SAP, Oracle, Dynamics).

Designed for high-throughput enterprise operations, the frontend provides real-time visibility, split-screen interactive OCR verification, detailed compliance auditing, and role-based access control (RBAC).

---

## 🏗️ Module Architecture & Workflow

The application is structured into **12 specialized operational modules** coordinated through a global reactive state context ([AppContext.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/context/AppContext.jsx)) and typed service interfaces ([services/](file:///c:/Apsingh/EODM%20Project/frontend/src/services)).

```
                               ┌────────────────────────────────────────┐
                               │  Global Layout Shell                   │
                               │  (Header, Sidebar, AppContext, Toast)  │
                               └──────────────────┬─────────────────────┘
                                                  │
 ┌──────────────────────┬─────────────────────────┼────────────────────────┬──────────────────────┐
 │                      │                         │                        │                      │
 ▼                      ▼                         ▼                        ▼                      ▼
Authentication     Dashboard &               Document Management      Interactive OCR         Validation Queue &
& RBAC             Analytics                 & Batch Upload           Review Studio           Rules Engine
[AuthPage.jsx]     [Dashboard.jsx]           [DocumentUpload.jsx]     [OcrReview.jsx]         [ValidationQueue.jsx]
[UserMgmt.jsx]     [ReportsAnalytics.jsx]    [Documents.jsx]          [InteractiveOcrStudio]  
 │                      │                         │                        │                      │
 └──────────────────────┴─────────────────────────┼────────────────────────┴──────────────────────┘
                                                  │
 ┌──────────────────────┬─────────────────────────┼────────────────────────┬──────────────────────┐
 │                      │                         │                        │                      │
 ▼                      ▼                         ▼                        ▼                      ▼
Workflow & Approvals   ERP Integration           Compliance Audit Logs    Notifications          Platform Settings
[WorkflowApprovals]    [ErpIntegration.jsx]      [AuditLogs.jsx]          [Notifications.jsx]    [SettingsAdmin.jsx]
```

---

## 🧩 Comprehensive Module Breakdown

### 1. 🔐 Auth & User Management Module
* **Primary Views**: [AuthPage.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/AuthPage.jsx), [UserManagement.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/UserManagement.jsx)
* **Services**: [auth.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/auth.ts), [user.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/user.ts)
* **Key Capabilities**:
  * **Role-Based Access Control (RBAC)**: Supports roles: `System Admin`, `Finance Manager`, `Document Operator`, `Compliance Auditor`, and `ERP Specialist`.
  * **Role Switching**: Instant active role switching context for quick permission testing and role-tailored view filtering.
  * **User Administration**: Comprehensive user directory, status toggling (`Active`, `Pending`, `Suspended`), role assignment, and security group controls.
  * **Session Management**: JWT authentication flow with automatic token attachment to backend microservice endpoints.

---

### 2. 📊 Executive Dashboard & Analytics Module
* **Primary Views**: [Dashboard.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/Dashboard.jsx), [ReportsAnalytics.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/ReportsAnalytics.jsx)
* **Services**: [report.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/report.ts)
* **Key Capabilities**:
  * **Real-Time Operational KPIs**: Displays live metrics for total document volume, processing success rates, average OCR confidence score, pending approvals, and validation error counts.
  * **Throughput & Accuracy Charts**: Interactive trend visualizations for document volume growth and OCR field-level accuracy.
  * **Format & Queue Breakdown**: Pie and bar distributions showing document breakdown by file format (PDF, PNG, JPG, TIFF) and pipeline status.
  * **Report Export Center**: Export detailed operational and financial audit reports in **CSV**, **PDF**, and **Excel** formats.

---

### 3. 📤 Document Upload & Batch Ingestion Module
* **Primary Views**: [DocumentUpload.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/DocumentUpload.jsx)
* **Services**: [document.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/document.ts)
* **Key Capabilities**:
  * **High-Throughput Dropzone**: Drag-and-drop file uploader supporting multi-file selection and ZIP batch archives.
  * **MIME & Format Validation**: Client-side validation for PDF, PNG, JPG, and TIFF files with file size checks.
  * **Ingestion Progress Tracking**: Live upload status bar, byte count, and automated queueing trigger to `document-service` and RabbitMQ.
  * **Pre-Ingestion Metadata**: Automated preliminary file indexing including file size, MIME type, payload signature, and initial queue assignment.

---

### 4. 🗂️ Document Management & Repository Module
* **Primary Views**: [Documents.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/Documents.jsx)
* **Services**: [document.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/document.ts)
* **Key Capabilities**:
  * **Centralized Document Inventory**: Data grid displaying all ingested invoices, purchase orders, and financial manifests.
  * **Status Lifecycle Tracking**: Live badges tracking document stages: `UPLOAD`, `OCR_PROCESSING`, `VALIDATION`, `MANAGER_APPROVAL`, `FINANCE_APPROVAL`, `ERP_SYNCED`, and `REJECTED`.
  * **Multi-Facet Search & Filtering**: Instant search across Document ID, Vendor Name, PO Number, Date Range, and Processing Status.
  * **Quick Detail Drawer**: Side panel for quick document metadata preview, file download, and direct link to OCR verification.

---

### 5. 🔍 Interactive OCR Review Studio Module
* **Primary Views**: [OcrReview.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/OcrReview.jsx)
* **Key Component**: [InteractiveOcrStudio.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/components/ocr/InteractiveOcrStudio.jsx)
* **Services**: [ocr.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/ocr.ts)
* **Key Capabilities**:
  * **Split-Screen Studio View**: Dual-pane workspace displaying document preview canvas side-by-side with extracted field data.
  * **Bounding Box Overlay**: Interactive canvas mapping extracted text regions directly onto the source PDF/Image preview.
  * **Confidence Score Highlighting**: Visual color indicators per extracted field (`High` > 90% green, `Medium` 70-90% amber, `Low` < 70% red).
  * **Field Editing & Recalculation**: Live editable fields for Invoice #, Invoice Date, Vendor Tax ID, Line Items, Subtotal, Tax Amount, and Total Amount with instant recalculation.
  * **Manual Override Audit**: Logs all human corrections into the immutable audit trail for continuous OCR engine retraining.

---

### 6. ✔️ Business Rules & Validation Queue Module
* **Primary Views**: [ValidationQueue.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/ValidationQueue.jsx)
* **Services**: [validation.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/validation.ts)
* **Key Capabilities**:
  * **5-Stage Rules Engine Monitor**: Displays automated validation checks:
    1. *Vendor Verification* (Database lookup & active vendor validation)
    2. *3-Way PO Matching* (Matching PO #, Quantities, and Unit Prices)
    3. *Tax / GST Checksum* (Checksum algorithm for Tax Registration numbers)
    4. *Duplicate Check* (Document hash & Invoice # duplicate detection)
    5. *Line-Item Math Audit* (Subtotal + Tax = Total Verification)
  * **Flagged Exception Queue**: Dedicated view for flagged invoices requiring human intervention.
  * **Manual Override & Re-Validation**: Allows operators to override failed validation rules with mandatory exception notes.

---

### 7. 🔄 Workflow & Multi-Tier Approval Engine Module
* **Primary Views**: [WorkflowApprovals.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/WorkflowApprovals.jsx)
* **Services**: [workflow.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/workflow.ts)
* **Key Capabilities**:
  * **Hierarchical Approval Gates**: Multi-level human sign-off process (`Manager Approval` → `Finance Approval`).
  * **Approval Actions**: Interactive `Approve` and `Reject` modal controls with required comment logs.
  * **Approval Delegation**: Assign approval tasks to delegates when primary approvers are away.
  * **Workflow Timeline Visualizer**: Step-by-step graphical progress tracker showing completed, active, and pending approval stages.

---

### 8. 🔗 Enterprise ERP Integration Hub Module
* **Primary Views**: [ErpIntegration.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/ErpIntegration.jsx)
* **Services**: [erp.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/erp.ts)
* **Key Capabilities**:
  * **Enterprise Connectors**: Native interfaces for **SAP S/4HANA**, **Oracle Fusion**, **Microsoft Dynamics 365**, and **NetSuite**.
  * **Sync Payload Inspector**: Inspect JSON payloads formatted for ERP REST/SOAP API submission.
  * **Failed Sync Retry Engine**: Manual retry controls and exponential backoff retry logs for failed ERP postings.
  * **Connection Health Monitor**: Live pulse check for backend ERP gateway connectors and simulator services.

---

### 9. 🛡️ Security & Compliance Audit Logs Module
* **Primary Views**: [AuditLogs.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/AuditLogs.jsx)
* **Key Capabilities**:
  * **Immutable Audit Trail**: SOC 2 and ISO 27001 compliant audit recording for all platform operations (Logins, Uploads, OCR Corrections, Approvals, Rejections, ERP Syncs).
  * **Cryptographic Verification**: Displays SHA-256 cryptographic hashes for log entry tamper detection.
  * **Granular Audit Filters**: Filter logs by User, Action Type, Timestamp Range, and IP Address.

---

### 10. 🔔 System Notifications & Live Alerts Module
* **Primary Views**: [Notifications.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/Notifications.jsx)
* **Key Component**: [Toast.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/components/common/Toast.jsx)
* **Key Capabilities**:
  * **Live Toast Notifications**: Non-intrusive floating toast alerts for immediate action feedback.
  * **Persistent Notification Drawer**: Inbox for system alerts, approval requests, OCR processing completions, and validation errors.
  * **Severity Categorization**: Classified into `Action Required`, `OCR Alert`, `Workflow Update`, and `System Info`.

---

### 11. ⚙️ System Administration & Platform Settings Module
* **Primary Views**: [SettingsAdmin.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/pages/SettingsAdmin.jsx)
* **Key Capabilities**:
  * **OCR Engine Tuning**: Adjust global OCR confidence thresholds (e.g., minimum confidence auto-pass score).
  * **Workflow Configurations**: Define default approval routing rules and escalation timeout hours.
  * **Storage & Gateway Config**: Configure MinIO S3 bucket parameters, API gateway timeouts, and document retention rules.
  * **Visual Theme Customization**: Toggle between Modern Dark Executive Theme and Crisp Light Mode.

---

### 12. 🐚 Global Layout Shell & Reactive Context
* **Primary Shell**: [App.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/App.jsx)
* **Core Components**: [Header.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/components/common/Header.jsx), [Sidebar.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/components/common/Sidebar.jsx), [Modal.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/components/common/Modal.jsx)
* **Global Context**: [AppContext.jsx](file:///c:/Apsingh/EODM%20Project/frontend/src/context/AppContext.jsx)
* **Key Capabilities**:
  * **Centralized Reactive State**: `AppContext` manages active routing view, logged-in user context, document inventory state, notification badge counts, and theme settings.
  * **Responsive Layout Shell**: Collapsible sidebar navigation, top header quick-stats bar, global document search input, and responsive mobile overlay menu.

---

## 📂 Frontend Directory Structure

```
frontend/
├── public/                     # Static public assets (favicon, logos)
├── src/
│   ├── assets/                 # SVGs, brand graphics, images
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Global layout elements
│   │   │   ├── Header.jsx      # Top navigation header
│   │   │   ├── Sidebar.jsx     # Side navigation menu
│   │   │   ├── Modal.jsx       # Reusable dialog modal
│   │   │   └── Toast.jsx       # Global toast notification banner
│   │   └── ocr/                # OCR specialized components
│   │       └── InteractiveOcrStudio.jsx  # Split-screen OCR review tool
│   ├── context/                # Global React context state management
│   │   └── AppContext.jsx      # Primary application state provider
│   ├── pages/                  # Main platform module views
│   │   ├── App.jsx             # Shell wrapper & dynamic router
│   │   ├── AuditLogs.jsx       # Compliance audit logging page
│   │   ├── AuthPage.jsx        # Login & registration authentication page
│   │   ├── Dashboard.jsx       # Operational executive dashboard
│   │   ├── DocumentUpload.jsx  # Drag & drop upload ingestion page
│   │   ├── Documents.jsx       # Centralized document directory page
│   │   ├── ErpIntegration.jsx  # ERP connector & synchronization page
│   │   ├── Notifications.jsx   # System alerts & notification drawer
│   │   ├── OcrReview.jsx       # OCR verification workspace container
│   │   ├── ReportsAnalytics.jsx# Analytics & export report builder
│   │   ├── SettingsAdmin.jsx   # Global platform configuration page
│   │   ├── UserManagement.jsx  # User accounts & RBAC management
│   │   ├── ValidationQueue.jsx # Validation rules exception queue
│   │   └── WorkflowApprovals.jsx # Workflow approval workflow page
│   ├── services/               # API Integration Services (Axios HTTP Client)
│   │   ├── auth.ts             # Auth endpoint integrations
│   │   ├── document.ts         # Document CRUD & upload service
│   │   ├── erp.ts              # ERP integration API service
│   │   ├── ocr.ts              # OCR processing & field edit service
│   │   ├── report.ts           # Analytics data fetcher service
│   │   ├── user.ts             # User management API service
│   │   ├── validation.ts       # Validation rules service
│   │   └── workflow.ts         # Workflow step transition service
│   ├── utils/                  # Helper utilities & mock data
│   │   └── mockData.js         # Comprehensive enterprise mock dataset
│   ├── index.css               # Global Tailwind CSS import & custom styles
│   └── main.jsx                # Application entrypoint
├── index.html                  # HTML template root
├── package.json                # NPM dependencies & scripts
├── postcss.config.js           # PostCSS plugin pipeline
├── tailwind.config.js          # Tailwind CSS theme extension config
└── vite.config.js              # Vite bundling & development server configuration
```

---

## ⚡ Service Layer & Backend API Integration

The frontend service layer in [src/services/](file:///c:/Apsingh/EODM%20Project/frontend/src/services) routes requests through the **Spring Cloud API Gateway** (`gateway-service` running on port `8080`).

| Service Module | File Path | Backend Endpoint Target | Microservice Handler |
| --- | --- | --- | --- |
| **Auth Service** | [auth.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/auth.ts) | `/api/auth/*` | `auth-service` (:8081) |
| **User Service** | [user.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/user.ts) | `/api/users/*` | `user-service` (:8082) |
| **Document Service** | [document.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/document.ts) | `/api/documents/*` | `document-service` (:8083) |
| **OCR Service** | [ocr.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/ocr.ts) | `/api/ocr/*` | `ocr-service` (Go :8085) |
| **Validation Service** | [validation.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/validation.ts) | `/api/validation/*` | `validation-service` (:8084) |
| **Workflow Service** | [workflow.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/workflow.ts) | `/api/workflow/*` | `workflow-service` (:8086) |
| **ERP Service** | [erp.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/erp.ts) | `/api/erp/*` | `erp-connector` (:8087) |
| **Report Service** | [report.ts](file:///c:/Apsingh/EODM%20Project/frontend/src/services/report.ts) | `/api/reports/*` | `report-service` (:8091) |

---

## 🛠️ Technology Stack & Libraries

* **Core Framework**: React 18.3.1
* **Build Tool & Dev Server**: Vite 5.4.10
* **Styling**: Tailwind CSS 3.4.14, PostCSS, Autoprefixer
* **Iconography**: Lucide React 0.453.0
* **HTTP Client**: Axios
* **UI Utility Helpers**: `clsx`, `tailwind-merge`

---

## 🚀 Getting Started & Local Setup

### Prerequisites

* **Node.js**: `v18.0.0` or higher
* **NPM**: `v9.0.0` or higher

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   *The application will launch locally at `http://localhost:5173` (or the port specified by Vite).*

4. Build for production deployment:
   ```bash
   npm run build
   ```

5. Preview production build locally:
   ```bash
   npm run preview
   ```

---

## 🎨 UI/UX Design System & Aesthetics

* **Dark Mode Strategy**: Built with an executive dark theme (`#090d16` background, `slate-900`/`slate-800` cards) featuring sleek glassmorphism and subtle glowing accent borders.
* **Color Palette**:
  * *Primary Accent*: Indigo / Violet (`#6366F1`)
  * *Success State*: Emerald Green (`#10B981`)
  * *Warning / Medium Confidence*: Amber / Gold (`#F59E0B`)
  * *Error / Flagged State*: Rose / Crimson (`#F43F5E`)
* **Typography**: Clean, high-legibility modern sans-serif typography tuned for high-density financial data viewing.
* **Responsiveness**: Fully responsive layout adapting across desktop, tablet, and mobile displays.

---

## 📄 License & Compliance

This module is part of the **Enterprise Optical Document Management (EODM) Platform** and is subject to corporate software licensing and compliance guidelines (SOC 2, ISO 27001, GDPR).
