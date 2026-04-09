import Link from "next/link";
import { Clock, Star, Lock, Globe } from "lucide-react";
import { Repository } from "@/types";
import { timeAgo } from "@/lib/utils";

interface MostUsedReposProps {
  repos: Repository[];
}

export function MostUsedRepos({ repos }: MostUsedReposProps) {
  const sorted = [...repos]
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-base font-semibold text-gh-fg mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-gh-fg-muted" />
        Most Used Repositories
      </h2>
      <div className="border border-gh-border rounded-md overflow-hidden">
        {sorted.map((repo, i) => (
          <div
            key={repo.name}
            className={`flex items-center justify-between px-4 py-3 hover:bg-gh-canvas-subtle transition-colors ${
              i < sorted.length - 1 ? "border-b border-gh-border" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-gh-fg-muted">
                {repo.visibility === "private" ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
              </span>
              <div>
                <Link
                  href={`/${repo.owner}/${repo.name}`}
                  className="text-gh-accent text-sm font-semibold hover:underline"
                >
                  {repo.name}
                </Link>
                <p className="text-xs text-gh-fg-muted mt-0.5">{repo.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gh-fg-muted shrink-0 ml-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                {repo.language}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" /> {repo.stars}
              </span>
              <span>Last used {timeAgo(repo.lastAccessed)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
