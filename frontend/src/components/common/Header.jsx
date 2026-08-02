import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Bell, Sun, Moon, HelpCircle, User, ChevronDown, 
  Menu, Shield, LogOut, CheckCircle2, AlertTriangle, FileText, Settings, Key
} from 'lucide-react';

export const Header = () => {
  const { 
    theme, setTheme, 
    currentRole, changeRole, 
    currentUser, 
    notifications, 
    searchQuery, setSearchQuery, 
    isSidebarOpen, setIsSidebarOpen,
    setActivePage,
    showToast
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const rolesList = [
    'Admin User',
    'Manager Approval',
    'Finance Approval',
    'Compliance Auditor',
    'Vendor User'
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between transition-colors">
      {/* Left section: Sidebar toggle & Title */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
            OCR
          </div>
          <span className="hidden sm:inline font-bold text-lg text-slate-800 dark:text-white tracking-tight">
            EODM <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 font-semibold uppercase tracking-wider ml-1">Enterprise</span>
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents, vendor name, invoice #, PO reference..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Role Switcher, Notifs, Theme, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Role Switcher Pill */}
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1 border border-slate-200 dark:border-slate-700 text-xs">
          <Shield className="w-3.5 h-3.5 text-brand-500 mr-1.5" />
          <span className="text-slate-500 dark:text-slate-400 mr-1.5 font-medium">Role:</span>
          <select 
            value={currentRole}
            onChange={(e) => changeRole(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            {rolesList.map(r => (
              <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifMenu(!showNotifMenu); setShowProfileMenu(false); }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Notifications</h4>
                <button 
                  onClick={() => { setActivePage('notifications'); setShowNotifMenu(false); }} 
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start space-x-3 cursor-pointer">
                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
                    {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
                    {n.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                    {n.type === 'info' && <FileText className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />}
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifMenu(false); }}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full object-cover border-2 border-brand-500/40"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{currentRole}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-sm text-slate-800 dark:text-white">{currentUser.name}</p>
                <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
              </div>
              <div className="py-1 text-xs">
                <button 
                  onClick={() => { setActivePage('users'); setShowProfileMenu(false); }}
                  className="w-full px-4 py-2 text-left flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button 
                  onClick={() => { setActivePage('settings'); setShowProfileMenu(false); }}
                  className="w-full px-4 py-2 text-left flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Key className="w-4 h-4" />
                  <span>Change Password / Security</span>
                </button>
                <button 
                  onClick={() => { setActivePage('settings'); setShowProfileMenu(false); }}
                  className="w-full px-4 py-2 text-left flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4" />
                  <span>Platform Settings</span>
                </button>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button 
                  onClick={() => { setActivePage('login'); setShowProfileMenu(false); showToast('Logged out of system session', 'info'); }}
                  className="w-full px-4 py-2 text-left flex items-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
