import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_SYSTEM_HEALTH } from '../utils/mockData';
import { Settings, Cpu, HardDrive, Database, ShieldCheck, Activity, Save, RefreshCw } from 'lucide-react';

export const SettingsAdmin = () => {
  const { showToast } = useApp();

  const [tesseractLang, setTesseractLang] = useState('eng+hin+fra');
  const [minConfidence, setMinConfidence] = useState(85);
  const [autoApproveScore, setAutoApproveScore] = useState(98);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Platform & OCR Engine configuration saved', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-brand-500" />
            <span>Administration & Infrastructure Health</span>
          </h2>
          <p className="text-xs text-slate-400">Configure Tesseract OCR thresholds, storage endpoints, and inspect microservices telemetry</p>
        </div>

        <button 
          onClick={() => showToast('Health check ping sent to all microservice workers', 'info')}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Ping Services</span>
        </button>
      </div>

      {/* Infrastructure Telemetry Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Spring Boot & Microservice Cluster Health Monitor</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-white">API Gateway</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">Online</span>
            </div>
            <p className="text-slate-400">Latency: {MOCK_SYSTEM_HEALTH.apiGateway.latencyMs}ms • Uptime: {MOCK_SYSTEM_HEALTH.apiGateway.uptime}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-white">Golang OCR Service</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">Online</span>
            </div>
            <p className="text-slate-400">Workers: {MOCK_SYSTEM_HEALTH.ocrEngine.tesseractWorkers} • Queue Depth: {MOCK_SYSTEM_HEALTH.ocrEngine.queueDepth}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-white">MinIO Storage Cluster</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">Online</span>
            </div>
            <p className="text-slate-400">Used: {MOCK_SYSTEM_HEALTH.storage.usedGb} GB / Free: {MOCK_SYSTEM_HEALTH.storage.freeGb} GB</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-white">Redis 7 Cache</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">Online</span>
            </div>
            <p className="text-slate-400">Hit Rate: {MOCK_SYSTEM_HEALTH.cacheStore.hitRate} • Token Store Active</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-white">RabbitMQ Broker</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">Online</span>
            </div>
            <p className="text-slate-400">Pending Messages: {MOCK_SYSTEM_HEALTH.messageBroker.pendingMessages} • Async Event Queue</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-white">PostgreSQL 16 DB</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">Online</span>
            </div>
            <p className="text-slate-400">Active Pool: {MOCK_SYSTEM_HEALTH.database.connections} connections</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-brand-500" />
          <span>Tesseract v5 OCR Engine Configuration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">OCR Language Packs</label>
            <input 
              type="text" 
              value={tesseractLang}
              onChange={(e) => setTesseractLang(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Min Confidence Flag Cutoff (%)</label>
            <input 
              type="number" 
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Auto-Approve Threshold (%)</label>
            <input 
              type="number" 
              value={autoApproveScore}
              onChange={(e) => setAutoApproveScore(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit"
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
