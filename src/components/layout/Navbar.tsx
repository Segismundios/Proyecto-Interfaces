"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, ChevronDown } from "lucide-react";
import { currentUser } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: `/${currentUser.username}/proyecto-interfaces`, label: "Repository" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="bg-gh-canvas-subtle border-b border-gh-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-lg tracking-tight hover:text-gh-fg-muted transition-colors">
          DevHub
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gh-fg-muted" />
            <input
              type="text"
              placeholder="Type / to search"
              className="w-full bg-gh-canvas border border-gh-border rounded-md pl-9 pr-3 py-1.5 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:border-gh-accent"
            />
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === link.href
                  ? "text-white font-semibold bg-gh-btn-bg"
                  : "text-gh-fg hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          <button className="text-gh-fg hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gh-accent rounded-full" />
          </button>

          <button className="flex items-center gap-1 text-gh-fg hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          <Link href="/settings" className="flex items-center gap-1">
            <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="sm" />
            <ChevronDown className="w-3 h-3 text-gh-fg-muted" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
