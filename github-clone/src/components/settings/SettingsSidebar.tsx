"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Key, Shield, Bell, Eye, Paintbrush } from "lucide-react";

const menuItems = [
  { href: "/settings", label: "Profile", icon: User },
  { href: "/settings/tokens", label: "Access Tokens", icon: Key, highlight: true },
  { href: "/settings/ssh-keys", label: "SSH Keys", icon: Shield, highlight: true },
  { href: "#", label: "Appearance", icon: Paintbrush },
  { href: "#", label: "Accessibility", icon: Eye },
  { href: "#", label: "Notifications", icon: Bell },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0">
      <h2 className="text-sm font-semibold text-gh-fg mb-2 px-3">Settings</h2>
      <ul className="space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-gh-btn-bg text-white font-medium"
                    : "text-gh-fg hover:bg-gh-canvas-subtle"
                } ${item.highlight && !isActive ? "text-gh-accent" : ""}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.highlight && (
                  <span className="ml-auto text-[10px] bg-gh-accent/20 text-gh-accent px-1.5 py-0.5 rounded-full">
                    Quick
                  </span>
                )}
              </Link>
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
  );
}
