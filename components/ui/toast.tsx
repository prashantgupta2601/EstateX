'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

let toastListeners: Array<(msg: ToastMessage) => void> = [];

export const toast = (message: string, type: 'success' | 'error' = 'success') => {
  const id = Math.random().toString(36).substring(2, 9);
  toastListeners.forEach((listener) => listener({ id, message, type }));
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-xl animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <span className="text-xs font-bold text-foreground text-left">{t.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
