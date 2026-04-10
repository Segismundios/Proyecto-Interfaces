"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SecurityGate({ children }: { children: React.ReactNode }) {
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState("");

  if (confirmed) return <>{children}</>;

  return (
    <>
      {/* Blurred background hint */}
      <div className="pointer-events-none select-none opacity-20 blur-sm">
        {children}
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-gh-canvas-subtle border border-gh-border rounded-xl shadow-2xl w-full max-w-sm mx-4">
          {/* Header */}
          <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center border-b border-gh-border">
            <div className="w-14 h-14 rounded-full bg-gh-btn-bg border border-gh-border flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-gh-fg" />
            </div>
            <h2 className="text-base font-semibold text-gh-fg mb-1">Confirm access</h2>
            <p className="text-sm text-gh-fg-muted">
              For security, please confirm your password to continue.
            </p>
          </div>

          {/* Password form */}
          <div className="px-6 py-6 space-y-3">
            <div>
              <label className="block text-sm text-gh-fg mb-1.5">Your password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setConfirmed(true)}
                placeholder="············"
                autoFocus
                className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg focus:outline-none focus:border-gh-accent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-col gap-2">
            <Button variant="primary" onClick={() => setConfirmed(true)} className="w-full justify-center">
              Confirm password
            </Button>
            <button className="text-xs text-gh-accent hover:underline text-center py-1">
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
