import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_ERP_SYSTEMS } from '../utils/mockData';
import { 
  Database, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, 
  Settings2, HardDrive, Code, Radio, Zap
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const ErpIntegration = () => {
  const { documents, triggerErpSync, showToast } = useApp();

  const [activeErp, setActiveErp] = useState('sap');
  const [showPayloadModalDoc, setShowPayloadModalDoc] = useState(null);

  // Field Mapping State
  const [fieldMappings, setFieldMappings] = useState([
    { ocrField: 'Vendor Name', erpField: 'SAP LFA1-NAME1 (Vendor Master Name)', type: 'STRING' },
    { ocrField: 'Invoice Number', erpField: 'SAP BKPF-XBLNR (Reference Doc Number)', type: 'STRING' },
    { ocrField: 'Invoice Date', erpField: 'SAP BKPF-BLDAT (Document Date)', type: 'DATE' },
    { ocrField: 'PO Number', erpField: 'SAP EKKO-EBELN (Purchasing Document Number)', type: 'STRING' },
    { ocrField: 'GSTIN Number', erpField: 'SAP LFA1-STCD3 (Tax Number 3)', type: 'STRING' },
    { ocrField: 'Total Amount', erpField: 'SAP BSEG-WRBTR (Amount in Document Currency)', type: 'DECIMAL' }
  ]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <Database className="w-5 h-5 text-brand-500" />
            <span>ERP Integration Hub & Field Mapper</span>
          </h2>
          <p className="text-xs text-slate-400">Synchronize validated invoices with SAP S/4HANA, Oracle ERP Cloud, and MS Dynamics 365</p>
        </div>

        <button 
          onClick={() => showToast('Initiating mass posting for pending sync queue...', 'info')}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center space-x-1.5"
        >
          <Zap className="w-4 h-4" />
          <span>Sync All Approved Invoices</span>
        </button>
      </div>

      {/* ERP System Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_ERP_SYSTEMS.map(erp => (
          <div 
            key={erp.id} 
            onClick={() => setActiveErp(erp.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm ${
              activeErp === erp.id 
                ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30 ring-2 ring-brand-500/20' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-500 font-bold text-xs">
                {erp.code}
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                <Radio className="w-3 h-3 mr-1 animate-pulse" />
                {erp.status} ({erp.pingMs}ms)
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">{erp.name}</h3>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Queue: <strong className="text-slate-800 dark:text-slate-200 font-mono">{erp.syncQueue}</strong></span>
              <span>Total Synced: <strong className="text-slate-800 dark:text-slate-200 font-mono">{erp.totalSynced.toLocaleString()}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Field Mapping Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <Settings2 className="w-4 h-4 text-brand-500" />
              <span>OCR Field to SAP/Oracle ERP Mapping Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">Configure how extracted fields translate to database target schemas</p>
          </div>
          <button 
            onClick={() => showToast('Field mapping schema saved to memory', 'success')}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Save Schema
          </button>
        </div>

        <div className="space-y-2">
          {fieldMappings.map((map, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="w-48 font-bold text-slate-800 dark:text-white">
                {map.ocrField}
              </div>
              <ArrowRight className="w-4 h-4 text-brand-500 shrink-0" />
              <div className="flex-1 font-mono text-brand-600 dark:text-brand-400 font-medium">
                {map.erpField}
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                {map.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent ERP Sync Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">Sync Status & Payload Log</h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {documents.map(doc => (
            <div key={doc.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400 mr-2">{doc.id}</span>
                <span className="font-semibold text-slate-800 dark:text-white">{doc.vendor}</span>
                <span className="text-slate-400 ml-2">(₹{doc.totalAmount.toLocaleString()})</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{doc.erpSyncStatus}</span>
                <button 
                  onClick={() => setShowPayloadModalDoc(doc)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold flex items-center space-x-1"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Payload JSON</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payload JSON Inspector Modal */}
      <Modal
        isOpen={!!showPayloadModalDoc}
        onClose={() => setShowPayloadModalDoc(null)}
        title={`ERP POST JSON Payload - ${showPayloadModalDoc?.id}`}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-400">Target Endpoint: <span className="font-mono text-brand-400">https://sap.enterprise.internal/api/v1/bapi_acc_document_post</span></p>
          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
{JSON.stringify({
  HEADER: {
    DOC_TYPE: "KR",
    COMP_CODE: "1000",
    PSTNG_DATE: showPayloadModalDoc?.invoiceDate,
    REF_DOC_NO: showPayloadModalDoc?.id,
    HEADER_TXT: `OCR Ingestion ${showPayloadModalDoc?.vendor}`
  },
  LINE_ITEMS: showPayloadModalDoc?.lineItems.map(item => ({
    ITEMNO_ACC: item.id,
    GL_ACCOUNT: "0000400000",
    AMT_DOCCUR: item.amount,
    ITEM_TEXT: item.desc
  })),
  TAX_DATA: {
    TAX_CODE: "V1",
    TAX_AMOUNT: showPayloadModalDoc?.taxAmount
  }
}, null, 2)}
          </pre>
        </div>
      </Modal>
    </div>
  );
};
