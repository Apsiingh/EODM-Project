import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Key, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthPage = () => {
  const { setActivePage, showToast } = useApp();

  const [email, setEmail] = useState('alex.wright@enterprise.com');
  const [password, setPassword] = useState('••••••••••••');
  const [step, setStep] = useState('login'); // login or mfa
  const [mfaCode, setMfaCode] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (step === 'login') {
      setStep('mfa');
      showToast('MFA verification code sent to corporate email', 'info');
    } else {
      showToast('Authenticated successfully via JWT & MFA', 'success');
      setActivePage('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Glowing background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Header Logo */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-brand-600/30 mb-3">
            OCR
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Enterprise OCR Platform</h2>
          <p className="text-xs text-slate-400 mt-1">Single Sign-On & Multi-Factor Security Portal</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {step === 'login' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Enter 6-Digit MFA Security Code</label>
              <input
                type="text"
                placeholder="1 2 3 4 5 6"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                maxLength={6}
                required
                className="w-full px-4 py-3 text-center tracking-[0.5em] font-mono font-bold text-lg bg-slate-800 border border-brand-500 rounded-xl text-white focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-2 text-center">Check your Authenticator app or email inbox</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all mt-2"
          >
            <span>{step === 'login' ? 'Continue to MFA' : 'Verify & Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          Secured by OAuth 2.0 / SAML 2.0 Enterprise Gateway
        </div>
      </div>
    </div>
  );
};
