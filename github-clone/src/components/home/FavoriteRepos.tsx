import Link from "next/link";
import { Star, Lock, Globe } from "lucide-react";
import { Repository } from "@/types";
import { Card } from "@/components/ui/Card";

interface FavoriteReposProps {
  repos: Repository[];
}

export function FavoriteRepos({ repos }: FavoriteReposProps) {
  const favorites = repos.filter((r) => r.isFavorite);

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
                {repo.visibility === "private" ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                {repo.visibility}
              </span>
            </div>
            <p className="text-xs text-gh-fg-muted mb-3 line-clamp-2">{repo.description}</p>
            <div className="flex items-center gap-3 text-xs text-gh-fg-muted">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: repo.languageColor }} />
                {repo.language}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" /> {repo.stars}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
