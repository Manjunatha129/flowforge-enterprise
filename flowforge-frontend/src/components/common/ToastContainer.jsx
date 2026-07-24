import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const styles = {
    success: 'bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40',
    error: 'bg-slate-900/95 border-rose-500/40 text-rose-300 shadow-rose-950/40',
    info: 'bg-slate-900/95 border-brand-500/40 text-brand-300 shadow-brand-950/40',
  };

  const iconColors = {
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    error: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    info: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const IconComponent = icons[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform animate-in slide-in-from-bottom-5 fade-in ${styles[toast.type]}`}
          >
            <div className="flex items-center space-x-3.5 pr-2">
              <div className={`p-2 rounded-lg border ${iconColors[toast.type]}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-100 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
