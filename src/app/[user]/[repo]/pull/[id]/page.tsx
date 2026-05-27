// Client component: useParams + useState para tabs y fileReviews (toggle
// "Reviewed" por archivo); requiere estado reactivo en el browser.
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { pullRequests } from "@/data/pullRequests";
import { collaborators, currentUser } from "@/data/users";
import { MergeDirectionBanner } from "@/components/pr/MergeDirectionBanner";
import { ReviewProgressBar } from "@/components/pr/ReviewProgressBar";
import { DiffViewer } from "@/components/pr/DiffViewer";
import { PRTimeline } from "@/components/pr/PRTimeline";
import { CommitList } from "@/components/pr/CommitList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs } from "@/components/ui/Tabs";
import { GitPullRequest, GitMerge, MessageCircle, GitCommit, FileText } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

function getUserAvatar(username: string) {
  if (username === currentUser.username) return currentUser.avatarUrl;
  const user = collaborators.find((u) => u.username === username);
  return user?.avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=128`;
}

export default function PullRequestPage() {
  const params = useParams();
  const prId = Number(params.id);
  const repoName = params.repo as string;
  const userName = params.user as string;
  const [activeTab, setActiveTab] = useState("conversation");

  const prData = pullRequests.find(
    (p) => p.id === prId && p.repoName === repoName && p.repoOwner === userName
  );

  const [fileReviews, setFileReviews] = useState<Record<string, string[]>>(
    () => Object.fromEntries(
      (prData?.diffFiles ?? []).map((f) => [f.filename, f.reviewedBy ?? []])
    )
  );

  function toggleFileReview(filename: string) {
    setFileReviews((prev) => {
      const current = prev[filename] ?? [];
      const hasReview = current.includes(currentUser.username);
      return {
        ...prev,
        [filename]: hasReview
          ? current.filter((u) => u !== currentUser.username)
          : [...current, currentUser.username],
      };
    });
  }

  const pr = prData;

  if (!pr) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl text-gh-fg mb-2">Pull Request not found</h1>
        <p className="text-gh-fg-muted">
          PR #{prId} does not exist in {userName}/{repoName}.
        </p>
      </div>
    );
  }

  const statusVariant = pr.status === "open" ? "success" : pr.status === "merged" ? "done" : "danger";
  const StatusIcon = pr.status === "merged" ? GitMerge : GitPullRequest;

  const tabs = [
    { id: "conversation", label: "Conversation", count: pr.comments.length, icon: <MessageCircle className="w-4 h-4" /> },
    { id: "commits", label: "Commits", count: pr.commits.length, icon: <GitCommit className="w-4 h-4" /> },
    { id: "files", label: "Files Changed", count: pr.diffFiles.length, icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gh-fg-muted">
        <Link href={`/${userName}/${repoName}`} className="text-gh-accent hover:underline">
          {userName}/{repoName}
        </Link>
        <span className="mx-2">/</span>
        <span>Pull Request #{pr.id}</span>
      </div>

      {/* PR Header */}
      <div>
        <div className="flex items-start gap-3 mb-2">
          <StatusIcon
            className={`w-5 h-5 mt-1 ${
              pr.status === "open" ? "text-gh-success" : pr.status === "merged" ? "text-gh-done" : "text-gh-danger"
            }`}
          />
          <div>
            <h1 className="text-2xl font-semibold text-gh-fg">
              {pr.title} <span className="text-gh-fg-muted font-normal">#{pr.id}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={statusVariant}>{pr.status}</Badge>
              <span className="text-sm text-gh-fg-muted">
                <Avatar src={getUserAvatar(pr.author)} alt={pr.author} size="sm" />
              </span>
              <span className="text-sm text-gh-fg-muted">
                <strong className="text-gh-fg">{pr.author}</strong> opened this pull request {timeAgo(pr.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MEJORA 5: Merge Direction Banner */}
      <MergeDirectionBanner
        headBranch={pr.headBranch}
        baseBranch={pr.baseBranch}
        status={pr.status}
      />

      {/* Layout: Main + Sidebar */}
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-4">
            {activeTab === "conversation" && (
              <div className="space-y-6">
                {/* PR body */}
                <div className="border border-gh-border rounded-md">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gh-canvas-subtle border-b border-gh-border rounded-t-md">
                    <Avatar src={getUserAvatar(pr.author)} alt={pr.author} size="sm" />
                    <span className="text-sm font-semibold text-gh-fg">{pr.author}</span>
                    <span className="text-xs text-gh-fg-muted">opened this PR</span>
                  </div>
                  <div className="px-4 py-3 text-sm text-gh-fg whitespace-pre-wrap">{pr.body}</div>
                </div>

                {/* Timeline */}
                <PRTimeline comments={pr.comments} />

                {/* Merge button area */}
                {pr.status === "open" && (
                  <div className="border border-gh-border rounded-md p-4 bg-gh-canvas-subtle">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gh-fg">This branch has no conflicts with the base branch</p>
                        <p className="text-xs text-gh-fg-muted">Merging can be performed automatically.</p>
                      </div>
                      <Button variant="primary">
                        <GitMerge className="w-4 h-4" />
                        Merge pull request
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "commits" && <CommitList commits={pr.commits} />}

            {activeTab === "files" && (
              <DiffViewer
                files={pr.diffFiles}
                reviewers={pr.reviewers}
                fileReviews={fileReviews}
                onToggleFileReview={toggleFileReview}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-72 shrink-0 space-y-4">
          {/* MEJORA 5: Review Progress */}
          <ReviewProgressBar
            reviewers={pr.reviewers}
            files={pr.diffFiles}
            fileReviews={fileReviews}
          />

          {/* Labels */}
          <div className="border border-gh-border rounded-md p-3">
            <h3 className="text-xs font-semibold text-gh-fg-muted uppercase mb-2">Labels</h3>
            <div className="flex flex-wrap gap-1">
              <Badge variant="accent">enhancement</Badge>
              <Badge variant="done">ui/ux</Badge>
            </div>
          </div>

          {/* Linked issues */}
          <div className="border border-gh-border rounded-md p-3">
            <h3 className="text-xs font-semibold text-gh-fg-muted uppercase mb-2">Linked Issues</h3>
            <p className="text-xs text-gh-fg-muted">No linked issues.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
