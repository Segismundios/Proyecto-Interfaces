// Client component: usa URL.createObjectURL (browser API) para la descarga
// (Mejora 4) y un dropdown de ramas funcional.
//
// HALLAZGOS E3:
//  - (Felipe + Salinas + Mananinane, los 3) el botón de descarga solo aparecía en
//    hover → casi nadie lo descubría. Ahora es SIEMPRE visible, en una columna
//    dedicada a la derecha, y también está en los ARCHIVOS (antes solo carpetas),
//    por consistencia. Principios: affordance/descubribilidad + consistencia.
//  - (Mananinane) el selector de rama "main ▾" no hacía nada → ahora es un
//    dropdown real poblado desde repoBranches.
"use client";

import { memo, useCallback, useState } from "react";
import { FileEntry } from "@/types";
import { Folder, FileText, Download, ChevronDown, GitBranch, Check } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useToast } from "@/components/ui/Toast";
import { getBranches } from "@/data/branches";

interface FileBrowserProps {
  files: FileEntry[];
  repoName: string;
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

function downloadEntry(entry: FileEntry) {
  const payload =
    entry.type === "folder"
      ? {
          folder: entry.name,
          generatedAt: new Date().toISOString(),
          note: "Mock download — en producción esto sería un archivo .zip",
          files: entry.children ? flatten(entry.children) : [],
        }
      : {
          file: entry.name,
          generatedAt: new Date().toISOString(),
          note: "Mock download — en producción esto sería el archivo real",
          lastCommitMessage: entry.lastCommitMessage,
        };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${entry.name}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function FileBrowser({ files, repoName }: FileBrowserProps) {
  const { toast } = useToast();
  const branches = getBranches(repoName);
  const [branch, setBranch] = useState(branches[0]);

  // useCallback: referencia estable para no romper React.memo de FileRow
  const handleDownload = useCallback(
    (entry: FileEntry) => {
      downloadEntry(entry);
      toast({
        title: `${entry.name}${entry.type === "folder" ? "/" : ""} descargado`,
        description:
          entry.type === "folder"
            ? "Manifest JSON — en producción sería un .zip real."
            : "Mock JSON — en producción sería el archivo real.",
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
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                aria-label={`Rama actual: ${branch}. Cambiar de rama`}
                className="inline-flex items-center gap-2 font-medium rounded-md border bg-gh-btn-bg border-gh-border text-gh-fg hover:bg-gh-btn-hover hover:border-gh-fg-muted/50 px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
              >
                <GitBranch className="w-3.5 h-3.5" />
                {branch}
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start" className="w-56">
              <DropdownMenu.Label>Switch branches</DropdownMenu.Label>
              {branches.map((b) => (
                <DropdownMenu.Item key={b} onSelect={() => setBranch(b)}>
                  <GitBranch className="w-3.5 h-3.5 text-gh-fg-muted" />
                  <span className="flex-1">{b}</span>
                  {b === branch && <Check className="w-3.5 h-3.5 text-gh-success" />}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <span className="text-xs text-gh-fg-muted">{branches.length} branches</span>
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
              onDownload={handleDownload}
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
  onDownload: (entry: FileEntry) => void;
  depth?: number;
}

/**
 * React.memo: evita re-renders cuando sólo cambia el toast o el orden de
 * otro archivo. Las props son estables (onDownload via useCallback).
 */
const FileRow = memo(function FileRow({
  file,
  isLast,
  onDownload,
  depth = 0,
}: FileRowProps) {
  return (
    <div
      className={`flex items-center px-4 py-2 text-sm hover:bg-gh-canvas-subtle transition-colors ${
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
      </div>

      <div className="flex-1 text-xs text-gh-fg-muted truncate px-4">
        {file.lastCommitMessage}
      </div>

      <div className="text-xs text-gh-fg-muted shrink-0 w-24 text-right">
        {timeAgo(file.lastCommitDate)}
      </div>

      {/* MEJORA 4 (revisada en E3): columna de descarga dedicada y SIEMPRE visible,
          para archivos y carpetas por consistencia. */}
      <div className="shrink-0 w-10 flex justify-end">
        <button
          onClick={() => onDownload(file)}
          className="text-gh-fg-muted hover:text-gh-accent hover:bg-gh-btn-bg p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
          title={`Download ${file.name}${file.type === "folder" ? "/" : ""}`}
          aria-label={`Download ${file.type === "folder" ? "folder" : "file"} ${file.name}`}
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});
