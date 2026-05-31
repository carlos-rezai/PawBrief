import { createContext, useContext, useState, type ReactNode } from "react";
import { ToastContainer, ToastItem } from "./Toast.styles";

interface ToastEntry {
  id: number;
  message: string;
}

interface ToastContextValue {
  enqueue: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let _nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const enqueue = (message: string) => {
    const id = ++_nextId;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ enqueue }}>
      {children}
      <ToastContainer aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id}>{t.message}</ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
