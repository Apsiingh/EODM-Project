# High-Level Architecture Design (HLD)

## Overall System Architecture

```
                          React Frontend (Mantine / Tailwind)
                                │
                                │
                        API Gateway (Spring Cloud Gateway)
                                │
 ┌──────────────┬───────────────┼───────────────┬──────────────┐
 │              │               │               │              │
Auth        User Service   Document Service  Workflow     Notification
Service        (Java)          (Java)        Service         Service
(Java)                          │             (Java)         (Java)
                                │
                         RabbitMQ Queue
                                │
                         OCR Service (Golang + Gin)
                                │
                        Validation Service (Java)
                                │
                         ERP Connector (Java)
                                │
                         ERP Simulator (Java)
                                │
                         PostgreSQL Database
                                │
                           Redis Cache
                                │
                  Prometheus + Grafana Monitoring
```

## Event & Data Processing Flow

1. **React Upload**: User uploads PDF invoice via Frontend.
2. **API Gateway**: Routes traffic to `Document Service`.
3. **Document Service**: Saves PDF file metadata into PostgreSQL and raw file to MinIO object storage.
4. **RabbitMQ Message**: `Document Service` publishes OCR job event to RabbitMQ queue.
5. **Go OCR Service**: Consumes RabbitMQ job, processes PDF (Image enhancement, layout extraction via Tesseract), returns JSON payload.
6. **Validation Service**: Executes business rule validations (Vendor verification, PO match, GST validation, Duplicate check, Amount check).
7. **Workflow Service**: Moves document through Approval pipeline (`Upload` -> `OCR` -> `Validation` -> `Manager` -> `Finance` -> `ERP`).
8. **Manager & Finance Approval**: Human-in-the-loop review and approval via React Frontend UI.
9. **ERP Connector**: Transforms validated JSON and sends to ERP system (SAP / Oracle / Dynamics).
10. **ERP Simulator**: Simulates target ERP response for testing and integration.
11. **Notification Service**: Sends WebSocket/SMS/Email notifications to stakeholders.
12. **Audit Service**: Records audit logs for Login, Upload, OCR extraction, Approval, and ERP Sync.
13. **Dashboard & Report Service**: Serves real-time analytics to Grafana and frontend dashboard.
