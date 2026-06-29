// Client component: useParams (hook de navegación) + useState para el tab
// activo del repo; ambos requieren router context y estado de browser.
"use client";

import { useParams } from "next/navigation";
import { repositories } from "@/data/repos";
import { repoFiles } from "@/data/files";
import { pullRequests } from "@/data/pullRequests";
import { RepoHeader } from "@/components/repo/RepoHeader";
import { FileBrowser } from "@/components/repo/FileBrowser";
import { ReadmePreview } from "@/components/repo/ReadmePreview";
import { NewPullRequestModal } from "@/components/pr/NewPullRequestModal";
import { Tabs } from "@/components/ui/Tabs";
import { useState } from "react";
import {
  Code, CircleDot, GitPullRequest, Play, CheckCircle2,
  XCircle, Clock, Loader2, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useUserData } from "@/context/UserDataContext";
import { timeAgo } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { currentUser } from "@/data/users";

/* ── Helpers ── */

const statusVariantMap: Record<
  "open" | "merged" | "closed",
  "success" | "done" | "danger"
> = {
  open: "success",
  merged: "done",
  closed: "danger",
};

const workflowStatusIcon = {
  success: <CheckCircle2 className="w-4 h-4 text-gh-success" />,
  failure: <XCircle className="w-4 h-4 text-gh-danger" />,
  running: <Loader2 className="w-4 h-4 text-gh-accent animate-spin" />,
  cancelled: <AlertCircle className="w-4 h-4 text-gh-fg-muted" />,
};

function formatDuration(seconds: number): string {
  if (seconds === 0) return "en progreso";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export default function RepoPage() {
  const params = useParams();
  const repoName = params.repo as string;
  const userName = params.user as string;
  const [activeTab, setActiveTab] = useState("code");
  const [showNewPR, setShowNewPR] = useState(false);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueBody, setNewIssueBody] = useState("");
  const [issueSubmitting, setIssueSubmitting] = useState(false);
  const [issueFilter, setIssueFilter] = useState<"open" | "closed">("open");

  const { issues, workflowRuns, addIssue } = useUserData();
  const { toast } = useToast();

  const repo = repositories.find((r) => r.name === repoName && r.owner === userName);
  const files = repoFiles[repoName] || [];
  const repoPRs = pullRequests.filter((pr) => pr.repoName === repoName);
  const repoIssues = issues.filter(
    (i) => i.repoName === repoName && i.repoOwner === userName
  );
  const openIssues = repoIssues.filter((i) => i.status === "open");
  const closedIssues = repoIssues.filter((i) => i.status === "closed");
  const filteredIssues = issueFilter === "open" ? openIssues : closedIssues;
  const repoRuns = workflowRuns.filter(
    (r) => r.repoName === repoName && r.repoOwner === userName
  );

  if (!repo) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl text-gh-fg mb-2">Repository not found</h1>
        <p className="text-gh-fg-muted">{userName}/{repoName} does not exist.</p>
      </div>
    );
  }

  const tabs = [
    { id: "code", label: "Code", icon: <Code className="w-4 h-4" /> },
    {
      id: "issues",
      label: "Issues",
      count: openIssues.length,
      icon: <CircleDot className="w-4 h-4" />,
    },
    {
      id: "pulls",
      label: "Pull Requests",
      count: repoPRs.length,
      icon: <GitPullRequest className="w-4 h-4" />,
    },
    { id: "actions", label: "Actions", icon: <Play className="w-4 h-4" /> },
  ];

  async function handleCreateIssue() {
    if (!newIssueTitle.trim()) return;
    setIssueSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    addIssue({
      repoOwner: userName,
      repoName,
      title: newIssueTitle.trim(),
      body: newIssueBody.trim(),
      status: "open",
      author: currentUser.username,
      labels: [],
    });
    setNewIssueTitle("");
    setNewIssueBody("");
    setIssueSubmitting(false);
    setShowNewIssue(false);
    toast({ title: "Issue creado", variant: "success" });
  }

  return (
    <div>
      <RepoHeader repo={repo} />
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">

        {/* ── Code tab ── */}
        {activeTab === "code" && (
          <>
            <FileBrowser files={files} repoName={repo.name} />
            <ReadmePreview repoName={repo.name} />
          </>
        )}

        {/* ── Pull Requests tab ── */}
        {activeTab === "pulls" && (
          <div>
            {/* Toolbar: entrada explícita para crear PR dentro del repo (Mananinane) */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gh-fg-muted">
                {repoPRs.length} pull request{repoPRs.length !== 1 ? "s" : ""}
              </span>
              <Button size="sm" variant="primary" onClick={() => setShowNewPR(true)}>
                <GitPullRequest className="w-3.5 h-3.5" />
                New pull request
              </Button>
            </div>

            <div className="border border-gh-border rounded-md overflow-hidden">
              {repoPRs.length === 0 ? (
                <EmptyState
                  icon={GitPullRequest}
                  title="No hay pull requests"
                  description="Crea la primera pull request de este repositorio."
                  cta={
                    <Button size="sm" variant="primary" onClick={() => setShowNewPR(true)}>
                      <GitPullRequest className="w-3.5 h-3.5" />
                      New pull request
                    </Button>
                  }
                />
              ) : (
                repoPRs.map((pr, i) => (
                <div
                  key={pr.id}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-gh-canvas-subtle ${
                    i < repoPRs.length - 1 ? "border-b border-gh-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GitPullRequest
                      className={`w-4 h-4 ${
                        pr.status === "open"
                          ? "text-gh-success"
                          : pr.status === "merged"
                          ? "text-gh-done"
                          : "text-gh-danger"
                      }`}
                    />
                    <div>
                      <Link
                        href={`/${pr.repoOwner}/${pr.repoName}/pull/${pr.id}`}
                        className="text-gh-fg font-semibold text-sm hover:text-gh-accent"
                      >
                        {pr.title}
                      </Link>
                      <p className="text-xs text-gh-fg-muted">
                        #{pr.id} opened by {pr.author} &middot; {pr.headBranch} &rarr;{" "}
                        {pr.baseBranch}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariantMap[pr.status]}>{pr.status}</Badge>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Issues tab ── */}
        {activeTab === "issues" && (
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1 border border-gh-border rounded-md overflow-hidden">
                <button
                  onClick={() => setIssueFilter("open")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                    issueFilter === "open"
                      ? "bg-gh-btn-bg text-gh-fg"
                      : "text-gh-fg-muted hover:text-gh-fg"
                  }`}
                >
                  <CircleDot className="w-3.5 h-3.5" />
                  {openIssues.length} Open
                </button>
                <button
                  onClick={() => setIssueFilter("closed")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-l border-gh-border ${
                    issueFilter === "closed"
                      ? "bg-gh-btn-bg text-gh-fg"
                      : "text-gh-fg-muted hover:text-gh-fg"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {closedIssues.length} Closed
                </button>
              </div>
              <Button size="sm" variant="primary" onClick={() => setShowNewIssue(true)}>
                New issue
              </Button>
            </div>

            {/* Lista */}
            <div className="border border-gh-border rounded-md overflow-hidden">
              {filteredIssues.length === 0 ? (
                <EmptyState
                  icon={CircleDot}
                  title={`No hay issues ${issueFilter === "open" ? "abiertos" : "cerrados"}`}
                  description={
                    issueFilter === "open"
                      ? "¡Todo en orden! No hay issues abiertos."
                      : "No hay issues cerrados aún."
                  }
                />
              ) : (
                filteredIssues.map((issue, i) => (
                  <div
                    key={issue.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gh-canvas-subtle ${
                      i < filteredIssues.length - 1 ? "border-b border-gh-border" : ""
                    }`}
                  >
                    {issue.status === "open" ? (
                      <CircleDot className="w-4 h-4 text-gh-success mt-0.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-gh-done mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/${userName}/${repoName}/issues/${issue.id}`}
                        className="text-sm font-semibold text-gh-fg hover:text-gh-accent"
                      >
                        {issue.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        {issue.labels.map((label) => (
                          <span
                            key={label}
                            className="text-[10px] px-1.5 py-0.5 rounded-full border border-gh-accent/40 bg-gh-accent/10 text-gh-accent"
                          >
                            {label}
                          </span>
                        ))}
                        <span className="text-xs text-gh-fg-muted">
                          #{issue.id} opened {timeAgo(issue.createdAt)} by {issue.author}
                        </span>
                        {issue.comments.length > 0 && (
                          <span className="text-xs text-gh-fg-muted ml-auto">
                            {issue.comments.length} comment{issue.comments.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal new issue */}
            <Modal
              isOpen={showNewIssue}
              onClose={() => {
                setShowNewIssue(false);
                setNewIssueTitle("");
                setNewIssueBody("");
              }}
              title="Nuevo issue"
            >
              <div className="space-y-3">
                <div>
                  <label htmlFor="issue-title" className="block text-sm text-gh-fg mb-1">
                    Título <span className="text-gh-danger">*</span>
                  </label>
                  <input
                    id="issue-title"
                    type="text"
                    value={newIssueTitle}
                    onChange={(e) => setNewIssueTitle(e.target.value)}
                    placeholder="Describe el problema brevemente"
                    disabled={issueSubmitting}
                    className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="issue-body" className="block text-sm text-gh-fg mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="issue-body"
                    value={newIssueBody}
                    onChange={(e) => setNewIssueBody(e.target.value)}
                    placeholder="Proporciona más detalles, pasos para reproducir, comportamiento esperado…"
                    disabled={issueSubmitting}
                    rows={4}
                    className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setShowNewIssue(false);
                      setNewIssueTitle("");
                      setNewIssueBody("");
                    }}
                    disabled={issueSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateIssue}
                    disabled={issueSubmitting || !newIssueTitle.trim()}
                  >
                    {issueSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Creando…
                      </>
                    ) : (
                      "Crear issue"
                    )}
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* ── Actions tab ── */}
        {activeTab === "actions" && (
          <div>
            {repoRuns.length === 0 ? (
              <EmptyState
                icon={Play}
                title="Sin workflow runs"
                description="No se han ejecutado workflows en este repositorio."
              />
            ) : (
              <div className="border border-gh-border rounded-md overflow-hidden">
                {repoRuns.map((run, i) => (
                  <div
                    key={run.id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gh-canvas-subtle ${
                      i < repoRuns.length - 1 ? "border-b border-gh-border" : ""
                    }`}
                  >
                    {workflowStatusIcon[run.status]}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gh-fg">{run.workflowName}</p>
                      <p className="text-xs text-gh-fg-muted truncate">
                        {run.commit} &middot; {run.branch} &middot; {run.author}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gh-fg-muted">{timeAgo(run.triggeredAt)}</p>
                      <p className="text-xs text-gh-fg-muted flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(run.duration)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de crear PR (repo fijo) — entrada que faltaba dentro del repo */}
      <NewPullRequestModal
        open={showNewPR}
        onClose={() => setShowNewPR(false)}
        lockedRepo={repo.name}
      />
    </div>
  );
}
