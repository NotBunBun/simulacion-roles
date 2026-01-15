'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  severity: ToastSeverity;
}

export interface ConfirmConfig {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
}

interface NotificationContextProps {
  toasts: Toast[];
  showToast: (message: string, severity: ToastSeverity) => void;
  hideToast: (id: string) => void;
  confirmDialog: ConfirmConfig | null;
  showConfirm: (config: ConfirmConfig) => void;
  hideConfirm: () => void;
  loading: boolean;
  showLoading: (show: boolean) => void;
}

export const NotificationContext = createContext<NotificationContextProps>(
  {} as NotificationContextProps
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const showToast = useCallback((message: string, severity: ToastSeverity) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, severity }]);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 6000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showConfirm = useCallback((config: ConfirmConfig) => {
    setConfirmDialog(config);
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  const showLoading = useCallback((show: boolean) => {
    setLoading(show);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        showToast,
        hideToast,
        confirmDialog,
        showConfirm,
        hideConfirm,
        loading,
        showLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
