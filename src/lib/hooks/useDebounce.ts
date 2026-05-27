// Hook para debouncear valores (ej: input de búsqueda).
// Sólo puede usarse en Client Components (usa useEffect + setTimeout).
"use client";

import { useState, useEffect } from "react";

/**
 * Retorna una versión "debounceada" de `value` que sólo se actualiza
 * después de que `delay` ms hayan pasado sin nuevos cambios.
 * Útil para evitar búsquedas en cada keystroke.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup obligatorio (regla useEffect)
  }, [value, delay]);

  return debouncedValue;
}
