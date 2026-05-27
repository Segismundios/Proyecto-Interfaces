// Client component: DiffFileView usa useState para el expand/collapse del hunk;
// requiere estado reactivo en el browser.
"use client";

import { DiffFile, Reviewer } from "@/types";
import { FileText, ChevronDown, ChevronRight, Check } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { currentUser, collaborators } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";

interface DiffViewerProps {
  files: DiffFile[];
  reviewers: Reviewer[];
  fileReviews: Record<string, string[]>;
  onToggleFileReview: (filename: string) => void;
}

function getUserAvatar(username: string) {
  if (username === currentUser.username) return currentUser.avatarUrl;
  const user = collaborators.find((u) => u.username === username);
  return user?.avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=128`;
}

export function DiffViewer({ files, reviewers, fileReviews, onToggleFileReview }: DiffViewerProps) {
  if (files.length === 0) {
    return <p className="text-sm text-gh-fg-muted p-4 text-center">No file changes to display.</p>;
  }

  const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0);
  const reviewedCount = files.filter((f) => (fileReviews[f.filename]?.length ?? 0) > 0).length;

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center gap-4 text-xs text-gh-fg-muted p-3 bg-gh-canvas-subtle border border-gh-border rounded-md">
        <span>
          Showing <strong className="text-gh-fg">{files.length}</strong> changed files
        </span>
        <span className="text-gh-success">+{totalAdditions}</span>
        <span className="text-gh-danger">-{totalDeletions}</span>
        <span className="ml-auto">
          <span className="text-gh-fg font-medium">{reviewedCount}</span>
          <span> / {files.length} files reviewed</span>
        </span>
      </div>

      {/* File diffs — React.memo evita re-render cuando sólo cambia un archivo */}
      {files.map((file) => (
        <DiffFileView
          key={file.filename}
          file={file}
          reviewers={reviewers}
          reviewedBy={fileReviews[file.filename] ?? []}
          onToggleReview={onToggleFileReview}
        />
      ))}
    </div>
  );
}

interface DiffFileViewProps {
  file: DiffFile;
  reviewers: Reviewer[];
  reviewedBy: string[];
  onToggleReview: (filename: string) => void;
}

/**
 * React.memo: evita re-renders cuando cambia el review de otro archivo.
 * El array reviewedBy y onToggleReview son las únicas props que cambian.
 */
const DiffFileView = memo(function DiffFileView({
  file,
  reviewers,
  reviewedBy,
  onToggleReview,
}: DiffFileViewProps) {
  const [expanded, setExpanded] = useState(true);
  const currentUserReviewed = reviewedBy.includes(currentUser.username);

  // useCallback: mantiene referencia estable para no romper memo del padre
  const handleToggle = useCallback(() => {
    onToggleReview(file.filename);
  }, [onToggleReview, file.filename]);

  return (
    <div className="border border-gh-border rounded-md overflow-hidden">
      {/* File header */}
      <div className="flex items-center gap-3 px-3 py-2 bg-gh-canvas-subtle border-b border-gh-border">
        <button
          className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent rounded"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={`${expanded ? "Colapsar" : "Expandir"} diff de ${file.filename}`}
        >
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gh-fg-muted shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gh-fg-muted shrink-0" />
          )}
          <FileText className="w-3.5 h-3.5 text-gh-fg-muted shrink-0" />
          <span className="text-sm font-mono text-gh-fg truncate">{file.filename}</span>
        </button>

        <div className="flex items-center gap-3 shrink-0">
          {/* Additions / deletions mini bar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gh-success">+{file.additions}</span>
            <span className="text-gh-danger">-{file.deletions}</span>
            <div className="flex gap-px">
              {Array.from({ length: Math.min(file.additions, 5) }).map((_, i) => (
                <div key={`a${i}`} className="w-2 h-2 bg-gh-success rounded-sm" />
              ))}
              {Array.from({ length: Math.min(file.deletions, 5) }).map((_, i) => (
                <div key={`d${i}`} className="w-2 h-2 bg-gh-danger rounded-sm" />
              ))}
            </div>
          </div>

          {/* Reviewer avatars */}
          {reviewers.length > 0 && (
            <div className="flex items-center -space-x-1">
              {reviewers.map((reviewer) => {
                const hasReviewed = reviewedBy.includes(reviewer.username);
                return (
                  <div
                    key={reviewer.username}
                    className="relative"
                    title={`${reviewer.username}: ${hasReviewed ? "reviewed" : "not reviewed"}`}
                  >
                    <div
                      className={`rounded-full ring-2 ring-gh-canvas-subtle transition-opacity ${
                        hasReviewed ? "opacity-100" : "opacity-25"
                      }`}
                    >
                      <Avatar
                        src={getUserAvatar(reviewer.username)}
                        alt={reviewer.username}
                        size="sm"
                      />
                    </div>
                    {hasReviewed && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gh-success rounded-full flex items-center justify-center ring-1 ring-gh-canvas-subtle">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mark as reviewed toggle */}
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent ${
              currentUserReviewed
                ? "bg-gh-success/20 border-gh-success text-gh-success"
                : "bg-gh-btn-bg border-gh-border text-gh-fg-muted hover:text-gh-fg hover:border-gh-fg-muted"
            }`}
          >
            <Check className="w-3 h-3" />
            {currentUserReviewed ? "Reviewed" : "Mark reviewed"}
          </button>
        </div>
      </div>

      {/* Diff lines */}
      {expanded && (
        <div className="font-mono text-xs overflow-x-auto">
          {file.hunks.map((hunk) => (
            <div key={hunk.header}>
              <div className="bg-gh-accent/10 text-gh-accent px-4 py-1 border-b border-gh-border">
                {hunk.header}
              </div>
              {hunk.lines.map((line) => {
                // Clave estable: tipo + número de línea (único en el hunk)
                const lineKey = `${line.type}-${line.oldLineNumber ?? "x"}-${line.newLineNumber ?? "x"}`;
                const bgClass =
                  line.type === "addition"
                    ? "bg-gh-diff-add-bg"
                    : line.type === "deletion"
                    ? "bg-gh-diff-del-bg"
                    : "";
                const textClass =
                  line.type === "addition"
                    ? "text-gh-success"
                    : line.type === "deletion"
                    ? "text-gh-danger"
                    : "text-gh-fg";
                const prefix =
                  line.type === "addition" ? "+" : line.type === "deletion" ? "-" : " ";

                return (
                  <div key={lineKey} className={`flex ${bgClass} border-b border-gh-border/30`}>
                    <span className="w-10 text-right pr-2 text-gh-fg-muted select-none shrink-0 border-r border-gh-border/30 py-0.5">
                      {line.oldLineNumber || ""}
                    </span>
                    <span className="w-10 text-right pr-2 text-gh-fg-muted select-none shrink-0 border-r border-gh-border/30 py-0.5">
                      {line.newLineNumber || ""}
                    </span>
                    <span className={`px-2 py-0.5 whitespace-pre ${textClass}`}>
                      {prefix} {line.content}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
