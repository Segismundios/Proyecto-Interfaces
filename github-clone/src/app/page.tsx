import { repositories } from "@/data/repos";
import { pullRequests } from "@/data/pullRequests";
import { currentUser } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";
import { FavoriteRepos } from "@/components/home/FavoriteRepos";
import { MostUsedRepos } from "@/components/home/MostUsedRepos";
import { RecentActivity } from "@/components/home/RecentActivity";
import { QuickActions } from "@/components/home/QuickActions";
import { Book } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-8">
      {/* Left sidebar */}
      <aside className="w-64 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="lg" />
          <div>
            <p className="text-gh-fg font-semibold">{currentUser.displayName}</p>
            <p className="text-sm text-gh-fg-muted">{currentUser.username}</p>
          </div>
        </div>
        <p className="text-sm text-gh-fg-muted mb-4">{currentUser.bio}</p>

        <div className="border-t border-gh-border pt-4">
          <h3 className="text-xs font-semibold text-gh-fg-muted uppercase mb-2">Your Repositories</h3>
          <ul className="space-y-1">
            {repositories.map((repo) => (
              <li key={repo.name}>
                <Link
                  href={`/${repo.owner}/${repo.name}`}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-gh-fg hover:bg-gh-canvas-subtle rounded-md transition-colors"
                >
                  <Book className="w-3.5 h-3.5 text-gh-fg-muted" />
                  <span className="truncate">{repo.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 space-y-8">
        <QuickActions />
        <FavoriteRepos repos={repositories} />
        <MostUsedRepos repos={repositories} />
        <RecentActivity pullRequests={pullRequests} />
      </div>
    </div>
  );
}
