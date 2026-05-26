"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Key, Shield, Bell, Eye, Paintbrush, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const menuItems = [
  { href: "/settings", label: "Profile", icon: User, protected: false },
  { href: "/settings/tokens", label: "Access Tokens", icon: Key, highlight: true, protected: true },
  { href: "/settings/ssh-keys", label: "SSH Keys", icon: Shield, highlight: true, protected: true },
  { href: "#", label: "Appearance", icon: Paintbrush, protected: false },
  { href: "#", label: "Accessibility", icon: Eye, protected: false },
  { href: "#", label: "Notifications", icon: Bell, protected: false },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  function handleProtectedClick(href: string) {
    setPendingHref(href);
    setPassword("");
  }

  function handleConfirm() {
    if (pendingHref) {
      router.push(pendingHref);
    }
    setPendingHref(null);
  }

  function handleCancel() {
    setPendingHref(null);
  }

  return (
    <>
      <nav className="w-56 shrink-0">
        <h2 className="text-sm font-semibold text-gh-fg mb-2 px-3">Settings</h2>
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const baseClass = `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors w-full text-left ${
              isActive
                ? "bg-gh-btn-bg text-white font-medium"
                : "text-gh-fg hover:bg-gh-canvas-subtle"
            } ${item.highlight && !isActive ? "text-gh-accent" : ""}`;

            return (
              <li key={item.label}>
                {item.protected ? (
                  <button className={baseClass} onClick={() => handleProtectedClick(item.href)}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    <span className="ml-auto text-[10px] bg-gh-accent/20 text-gh-accent px-1.5 py-0.5 rounded-full">
                      Quick
                    </span>
                  </button>
                ) : (
                  <Link href={item.href} className={baseClass}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-6 mx-3 p-3 bg-gh-accent/10 border border-gh-accent/20 rounded-md">
          <p className="text-xs text-gh-accent font-medium mb-1">UX Improvement</p>
          <p className="text-xs text-gh-fg-muted">
            Tokens and SSH keys are now directly accessible from settings, not hidden in Developer Settings.
          </p>
        </div>
      </nav>

      {/* Password confirmation modal */}
      <Modal isOpen={pendingHref !== null} onClose={handleCancel} title="Confirm access">
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-gh-btn-bg border border-gh-border flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-gh-fg" />
            </div>
            <p className="text-sm text-gh-fg-muted">
              For security, please confirm your password to continue.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gh-fg mb-1.5">Your password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder="············"
              autoFocus
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg focus:outline-none focus:border-gh-accent"
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button variant="primary" onClick={handleConfirm} className="w-full justify-center">
              Confirm password
            </Button>
            <button
              onClick={handleCancel}
              className="text-xs text-gh-accent hover:underline text-center py-1"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
