"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ToastType = "success" | "error";
type Toast = { type: ToastType; message: string };

const ToastContext = createContext<{
  success: (message: string) => void;
  error: (message: string) => void;
} | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 5500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ success: (message) => showToast("success", message), error: (message) => showToast("error", message) }}>
      {children}
      {toast && (
        <div className={`floating-toast floating-toast-${toast.type}`} role={toast.type === "success" ? "status" : "alert"}>
          <span className="floating-toast-icon" aria-hidden="true">{toast.type === "success" ? "✓" : "!"}</span>
          <span>{toast.message}</span>
          <button type="button" className="floating-toast-close" onClick={() => setToast(null)} aria-label="Fechar notificação">×</button>
        </div>
      )}
    </ToastContext.Provider>
  );
}