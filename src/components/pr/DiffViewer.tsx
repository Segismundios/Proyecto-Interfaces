import { DiffFile, Reviewer } from "@/types";
import { FileText, ChevronDown, ChevronRight, Check } from "lucide-react";
import { useState } from "react";
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
      {/* Summary */}
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

      {/* File diffs */}
      {files.map((file) => (
        <DiffFileView
          key={file.filename}
          file={file}
          reviewers={reviewers}
          reviewedBy={fileReviews[file.filename] ?? []}
          onToggleReview={() => onToggleFileReview(file.filename)}
        />
      ))}
    </div>
  );
}

interface DiffFileViewProps {
  file: DiffFile;
  reviewers: Reviewer[];
  reviewedBy: string[];
  onToggleReview: () => void;
}

function DiffFileView({ file, reviewers, reviewedBy, onToggleReview }: DiffFileViewProps) {
  const [expanded, setExpanded] = useState(true);
  const currentUserReviewed = reviewedBy.includes(currentUser.username);

  return (
    <div className="border border-gh-border rounded-md overflow-hidden">
      {/* File header */}
      <div className="flex items-center gap-3 px-3 py-2 bg-gh-canvas-subtle border-b border-gh-border">
        {/* Expand toggle + filename */}
        <div
          className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gh-fg-muted shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gh-fg-muted shrink-0" />
          )}
          <FileText className="w-3.5 h-3.5 text-gh-fg-muted shrink-0" />
          <span className="text-sm font-mono text-gh-fg truncate">{file.filename}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Additions / deletions + mini bar */}
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

          {/* Reviewer avatars: who reviewed this file */}
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
                      <Avatar src={getUserAvatar(reviewer.username)} alt={reviewer.username} size="sm" />
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
            onClick={onToggleReview}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
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

      {/* Diff content */}
      {expanded && (
        <div className="font-mono text-xs overflow-x-auto">
          {file.hunks.map((hunk, hi) => (
            <div key={hi}>
              <div className="bg-gh-accent/10 text-gh-accent px-4 py-1 border-b border-gh-border">
                {hunk.header}
              </div>
              {hunk.lines.map((line, li) => {
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
                  <div key={li} className={`flex ${bgClass} border-b border-gh-border/30`}>
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
}
