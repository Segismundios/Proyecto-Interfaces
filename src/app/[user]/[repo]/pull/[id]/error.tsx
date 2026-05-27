// Client component: error.tsx debe ser Client para acceder a `reset`.
// Captura errores en la vista de Pull Request.
"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function PRError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();

  useEffect(() => {
    console.error("[PRError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <AlertCircle className="w-12 h-12 text-gh-danger" />
      <div>
        <h2 className="text-lg font-semibold text-gh-fg mb-1">
          Error al cargar el pull request
        </h2>
        <p className="text-sm text-gh-fg-muted max-w-md">
          {error.message || "No se pudo cargar este PR. Intenta de nuevo."}
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
        <Link href={`/${params.user}/${params.repo}`}>
          <Button variant="outline">Volver al repositorio</Button>
        </Link>
      </div>
    </div>
  );
}
