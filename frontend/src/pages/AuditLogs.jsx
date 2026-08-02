import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Search, Download, Lock, CheckCircle2 } from 'lucide-react';

export const AuditLogs = () => {
  const { auditLogs, searchQuery, setSearchQuery, showToast } = useApp();

  const filteredLogs = auditLogs.filter(log =>
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-500" />
            <span>Immutable Audit Logs & Compliance</span>
          </h2>
          <p className="text-xs text-slate-400">SOX & ISO 27001 compliant activity trail with SHA256 cryptographic hashes</p>
        </div>

        <button 
          onClick={() => showToast('Exporting cryptographic audit log (CSV)...', 'success')}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Filter audit entries by user, action, IP address or detail keyword..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">SHA256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">{log.id}</td>
                  <td className="py-3.5 px-4 text-slate-400">{log.time}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">{log.user}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate">{log.details}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{log.ip}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-400 max-w-[120px] truncate" title={log.hash}>
                    🔒 {log.hash}
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
