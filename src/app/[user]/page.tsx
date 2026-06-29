// Client component: vista de perfil con listado de TODOS los repos del usuario.
//
// HALLAZGO E3 (Salinas): el item "Your repositories" del menú de usuario llevaba
// a un repo específico en vez de a una lista. Esta ruta /[user] resuelve eso: es
// el destino correcto para "ver todos mis repositorios". Usa useState para el
// filtro y consume Favorites/Visibility (estado de browser).
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Book, Star, Lock, Globe, Search, GitFork } from "lucide-react";
import { repositories } from "@/data/repos";
import { currentUser } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFavorites } from "@/context/FavoritesContext";
import { useVisibility } from "@/context/VisibilityContext";
import { timeAgo } from "@/lib/utils";

type VisFilter = "all" | "public" | "private";

export default function UserProfilePage() {
  const params = useParams();
  const userName = params.user as string;

  const { isFavorite, toggleFavorite } = useFavorites();
  const { getVisibility } = useVisibility();
  const [query, setQuery] = useState("");
  const [visFilter, setVisFilter] = useState<VisFilter>("all");

  const userRepos = useMemo(
    () => repositories.filter((r) => r.owner === userName),
    [userName]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return userRepos.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      const matchesVis =
        visFilter === "all" || getVisibility(r.owner, r.name) === visFilter;
      return matchesQuery && matchesVis;
    });
  }, [userRepos, query, visFilter, getVisibility]);

  function starCount(stars: number, isFav: boolean, wasFav: boolean) {
    return stars - (wasFav ? 1 : 0) + (isFav ? 1 : 0);
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Columna perfil */}
      <aside className="w-full md:w-72 shrink-0">
        <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="lg" />
        <h1 className="text-xl font-semibold text-gh-fg mt-3">{currentUser.displayName}</h1>
        <p className="text-gh-fg-muted">{userName}</p>
        <p className="text-sm text-gh-fg mt-3">{currentUser.bio}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gh-fg-muted">
          <span>
            <strong className="text-gh-fg">{userRepos.length}</strong> repositorios
          </span>
        </div>
      </aside>

      {/* Listado de repos */}
      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gh-fg">Repositories</h2>

          <div className="flex items-center gap-2">
            {/* Buscador local */}
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gh-fg-muted pointer-events-none"
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a repository…"
                aria-label="Filtrar repositorios"
                className="bg-gh-canvas border border-gh-border rounded-md pl-8 pr-3 py-1.5 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent w-48"
              />
            </div>

            {/* Filtro de visibilidad */}
            <div className="flex border border-gh-border rounded-md overflow-hidden" role="group" aria-label="Filtrar por visibilidad">
              {(["all", "public", "private"] as VisFilter[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisFilter(v)}
                  aria-pressed={visFilter === v}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors border-l border-gh-border first:border-l-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent ${
                    visFilter === v
                      ? "bg-gh-btn-bg text-gh-fg"
                      : "text-gh-fg-muted hover:text-gh-fg"
                  }`}
                >
                  {v === "all" ? "Todos" : v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Book}
            title="Sin repositorios"
            description={
              query || visFilter !== "all"
                ? "Ningún repositorio coincide con el filtro."
                : "Este usuario aún no tiene repositorios."
            }
          />
        ) : (
          <ul className="border border-gh-border rounded-md overflow-hidden divide-y divide-gh-border">
            {filtered.map((repo) => {
              const visibility = getVisibility(repo.owner, repo.name);
              const fav = isFavorite(repo.owner, repo.name);
              return (
                <li
                  key={repo.name}
                  className="flex items-start justify-between gap-4 px-4 py-4 hover:bg-gh-canvas-subtle transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/${repo.owner}/${repo.name}`}
                        className="text-gh-accent font-semibold text-base hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent rounded"
                      >
                        {repo.name}
                      </Link>
                      <Badge variant={visibility === "public" ? "muted" : "warning"}>
                        {visibility === "public" ? (
                          <Globe className="w-3 h-3 mr-1" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {visibility}
                      </Badge>
                    </div>
                    <p className="text-sm text-gh-fg-muted mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gh-fg-muted mt-2">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: repo.languageColor }}
                        />
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />{" "}
                        {starCount(repo.stars, fav, repo.isFavorite)}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" /> {repo.forks}
                      </span>
                      <span>Updated {timeAgo(repo.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Star toggle (reutiliza FavoritesContext) */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(repo.owner, repo.name)}
                    aria-pressed={fav}
                    aria-label={fav ? `Quitar ${repo.name} de favoritos` : `Marcar ${repo.name} como favorito`}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-gh-border bg-gh-btn-bg text-gh-fg hover:bg-gh-btn-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
                  >
                    <Star className={`w-3.5 h-3.5 ${fav ? "fill-gh-warning text-gh-warning" : ""}`} />
                    {fav ? "Starred" : "Star"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
