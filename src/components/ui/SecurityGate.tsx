"use client";

import { useState } from "react";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSecurity } from "@/context/SecurityContext";

interface SecurityGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function SecurityGate({
  children,
  title = "Confirm access",
  description = "Esta sección contiene credenciales sensibles. Confirma tu contraseña para continuar.",
}: SecurityGateProps) {
  const { isVerified, verify, remainingMs } = useSecurity();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isVerified) {
    return (
      <>
        <VerifiedBadge remainingMs={remainingMs} />
        {children}
      </>
    );
  }

  async function handleSubmit() {
    if (!password.trim()) {
      setError("Ingresa tu contraseña para continuar");
      return;
    }
    setSubmitting(true);
    setError(null);
    const ok = await verify(password);
    setSubmitting(false);
    if (!ok) {
      setError("Contraseña incorrecta");
      setPassword("");
    }
  }

  return (
    <>
      {/* Blurred preview of the protected content */}
      <div aria-hidden="true" className="pointer-events-none select-none opacity-20 blur-sm">
        {children}
      </div>

      {/* Overlay modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-gate-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <div className="bg-gh-canvas-subtle border border-gh-border rounded-xl shadow-2xl w-full max-w-sm">
          <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center border-b border-gh-border">
            <div className="w-14 h-14 rounded-full bg-gh-btn-bg border border-gh-border flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-gh-fg" />
            </div>
            <h2 id="security-gate-title" className="text-base font-semibold text-gh-fg mb-1">
              {title}
            </h2>
            <p className="text-sm text-gh-fg-muted">{description}</p>
          </div>

          <div className="px-6 py-6 space-y-3">
            <div>
              <label htmlFor="gate-password" className="block text-sm text-gh-fg mb-1.5">
                Tu contraseña
              </label>
              <input
                id="gate-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit()}
                placeholder="············"
                autoFocus
                disabled={submitting}
                className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 disabled:cursor-not-allowed"
                aria-invalid={error !== null}
                aria-describedby={error ? "gate-password-error" : undefined}
              />
              {error && (
                <p
                  id="gate-password-error"
                  role="alert"
                  className="mt-1.5 text-xs text-gh-danger"
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col gap-2">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm password"
              )}
            </Button>
            <button
              type="button"
              className="text-xs text-gh-accent hover:underline text-center py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function VerifiedBadge({ remainingMs }: { remainingMs: number }) {
  const minutes = Math.ceil(remainingMs / 60_000);
  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-3 flex items-center gap-2 px-3 py-1.5 text-xs text-gh-success bg-gh-success/10 border border-gh-success/30 rounded-md w-fit"
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>
        Sesión verificada · expira en {minutes} min
      </span>
    </div>
  );
}
