// Client component: usePathname + state local del modal de password + simulación
// del flujo loading→success (setTimeout) requieren entorno de browser.
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Key, Shield, Lock, Info, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useSecurity } from "@/context/SecurityContext";

const menuItems = [
  { href: "/settings", label: "Profile", icon: User, protected: false },
  { href: "/settings/tokens", label: "Access Tokens", icon: Key, highlight: true, protected: true },
  { href: "/settings/ssh-keys", label: "SSH Keys", icon: Shield, highlight: true, protected: true },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isVerified, verify, remainingMs } = useSecurity();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleProtectedClick(href: string) {
    // Si ya estamos verificados (TTL vigente), saltamos el modal.
    if (isVerified) {
      router.push(href);
      return;
    }
    setPendingHref(href);
    setPassword("");
    setError(null);
  }

  async function handleConfirm() {
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
      return;
    }
    if (pendingHref) router.push(pendingHref);
    setPendingHref(null);
    setPassword("");
  }

  function handleCancel() {
    setPendingHref(null);
    setPassword("");
    setError(null);
    setSubmitting(false);
  }

  const minutesLeft = Math.ceil(remainingMs / 60_000);

  return (
    <>
      <nav aria-label="Settings navigation" className="w-56 shrink-0">
        <h2 className="text-sm font-semibold text-gh-fg mb-2 px-3">Settings</h2>
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const baseClass = `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gh-canvas relative ${
              isActive
                ? "bg-gh-btn-bg text-white font-medium"
                : "text-gh-fg hover:bg-gh-canvas-subtle"
            } ${item.highlight && !isActive ? "text-gh-accent" : ""}`;

            const indicator = isActive && (
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-gh-accent rounded-r"
              />
            );

            return (
              <li key={item.label}>
                {item.protected ? (
                  <button className={baseClass} onClick={() => handleProtectedClick(item.href)}>
                    {indicator}
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.highlight && (
                      <span className="ml-auto text-[10px] bg-gh-accent/20 text-gh-accent px-1.5 py-0.5 rounded-full">
                        Quick
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={baseClass}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {indicator}
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Estado de la sesión verificada */}
        {isVerified && (
          <div
            role="status"
            aria-live="polite"
            className="mt-3 mx-3 flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-gh-success bg-gh-success/10 border border-gh-success/30 rounded-md"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verificado · {minutesLeft} min</span>
          </div>
        )}

        {/* Reframe callout: justifies WHY tokens/SSH are at top level */}
        <aside
          className="mt-6 mx-3 p-3 bg-gh-accent/10 border border-gh-accent/20 rounded-md"
          aria-label="UX rationale"
        >
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-gh-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gh-accent font-semibold mb-1">
                Frecuencia sobre completitud
              </p>
              <p className="text-xs text-gh-fg-muted leading-relaxed">
                Promovimos <strong className="text-gh-fg">Access Tokens</strong> y{" "}
                <strong className="text-gh-fg">SSH Keys</strong> al primer nivel porque son acciones
                semanales para un desarrollador. En GitHub clásico viven dentro de
                {" "}<code className="text-gh-fg-muted">Settings → Developer settings</code>.
              </p>
            </div>
          </div>
        </aside>
      </nav>

      <Modal isOpen={pendingHref !== null} onClose={handleCancel} title="Confirm access">
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-gh-btn-bg border border-gh-border flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-gh-fg" />
            </div>
            <p className="text-sm text-gh-fg-muted">
              Por seguridad, confirma tu contraseña para continuar.
            </p>
          </div>

          <div>
            <label htmlFor="security-password" className="block text-sm text-gh-fg mb-1.5">
              Tu contraseña
            </label>
            <input
              id="security-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleConfirm()}
              placeholder="············"
              autoFocus
              disabled={submitting}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 disabled:cursor-not-allowed"
              aria-invalid={error !== null}
              aria-describedby={error ? "security-password-error" : undefined}
            />
            {error && (
              <p id="security-password-error" role="alert" className="mt-1.5 text-xs text-gh-danger">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full justify-center"
            >
              {submitting ? "Verifying..." : "Confirm password"}
            </Button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-gh-accent hover:underline text-center py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent rounded"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
