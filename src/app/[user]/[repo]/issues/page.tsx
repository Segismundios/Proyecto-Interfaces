// Client component: useParams + useUserData (issues mutables en localStorage)
// + useState para filtros y modal de nuevo issue; requiere browser.
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  CircleDot, CheckCircle2, Loader2, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "@/components/ui/Toast";
import { currentUser } from "@/data/users";
import { timeAgo } from "@/lib/utils";

export default function IssuesPage() {
  const params = useParams();
  const repoName = params.repo as string;
  const userName = params.user as string;

  const { issues, addIssue, closeIssue } = useUserData();
  const { toast } = useToast();

  const [filter, setFilter] = useState<"open" | "closed">("open");
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const repoIssues = issues.filter(
    (i) => i.repoName === repoName && i.repoOwner === userName
  );
  const openIssues = repoIssues.filter((i) => i.status === "open");
  const closedIssues = repoIssues.filter((i) => i.status === "closed");
  const filtered = filter === "open" ? openIssues : closedIssues;

  async function handleSubmit() {
    if (!title.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    addIssue({
      repoOwner: userName,
      repoName,
      title: title.trim(),
      body: body.trim(),
      status: "open",
      author: currentUser.username,
      labels: [],
    });
    setTitle("");
    setBody("");
    setSubmitting(false);
    setShowNew(false);
    toast({ title: "Issue creado", variant: "success" });
  }

  function handleClose(id: number) {
    closeIssue(id);
    toast({ title: "Issue cerrado", variant: "info" });
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gh-fg-muted">
        <Link
          href={`/${userName}/${repoName}`}
          className="flex items-center gap-1 text-gh-accent hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {userName}/{repoName}
        </Link>
        <span>/</span>
        <span className="text-gh-fg">Issues</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 border border-gh-border rounded-md overflow-hidden">
          <button
            onClick={() => setFilter("open")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === "open" ? "bg-gh-btn-bg text-gh-fg" : "text-gh-fg-muted hover:text-gh-fg"
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            {openIssues.length} Open
          </button>
          <button
            onClick={() => setFilter("closed")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-l border-gh-border transition-colors ${
              filter === "closed"
                ? "bg-gh-btn-bg text-gh-fg"
                : "text-gh-fg-muted hover:text-gh-fg"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {closedIssues.length} Closed
          </button>
        </div>
        <Button size="sm" variant="primary" onClick={() => setShowNew(true)}>
          New issue
        </Button>
      </div>

      {/* Lista */}
      <div className="border border-gh-border rounded-md overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CircleDot}
            title={`No hay issues ${filter === "open" ? "abiertos" : "cerrados"}`}
            description={
              filter === "open"
                ? "¡Todo en orden! No hay issues abiertos."
                : "No hay issues cerrados todavía."
            }
          />
        ) : (
          filtered.map((issue, i) => (
            <div
              key={issue.id}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-gh-canvas-subtle ${
                i < filtered.length - 1 ? "border-b border-gh-border" : ""
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
                    {issue.comments.length > 0 && (
                      <> &middot; {issue.comments.length} comment{issue.comments.length !== 1 ? "s" : ""}</>
                    )}
                  </span>
                </div>
              </div>
              {issue.status === "open" && (
                <Button size="sm" onClick={() => handleClose(issue.id)}>
                  Close
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal new issue */}
      <Modal
        isOpen={showNew}
        onClose={() => {
          setShowNew(false);
          setTitle("");
          setBody("");
        }}
        title="Nuevo issue"
      >
        <div className="space-y-3">
          <div>
            <label htmlFor="new-issue-title" className="block text-sm text-gh-fg mb-1">
              Título <span className="text-gh-danger">*</span>
            </label>
            <input
              id="new-issue-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe el problema brevemente"
              disabled={submitting}
              aria-required="true"
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="new-issue-body" className="block text-sm text-gh-fg mb-1">
              Descripción
            </label>
            <textarea
              id="new-issue-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Pasos para reproducir, comportamiento esperado…"
              disabled={submitting}
              rows={4}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setShowNew(false);
                setTitle("");
                setBody("");
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting || !title.trim()}
            >
              {submitting ? (
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
  );
}
