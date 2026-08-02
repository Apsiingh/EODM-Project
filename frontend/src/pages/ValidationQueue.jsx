import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, 
  ArrowRight, ScanText, RefreshCw, FileCheck
} from 'lucide-react';

export const ValidationQueue = () => {
  const { documents, setSelectedDocId, setActivePage, updateDocumentStatus, showToast } = useApp();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-brand-500" />
            <span>Validation & Exception Queue</span>
          </h2>
          <p className="text-xs text-slate-400">Automated GSTIN checksum, Vendor DB lookup, and PO line-item total verification</p>
        </div>

        <button 
          onClick={() => showToast('All pending validation rules re-executed against database.', 'info')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Run All Rule Checks</span>
        </button>
      </div>

      {/* Validation Queue Cards */}
      <div className="space-y-4">
        {documents.map(doc => (
          <div key={doc.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 font-mono font-bold text-xs">
                  {doc.id}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{doc.vendor}</h4>
                  <p className="text-xs text-slate-400">PO: <span className="font-mono text-slate-700 dark:text-slate-300">{doc.poNumber}</span> | Date: {doc.invoiceDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Total: <strong className="text-slate-900 dark:text-white font-mono">₹{doc.totalAmount.toLocaleString()}</strong></span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {doc.status}
                </span>
              </div>
            </div>

            {/* Field Level Verification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {doc.ocrFields.map(field => (
                <div key={field.key} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{field.label}</span>
                    {field.status === 'Valid' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </div>
                  <p className="font-mono font-bold text-slate-900 dark:text-white truncate">{field.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">{field.remarks}</p>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedDocId(doc.id);
                  setActivePage('ocr-review');
                }}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold flex items-center space-x-1"
              >
                <ScanText className="w-3.5 h-3.5" />
                <span>Open in Visual OCR Studio for Field Correction</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => updateDocumentStatus(doc.id, 'Rejected', 'Rejected', 'Failed automated validation check')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 hover:bg-red-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateDocumentStatus(doc.id, 'Pending', 'Manager Approval', 'Validated successfully')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 flex items-center space-x-1"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Pass Validation</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
