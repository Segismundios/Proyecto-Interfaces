import Link from "next/link";
import { GitPullRequest } from "lucide-react";
import { PullRequest } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";

interface RecentActivityProps {
  pullRequests: PullRequest[];
}

const statusVariant: Record<PullRequest["status"], "success" | "danger" | "done"> = {
  open: "success",
  closed: "danger",
  merged: "done",
};

export function RecentActivity({ pullRequests }: RecentActivityProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gh-fg mb-3 flex items-center gap-2">
        <GitPullRequest className="w-4 h-4 text-gh-fg-muted" />
        Recent Pull Requests
      </h2>
      <div className="border border-gh-border rounded-md overflow-hidden">
        {pullRequests.map((pr, i) => (
          <div
            key={`${pr.repoName}-${pr.id}`}
            className={`flex items-center justify-between px-4 py-3 hover:bg-gh-canvas-subtle transition-colors ${
              i < pullRequests.length - 1 ? "border-b border-gh-border" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <GitPullRequest
                className={`w-4 h-4 ${
                  pr.status === "open" ? "text-gh-success" : pr.status === "merged" ? "text-gh-done" : "text-gh-danger"
                }`}
              />
              <div>
                <Link
                  href={`/${pr.repoOwner}/${pr.repoName}/pull/${pr.id}`}
                  className="text-gh-fg text-sm font-semibold hover:text-gh-accent"
                >
                  {pr.title}
                </Link>
                <p className="text-xs text-gh-fg-muted mt-0.5">
                  {pr.repoOwner}/{pr.repoName} #{pr.id} by {pr.author}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <Badge variant={statusVariant[pr.status]}>{pr.status}</Badge>
              <span className="text-xs text-gh-fg-muted">{timeAgo(pr.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
