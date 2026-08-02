# Entity Relationship Diagram (ERD) & Database Schema Specification

## 1. Authentication & Users

### `users`
- `id` (UUID, PK)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `department_id` (UUID, FK)
- `designation` (VARCHAR)
- `created_at` (TIMESTAMP)

### `roles`
- `id` (UUID, PK)
- `name` (VARCHAR, UNIQUE)

### `permissions`
- `id` (UUID, PK)
- `name` (VARCHAR, UNIQUE)

---

## 2. Document & OCR Engine

### `documents`
- `id` (UUID, PK)
- `file_name` (VARCHAR)
- `file_path` (VARCHAR)
- `file_size` (BIGINT)
- `mime_type` (VARCHAR)
- `status` (VARCHAR)
- `uploaded_by` (UUID, FK -> users.id)
- `created_at` (TIMESTAMP)

### `document_versions`
- `id` (UUID, PK)
- `document_id` (UUID, FK -> documents.id)
- `version_number` (INT)
- `file_path` (VARCHAR)

### `ocr_results`
- `id` (UUID, PK)
- `document_id` (UUID, FK -> documents.id)
- `raw_text` (TEXT)
- `json_extracted` (JSONB)
- `confidence_score` (DECIMAL)
- `processed_at` (TIMESTAMP)

---

## 3. Validation & Workflow

### `validation_results`
- `id` (UUID, PK)
- `document_id` (UUID, FK -> documents.id)
- `vendor_matched` (BOOLEAN)
- `po_matched` (BOOLEAN)
- `gst_valid` (BOOLEAN)
- `is_duplicate` (BOOLEAN)
- `validation_details` (JSONB)

### `workflow`
- `id` (UUID, PK)
- `document_id` (UUID, FK -> documents.id)
- `current_stage` (VARCHAR) -- Upload -> OCR -> Validation -> Manager -> Finance -> ERP
- `assigned_to` (UUID, FK -> users.id)
- `status` (VARCHAR)

### `workflow_history`
- `id` (UUID, PK)
- `workflow_id` (UUID, FK -> workflow.id)
- `action` (VARCHAR)
- `performed_by` (UUID, FK -> users.id)
- `comments` (TEXT)
- `timestamp` (TIMESTAMP)

---

## 4. ERP & Business Data

### `vendors`
- `id` (UUID, PK)
- `vendor_code` (VARCHAR)
- `name` (VARCHAR)
- `gstin` (VARCHAR)

### `purchase_orders`
- `id` (UUID, PK)
- `po_number` (VARCHAR)
- `vendor_id` (UUID, FK -> vendors.id)
- `total_amount` (DECIMAL)

### `purchase_order_items`
- `id` (UUID, PK)
- `po_id` (UUID, FK -> purchase_orders.id)
- `item_description` (VARCHAR)
- `quantity` (INT)
- `unit_price` (DECIMAL)

### `invoices`
- `id` (UUID, PK)
- `invoice_number` (VARCHAR)
- `po_number` (VARCHAR)
- `vendor_id` (UUID, FK -> vendors.id)
- `amount` (DECIMAL)

### `invoice_items`
- `id` (UUID, PK)
- `invoice_id` (UUID, FK -> invoices.id)
- `description` (VARCHAR)
- `amount` (DECIMAL)

### `erp_sync_logs`
- `id` (UUID, PK)
- `document_id` (UUID, FK -> documents.id)
- `target_erp` (VARCHAR) -- SAP / Oracle / Dynamics
- `sync_status` (VARCHAR)
- `response_payload` (JSONB)
- `synced_at` (TIMESTAMP)

---

## 5. System & Operations

### `notifications`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> users.id)
- `title` (VARCHAR)
- `message` (TEXT)
- `is_read` (BOOLEAN)

### `audit_logs`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> users.id)
- `action` (VARCHAR) -- Login, Upload, OCR, Approval, ERP Sync
- `ip_address` (VARCHAR)
- `timestamp` (TIMESTAMP)

### `dashboard_cache`
- `id` (UUID, PK)
- `metric_key` (VARCHAR)
- `metric_value` (JSONB)
- `updated_at` (TIMESTAMP)
