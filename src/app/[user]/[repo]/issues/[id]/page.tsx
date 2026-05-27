// Client component: useParams + useUserData para leer/mutuar issues en
// localStorage; addCommentToIssue y closeIssue requieren browser.
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  CircleDot, CheckCircle2, ArrowLeft, Loader2, MessageCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "@/components/ui/Toast";
import { currentUser, collaborators } from "@/data/users";
import { timeAgo } from "@/lib/utils";

function getAvatar(username: string) {
  if (username === currentUser.username) return currentUser.avatarUrl;
  const user = collaborators.find((u) => u.username === username);
  return user?.avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=128`;
}

export default function IssueDetailPage() {
  const params = useParams();
  const repoName = params.repo as string;
  const userName = params.user as string;
  const issueId = Number(params.id);

  const { issues, closeIssue, addCommentToIssue } = useUserData();
  const { toast } = useToast();

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  const issue = issues.find(
    (i) => i.id === issueId && i.repoName === repoName && i.repoOwner === userName
  );

  if (!issue) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl text-gh-fg mb-2">Issue not found</h1>
        <p className="text-gh-fg-muted">
          Issue #{issueId} does not exist in {userName}/{repoName}.
        </p>
        <Link
          href={`/${userName}/${repoName}/issues`}
          className="text-gh-accent hover:underline text-sm mt-4 inline-block"
        >
          ← Volver a Issues
        </Link>
      </div>
    );
  }

  async function handleComment() {
    if (!issue || !commentText.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    addCommentToIssue(issue.id, {
      author: currentUser.username,
      body: commentText.trim(),
      createdAt: new Date().toISOString(),
    });
    setCommentText("");
    setSubmitting(false);
    toast({ title: "Comentario agregado", variant: "success" });
  }

  async function handleClose() {
    if (!issue) return;
    setClosing(true);
    await new Promise((r) => setTimeout(r, 400));
    closeIssue(issue.id);
    setClosing(false);
    toast({ title: "Issue cerrado", variant: "info" });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gh-fg-muted">
        <Link
          href={`/${userName}/${repoName}/issues`}
          className="flex items-center gap-1 text-gh-accent hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Issues
        </Link>
        <span>/</span>
        <span className="text-gh-fg truncate">#{issue.id}</span>
      </div>

      {/* Header del issue */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gh-fg">
          {issue.title}{" "}
          <span className="text-gh-fg-muted font-normal text-xl">#{issue.id}</span>
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={issue.status === "open" ? "success" : "done"}>
            {issue.status === "open" ? (
              <CircleDot className="w-3 h-3 mr-1" />
            ) : (
              <CheckCircle2 className="w-3 h-3 mr-1" />
            )}
            {issue.status}
          </Badge>
          <span className="text-sm text-gh-fg-muted">
            <strong className="text-gh-fg">{issue.author}</strong> opened this issue{" "}
            {timeAgo(issue.createdAt)} &middot; {issue.comments.length} comment
            {issue.comments.length !== 1 ? "s" : ""}
          </span>
          <div className="flex flex-wrap gap-1">
            {issue.labels.map((label) => (
              <span
                key={label}
                className="text-[10px] px-1.5 py-0.5 rounded-full border border-gh-accent/40 bg-gh-accent/10 text-gh-accent"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cuerpo del issue */}
      <div className="border border-gh-border rounded-md overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gh-canvas-subtle border-b border-gh-border">
          <Avatar src={getAvatar(issue.author)} alt={issue.author} size="sm" />
          <span className="text-sm font-semibold text-gh-fg">{issue.author}</span>
          <span className="text-xs text-gh-fg-muted">
            opened this issue {timeAgo(issue.createdAt)}
          </span>
        </div>
        <div className="px-4 py-4 text-sm text-gh-fg whitespace-pre-wrap leading-relaxed">
          {issue.body || <span className="text-gh-fg-muted italic">Sin descripción</span>}
        </div>
      </div>

      {/* Comentarios */}
      {issue.comments.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="Sin comentarios"
          description="Sé el primero en comentar este issue."
        />
      ) : (
        <div className="space-y-4">
          {issue.comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gh-border rounded-md overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gh-canvas-subtle border-b border-gh-border">
                <Avatar src={getAvatar(comment.author)} alt={comment.author} size="sm" />
                <span className="text-sm font-semibold text-gh-fg">{comment.author}</span>
                <span className="text-xs text-gh-fg-muted ml-auto">
                  {timeAgo(comment.createdAt)}
                </span>
              </div>
              <div className="px-4 py-3 text-sm text-gh-fg whitespace-pre-wrap">
                {comment.body}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nuevo comentario */}
      <div className="border border-gh-border rounded-md overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gh-canvas-subtle border-b border-gh-border">
          <Avatar src={getAvatar(currentUser.username)} alt={currentUser.displayName} size="sm" />
          <span className="text-sm font-semibold text-gh-fg">{currentUser.displayName}</span>
          <span className="text-xs text-gh-fg-muted">Leave a comment</span>
        </div>
        <div className="p-4 space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe un comentario…"
            disabled={submitting || issue.status === "closed"}
            rows={4}
            aria-label="Nuevo comentario"
            className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 resize-none"
          />
          <div className="flex items-center justify-between">
            {issue.status === "open" && (
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={closing || submitting}
              >
                {closing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Cerrando…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cerrar issue
                  </>
                )}
              </Button>
            )}
            <div className="ml-auto">
              <Button
                variant="primary"
                onClick={handleComment}
                disabled={submitting || !commentText.trim() || issue.status === "closed"}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  "Comment"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
