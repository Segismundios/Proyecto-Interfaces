// Client component: persiste cambios de visibilidad del repo en localStorage
// para que el toggle del header sobreviva navegación entre rutas.
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { repositories } from "@/data/repos";

const STORAGE_KEY = "gh-visibility";

type VisibilityMap = Record<string, "public" | "private">;

function loadFromSession(): VisibilityMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return Object.fromEntries(
    repositories.map((r) => [`${r.owner}/${r.name}`, r.visibility])
  );
}

interface VisibilityContextValue {
  getVisibility: (owner: string, name: string) => "public" | "private";
  toggleVisibility: (owner: string, name: string) => void;
}

const VisibilityContext = createContext<VisibilityContextValue | null>(null);

export function VisibilityProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<VisibilityMap>({});

  useEffect(() => {
    setMap(loadFromSession());
  }, []);

  function getVisibility(owner: string, name: string): "public" | "private" {
    const key = `${owner}/${name}`;
    if (key in map) return map[key];
    return repositories.find((r) => r.owner === owner && r.name === name)?.visibility ?? "public";
  }

  function toggleVisibility(owner: string, name: string) {
    const key = `${owner}/${name}`;
    setMap((prev) => {
      const current = prev[key] ?? getVisibility(owner, name);
      const next = { ...prev, [key]: current === "public" ? "private" : "public" } as VisibilityMap;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return (
    <VisibilityContext.Provider value={{ getVisibility, toggleVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const ctx = useContext(VisibilityContext);
  if (!ctx) throw new Error("useVisibility must be used inside VisibilityProvider");
  return ctx;
}
