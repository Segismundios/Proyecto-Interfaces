// Client component: error.tsx debe ser Client para acceder a `reset` de React.
// Captura errores en el segmento de ruta del repo y ofrece reintentar.
"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RepoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En producción se enviaría a un servicio de errores (ej: Sentry)
    console.error("[RepoError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <AlertCircle className="w-12 h-12 text-gh-danger" />
      <div>
        <h2 className="text-lg font-semibold text-gh-fg mb-1">
          Algo salió mal al cargar el repositorio
        </h2>
        <p className="text-sm text-gh-fg-muted max-w-md">
          {error.message || "Error inesperado. Intenta de nuevo o vuelve al inicio."}
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
        <Link href="/">
          <Button variant="outline">Ir al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
