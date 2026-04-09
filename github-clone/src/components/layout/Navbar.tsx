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
        <Link href="/" className="text-white hover:text-gh-fg-muted transition-colors">
          <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>
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
