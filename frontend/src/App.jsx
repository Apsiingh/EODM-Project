import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Toast } from './components/common/Toast';

import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { DocumentUpload } from './pages/DocumentUpload';
import { OcrReview } from './pages/OcrReview';
import { ValidationQueue } from './pages/ValidationQueue';
import { WorkflowApprovals } from './pages/WorkflowApprovals';
import { ErpIntegration } from './pages/ErpIntegration';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { AuditLogs } from './pages/AuditLogs';
import { Notifications } from './pages/Notifications';
import { UserManagement } from './pages/UserManagement';
import { SettingsAdmin } from './pages/SettingsAdmin';
import { AuthPage } from './pages/AuthPage';

export function App() {
  const { activePage } = useApp();

  if (activePage === 'login') {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'documents' && <Documents />}
          {activePage === 'upload' && <DocumentUpload />}
          {activePage === 'ocr-review' && <OcrReview />}
          {activePage === 'validation' && <ValidationQueue />}
          {activePage === 'workflow' && <WorkflowApprovals />}
          {activePage === 'erp' && <ErpIntegration />}
          {activePage === 'reports' && <ReportsAnalytics />}
          {activePage === 'audit' && <AuditLogs />}
          {activePage === 'notifications' && <Notifications />}
          {activePage === 'users' && <UserManagement />}
          {activePage === 'settings' && <SettingsAdmin />}
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default App;
