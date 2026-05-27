// Client component: consume FavoritesContext (toggle/read de favoritos)
// que vive en el cliente; requiere eventos de browser para el star button.
"use client";

import Link from "next/link";
import { Star, Lock, Globe } from "lucide-react";
import { Repository } from "@/types";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFavorites } from "@/context/FavoritesContext";
import { useVisibility } from "@/context/VisibilityContext";

interface FavoriteReposProps {
  repos: Repository[];
}

function starCount(repo: Repository, isFavorite: (o: string, n: string) => boolean) {
  return repo.stars - (repo.isFavorite ? 1 : 0) + (isFavorite(repo.owner, repo.name) ? 1 : 0);
}

export function FavoriteRepos({ repos }: FavoriteReposProps) {
  const { isFavorite } = useFavorites();
  const { getVisibility } = useVisibility();
  const favorites = repos.filter((r) => isFavorite(r.owner, r.name));

  return (
    <section aria-labelledby="favorite-repos-heading">
      <h2
        id="favorite-repos-heading"
        className="text-base font-semibold text-gh-fg mb-3 flex items-center gap-2"
      >
        <Star className="w-4 h-4 text-gh-warning" />
        Favorite Repositories
      </h2>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Aún no marcaste favoritos"
          description="Marca un repositorio con la estrella desde su header para verlo destacado aquí."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {favorites.map((repo) => (
            <Card
              key={repo.name}
              className="hover:border-gh-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <Link
                  href={`/${repo.owner}/${repo.name}`}
                  className="text-gh-accent font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent rounded"
                >
                  {repo.owner}/{repo.name}
                </Link>
                <span className="flex items-center gap-1 text-xs text-gh-fg-muted border border-gh-border rounded-full px-2 py-0.5">
                  {getVisibility(repo.owner, repo.name) === "private" ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <Globe className="w-3 h-3" />
                  )}
                  {getVisibility(repo.owner, repo.name)}
                </span>
              </div>
              <p className="text-xs text-gh-fg-muted mb-3 line-clamp-2">{repo.description}</p>
              <div className="flex items-center gap-3 text-xs text-gh-fg-muted">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> {starCount(repo, isFavorite)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
