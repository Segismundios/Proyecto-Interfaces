"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { repositories } from "@/data/repos";

const SESSION_KEY = "gh-favorites";

function loadFromSession(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  // Fallback: initialize from mock data
  return new Set(
    repositories.filter((r) => r.isFavorite).map((r) => `${r.owner}/${r.name}`)
  );
}

interface FavoritesContextValue {
  favorites: Set<string>;
  isFavorite: (owner: string, name: string) => boolean;
  toggleFavorite: (owner: string, name: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load from sessionStorage on mount (client only)
  useEffect(() => {
    setFavorites(loadFromSession());
  }, []);

  function toggleFavorite(owner: string, name: string) {
    const key = `${owner}/${name}`;
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }

  function isFavorite(owner: string, name: string) {
    return favorites.has(`${owner}/${name}`);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
