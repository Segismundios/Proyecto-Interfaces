import { repositories } from "@/data/repos";
import { pullRequests } from "@/data/pullRequests";
import { currentUser } from "@/data/users";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { FavoriteRepos } from "@/components/home/FavoriteRepos";
import { MostUsedRepos } from "@/components/home/MostUsedRepos";
import { RecentActivity } from "@/components/home/RecentActivity";
import { QuickActions } from "@/components/home/QuickActions";
import { SidebarRepoList } from "@/components/home/SidebarRepoList";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left sidebar — perfil + repos (estética suavizada, M4) */}
      <aside className="w-full lg:w-64 shrink-0 space-y-5">
        {/* Tarjeta de perfil */}
        <Link
          href={`/settings`}
          className="flex items-center gap-3 p-3 -m-3 rounded-lg hover:bg-gh-canvas-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
        >
          <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="lg" />
          <div className="min-w-0">
            <p className="text-gh-fg font-semibold truncate">{currentUser.displayName}</p>
            <p className="text-sm text-gh-fg-muted truncate">{currentUser.username}</p>
          </div>
        </Link>
        <p className="text-sm text-gh-fg-muted">{currentUser.bio}</p>

        <SidebarRepoList repos={repositories} userName={currentUser.username} />
      </aside>

      {/* Main content — Recent PRs sube por sobre Most Used (M3) para no quedar al fondo */}
      <div className="flex-1 min-w-0 space-y-8">
        <QuickActions />
        <FavoriteRepos repos={repositories} />
        <RecentActivity pullRequests={pullRequests} />
        <MostUsedRepos repos={repositories} />
      </div>
    </div>
  );
}
