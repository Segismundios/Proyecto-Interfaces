// Client component: usePathname para resaltar el link activo + useState/useTransition
// para la búsqueda global (useTransition marca el filtrado como no urgente).
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Bell, Plus, ChevronDown, GitPullRequest,
  BookOpen, Settings, LogOut, X,
} from "lucide-react";
import { currentUser } from "@/data/users";
import { repositories } from "@/data/repos";
import { Avatar } from "@/components/ui/Avatar";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useUserData } from "@/context/UserDataContext";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  useState, useTransition, useMemo, useRef, useEffect,
} from "react";
import { timeAgo } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useUserData();

  // ── Búsqueda global ──────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query, 200);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown de búsqueda al hacer click fuera
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // useTransition: el filtrado es no urgente — React prioriza keystroke primero
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return null;
    const q = debouncedQuery.toLowerCase();
    const repos = repositories.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
    return { repos };
  }, [debouncedQuery]);

  function handleQueryChange(v: string) {
    setQuery(v);
    setSearchOpen(v.trim().length > 0);
    startTransition(() => {
      // El re-cómputo de searchResults es marcado como no urgente
    });
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setQuery("");
      setSearchOpen(false);
    }
  }

  // ── Nav links ────────────────────────────────────────────────────────────
  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/explore", label: "Explore" },
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

        {/* Search global */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gh-fg-muted pointer-events-none"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => query.trim() && setSearchOpen(true)}
            placeholder="Type / to search"
            aria-label="Search repositories"
            aria-haspopup="listbox"
            className="w-full bg-gh-canvas border border-gh-border rounded-md pl-9 pr-8 py-1.5 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent transition-colors"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setSearchOpen(false); }}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gh-fg-muted hover:text-gh-fg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Resultados */}
          {searchOpen && searchResults && (
            <div
              role="listbox"
              aria-label="Resultados de búsqueda"
              className="absolute top-full left-0 mt-1 w-full bg-gh-canvas-subtle border border-gh-border rounded-md shadow-xl z-50 py-1"
            >
              {isPending && (
                <p className="px-3 py-2 text-xs text-gh-fg-muted">Buscando…</p>
              )}
              {!isPending && searchResults.repos.length === 0 && (
                <p className="px-3 py-2 text-xs text-gh-fg-muted">
                  Sin resultados para &ldquo;{query}&rdquo;
                </p>
              )}
              {!isPending && searchResults.repos.length > 0 && (
                <>
                  <p className="px-3 py-1 text-[10px] font-semibold text-gh-fg-muted uppercase tracking-wide">
                    Repositorios
                  </p>
                  {searchResults.repos.slice(0, 5).map((repo) => (
                    <button
                      key={`${repo.owner}/${repo.name}`}
                      role="option"
                      aria-selected={false}
                      className="w-full text-left flex items-center gap-2 px-3 py-1.5 hover:bg-gh-btn-bg text-sm text-gh-fg focus:outline-none focus:bg-gh-btn-bg"
                      onClick={() => {
                        router.push(`/${repo.owner}/${repo.name}`);
                        setQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-gh-fg-muted shrink-0" />
                      <span className="font-medium">{repo.owner}/{repo.name}</span>
                      <span className="text-xs text-gh-fg-muted truncate">{repo.description}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
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
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notificaciones */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ""}`}
                className="relative p-1 rounded text-gh-fg hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span
                    aria-hidden
                    className="absolute top-0 right-0 w-2.5 h-2.5 bg-gh-accent rounded-full border-2 border-gh-canvas-subtle"
                  />
                )}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gh-border">
                <span className="text-xs font-semibold text-gh-fg">Notificaciones</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-gh-accent hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gh-accent rounded"
                  >
                    Marcar todo como leído
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="px-3 py-4 text-xs text-gh-fg-muted text-center">
                  Sin notificaciones
                </p>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <DropdownMenu.Item
                    key={n.id}
                    onSelect={() => {
                      markNotificationRead(n.id);
                      router.push(n.href);
                    }}
                    className={`flex-col items-start gap-0.5 py-2 ${!n.read ? "bg-gh-accent/5" : ""}`}
                  >
                    <div className="flex items-start gap-2 w-full">
                      {!n.read && (
                        <span className="mt-1 w-2 h-2 rounded-full bg-gh-accent shrink-0" aria-hidden />
                      )}
                      <span className={`text-xs leading-snug ${n.read ? "ml-4" : ""}`}>
                        {n.title}
                      </span>
                    </div>
                    <span className="ml-4 text-[11px] text-gh-fg-muted">
                      {timeAgo(n.createdAt)}
                    </span>
                  </DropdownMenu.Item>
                ))
              )}
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={() => router.push("/notifications")}>
                Ver todas las notificaciones
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* Quick create */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                aria-label="Crear nuevo"
                className="flex items-center gap-1 p-1 rounded text-gh-fg hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
              >
                <Plus className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item onSelect={() => router.push("/")}>
                <BookOpen className="w-4 h-4" />
                New repository
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() =>
                  router.push(`/${currentUser.username}/proyecto-interfaces/pull/1`)
                }
              >
                <GitPullRequest className="w-4 h-4" />
                New pull request
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onSelect={() =>
                  router.push(`/${currentUser.username}/proyecto-interfaces/issues`)
                }
              >
                New issue
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* User menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                aria-label="Menú de usuario"
                className="flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
              >
                <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="sm" />
                <ChevronDown className="w-3 h-3 text-gh-fg-muted" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <div className="px-3 py-2 border-b border-gh-border">
                <p className="text-xs font-semibold text-gh-fg">
                  {currentUser.displayName}
                </p>
                <p className="text-[11px] text-gh-fg-muted">@{currentUser.username}</p>
              </div>
              <DropdownMenu.Item
                onSelect={() => router.push(`/${currentUser.username}`)}
              >
                <BookOpen className="w-4 h-4" />
                Your repositories
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => router.push("/settings")}>
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onSelect={() => {}}
                className="text-gh-danger focus:text-white"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </nav>
  );
}
