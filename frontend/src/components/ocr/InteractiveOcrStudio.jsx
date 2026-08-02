import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ScanText, CheckCircle2, AlertTriangle, Edit3, Save, RotateCw, ZoomIn, ZoomOut, 
  Send, RefreshCw, Layers, ShieldCheck, HelpCircle, CornerDownRight, ArrowRight
} from 'lucide-react';

export const InteractiveOcrStudio = () => {
  const { 
    documents, selectedDocId, setSelectedDocId, selectedDocument, 
    updateOcrField, updateDocumentStatus, showToast, setActivePage, triggerErpSync 
  } = useApp();

  const [activeFieldKey, setActiveFieldKey] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [editingFieldKey, setEditingFieldKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveEdit = (fieldKey) => {
    updateOcrField(selectedDocument.id, fieldKey, editValue);
    setEditingFieldKey(null);
  };

  const handleReprocessOcr = () => {
    setIsProcessing(true);
    showToast('Re-running Tesseract v5 OCR Engine algorithm...', 'info');
    setTimeout(() => {
      setIsProcessing(false);
      showToast(`OCR re-processing completed for ${selectedDocument.id}. Accuracy: 99.1%`, 'success');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 dark:bg-brand-500/20">
            <ScanText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-base text-slate-800 dark:text-white">OCR Visual Studio</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Confidence: {selectedDocument.ocrConfidence}%
              </span>
            </div>
            <p className="text-xs text-slate-400">Document ID: <span className="font-mono text-brand-600 dark:text-brand-400">{selectedDocument.id}</span> ({selectedDocument.name})</p>
          </div>
        </div>

        {/* Document Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Doc Picker */}
          <select 
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {documents.map(d => (
              <option key={d.id} value={d.id}>
                {d.id} - {d.vendor} ({d.status})
              </option>
            ))}
          </select>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-2 text-slate-600 dark:text-slate-300">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reprocess Button */}
          <button 
            onClick={handleReprocessOcr}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-brand-500' : ''}`} />
            <span>{isProcessing ? 'Processing...' : 'Reprocess OCR'}</span>
          </button>

          {/* Send for Validation */}
          <button 
            onClick={() => {
              updateDocumentStatus(selectedDocument.id, 'Pending', 'Validation Queue');
              setActivePage('validation');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-brand-600/30 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send for Validation</span>
          </button>
        </div>
      </div>

      {/* Main Split Pane Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Canvas Document Preview Pane (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-4 min-h-[560px] flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Interactive OCR Bounding Box Preview</span>
            </span>
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-300">Format: Standard Tax Invoice PDF</span>
          </div>

          {/* Invoice Document Graphic Canvas */}
          <div className="flex-1 flex justify-center items-center overflow-auto p-4">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-[440px] h-[520px] bg-white text-slate-900 rounded-xl shadow-2xl p-6 relative select-none transition-transform duration-200 font-sans border border-slate-200"
            >
              {/* Document Header mockup */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="font-extrabold text-xl tracking-tight text-slate-900">{selectedDocument.vendor}</h3>
                  <p className="text-[10px] text-slate-500">TAX INVOICE / ORIGINAL FOR RECIPIENT</p>
                  <p className="text-[9px] text-slate-400">GSTIN: {selectedDocument.vendorGst}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-slate-900 text-white rounded">INVOICE</span>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1">{selectedDocument.id}</p>
                  <p className="text-[10px] text-slate-500">Date: {selectedDocument.invoiceDate}</p>
                </div>
              </div>

              {/* Bill To & PO Info */}
              <div className="grid grid-cols-2 gap-4 text-[10px] mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="font-bold text-slate-700">BILLED TO:</p>
                  <p className="font-semibold text-slate-800">Enterprise Solutions Inc.</p>
                  <p className="text-slate-500">24 Tech Boulevard, Sector 62</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700">ORDER DETAILS:</p>
                  <p className="text-slate-600">PO Ref: <span className="font-mono font-bold text-slate-800">{selectedDocument.poNumber}</span></p>
                  <p className="text-slate-600">Payment Terms: Net 30 Days</p>
                </div>
              </div>

              {/* Line Items Table Preview */}
              <div className="mb-6">
                <table className="w-full text-[10px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-1 px-2">Item Description</th>
                      <th className="py-1 px-2 text-center">Qty</th>
                      <th className="py-1 px-2 text-right">Price</th>
                      <th className="py-1 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedDocument.lineItems.map(item => (
                      <tr key={item.id}>
                        <td className="py-1.5 px-2">{item.desc}</td>
                        <td className="py-1.5 px-2 text-center">{item.qty}</td>
                        <td className="py-1.5 px-2 text-right font-mono">₹{item.unitPrice.toLocaleString()}</td>
                        <td className="py-1.5 px-2 text-right font-mono font-semibold">₹{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary mockup */}
              <div className="w-48 ml-auto text-[10px] space-y-1 pt-2 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{selectedDocument.subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IGST / CGST (18%):</span>
                  <span className="font-mono">₹{selectedDocument.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-xs pt-1 border-t border-slate-300">
                  <span>Total Payable:</span>
                  <span className="font-mono text-brand-700">₹{selectedDocument.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* OVERLAY BOUNDING BOXES FOR INTERACTIVE HIGHLIGHT */}
              {selectedDocument.ocrFields.map((field) => {
                const isActive = activeFieldKey === field.key;
                const isHovered = activeFieldKey === field.key;
                return (
                  <div
                    key={field.key}
                    onClick={() => setActiveFieldKey(field.key)}
                    onMouseEnter={() => setActiveFieldKey(field.key)}
                    style={{
                      left: `${field.bbox.x}%`,
                      top: `${field.bbox.y}%`,
                      width: `${field.bbox.w}%`,
                      height: `${field.bbox.h}%`
                    }}
                    className={`absolute rounded transition-all duration-150 cursor-pointer border-2 ${
                      isActive 
                        ? 'border-brand-500 bg-brand-500/25 z-20 ring-4 ring-brand-500/30 scale-105 ocr-highlight-active' 
                        : 'border-blue-400/50 bg-blue-400/10 hover:border-brand-500 hover:bg-brand-500/20'
                    }`}
                  >
                    <span className={`absolute -top-4 left-0 text-[8px] font-bold px-1 rounded ${
                      isActive ? 'bg-brand-600 text-white' : 'bg-slate-800 text-white'
                    }`}>
                      {field.label} ({field.confidence}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            💡 <span className="font-medium text-slate-300">Pro Tip:</span> Hover or click any highlighted box on the invoice document preview to inspect its OCR confidence score and edit its value.
          </div>
        </div>

        {/* Right Extracted Data Inspection Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Extracted Key-Value Fields</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {selectedDocument.ocrFields.length} Fields Detected
              </span>
            </div>

            {/* Field Items List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {selectedDocument.ocrFields.map((field) => {
                const isActive = activeFieldKey === field.key;
                const isEditing = editingFieldKey === field.key;

                return (
                  <div
                    key={field.key}
                    onMouseEnter={() => setActiveFieldKey(field.key)}
                    onClick={() => setActiveFieldKey(field.key)}
                    className={`p-3 rounded-2xl border transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 shadow-md' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {field.label}
                      </span>
                      <div className="flex items-center space-x-2">
                        {field.status === 'Valid' ? (
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-500/20">
                            ✓ {field.confidence}% Valid
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-500/20">
                            ⚠ {field.confidence}% Review
                          </span>
                        )}

                        {!isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFieldKey(field.key);
                              setEditValue(field.value);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-brand-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Edit Field"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Field Value or Edit Input */}
                    {isEditing ? (
                      <div className="flex items-center space-x-2 mt-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-brand-500 rounded-lg text-slate-800 dark:text-slate-100 font-mono focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEdit(field.key)}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                          title="Save Field Value"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {field.value}
                        </p>
                      </div>
                    )}

                    {/* Field remark note */}
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                      <CornerDownRight className="w-3 h-3 text-slate-400" />
                      <span>{field.remarks}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Overall Status: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedDocument.status}</span>
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={() => updateDocumentStatus(selectedDocument.id, 'Rejected', 'Rejected', 'User rejected in OCR Visual Studio')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 hover:bg-red-200 transition-colors"
              >
                Reject Document
              </button>
              <button 
                onClick={() => {
                  updateDocumentStatus(selectedDocument.id, 'Processed', 'Completed');
                  triggerErpSync(selectedDocument.id, 'SAP S/4HANA');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
              >
                <span>Approve & Post to ERP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
