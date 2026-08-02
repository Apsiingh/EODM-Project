import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, CheckCircle2, Clock, ShieldAlert, TrendingUp, ArrowUpRight, 
  Eye, ScanText, ArrowRight, Download, Filter, Search, Plus
} from 'lucide-react';

export const Dashboard = () => {
  const { documents, setSelectedDocId, setActivePage, searchQuery, setSearchQuery } = useApp();

  const filteredDocs = documents.filter(d => 
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-brand-500/30 text-brand-300 border border-brand-400/30 tracking-wider uppercase">
            Enterprise Executive Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            OCR Document Management Platform
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Real-time automated document extraction, multi-level financial approvals, and instant SAP/Oracle ERP synchronization.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3">
          <button 
            onClick={() => setActivePage('upload')}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-brand-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Invoice</span>
          </button>
          <button 
            onClick={() => setActivePage('ocr-review')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md flex items-center space-x-2 border border-white/20 transition-all"
          >
            <ScanText className="w-4 h-4" />
            <span>OCR Studio</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Documents</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">12,580</h3>
            </div>
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-3">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* Processed (This Month) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Processed (This Month)</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">9,245</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-3">
            <span>73.4% auto-reconciled</span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approval</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,235</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 mt-3">
            <span>Requires manager signoff</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OCR Success Rate</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">98.45%</h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-3">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            <span>+0.8% engine accuracy</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Documents by Status (Doughnut Chart mockup) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Documents by Status</h3>
          
          <div className="flex items-center justify-center py-4">
            {/* Custom SVG Ring Chart */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path className="text-slate-100 dark:text-slate-800" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                {/* Processed (73%) Emerald */}
                <path className="text-emerald-500" strokeDasharray="73, 100" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                {/* Pending (12%) Amber */}
                <path className="text-amber-500" strokeDasharray="12, 100" strokeDashoffset="-73" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                {/* Rejected (5%) Red */}
                <path className="text-red-500" strokeDasharray="5, 100" strokeDashoffset="-85" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">12.5k</span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Total Invoices</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Processed (73%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Pending (12%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Rejected (5%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Draft (10%)</span>
            </div>
          </div>
        </div>

        {/* Monthly Trend (Line Graph mockup) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">Monthly Invoice Processing Trend</h3>
            <span className="text-xs text-slate-400">Jan - Jul 2024</span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-44 w-full pt-4 flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d="M 10 130 Q 80 110, 150 70 T 300 40 T 490 20 L 490 150 L 10 150 Z" 
                fill="url(#trendGrad)" 
              />
              <path 
                d="M 10 130 Q 80 110, 150 70 T 300 40 T 490 20" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="3" 
              />
              {/* Data points */}
              <circle cx="10" cy="130" r="4" className="fill-brand-600" />
              <circle cx="90" cy="105" r="4" className="fill-brand-600" />
              <circle cx="170" cy="65" r="4" className="fill-brand-600" />
              <circle cx="270" cy="45" r="4" className="fill-brand-600" />
              <circle cx="370" cy="35" r="4" className="fill-brand-600" />
              <circle cx="490" cy="20" r="5" className="fill-brand-500 stroke-white stroke-2" />
            </svg>
          </div>

          <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Jan (1.2k)</span>
            <span>Feb (2.4k)</span>
            <span>Mar (4.1k)</span>
            <span>Apr (6.8k)</span>
            <span>May (9.2k)</span>
            <span>Jun (11.5k)</span>
            <span>Jul (12.5k)</span>
          </div>
        </div>
      </div>

      {/* Recent Documents Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">Recent Documents Queue</h3>
            <p className="text-xs text-slate-400">Live feed of ingested vendor invoices and validation statuses</p>
          </div>
          
          <button 
            onClick={() => setActivePage('documents')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
          >
            <span>View All Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Document ID</th>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Uploaded On</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {doc.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                    {doc.name}
                  </td>
                  <td className="py-3 px-4">{doc.vendor}</td>
                  <td className="py-3 px-4 text-slate-400">{doc.uploadedOn}</td>
                  <td className="py-3 px-4 font-mono font-semibold">₹{doc.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {doc.status === 'Processed' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-500/20">
                        ● Processed
                      </span>
                    )}
                    {doc.status === 'Pending' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-500/20">
                        ● Pending
                      </span>
                    )}
                    {doc.status === 'Rejected' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 border border-red-500/20">
                        ● Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setActivePage('ocr-review');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 text-brand-600 dark:text-brand-400 font-semibold text-[11px] inline-flex items-center space-x-1"
                    >
                      <ScanText className="w-3.5 h-3.5" />
                      <span>OCR Studio</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
