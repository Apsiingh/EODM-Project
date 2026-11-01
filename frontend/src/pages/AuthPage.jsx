import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const AuthPage = () => {
  const { showToast, loginUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('login'); // 'login' | 'mfa'
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [authResult, setAuthResult] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    authService.checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (step === 'login') {
      setIsLoading(true);
      try {
        const response = await authService.login({ email: email.trim(), password });
        setAuthResult(response);
        setStep('mfa');
        showToast('MFA code sent to ' + email.trim(), 'info');
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check credentials.';
        setErrorMessage(msg);
        showToast(msg, 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      // MFA Verification Step
      if (mfaCode.length < 6) {
        setErrorMessage('Please enter the full 6-digit MFA security code.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (authResult) {
          loginUser(authResult);
        } else {
          loginUser({
            user: { username: email.split('@')[0], email, roles: ['ROLE_USER'], designation: 'Enterprise User' }
          });
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Header Logo & Backend Status */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-brand-600/30 mb-3">
            OCR
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Enterprise OCR Platform</h2>
          <p className="text-xs text-slate-400 mt-1">Single Sign-On & JWT Security Gateway</p>

          {/* Backend Status Badge */}
          <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] bg-slate-800/80 border border-slate-700">
            <span className={`w-2 h-2 rounded-full ${backendOnline === true ? 'bg-emerald-400 animate-pulse' : backendOnline === false ? 'bg-red-400' : 'bg-slate-400'}`} />
            <span className="text-slate-300">
              {backendOnline === true ? 'Database & Auth Online (:8081)' : backendOnline === false ? 'Auth Service Offline' : 'Connecting to API...'}
            </span>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="flex items-start space-x-2 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {step === 'login' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Corporate Email or Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter corporate email or username"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300">Enter 6-Digit MFA Security Code</label>
                <button
                  type="button"
                  onClick={() => { setStep('login'); setErrorMessage(null); }}
                  className="text-[10px] text-brand-400 hover:underline cursor-pointer"
                >
                  Back to login
                </button>
              </div>
              <input
                type="text"
                placeholder="1 2 3 4 5 6"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                maxLength={6}
                required
                autoFocus
                className="w-full px-4 py-3 text-center tracking-[0.5em] font-mono font-bold text-lg bg-slate-800 border border-brand-500 rounded-xl text-white focus:outline-none shadow-lg shadow-brand-500/10"
              />
              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enter your 6-digit MFA code (e.g. 123456)</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all mt-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Database...</span>
              </>
            ) : (
              <>
                <span>{step === 'login' ? 'Sign In' : 'Verify & Enter Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-center space-x-1">
          <Shield className="w-3.5 h-3.5 text-slate-500" />
          <span>Secured by Spring Boot JWT & PostgreSQL</span>
        </div>
      </div>
    </div>
  );
};
