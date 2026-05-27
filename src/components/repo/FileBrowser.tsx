// Client component: usa URL.createObjectURL (browser API) para la descarga
// por carpeta (Mejora 4) y useState para navegar dentro de carpetas.
"use client";

import { memo, useCallback } from "react";
import { FileEntry } from "@/types";
import { Folder, FileText, Download, ChevronDown, GitBranch } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface FileBrowserProps {
  files: FileEntry[];
}

function flatten(
  entries: FileEntry[],
  prefix = ""
): Array<{ path: string; type: FileEntry["type"]; lastCommitMessage: string }> {
  const out: Array<{ path: string; type: FileEntry["type"]; lastCommitMessage: string }> = [];
  for (const entry of entries) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    out.push({ path, type: entry.type, lastCommitMessage: entry.lastCommitMessage });
    if (entry.type === "folder" && entry.children) {
      out.push(...flatten(entry.children, path));
    }
  }
  return out;
}

function downloadJson(folderName: string, folder: FileEntry) {
  const payload = {
    folder: folderName,
    generatedAt: new Date().toISOString(),
    note: "Mock download — en producción esto sería un archivo .zip",
    files: folder.children ? flatten(folder.children) : [],
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${folderName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function FileBrowser({ files }: FileBrowserProps) {
  const { toast } = useToast();

  // useCallback: referencia estable para no romper React.memo de FileRow
  const handleFolderDownload = useCallback(
    (folder: FileEntry) => {
      downloadJson(folder.name, folder);
      toast({
        title: `${folder.name}/ descargado`,
        description: "Manifest JSON — en producción sería un .zip real.",
        variant: "success",
      });
    },
    [toast]
  );

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
        {sorted.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gh-fg-muted">
            <Folder className="w-8 h-8 mx-auto mb-2 text-gh-fg-muted/50" />
            <p>Esta carpeta está vacía.</p>
          </div>
        ) : (
          sorted.map((file, i) => (
            <FileRow
              key={file.name}
              file={file}
              isLast={i === sorted.length - 1}
              onFolderDownload={handleFolderDownload}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface FileRowProps {
  file: FileEntry;
  isLast: boolean;
  onFolderDownload: (folder: FileEntry) => void;
  depth?: number;
}

/**
 * React.memo: evita re-renders cuando sólo cambia el toast o el orden de
 * otro archivo. Las props son estables (onFolderDownload via useCallback).
 */
const FileRow = memo(function FileRow({
  file,
  isLast,
  onFolderDownload,
  depth = 0,
}: FileRowProps) {
  return (
    <div
      className={`flex items-center px-4 py-2 text-sm hover:bg-gh-canvas-subtle transition-colors group ${
        !isLast ? "border-b border-gh-border" : ""
      }`}
    >
      <div
        className="flex items-center gap-2 min-w-[200px]"
        style={{ paddingLeft: depth * 16 }}
      >
        {file.type === "folder" ? (
          <Folder className="w-4 h-4 text-gh-accent" />
        ) : (
          <FileText className="w-4 h-4 text-gh-fg-muted" />
        )}
        <span className={file.type === "folder" ? "text-gh-fg font-medium" : "text-gh-fg"}>
          {file.name}
        </span>

        {/* MEJORA 4: Download button para carpetas — visible en hover, siempre accessible */}
        {file.type === "folder" && (
          <button
            onClick={() => onFolderDownload(file)}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity ml-2 text-gh-fg-muted hover:text-gh-accent p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
            title={`Download ${file.name}/ as JSON manifest`}
            aria-label={`Download folder ${file.name}`}
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
});
