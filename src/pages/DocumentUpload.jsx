import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, Sparkles, 
  ArrowRight, RefreshCw, X, FolderPlus
} from 'lucide-react';

export const DocumentUpload = () => {
  const { addDocument, setActivePage, showToast } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState('Vendor Invoice');
  const [vendor, setVendor] = useState('ABC Pvt Ltd');
  const [poNumber, setPoNumber] = useState('PO-2024-550');
  const [invoiceDate, setInvoiceDate] = useState('2024-05-15');
  const [remarks, setRemarks] = useState('Urgent processing requested by Procurement team');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Sample Invoice Presets for 1-Click Demo
  const presetInvoices = [
    { name: 'Invoice_ABC_12345.pdf', vendor: 'ABC Pvt Ltd', po: 'PO-2024-125', date: '2024-05-10', total: 53100 },
    { name: 'Invoice_XYZ_98765.pdf', vendor: 'XYZ Corp', po: 'PO-2024-189', date: '2024-05-12', total: 141600 },
    { name: 'Invoice_LMN_44321.pdf', vendor: 'LMN Ltd', po: 'PO-2024-090', date: '2024-05-11', total: 10030 }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const loadPreset = (preset) => {
    setSelectedFile({ name: preset.name, size: 1434475 });
    setVendor(preset.vendor);
    setPoNumber(preset.po);
    setInvoiceDate(preset.date);
    showToast(`Loaded ${preset.name} metadata into upload form`, 'info');
  };

  const handleSubmitUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select a file or click a sample preset to upload.', 'warning');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          const newDoc = {
            id: `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`,
            name: selectedFile.name,
            type: docType,
            vendor: vendor,
            vendorGst: '27ABCDE1234F1Z5',
            poNumber: poNumber,
            invoiceDate: invoiceDate,
            dueDate: '2024-06-15',
            subTotal: 50000.00,
            taxAmount: 9000.00,
            totalAmount: 59000.00,
            currency: 'INR',
            status: 'Pending',
            ocrConfidence: 97.80,
            uploadedBy: 'Admin User',
            uploadedOn: new Date().toLocaleString(),
            approvalStage: 'Validation Queue',
            erpSyncStatus: 'Pending Queue',
            ocrFields: [
              { key: 'vendorName', label: 'Vendor Name', value: vendor, confidence: 99.1, status: 'Valid', bbox: { x: 8, y: 14, w: 32, h: 6 }, remarks: 'Vendor matched' },
              { key: 'poNumber', label: 'PO Number', value: poNumber, confidence: 98.4, status: 'Valid', bbox: { x: 68, y: 28, w: 22, h: 4 }, remarks: 'PO verified' },
              { key: 'totalAmount', label: 'Total Amount', value: '₹ 59,000.00', confidence: 97.2, status: 'Valid', bbox: { x: 68, y: 76, w: 24, h: 5 }, remarks: 'Total calculated' }
            ],
            lineItems: [
              { id: 1, desc: 'Enterprise Server Maintenance Item', qty: 1, unitPrice: 50000.00, amount: 50000.00 }
            ],
            approvalWorkflow: [
              { step: 'Manager Approval', user: 'John Manager', status: 'Pending', timestamp: '-', comments: '' }
            ]
          };

          addDocument(newDoc);
          setActivePage('ocr-review');
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <Upload className="w-5 h-5 text-brand-500" />
            <span>Document Ingestion & Upload</span>
          </h2>
          <p className="text-xs text-slate-400">Upload PDF/Image invoices for automated OCR data extraction</p>
        </div>
      </div>

      {/* Preset Quick Load Bar */}
      <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/40">
        <span className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center space-x-1.5 mb-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Quick Demo Presets (1-Click Sample File Load)</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presetInvoices.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p)}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 hover:border-brand-500 text-left transition-all shadow-sm group"
            >
              <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-brand-600 truncate">{p.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.vendor} • ₹{p.total.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload Form */}
      <form onSubmit={handleSubmitUpload} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30' 
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-brand-400'
          }`}
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
            <Upload className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Drag & drop files here, or <label className="text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">browse files<input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])} /></label>
          </p>
          <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, PNG, JPG, JPEG (Max 20MB)</p>

          {selectedFile && (
            <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <FileText className="w-4 h-4" />
              <span>Selected: {selectedFile.name}</span>
              <button type="button" onClick={() => setSelectedFile(null)} className="ml-2 text-emerald-600 hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Form Metadata Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Document Type *</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Vendor Invoice">Vendor Invoice</option>
              <option value="Purchase Order Invoice">Purchase Order Invoice</option>
              <option value="Utility Invoice">Utility Invoice</option>
              <option value="Logistics Invoice">Logistics Invoice</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor *</label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ABC Pvt Ltd">ABC Pvt Ltd</option>
              <option value="XYZ Corp">XYZ Corp</option>
              <option value="LMN Ltd">LMN Ltd</option>
              <option value="QRS Pvt Ltd">QRS Pvt Ltd</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Purchase Order No.</label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Remarks (Optional)</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any additional processing notes..."
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-brand-600 dark:text-brand-400 font-bold">
              <span>Extracting fields via Tesseract OCR...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => { setSelectedFile(null); setRemarks(''); }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 flex items-center space-x-2"
          >
            {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{isUploading ? 'Extracting OCR...' : 'Upload & Start OCR'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
