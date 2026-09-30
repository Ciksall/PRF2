import React from 'react';
import { Mail, CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'email' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface ToastBannerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isEmail = toast.type === 'email';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900 text-white rounded-xl p-4 shadow-xl border border-slate-700/80 flex items-start gap-3 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="shrink-0 mt-0.5">
              {isEmail ? (
                <div className="w-8 h-8 rounded-lg bg-red-600/30 text-red-400 border border-red-500/40 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
              ) : isSuccess ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-amber-600/30 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white">{toast.title}</div>
              {toast.description && (
                <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {toast.description}
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
