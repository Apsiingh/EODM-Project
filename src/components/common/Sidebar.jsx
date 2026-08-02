import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, FileText, ScanText, CheckSquare, GitPullRequest, 
  Database, BarChart3, ShieldCheck, Bell, Users, Settings, Upload, HardDrive
} from 'lucide-react';

export const Sidebar = () => {
  const { activePage, setActivePage, isSidebarOpen, notifications } = useApp();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents Directory', icon: FileText },
    { id: 'upload', label: 'Upload Invoice', icon: Upload, badge: 'New' },
    { id: 'ocr-review', label: 'OCR Visual Studio', icon: ScanText, highlight: true },
    { id: 'validation', label: 'Validation Queue', icon: CheckSquare },
    { id: 'workflow', label: 'Approval Workflow', icon: GitPullRequest },
    { id: 'erp', label: 'ERP Integration', icon: Database },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell, badgeCount: unreadNotifs },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'settings', label: 'Settings & Health', icon: Settings },
  ];

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-200 z-20">
      {/* Platform Title */}
      <div className="p-4 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <HardDrive className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white tracking-wide">OCR ENTERPRISE</h3>
          <p className="text-[11px] text-slate-400">Document Hub v2.4</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 font-semibold' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}

              {item.badgeCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                  {item.badgeCount}
                </span>
              )}

              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footnote */}
      <div className="p-3 m-3 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>OCR Engine (Tesseract)</span>
          <span className="text-emerald-400 font-medium">Online</span>
        </div>
        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-full"></div>
        </div>
      </div>
    </aside>
  );
};
