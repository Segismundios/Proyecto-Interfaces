// Client component: useParams + useState para tabs, fileReviews, y el modal
// de merge; requiere estado reactivo y eventos de browser.
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
import { Modal } from "@/components/ui/Modal";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "@/components/ui/Toast";
import {
  GitPullRequest, GitMerge, MessageCircle, GitCommit, FileText, ChevronDown, Loader2,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

/* ── Helpers ── */

const statusVariantMap: Record<"open" | "merged" | "closed", "success" | "done" | "danger"> = {
  open: "success",
  merged: "done",
  closed: "danger",
};

function getUserAvatar(username: string) {
  if (username === currentUser.username) return currentUser.avatarUrl;
  const user = collaborators.find((u) => u.username === username);
  return user?.avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=128`;
}

type MergeStrategy = "merge" | "squash" | "rebase";
const mergeStrategyLabels: Record<MergeStrategy, string> = {
  merge: "Create a merge commit",
  squash: "Squash and merge",
  rebase: "Rebase and merge",
};

export default function PullRequestPage() {
  const params = useParams();
  const prId = Number(params.id);
  const repoName = params.repo as string;
  const userName = params.user as string;

  const [activeTab, setActiveTab] = useState("conversation");
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>("merge");
  const [merging, setMerging] = useState(false);

  const { mergePR, getPRStatus } = useUserData();
  const { toast } = useToast();

  const prData = pullRequests.find(
    (p) => p.id === prId && p.repoName === repoName && p.repoOwner === userName
  );

  const [fileReviews, setFileReviews] = useState<Record<string, string[]>>(
    () =>
      Object.fromEntries(
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

  // El estado puede estar sobreescrito por UserDataContext (después del merge)
  const currentStatus = getPRStatus(pr.id) ?? pr.status;
  const StatusIcon = currentStatus === "merged" ? GitMerge : GitPullRequest;

  const tabs = [
    {
      id: "conversation",
      label: "Conversation",
      count: pr.comments.length,
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      id: "commits",
      label: "Commits",
      count: pr.commits.length,
      icon: <GitCommit className="w-4 h-4" />,
    },
    {
      id: "files",
      label: "Files Changed",
      count: pr.diffFiles.length,
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  async function handleMerge() {
    if (!pr) return;
    setMerging(true);
    await new Promise((r) => setTimeout(r, 800));
    mergePR(pr.id);
    setMerging(false);
    setShowMergeModal(false);
    toast({
      title: "Pull request merged",
      description: `"${pr.title}" fue mergeado usando ${mergeStrategyLabels[mergeStrategy].toLowerCase()}.`,
      variant: "success",
    });
  }

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
              currentStatus === "open"
                ? "text-gh-success"
                : currentStatus === "merged"
                ? "text-gh-done"
                : "text-gh-danger"
            }`}
          />
          <div>
            <h1 className="text-2xl font-semibold text-gh-fg">
              {pr.title}{" "}
              <span className="text-gh-fg-muted font-normal">#{pr.id}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={statusVariantMap[currentStatus]}>{currentStatus}</Badge>
              <span className="text-sm text-gh-fg-muted">
                <Avatar src={getUserAvatar(pr.author)} alt={pr.author} size="sm" />
              </span>
              <span className="text-sm text-gh-fg-muted">
                <strong className="text-gh-fg">{pr.author}</strong> opened this pull request{" "}
                {timeAgo(pr.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MEJORA 5: Merge Direction Banner */}
      <MergeDirectionBanner
        headBranch={pr.headBranch}
        baseBranch={pr.baseBranch}
        status={currentStatus}
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
                  <div className="px-4 py-3 text-sm text-gh-fg whitespace-pre-wrap">
                    {pr.body}
                  </div>
                </div>

                {/* Timeline */}
                <PRTimeline comments={pr.comments} />

                {/* Merge area */}
                {currentStatus === "open" && (
                  <div className="border border-gh-border rounded-md p-4 bg-gh-canvas-subtle">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gh-fg">
                          This branch has no conflicts with the base branch
                        </p>
                        <p className="text-xs text-gh-fg-muted">
                          Merging can be performed automatically.
                        </p>
                      </div>
                      <div className="flex items-center gap-0">
                        <Button
                          variant="primary"
                          onClick={() => setShowMergeModal(true)}
                          className="rounded-r-none"
                        >
                          <GitMerge className="w-4 h-4" />
                          Merge pull request
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-l-none border-l border-gh-btn-primary-hover px-2"
                          onClick={() => setShowMergeModal(true)}
                          aria-label="Seleccionar estrategia de merge"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStatus === "merged" && (
                  <div className="border border-gh-done/40 rounded-md p-4 bg-gh-done/10">
                    <div className="flex items-center gap-2">
                      <GitMerge className="w-5 h-5 text-gh-done" />
                      <p className="text-sm font-semibold text-gh-done">
                        Pull request successfully merged
                      </p>
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
            <h3 className="text-xs font-semibold text-gh-fg-muted uppercase mb-2">
              Linked Issues
            </h3>
            <p className="text-xs text-gh-fg-muted">No linked issues.</p>
          </div>
        </aside>
      </div>

      {/* Modal de confirmación de merge */}
      <Modal
        isOpen={showMergeModal}
        onClose={() => !merging && setShowMergeModal(false)}
        title="Merge pull request"
      >
        <div className="space-y-4">
          <p className="text-sm text-gh-fg">
            Selecciona la estrategia de merge para{" "}
            <strong>{pr.headBranch}</strong> → <strong>{pr.baseBranch}</strong>:
          </p>

          <div className="space-y-2">
            {(["merge", "squash", "rebase"] as MergeStrategy[]).map((strategy) => (
              <label
                key={strategy}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  mergeStrategy === strategy
                    ? "border-gh-accent bg-gh-accent/10"
                    : "border-gh-border hover:bg-gh-canvas-subtle"
                }`}
              >
                <input
                  type="radio"
                  name="merge-strategy"
                  value={strategy}
                  checked={mergeStrategy === strategy}
                  onChange={() => setMergeStrategy(strategy)}
                  className="accent-gh-accent"
                />
                <div>
                  <p className="text-sm font-medium text-gh-fg">
                    {mergeStrategyLabels[strategy]}
                  </p>
                  <p className="text-xs text-gh-fg-muted">
                    {strategy === "merge" && "Todos los commits serán agregados al branch destino."}
                    {strategy === "squash" && "Todos los commits se combinan en uno solo."}
                    {strategy === "rebase" && "Los commits se replican sobre el branch destino."}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button onClick={() => setShowMergeModal(false)} disabled={merging}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleMerge} disabled={merging}>
              {merging ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Merging…
                </>
              ) : (
                <>
                  <GitMerge className="w-4 h-4" />
                  Confirm merge
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
