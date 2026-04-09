import { DiffFile } from "@/types";
import { FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DiffViewerProps {
  files: DiffFile[];
}

export function DiffViewer({ files }: DiffViewerProps) {
  if (files.length === 0) {
    return <p className="text-sm text-gh-fg-muted p-4 text-center">No file changes to display.</p>;
  }

  const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center gap-4 text-xs text-gh-fg-muted p-3 bg-gh-canvas-subtle border border-gh-border rounded-md">
        <span>
          Showing <strong className="text-gh-fg">{files.length}</strong> changed files
        </span>
        <span className="text-gh-success">+{totalAdditions}</span>
        <span className="text-gh-danger">-{totalDeletions}</span>
      </div>

      {/* File diffs */}
      {files.map((file) => (
        <DiffFileView key={file.filename} file={file} />
      ))}
    </div>
  );
}

function DiffFileView({ file }: { file: DiffFile }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gh-border rounded-md overflow-hidden">
      {/* File header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-gh-canvas-subtle border-b border-gh-border cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gh-fg-muted" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gh-fg-muted" />
          )}
          <FileText className="w-3.5 h-3.5 text-gh-fg-muted" />
          <span className="text-sm font-mono text-gh-fg">{file.filename}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gh-success">+{file.additions}</span>
          <span className="text-gh-danger">-{file.deletions}</span>
          {/* Mini bar */}
          <div className="flex gap-px">
            {Array.from({ length: Math.min(file.additions, 5) }).map((_, i) => (
              <div key={`a${i}`} className="w-2 h-2 bg-gh-success rounded-sm" />
            ))}
            {Array.from({ length: Math.min(file.deletions, 5) }).map((_, i) => (
              <div key={`d${i}`} className="w-2 h-2 bg-gh-danger rounded-sm" />
            ))}
          </div>
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
