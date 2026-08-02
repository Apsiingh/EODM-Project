import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, Download, Calendar, Filter, FileText, CheckCircle2, TrendingUp, PieChart
} from 'lucide-react';

export const ReportsAnalytics = () => {
  const { showToast } = useApp();
  const [reportType, setReportType] = useState('OCR Accuracy');
  const [dateRange, setDateRange] = useState('This Month');

  const handleExport = () => {
    showToast(`Generating ${reportType} CSV export...`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brand-500" />
            <span>Reports & Analytics Studio</span>
          </h2>
          <p className="text-xs text-slate-400">Generate executive financial reports, OCR accuracy metrics, and audit summaries</p>
        </div>

        <button 
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report (CSV / PDF)</span>
        </button>
      </div>

      {/* Report Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center space-x-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Report Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="OCR Accuracy">OCR Accuracy & Field Extraction Rate</option>
              <option value="Financial Reconciliation">Financial Reconciliation Summary</option>
              <option value="Vendor Performance">Vendor Invoicing Cycle Times</option>
              <option value="Compliance & Audit">SOX / Compliance Audit Digest</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month (May 2024)</option>
              <option value="Quarter to Date">Quarter to Date (Q2 2024)</option>
              <option value="Year to Date">Year to Date (2024)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => showToast('Analytics dataset refreshed', 'info')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold"
        >
          Generate Report
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">Total Volume</p>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-1">12,580</h3>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">↑ 14% volume growth</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">OCR Extraction Confidence</p>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-1">98.45%</h3>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">↑ 0.8% engine boost</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">Avg Processing Speed</p>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-1">1.4 sec / page</h3>
          <span className="text-[10px] text-slate-400 mt-1 block">Tesseract v5 benchmark</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">Total Financial Value</p>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-1">₹ 4.82 Cr</h3>
          <span className="text-[10px] text-brand-500 font-semibold mt-1 block">Reconciled YTD</span>
        </div>
      </div>

      {/* Visual Chart Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vendor Breakdown Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Top Vendor Invoice Ingestion Volume</h3>
          
          <div className="space-y-3 pt-2">
            {[
              { vendor: 'ABC Pvt Ltd', count: 4820, pct: 85 },
              { vendor: 'XYZ Corp', count: 3150, pct: 60 },
              { vendor: 'LMN Ltd', count: 2100, pct: 40 },
              { vendor: 'QRS Pvt Ltd', count: 1450, pct: 28 },
              { vendor: 'PQR Ltd', count: 1060, pct: 20 }
            ].map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{v.vendor}</span>
                  <span className="font-mono text-slate-500">{v.count.toLocaleString()} docs</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${v.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exception Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">OCR Exception Root Cause Distribution</h3>
          
          <div className="space-y-3 pt-2">
            {[
              { cause: 'GSTIN Checksum Verification Failed', count: '42%', color: 'bg-red-500' },
              { cause: 'Blurry / Low Resolution Scan', count: '28%', color: 'bg-amber-500' },
              { cause: 'Handwritten Date Format', count: '18%', color: 'bg-indigo-500' },
              { cause: 'PO Line Item Math Mismatch', count: '12%', color: 'bg-brand-500' }
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${c.color}`}></span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{c.cause}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
