import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { login, activeTheme } = useAuth();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(password);
      setPassword('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Incorrect password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-[24px_6px_24px_6px] shadow-[8px_8px_0px_rgba(15,23,42,1)] border-2 border-slate-900 p-6 sm:p-8 overflow-hidden crosshair-pattern">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-[6px_2px_6px_2px] hover:bg-[#F0ECE4] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-2 mb-6">
          <div 
            className="w-14 h-14 mx-auto rounded-[14px_4px_14px_4px] bg-slate-900 border-2 border-slate-900 flex items-center justify-center"
            style={{ boxShadow: `3px 3px 0px ${activeTheme.primaryColor}` }}
          >
            <Zap className="w-7 h-7" style={{ fill: activeTheme.primaryColor, color: activeTheme.primaryColor }} />
          </div>
          <h2 className="font-heading text-xl font-black text-slate-900 uppercase">
            {t('login_title')}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {t('login_sub')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-[8px_2px_8px_2px] bg-rose-50 border-2 border-rose-300 flex items-center space-x-2 text-xs text-rose-700 font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono-tech text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
              {t('login_pwd_label')}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login_pwd_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-[#FAF9F6] border-2 border-[#E2DDD5] rounded-[10px_3px_10px_3px] focus:outline-none focus:border-slate-900 focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all font-heading"
                autoFocus
              />
            </div>
            <p className="font-mono-tech text-[10px] text-slate-400 mt-1.5">
              {t('login_pwd_hint')} <code className="bg-[#EDE7DE] px-1.5 py-0.5 rounded text-rose-600 font-bold">admin</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-mechanical w-full flex items-center justify-center space-x-2 py-3 px-4 text-white font-extrabold text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            {isLoading ? (
              <span>{t('login_verifying')}</span>
            ) : (
              <>
                <span>{t('login_btn_submit')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
