import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2, Check } from 'lucide-react';

export const Notifications = () => {
  const { notifications, setNotifications, showToast } = useApp();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <Bell className="w-5 h-5 text-brand-500" />
            <span>Notification Center</span>
          </h2>
          <p className="text-xs text-slate-400">System alerts, OCR engine notifications, and approval reminders</p>
        </div>

        <button 
          onClick={markAllRead}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between ${
              n.read 
                ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-80' 
                : 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-200 dark:border-brand-900/40'
            }`}
          >
            <div className="flex items-start space-x-3">
              {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
              {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
              {n.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
              {n.type === 'info' && <Info className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />}

              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">{n.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">{n.time}</span>
              </div>
            </div>

            <button 
              onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
              className="p-1 rounded text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
