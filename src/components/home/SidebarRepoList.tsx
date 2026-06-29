// Client component: lista lateral de repos con "mostrar más".
//
// HALLAZGO E3 (Salinas): la lista de repos del sidebar se acumulaba infinito
// hacia abajo. Acotamos a 5 visibles + "mostrar más", y el encabezado enlaza a
// la vista completa /[user]. Principio: control de densidad / progressive disclosure.
"use client";

import { useState } from "react";
import Link from "next/link";
import { Book, ChevronDown, ChevronUp } from "lucide-react";
import { Repository } from "@/types";

interface SidebarRepoListProps {
  repos: Repository[];
  userName: string;
}

const COLLAPSED_LIMIT = 5;

export function SidebarRepoList({ repos, userName }: SidebarRepoListProps) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = repos.length > COLLAPSED_LIMIT;
  const visible = expanded || !canExpand ? repos : repos.slice(0, COLLAPSED_LIMIT);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wide">
          Your Repositories
        </h3>
        <Link
          href={`/${userName}`}
          className="text-[11px] text-gh-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent rounded"
        >
          Ver todos
        </Link>
      </div>
      <ul className="space-y-0.5">
        {visible.map((repo) => (
          <li key={repo.name}>
            <Link
              href={`/${repo.owner}/${repo.name}`}
              className="flex items-center gap-2 px-2 py-1.5 text-sm text-gh-fg hover:bg-gh-canvas-subtle rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
            >
              <Book className="w-3.5 h-3.5 text-gh-fg-muted shrink-0" />
              <span className="truncate">{repo.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-gh-accent hover:bg-gh-canvas-subtle rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              Mostrar menos <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Mostrar {repos.length - COLLAPSED_LIMIT} más <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
