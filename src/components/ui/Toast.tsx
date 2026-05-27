// Client component: Radix Toast gestiona el ciclo de vida (open → swipe →
// close), animaciones y aria-live; requiere estado y eventos de browser.
"use client";

import * as RadixToast from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { ReactNode, createContext, useContext, useState, useCallback, ReactElement } from "react";

/* ─── Tipos ─── */

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
}

/* ─── Context ─── */

const ToastContext = createContext<ToastContextValue | null>(null);

/* ─── Provider (envuelve layout.tsx) ─── */

export function ToastProvider({ children }: { children: ReactNode }): ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((item: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, ...item }]);
    // Auto-remove después de la animación de salida (1.5s extra de margen)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6500);
  }, []);

  const variantIcon: Record<ToastVariant, ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-gh-success" />,
    error: <AlertCircle className="w-4 h-4 text-gh-danger" />,
    info: <Info className="w-4 h-4 text-gh-accent" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToast.Provider swipeDirection="right" duration={5000}>
        {children}

        {toasts.map((t) => (
          <RadixToast.Root
            key={t.id}
            className={[
              "flex items-start gap-3 rounded-md border px-4 py-3 shadow-xl",
              "bg-gh-canvas-subtle border-gh-border text-gh-fg",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
              "data-[state=open]:slide-in-from-top-full",
              "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
              "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
              "transition-all duration-300",
            ].join(" ")}
          >
            {t.variant && variantIcon[t.variant]}
            <div className="flex-1 min-w-0">
              <RadixToast.Title className="text-sm font-semibold">
                {t.title}
              </RadixToast.Title>
              {t.description && (
                <RadixToast.Description className="text-xs text-gh-fg-muted mt-0.5">
                  {t.description}
                </RadixToast.Description>
              )}
            </div>
            <RadixToast.Close
              aria-label="Cerrar notificación"
              className="text-gh-fg-muted hover:text-gh-fg transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
            >
              <X className="w-3.5 h-3.5" />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}

        <RadixToast.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[100vw]" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

/* ─── Hook de uso ─── */

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
