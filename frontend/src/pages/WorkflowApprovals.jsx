import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GitPullRequest, CheckCircle2, Clock, XCircle, User, MessageSquare, 
  Send, Shield, ArrowRight, CornerDownRight, FileText
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const WorkflowApprovals = () => {
  const { documents, currentRole, updateDocumentStatus, triggerErpSync, showToast } = useApp();
  const [commentDoc, setCommentDoc] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [actionType, setActionType] = useState('Approve'); // Approve, Request Changes, Reject

  const pendingDocs = documents.filter(d => d.status === 'Pending');

  const handleExecuteWorkflow = () => {
    if (!commentDoc) return;
    
    if (actionType === 'Approve') {
      updateDocumentStatus(commentDoc.id, 'Processed', 'Completed', commentText || 'Approved by ' + currentRole);
      triggerErpSync(commentDoc.id, 'SAP S/4HANA');
    } else if (actionType === 'Reject') {
      updateDocumentStatus(commentDoc.id, 'Rejected', 'Rejected', commentText || 'Rejected by ' + currentRole);
    } else {
      updateDocumentStatus(commentDoc.id, 'Pending', 'Revision Requested', commentText || 'Changes requested');
    }

    setCommentDoc(null);
    setCommentText('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5 text-brand-500" />
            <span>Multi-Level Approval Workflow</span>
          </h2>
          <p className="text-xs text-slate-400">Sequential multi-stage financial signoff: Manager ➔ Finance ➔ CFO</p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-900 text-xs font-semibold text-brand-700 dark:text-brand-300">
          Viewing Context: {currentRole}
        </div>
      </div>

      {/* Pending Items List */}
      <div className="space-y-4">
        {pendingDocs.map(doc => (
          <div key={doc.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Doc summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{doc.id}</span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{doc.vendor}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{doc.name} • PO: {doc.poNumber} • Date: {doc.invoiceDate}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400">Grand Total Payable</p>
                <p className="text-xl font-black font-mono text-slate-900 dark:text-white">₹{doc.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Stage Progress Bar (3-Stage Workflow Tracker) */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Approval Pipeline Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {doc.approvalWorkflow.map((stage, idx) => {
                  const isApproved = stage.status === 'Approved';
                  const isPending = stage.status === 'Pending';
                  const isRejected = stage.status === 'Rejected';

                  return (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isApproved 
                          ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20' 
                          : isRejected 
                          ? 'border-red-500/30 bg-red-50/50 dark:bg-red-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{stage.step}</span>
                        {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {isPending && <Clock className="w-4 h-4 text-amber-500 animate-pulse" />}
                        {isRejected && <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{stage.user}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{stage.timestamp}</span>
                      {stage.comments && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 italic">
                          "{stage.comments}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => { setCommentDoc(doc); setActionType('Reject'); }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 hover:bg-red-200"
              >
                Reject
              </button>
              <button
                onClick={() => { setCommentDoc(doc); setActionType('Request Changes'); }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200"
              >
                Request Changes
              </button>
              <button
                onClick={() => { setCommentDoc(doc); setActionType('Approve'); }}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Invoice</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Confirmation Modal */}
      <Modal
        isOpen={!!commentDoc}
        onClose={() => setCommentDoc(null)}
        title={`${actionType} Invoice - ${commentDoc?.id}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Confirming action as <strong className="text-slate-900 dark:text-white">{currentRole}</strong> for invoice from <strong>{commentDoc?.vendor}</strong> (Amount: ₹{commentDoc?.totalAmount.toLocaleString()}).
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Approval / Feedback Notes</label>
            <textarea
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter approval comments or change request notes..."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setCommentDoc(null)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteWorkflow}
              className={`px-5 py-2 text-xs font-semibold rounded-xl text-white shadow-md ${
                actionType === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              Confirm {actionType}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
