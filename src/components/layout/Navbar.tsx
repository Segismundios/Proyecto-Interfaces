// Client component: usePathname requiere router context para resaltar el link activo.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, ChevronDown, Compass } from "lucide-react";
import { currentUser } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: `/${currentUser.username}/proyecto-interfaces`, label: "Repository" },
    { href: "/settings", label: "Settings" },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="bg-gh-canvas-subtle border-b border-gh-border px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-bold text-lg tracking-tight hover:text-gh-fg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent rounded"
        >
          DevHub
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gh-fg-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Type / to search"
              aria-label="Search"
              className="w-full bg-gh-canvas border border-gh-border rounded-md pl-9 pr-3 py-1.5 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent transition-colors"
            />
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent ${
                  active
                    ? "text-white font-semibold bg-gh-btn-bg"
                    : "text-gh-fg hover:text-white hover:bg-gh-btn-bg/50"
                }`}
              >
                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            aria-label="Notifications"
            className="text-gh-fg hover:text-white transition-colors relative p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-gh-accent rounded-full border-2 border-gh-canvas-subtle" />
          </button>

          <button
            type="button"
            aria-label="Quick create"
            className="flex items-center gap-1 text-gh-fg hover:text-white transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
          >
            <Plus className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          <Link
            href="/settings"
            aria-label="Profile and settings"
            className="flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
          >
            <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="sm" />
            <ChevronDown className="w-3 h-3 text-gh-fg-muted" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
