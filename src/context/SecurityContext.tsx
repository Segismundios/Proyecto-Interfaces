// Client component: la verificación es UX puro (no hay backend); usamos
// localStorage con TTL para que la sesión "verificada" sobreviva navegación
// y reload, pero expire pasados 30 minutos (patrón sudo de GitHub/macOS).
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "gh-security-verified-until";
const TTL_MS = 30 * 60 * 1000; // 30 minutos

interface SecurityContextValue {
  isVerified: boolean;
  remainingMs: number;
  verify: (password: string) => Promise<boolean>;
  reset: () => void;
}

const SecurityContext = createContext<SecurityContextValue | null>(null);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [verifiedUntil, setVerifiedUntil] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  // Hidratar desde localStorage al montar (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const ts = Number(raw);
      if (Number.isFinite(ts) && ts > Date.now()) {
        setVerifiedUntil(ts);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, []);

  // Tick periódico para invalidar cuando expira
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const isVerified = verifiedUntil !== null && verifiedUntil > now;
  const remainingMs = verifiedUntil ? Math.max(0, verifiedUntil - now) : 0;

  async function verify(password: string): Promise<boolean> {
    // Simulamos latencia para mostrar loading state.
    await new Promise((r) => setTimeout(r, 600));
    if (!password.trim()) return false;
    const until = Date.now() + TTL_MS;
    setVerifiedUntil(until);
    try {
      localStorage.setItem(STORAGE_KEY, String(until));
    } catch {}
    return true;
  }

  function reset() {
    setVerifiedUntil(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return (
    <SecurityContext.Provider value={{ isVerified, remainingMs, verify, reset }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const ctx = useContext(SecurityContext);
  if (!ctx) throw new Error("useSecurity must be used inside SecurityProvider");
  return ctx;
}
