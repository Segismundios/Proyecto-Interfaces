"use client";

import { useState } from "react";
import { FileEntry } from "@/types";
import { Folder, FileText, Download, ChevronDown, GitBranch } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface FileBrowserProps {
  files: FileEntry[];
}

export function FileBrowser({ files }: FileBrowserProps) {
  const [toast, setToast] = useState<string | null>(null);

  const handleFolderDownload = (folderName: string) => {
    setToast(`Downloading ${folderName}/ as ZIP...`);
    setTimeout(() => setToast(null), 3000);
  };

  const sorted = [...files].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "folder" ? -1 : 1;
  });

  return (
    <div>
      {/* Branch selector */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button size="sm">
            <GitBranch className="w-3.5 h-3.5" />
            main
            <ChevronDown className="w-3 h-3" />
          </Button>
          <span className="text-xs text-gh-fg-muted">4 branches</span>
        </div>
        <Button size="sm" variant="primary">
          <Download className="w-3.5 h-3.5" />
          Code
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>

      {/* File table */}
      <div className="border border-gh-border rounded-md overflow-hidden">
        <div className="bg-gh-canvas-subtle px-4 py-2 border-b border-gh-border text-xs text-gh-fg-muted">
          <span className="font-semibold text-gh-fg">javier-lopez</span> docs: update README with project info
        </div>
        {sorted.map((file, i) => (
          <FileRow
            key={file.name}
            file={file}
            isLast={i === sorted.length - 1}
            onFolderDownload={handleFolderDownload}
          />
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gh-canvas-subtle border border-gh-border rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 z-50">
          <Download className="w-4 h-4 text-gh-success animate-bounce" />
          <span className="text-sm text-gh-fg">{toast}</span>
        </div>
      )}
    </div>
  );
}

function FileRow({
  file,
  isLast,
  onFolderDownload,
  depth = 0,
}: {
  file: FileEntry;
  isLast: boolean;
  onFolderDownload: (name: string) => void;
  depth?: number;
}) {
  return (
    <div
      className={`flex items-center px-4 py-2 text-sm hover:bg-gh-canvas-subtle transition-colors group ${
        !isLast ? "border-b border-gh-border" : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-[200px]" style={{ paddingLeft: depth * 16 }}>
        {file.type === "folder" ? (
          <Folder className="w-4 h-4 text-gh-accent" />
        ) : (
          <FileText className="w-4 h-4 text-gh-fg-muted" />
        )}
        <span className={file.type === "folder" ? "text-gh-fg font-medium" : "text-gh-fg"}>
          {file.name}
        </span>

        {/* MEJORA 4: Download button for folders */}
        {file.type === "folder" && (
          <button
            onClick={() => onFolderDownload(file.name)}
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gh-fg-muted hover:text-gh-accent"
            title={`Download ${file.name}/ as ZIP`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 text-xs text-gh-fg-muted truncate px-4">
        {file.lastCommitMessage}
      </div>

      <div className="text-xs text-gh-fg-muted shrink-0">
        {timeAgo(file.lastCommitDate)}
      </div>
    </div>
  );
}
