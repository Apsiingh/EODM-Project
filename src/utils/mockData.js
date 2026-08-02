// Comprehensive Mock Data for Enterprise OCR Document Management Platform (EODM)

export const MOCK_USERS = [
  { id: 'usr-1', name: 'Alexander Wright', email: 'alex.wright@enterprise.com', role: 'Admin User', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Active' },
  { id: 'usr-2', name: 'John Manager', email: 'john.manager@enterprise.com', role: 'Manager Approval', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Active' },
  { id: 'usr-3', name: 'Jane Finance', email: 'jane.finance@enterprise.com', role: 'Finance Approval', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'Active' },
  { id: 'usr-4', name: 'Michael Auditor', email: 'm.auditor@enterprise.com', role: 'Compliance Auditor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'Active' },
  { id: 'usr-5', name: 'Sarah Vendor', email: 's.vendor@abcpvtltd.com', role: 'Vendor User', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', status: 'Active' }
];

export const MOCK_DOCUMENTS = [
  {
    id: 'INV-2024-0001',
    name: 'Invoice_ABC_12345.pdf',
    type: 'Vendor Invoice',
    vendor: 'ABC Pvt Ltd',
    vendorGst: '27ABCDE1234F1Z5',
    poNumber: 'PO-2024-125',
    invoiceDate: '2024-05-10',
    dueDate: '2024-06-10',
    subTotal: 45000.00,
    taxAmount: 8100.00,
    totalAmount: 53100.00,
    currency: 'INR',
    status: 'Processed', // Processed, Pending, Rejected, Draft, Exception
    ocrConfidence: 98.45,
    uploadedBy: 'John Manager',
    uploadedOn: '2024-05-12 11:20 AM',
    approvalStage: 'Completed',
    erpSyncStatus: 'Synced (SAP S/4HANA)',
    ocrFields: [
      { key: 'vendorName', label: 'Vendor Name', value: 'ABC Pvt Ltd', confidence: 99.2, status: 'Valid', bbox: { x: 8, y: 14, w: 32, h: 6 }, remarks: 'Matched with Vendor DB' },
      { key: 'invoiceNo', label: 'Invoice No.', value: 'INV-2024-0001', confidence: 99.8, status: 'Valid', bbox: { x: 68, y: 14, w: 24, h: 5 }, remarks: 'Unique invoice ID verified' },
      { key: 'invoiceDate', label: 'Invoice Date', value: '10/05/2024', confidence: 97.5, status: 'Valid', bbox: { x: 68, y: 22, w: 22, h: 4 }, remarks: 'Standard date format' },
      { key: 'poNumber', label: 'PO Number', value: 'PO-2024-125', confidence: 98.1, status: 'Valid', bbox: { x: 68, y: 28, w: 22, h: 4 }, remarks: 'Matched with ERP Purchase Order' },
      { key: 'gstNumber', label: 'GST Number', value: '27ABCDE1234F1Z5', confidence: 96.4, status: 'Valid', bbox: { x: 8, y: 22, w: 34, h: 4 }, remarks: 'GSTIN checksum valid' },
      { key: 'subTotal', label: 'Sub Total', value: '₹ 45,000.00', confidence: 98.9, status: 'Valid', bbox: { x: 68, y: 62, w: 24, h: 4 }, remarks: 'Line item total math verified' },
      { key: 'taxAmount', label: 'Tax Amount (18%)', value: '₹ 8,100.00', confidence: 97.2, status: 'Valid', bbox: { x: 68, y: 68, w: 24, h: 4 }, remarks: 'Calculated tax matches 18%' },
      { key: 'totalAmount', label: 'Total Amount', value: '₹ 53,100.00', confidence: 99.5, status: 'Valid', bbox: { x: 68, y: 76, w: 24, h: 5 }, remarks: 'Grand total verified' }
    ],
    lineItems: [
      { id: 1, desc: 'Enterprise Server Maintenance Kit', qty: 2, unitPrice: 15000.00, amount: 30000.00 },
      { id: 2, desc: 'High-Speed Fiber Transceivers 10G', qty: 3, unitPrice: 5000.00, amount: 15000.00 }
    ],
    approvalWorkflow: [
      { step: 'Manager Approval', user: 'John Manager', status: 'Approved', timestamp: '10 May 2024 11:20 AM', comments: 'Verified line items with PO specs.' },
      { step: 'Finance Approval', user: 'Jane Finance', status: 'Approved', timestamp: '11 May 2024 02:45 PM', comments: 'Budget code approved.' },
      { step: 'Final Approval', user: 'CFO Office', status: 'Approved', timestamp: '12 May 2024 09:15 AM', comments: 'Processed for payment release.' }
    ]
  },
  {
    id: 'INV-2024-0002',
    name: 'Invoice_12346_XYZ.pdf',
    type: 'Purchase Order Invoice',
    vendor: 'XYZ Corp',
    vendorGst: '29AAACX9876Q1Z9',
    poNumber: 'PO-2024-189',
    invoiceDate: '2024-05-12',
    dueDate: '2024-06-12',
    subTotal: 120000.00,
    taxAmount: 21600.00,
    totalAmount: 141600.00,
    currency: 'INR',
    status: 'Pending',
    ocrConfidence: 94.20,
    uploadedBy: 'Jane Finance',
    uploadedOn: '12 May 2024 10:15 AM',
    approvalStage: 'Finance Approval',
    erpSyncStatus: 'Pending Queue',
    ocrFields: [
      { key: 'vendorName', label: 'Vendor Name', value: 'XYZ Corp', confidence: 98.1, status: 'Valid', bbox: { x: 8, y: 14, w: 32, h: 6 }, remarks: 'Matched with Vendor DB' },
      { key: 'invoiceNo', label: 'Invoice No.', value: 'INV-2024-0002', confidence: 99.1, status: 'Valid', bbox: { x: 68, y: 14, w: 24, h: 5 }, remarks: 'Unique invoice ID verified' },
      { key: 'invoiceDate', label: 'Invoice Date', value: '12/05/2024', confidence: 92.0, status: 'Needs Review', bbox: { x: 68, y: 22, w: 22, h: 4 }, remarks: 'Handwritten date overlay warning' },
      { key: 'poNumber', label: 'PO Number', value: 'PO-2024-189', confidence: 95.3, status: 'Valid', bbox: { x: 68, y: 28, w: 22, h: 4 }, remarks: 'Matched PO-2024-189' },
      { key: 'totalAmount', label: 'Total Amount', value: '₹ 1,41,600.00', confidence: 96.8, status: 'Valid', bbox: { x: 68, y: 76, w: 24, h: 5 }, remarks: 'Verified total' }
    ],
    lineItems: [
      { id: 1, desc: 'Cloud Infrastructure License Annual', qty: 1, unitPrice: 120000.00, amount: 120000.00 }
    ],
    approvalWorkflow: [
      { step: 'Manager Approval', user: 'John Manager', status: 'Approved', timestamp: '12 May 2024 11:30 AM', comments: 'Annual renewal approved.' },
      { step: 'Finance Approval', user: 'Jane Finance', status: 'Pending', timestamp: '-', comments: 'Awaiting invoice date tax verification.' },
      { step: 'Final Approval', user: 'CFO Office', status: 'Pending', timestamp: '-', comments: '' }
    ]
  },
  {
    id: 'INV-2024-0003',
    name: 'Invoice_12347_LMN.pdf',
    type: 'Utility Invoice',
    vendor: 'LMN Ltd',
    vendorGst: '07BBBCL1122K1Z3',
    poNumber: 'PO-2024-090',
    invoiceDate: '2024-05-11',
    dueDate: '2024-05-25',
    subTotal: 8500.00,
    taxAmount: 1530.00,
    totalAmount: 10030.00,
    currency: 'INR',
    status: 'Rejected',
    ocrConfidence: 78.50,
    uploadedBy: 'Sarah Vendor',
    uploadedOn: '11 May 2024 04:10 PM',
    approvalStage: 'Rejected',
    erpSyncStatus: 'Failed Sync',
    ocrFields: [
      { key: 'vendorName', label: 'Vendor Name', value: 'LMN Ltd', confidence: 85.0, status: 'Valid', bbox: { x: 8, y: 14, w: 32, h: 6 }, remarks: 'Vendor found' },
      { key: 'invoiceNo', label: 'Invoice No.', value: 'INV-2024-0003', confidence: 91.0, status: 'Valid', bbox: { x: 68, y: 14, w: 24, h: 5 }, remarks: 'Unique ID' },
      { key: 'gstNumber', label: 'GST Number', value: 'INVALID_GSTIN', confidence: 64.0, status: 'Mismatch', bbox: { x: 8, y: 22, w: 34, h: 4 }, remarks: 'Tax ID failed checksum check' },
      { key: 'totalAmount', label: 'Total Amount', value: '₹ 10,030.00', confidence: 72.0, status: 'Mismatch', bbox: { x: 68, y: 76, w: 24, h: 5 }, remarks: 'Math mismatch on tax calculation' }
    ],
    lineItems: [
      { id: 1, desc: 'Office Facility Repair Services', qty: 1, unitPrice: 8500.00, amount: 8500.00 }
    ],
    approvalWorkflow: [
      { step: 'Manager Approval', user: 'John Manager', status: 'Rejected', timestamp: '11 May 2024 05:00 PM', comments: 'Invalid GSTIN number and tax mismatch.' }
    ]
  },
  {
    id: 'INV-2024-0004',
    name: 'Invoice_12348_QRS.pdf',
    type: 'Vendor Invoice',
    vendor: 'QRS Pvt Ltd',
    vendorGst: '33CCCCQ4455P1Z8',
    poNumber: 'PO-2024-311',
    invoiceDate: '2024-05-11',
    dueDate: '2024-06-11',
    subTotal: 34000.00,
    taxAmount: 6120.00,
    totalAmount: 40120.00,
    currency: 'INR',
    status: 'Processed',
    ocrConfidence: 99.10,
    uploadedBy: 'John Manager',
    uploadedOn: '11 May 2024 09:40 AM',
    approvalStage: 'Completed',
    erpSyncStatus: 'Synced (Oracle ERP)',
    ocrFields: [
      { key: 'vendorName', label: 'Vendor Name', value: 'QRS Pvt Ltd', confidence: 99.5, status: 'Valid', bbox: { x: 8, y: 14, w: 32, h: 6 }, remarks: 'Verified' },
      { key: 'invoiceNo', label: 'Invoice No.', value: 'INV-2024-0004', confidence: 99.9, status: 'Valid', bbox: { x: 68, y: 14, w: 24, h: 5 }, remarks: 'Verified' },
      { key: 'totalAmount', label: 'Total Amount', value: '₹ 40,120.00', confidence: 99.0, status: 'Valid', bbox: { x: 68, y: 76, w: 24, h: 5 }, remarks: 'Verified' }
    ],
    lineItems: [
      { id: 1, desc: 'Network Switches 24-Port Managed', qty: 2, unitPrice: 17000.00, amount: 34000.00 }
    ],
    approvalWorkflow: [
      { step: 'Manager Approval', user: 'John Manager', status: 'Approved', timestamp: '11 May 2024 10:00 AM', comments: 'Hardware received in good order.' },
      { step: 'Finance Approval', user: 'Jane Finance', status: 'Approved', timestamp: '11 May 2024 01:15 PM', comments: 'Approved.' }
    ]
  },
  {
    id: 'INV-2024-0005',
    name: 'Invoice_12349_PQR.pdf',
    type: 'Logistics Invoice',
    vendor: 'PQR Ltd',
    vendorGst: '19DDDEP7788M1Z2',
    poNumber: 'PO-2024-402',
    invoiceDate: '2024-05-14',
    dueDate: '2024-06-14',
    subTotal: 18500.00,
    taxAmount: 3330.00,
    totalAmount: 21830.00,
    currency: 'INR',
    status: 'Pending',
    ocrConfidence: 91.80,
    uploadedBy: 'Jane Finance',
    uploadedOn: '14 May 2024 02:20 PM',
    approvalStage: 'Manager Approval',
    erpSyncStatus: 'Pending Queue',
    ocrFields: [
      { key: 'vendorName', label: 'Vendor Name', value: 'PQR Ltd', confidence: 94.0, status: 'Valid', bbox: { x: 8, y: 14, w: 32, h: 6 }, remarks: 'Verified' },
      { key: 'invoiceNo', label: 'Invoice No.', value: 'INV-2024-0005', confidence: 96.0, status: 'Valid', bbox: { x: 68, y: 14, w: 24, h: 5 }, remarks: 'Verified' },
      { key: 'totalAmount', label: 'Total Amount', value: '₹ 21,830.00', confidence: 92.5, status: 'Valid', bbox: { x: 68, y: 76, w: 24, h: 5 }, remarks: 'Verified' }
    ],
    lineItems: [
      { id: 1, desc: 'Freight & Express Cargo Delivery', qty: 1, unitPrice: 18500.00, amount: 18500.00 }
    ],
    approvalWorkflow: [
      { step: 'Manager Approval', user: 'John Manager', status: 'Pending', timestamp: '-', comments: 'Awaiting waybill verification.' }
    ]
  }
];

export const MOCK_AUDIT_LOGS = [
  { id: 'LOG-9001', time: '12 May 2024 11:20 AM', user: 'John Manager', action: 'Approved Document', details: 'Document INV-2024-0001 approved for payment', ip: '192.168.1.45', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  { id: 'LOG-9002', time: '12 May 2024 10:15 AM', user: 'Jane Finance', action: 'Uploaded Document', details: 'Document INV-2024-0002 uploaded to processing queue', ip: '192.168.1.88', hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
  { id: 'LOG-9003', time: '12 May 2024 09:45 AM', user: 'System (OCR Engine)', action: 'OCR Processing Completed', details: 'OCR completed successfully for INV-2024-0001 with 98.45% accuracy', ip: '127.0.0.1', hash: '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eee796a0ad8c' },
  { id: 'LOG-9004', time: '12 May 2024 09:40 AM', user: 'System (Validation)', action: 'Validation Completed', details: 'Validation rules executed for INV-2024-0001 (GST & PO match PASS)', ip: '127.0.0.1', hash: '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6' },
  { id: 'LOG-9005', time: '11 May 2024 04:10 PM', user: 'Admin User', action: 'User Login', details: 'Admin user logged in from chrome browser', ip: '192.168.1.10', hash: '185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969' }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'NOTIF-1', title: 'Document Approved', message: 'Invoice INV-2024-0001 has been fully approved by CFO Office.', time: '10 mins ago', read: false, type: 'success' },
  { id: 'NOTIF-2', title: 'Validation Warning', message: 'Invoice INV-2024-0002 date field marked for manual verification.', time: '1 hour ago', read: false, type: 'warning' },
  { id: 'NOTIF-3', title: 'ERP Sync Success', message: 'INV-2024-0004 posted to SAP S/4HANA (Doc # 90028471).', time: '2 hours ago', read: true, type: 'info' },
  { id: 'NOTIF-4', title: 'OCR Extraction Failed', message: 'Invoice INV-2024-0003 failed GST checksum validation.', time: '1 day ago', read: true, type: 'error' }
];

export const MOCK_ERP_SYSTEMS = [
  { id: 'sap', name: 'SAP S/4HANA Enterprise', code: 'SAP-PROD-01', status: 'Connected', pingMs: 24, syncQueue: 2, totalSynced: 4892 },
  { id: 'oracle', name: 'Oracle ERP Cloud', code: 'ORCL-FIN-PROD', status: 'Connected', pingMs: 42, syncQueue: 0, totalSynced: 3120 },
  { id: 'dynamics', name: 'Microsoft Dynamics 365', code: 'MS-DYN-365', status: 'Connected', pingMs: 18, syncQueue: 1, totalSynced: 1845 }
];

export const MOCK_SYSTEM_HEALTH = {
  apiGateway: { status: 'Healthy', latencyMs: 12, uptime: '99.98%' },
  ocrEngine: { status: 'Healthy', tesseractWorkers: 8, queueDepth: 3 },
  validationService: { status: 'Healthy', ruleEngine: 'Active', latencyMs: 8 },
  database: { status: 'Healthy', type: 'PostgreSQL 16', connections: 42 },
  messageBroker: { status: 'Healthy', type: 'RabbitMQ', pendingMessages: 5 },
  cacheStore: { status: 'Healthy', type: 'Redis 7.2', hitRate: '96.4%' },
  storage: { status: 'Healthy', type: 'MinIO Object Storage', usedGb: 142.8, freeGb: 857.2 }
};
