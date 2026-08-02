import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, Search, Filter, ScanText, Download, Eye, History, Trash2, 
  CheckCircle2, Clock, XCircle, Grid, List, Sparkles
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const Documents = () => {
  const { documents, setSelectedDocId, setActivePage, searchQuery, setSearchQuery, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // list or grid
  const [historyModalDoc, setHistoryModalDoc] = useState(null);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-brand-500" />
            <span>Documents Directory</span>
          </h2>
          <p className="text-xs text-slate-400">Manage all ingested invoices, preview extracted fields, and track version history</p>
        </div>

        <button 
          onClick={() => setActivePage('upload')}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30"
        >
          + Upload Document
        </button>
      </div>

      {/* Filter & View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents by ID, vendor or filename..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {['All', 'Processed', 'Pending', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === status 
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* List / Grid Toggle */}
        <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-slate-800 pl-3">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400' : 'text-slate-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400' : 'text-slate-400'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Document ID</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">PO Ref</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">OCR Confidence</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {doc.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                      {doc.name}
                    </td>
                    <td className="py-3.5 px-4 font-medium">{doc.vendor}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{doc.poNumber}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{doc.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {doc.ocrConfidence}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {doc.status === 'Processed' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">● Processed</span>}
                      {doc.status === 'Pending' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">● Pending</span>}
                      {doc.status === 'Rejected' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400">● Rejected</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button 
                        onClick={() => {
                          setSelectedDocId(doc.id);
                          setActivePage('ocr-review');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 text-brand-600 dark:text-brand-400 font-semibold text-[11px] inline-flex items-center space-x-1"
                        title="Open in OCR Studio"
                      >
                        <ScanText className="w-3.5 h-3.5" />
                        <span>OCR Studio</span>
                      </button>
                      <button 
                        onClick={() => setHistoryModalDoc(doc)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Version History"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{doc.id}</span>
                  {doc.status === 'Processed' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">Processed</span>}
                  {doc.status === 'Pending' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">Pending</span>}
                  {doc.status === 'Rejected' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Rejected</span>}
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{doc.vendor}</h4>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{doc.name}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total: <strong className="text-slate-800 dark:text-slate-200 font-mono">₹{doc.totalAmount.toLocaleString()}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">{doc.ocrConfidence}% OCR</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <button 
                  onClick={() => setHistoryModalDoc(doc)} 
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                </button>

                <button 
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setActivePage('ocr-review');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-semibold text-xs flex items-center space-x-1 shadow-md shadow-brand-600/30"
                >
                  <ScanText className="w-3.5 h-3.5" />
                  <span>OCR Studio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Modal */}
      <Modal 
        isOpen={!!historyModalDoc} 
        onClose={() => setHistoryModalDoc(null)} 
        title={`Version History & Timeline - ${historyModalDoc?.id}`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{historyModalDoc?.vendor}</p>
              <p className="text-slate-400">{historyModalDoc?.name}</p>
            </div>
            <div className="text-right font-mono font-bold text-brand-600">
              ₹{historyModalDoc?.totalAmount.toLocaleString()}
            </div>
          </div>

          <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Approval Audit Timeline</h4>

          <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            {historyModalDoc?.approvalWorkflow?.map((w, idx) => (
              <div key={idx} className="relative pl-4">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                  w.status === 'Approved' ? 'bg-emerald-500' : w.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'
                }`}></div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{w.step} - {w.user}</p>
                <p className="text-[10px] text-slate-400">{w.timestamp}</p>
                {w.comments && <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg mt-1">{w.comments}</p>}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
