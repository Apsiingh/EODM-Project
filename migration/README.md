# Database Migrations — Enterprise Optical Document Management (EODM)

This directory contains the database schema definitions, master seed data, and migration automation scripts for the PostgreSQL database (`enterprise_ocr`).

---

## 📁 Directory Structure

```text
migration/
├── 01_schema_init.sql       # Complete DDL: Extensions, Tables, Foreign Keys, Indexes
├── 02_seed_data.sql         # Pre-seeded Roles, Departments, Users, Vendors, POs
├── run_migrations.ps1       # Automated PowerShell runner (Docker container & local psql)
├── run_migrations.sh        # Bash runner script
└── README.md                # Documentation and table index
```

---

## 🗄️ Database Tables Inventory

| Domain | Table Name | Description |
| :--- | :--- | :--- |
| **Authentication & Users** | `roles` | Security RBAC roles (`ROLE_ADMIN`, `ROLE_MANAGER`, etc.) |
| | `permissions` | Granular permission keys |
| | `role_permissions` | Junction table mapping permissions to roles |
| | `departments` | Organizational departments (`IT`, `Finance`, `Operations`, `Audit`) |
| | `users` | Corporate users with hashed passwords and designations |
| | `user_roles` | Junction table mapping users to roles |
| | `refresh_tokens` | JWT refresh tokens for session rotation and revocation |
| **Document & OCR** | `documents` | Uploaded document metadata, status, and S3 file paths |
| | `document_versions` | Versioned file storage tracking |
| | `ocr_results` | Golang + Tesseract extracted text, JSON, and confidence scores |
| **Validation & Workflow** | `validation_results` | 5-stage rule results (Vendor, PO, GST, Duplicate, Amount) |
| | `workflow` | State machine tracking (`Upload` → `OCR` → `Validation` → `Manager` → `Finance` → `ERP`) |
| | `workflow_history` | Immutable operational approval audit log |
| **ERP Master Data** | `vendors` | Vendor master profiles, codes, and GSTINs |
| | `purchase_orders` | Purchase order header records |
| | `purchase_order_items` | Purchase order line items and quantities |
| | `invoices` | Extracted invoice data linked to documents and POs |
| | `invoice_items` | Line-item auditing breakdown |
| | `erp_sync_logs` | Synchronization logs for SAP / Oracle / Dynamics integrations |
| **Telemetry & Operations** | `notifications` | Real-time WebSocket, Email, and in-app notifications |
| | `audit_logs` | Regulatory and compliance audit logs |
| | `dashboard_cache` | High-performance JSON metric cache for BI reporting |

---

## 🚀 Execution Instructions

### Option 1: Automatic Initialization via Docker Compose
The `docker-compose.yml` mounts this `migration/` directory into PostgreSQL's `/docker-entrypoint-initdb.d/`.

```bash
cd infrastructure/docker
docker compose up -d
```
All tables and seed data are automatically executed in order upon initial database container boot.

---

### Option 2: Run via PowerShell Script
To execute migrations against an already running Docker container or a local PostgreSQL instance:

```powershell
cd migration
.\run_migrations.ps1
```

---

### Option 3: Run via Bash / Git Bash
```bash
cd migration
chmod +x run_migrations.sh
./run_migrations.sh
```

---

### Option 4: Direct `psql` Command
```bash
psql -h localhost -p 5432 -U postgres -d enterprise_ocr -f migration/01_schema_init.sql
psql -h localhost -p 5432 -U postgres -d enterprise_ocr -f migration/02_seed_data.sql
```
