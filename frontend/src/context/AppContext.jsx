import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_DOCUMENTS, MOCK_NOTIFICATIONS, MOCK_USERS, MOCK_AUDIT_LOGS } from '../utils/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState('dark'); // 'dark' default for modern executive look
  const [currentRole, setCurrentRole] = useState('Admin User');
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState('INV-2024-0001');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sync theme class to document elem
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toast trigger helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to add audit log
  const logAudit = (action, details) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleString(),
      user: currentUser.name,
      action,
      details,
      ip: '192.168.1.10',
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Role Switcher
  const changeRole = (roleName) => {
    setCurrentRole(roleName);
    const foundUser = MOCK_USERS.find(u => u.role === roleName) || MOCK_USERS[0];
    setCurrentUser(foundUser);
    showToast(`Switched active view role to: ${roleName}`, 'info');
    logAudit('Role Switch', `Switched active role context to ${roleName}`);
  };

  // Document upload handler
  const addDocument = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    showToast(`Uploaded invoice ${newDoc.name} successfully! OCR queueing initiated.`, 'success');
    logAudit('Uploaded Document', `Document ${newDoc.id} uploaded to queue`);
  };

  // Document status updater
  const updateDocumentStatus = (docId, newStatus, stage, comments = '') => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const updatedWorkflow = doc.approvalWorkflow ? [...doc.approvalWorkflow] : [];
        const currentStageIdx = updatedWorkflow.findIndex(w => w.step.toLowerCase().includes(currentRole.toLowerCase().split(' ')[0]));
        
        if (currentStageIdx !== -1) {
          updatedWorkflow[currentStageIdx] = {
            ...updatedWorkflow[currentStageIdx],
            status: newStatus === 'Processed' ? 'Approved' : newStatus,
            timestamp: new Date().toLocaleString(),
            comments: comments || updatedWorkflow[currentStageIdx].comments
          };
        }

        return {
          ...doc,
          status: newStatus,
          approvalStage: stage || doc.approvalStage,
          approvalWorkflow: updatedWorkflow
        };
      }
      return doc;
    }));

    showToast(`Document ${docId} updated to ${newStatus}`, newStatus === 'Rejected' ? 'error' : 'success');
    logAudit('Workflow Action', `Document ${docId} set to ${newStatus} (${comments})`);
  };

  // OCR Field Edit Handler
  const updateOcrField = (docId, fieldKey, newValue) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const updatedFields = doc.ocrFields.map(f => {
          if (f.key === fieldKey) {
            return { ...f, value: newValue, status: 'Valid', confidence: 100 };
          }
          return f;
        });
        return { ...doc, ocrFields: updatedFields, ocrConfidence: 99.8 };
      }
      return doc;
    }));
    showToast(`Field ${fieldKey} updated successfully`, 'success');
    logAudit('OCR Manual Correction', `Field ${fieldKey} corrected to "${newValue}" in document ${docId}`);
  };

  // ERP Sync Trigger
  const triggerErpSync = (docId, erpSystem = 'SAP S/4HANA') => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, erpSyncStatus: `Synced (${erpSystem})` };
      }
      return doc;
    }));
    showToast(`Document ${docId} successfully posted to ${erpSystem}`, 'success');
    logAudit('ERP Integration', `Document ${docId} posted to ${erpSystem}`);
  };

  const selectedDocument = documents.find(d => d.id === selectedDocId) || documents[0];

  return (
    <AppContext.Provider value={{
      activePage,
      setActivePage,
      theme,
      setTheme,
      currentRole,
      currentUser,
      changeRole,
      documents,
      selectedDocId,
      setSelectedDocId,
      selectedDocument,
      addDocument,
      updateDocumentStatus,
      updateOcrField,
      triggerErpSync,
      notifications,
      setNotifications,
      auditLogs,
      searchQuery,
      setSearchQuery,
      toast,
      showToast,
      isSidebarOpen,
      setIsSidebarOpen,
      logAudit
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
