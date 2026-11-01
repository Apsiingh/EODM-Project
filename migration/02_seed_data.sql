-- ==============================================================================
-- Enterprise Optical Document Management (EODM) Platform
-- Database Migration Script: 02_seed_data.sql
-- Description: Pre-seeded enterprise master data, roles, users, vendors, and sample POs
-- ==============================================================================

-- 1. Insert Default Security Roles
INSERT INTO roles (name) VALUES
    ('ROLE_ADMIN'),
    ('ROLE_MANAGER'),
    ('ROLE_FINANCE'),
    ('ROLE_AUDITOR'),
    ('ROLE_OPERATOR'),
    ('ROLE_USER')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Default Departments
INSERT INTO departments (name, code, description) VALUES
    ('Executive Administration', 'DEPT-ADMIN', 'Platform security and administrative governance'),
    ('Document Processing Operations', 'DEPT-OPS', 'High-throughput document intake, scanning and OCR verification'),
    ('Finance & Accounts Payable', 'DEPT-FIN', 'Invoice auditing, tax calculation and payment settlement'),
    ('Corporate Compliance & Risk', 'DEPT-AUDIT', 'Regulatory compliance, internal controls and audit trail verification')
ON CONFLICT (name) DO NOTHING;

-- 3. Insert Corporate Seed Users (Password: password123)
-- BCrypt password hash: $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGPEWiSDe.6C1qUeq
DO $$
DECLARE
    dept_admin_id UUID;
    dept_ops_id UUID;
    dept_fin_id UUID;
    dept_audit_id UUID;
    role_admin_id UUID;
    role_mgr_id UUID;
    role_fin_id UUID;
    role_audit_id UUID;
    role_op_id UUID;
    v_user_id UUID;
    pwd_hash VARCHAR(255) := '$2a$10$r5v6DY.D/SNo/SpfbErZheGpiol.FOraFSX3cm0rOes6Y46pesPY.';
BEGIN
    SELECT id INTO dept_admin_id FROM departments WHERE code = 'DEPT-ADMIN';
    SELECT id INTO dept_ops_id FROM departments WHERE code = 'DEPT-OPS';
    SELECT id INTO dept_fin_id FROM departments WHERE code = 'DEPT-FIN';
    SELECT id INTO dept_audit_id FROM departments WHERE code = 'DEPT-AUDIT';

    SELECT id INTO role_admin_id FROM roles WHERE name = 'ROLE_ADMIN';
    SELECT id INTO role_mgr_id FROM roles WHERE name = 'ROLE_MANAGER';
    SELECT id INTO role_fin_id FROM roles WHERE name = 'ROLE_FINANCE';
    SELECT id INTO role_audit_id FROM roles WHERE name = 'ROLE_AUDITOR';
    SELECT id INTO role_op_id FROM roles WHERE name = 'ROLE_OPERATOR';

    -- Alex Wright (Admin)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'alex.wright@enterprise.com') THEN
        INSERT INTO users (username, email, password_hash, department_id, designation, status)
        VALUES ('alex.wright', 'alex.wright@enterprise.com', pwd_hash, dept_admin_id, 'Admin User', 'Active')
        RETURNING id INTO v_user_id;
        INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, role_admin_id);
    END IF;

    -- John Manager (Manager Approval)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'john.manager@enterprise.com') THEN
        INSERT INTO users (username, email, password_hash, department_id, designation, status)
        VALUES ('john.manager', 'john.manager@enterprise.com', pwd_hash, dept_ops_id, 'Manager Approval', 'Active')
        RETURNING id INTO v_user_id;
        INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, role_mgr_id);
    END IF;

    -- Jane Finance (Finance Approval)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'jane.finance@enterprise.com') THEN
        INSERT INTO users (username, email, password_hash, department_id, designation, status)
        VALUES ('jane.finance', 'jane.finance@enterprise.com', pwd_hash, dept_fin_id, 'Finance Approval', 'Active')
        RETURNING id INTO v_user_id;
        INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, role_fin_id);
    END IF;

    -- Michael Auditor (Compliance Auditor)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'm.auditor@enterprise.com') THEN
        INSERT INTO users (username, email, password_hash, department_id, designation, status)
        VALUES ('m.auditor', 'm.auditor@enterprise.com', pwd_hash, dept_audit_id, 'Compliance Auditor', 'Active')
        RETURNING id INTO v_user_id;
        INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, role_audit_id);
    END IF;

    -- Sarah Vendor (Vendor User)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 's.vendor@abcpvtltd.com') THEN
        INSERT INTO users (username, email, password_hash, department_id, designation, status)
        VALUES ('s.vendor', 's.vendor@abcpvtltd.com', pwd_hash, dept_ops_id, 'Vendor User', 'Active')
        RETURNING id INTO v_user_id;
        INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, role_op_id);
    END IF;
END $$;

-- 4. Insert Master ERP Vendors
INSERT INTO vendors (vendor_code, name, gstin, email, phone, address) VALUES
    ('VEND-001', 'ABC Pvt Ltd', '27ABCDE1234F1Z5', 'billing@abcpvtltd.com', '+91 22 2589 4400', 'Plot 45, MIDC Industrial Area, Andheri East, Mumbai, MH - 400093'),
    ('VEND-002', 'XYZ Corp', '29AAACX9876Q1Z9', 'finance@xyzcorp.com', '+91 80 4123 7890', 'Tower B, Global Tech Park, Bellandur, Bengaluru, KA - 560103'),
    ('VEND-003', 'Apex Logistical Services', '07AAACA1234B1Z8', 'accounts@apexlogistics.in', '+91 11 4987 6543', 'Cargo Terminal 3, IGI Airport, New Delhi, DL - 110037')
ON CONFLICT (vendor_code) DO NOTHING;

-- 5. Insert Sample Purchase Orders matching Invoices in mockData
DO $$
DECLARE
    v_vendor_abc_id UUID;
    v_vendor_xyz_id UUID;
    v_po_125_id UUID;
    v_po_189_id UUID;
BEGIN
    SELECT id INTO v_vendor_abc_id FROM vendors WHERE vendor_code = 'VEND-001';
    SELECT id INTO v_vendor_xyz_id FROM vendors WHERE vendor_code = 'VEND-002';

    -- PO-2024-125 for ABC Pvt Ltd (Total ₹ 53,100)
    IF NOT EXISTS (SELECT 1 FROM purchase_orders WHERE po_number = 'PO-2024-125') THEN
        INSERT INTO purchase_orders (po_number, vendor_id, total_amount, status)
        VALUES ('PO-2024-125', v_vendor_abc_id, 53100.00, 'OPEN')
        RETURNING id INTO v_po_125_id;

        INSERT INTO purchase_order_items (po_id, item_description, quantity, unit_price) VALUES
            (v_po_125_id, 'Enterprise Server Maintenance Kit', 2, 15000.00),
            (v_po_125_id, 'High-Speed Fiber Transceivers 10G', 3, 5000.00);
    END IF;

    -- PO-2024-189 for XYZ Corp (Total ₹ 1,41,600)
    IF NOT EXISTS (SELECT 1 FROM purchase_orders WHERE po_number = 'PO-2024-189') THEN
        INSERT INTO purchase_orders (po_number, vendor_id, total_amount, status)
        VALUES ('PO-2024-189', v_vendor_xyz_id, 141600.00, 'OPEN')
        RETURNING id INTO v_po_189_id;

        INSERT INTO purchase_order_items (po_id, item_description, quantity, unit_price) VALUES
            (v_po_189_id, 'High-Availability Router Chassis', 1, 120000.00);
    END IF;
END $$;

-- 6. Insert System Broadcast Notifications
INSERT INTO notifications (title, message, type, is_read) VALUES
    ('System Initialized', 'Database migration and core system tables successfully provisioned.', 'SUCCESS', false),
    ('OCR Engine Ready', 'High-throughput Go OCR worker ready for queue consumption.', 'INFO', false);
