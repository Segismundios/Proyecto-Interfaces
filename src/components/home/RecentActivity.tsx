// Client component: useState para el botón "Show more" que expande la lista
// de PRs recientes sin re-render del servidor.
"use client";

import { useState } from "react";
import Link from "next/link";
import { GitPullRequest, ChevronDown, ChevronUp } from "lucide-react";
import { PullRequest } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { timeAgo } from "@/lib/utils";

interface RecentActivityProps {
  pullRequests: PullRequest[];
}

const statusVariant: Record<PullRequest["status"], "success" | "danger" | "done"> = {
  open: "success",
  closed: "danger",
  merged: "done",
};

const COLLAPSED_LIMIT = 5;

export function RecentActivity({ pullRequests }: RecentActivityProps) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = pullRequests.length > COLLAPSED_LIMIT;
  const visible = expanded || !canExpand ? pullRequests : pullRequests.slice(0, COLLAPSED_LIMIT);

  return (
    <section aria-labelledby="recent-activity-heading">
      <h2
        id="recent-activity-heading"
        className="text-base font-semibold text-gh-fg mb-3 flex items-center gap-2"
      >
        <GitPullRequest className="w-4 h-4 text-gh-fg-muted" />
        Recent Pull Requests
      </h2>

      {pullRequests.length === 0 ? (
        <EmptyState
          icon={GitPullRequest}
          title="Sin actividad reciente"
          description="Cuando abras o revises un pull request, lo verás aquí."
        />
      ) : (
        <>
          <div className="border border-gh-border rounded-md overflow-hidden">
            {visible.map((pr, i) => (
              <div
                key={`${pr.repoName}-${pr.id}`}
                className={`flex items-center justify-between px-4 py-3 hover:bg-gh-canvas-subtle transition-colors ${
                  i < visible.length - 1 ? "border-b border-gh-border" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GitPullRequest
                    className={`w-4 h-4 shrink-0 ${
                      pr.status === "open"
                        ? "text-gh-success"
                        : pr.status === "merged"
                        ? "text-gh-done"
                        : "text-gh-danger"
                    }`}
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/${pr.repoOwner}/${pr.repoName}/pull/${pr.id}`}
                      className="text-gh-fg text-sm font-semibold hover:text-gh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent rounded truncate block"
                    >
                      {pr.title}
                    </Link>
                    <p className="text-xs text-gh-fg-muted mt-0.5 truncate">
                      {pr.repoOwner}/{pr.repoName} #{pr.id} by {pr.author}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <Badge variant={statusVariant[pr.status]}>{pr.status}</Badge>
                  <span className="text-xs text-gh-fg-muted whitespace-nowrap">
                    {timeAgo(pr.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {canExpand && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gh-accent hover:bg-gh-canvas-subtle rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Show {pullRequests.length - COLLAPSED_LIMIT} more <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
}
