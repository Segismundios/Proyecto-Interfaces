"use client";

import Link from "next/link";
import { Star, Lock, Globe } from "lucide-react";
import { Repository } from "@/types";
import { Card } from "@/components/ui/Card";
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

  if (favorites.length === 0) {
    return (
      <div>
        <h2 className="text-base font-semibold text-gh-fg mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-gh-warning" />
          Favorite Repositories
        </h2>
        <p className="text-sm text-gh-fg-muted">No favorite repositories yet. Star a repository to see it here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gh-fg mb-3 flex items-center gap-2">
        <Star className="w-4 h-4 text-gh-warning" />
        Favorite Repositories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {favorites.map((repo) => (
          <Card key={repo.name} className="hover:border-gh-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <Link
                href={`/${repo.owner}/${repo.name}`}
                className="text-gh-accent font-semibold text-sm hover:underline"
              >
                {repo.owner}/{repo.name}
              </Link>
              <span className="flex items-center gap-1 text-xs text-gh-fg-muted border border-gh-border rounded-full px-2 py-0.5">
                {getVisibility(repo.owner, repo.name) === "private" ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                {getVisibility(repo.owner, repo.name)}
              </span>
            </div>
            <p className="text-xs text-gh-fg-muted mb-3 line-clamp-2">{repo.description}</p>
            <div className="flex items-center gap-3 text-xs text-gh-fg-muted">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: repo.languageColor }} />
                {repo.language}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" /> {starCount(repo, isFavorite)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
