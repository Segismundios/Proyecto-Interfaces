"use client";

import { useState } from "react";
import { Repository } from "@/types";
import { Star, GitFork, Eye, Lock, Globe, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useFavorites } from "@/context/FavoritesContext";
import { useVisibility } from "@/context/VisibilityContext";

interface RepoHeaderProps {
  repo: Repository;
}

export function RepoHeader({ repo }: RepoHeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getVisibility, toggleVisibility: ctxToggle } = useVisibility();
  const starred = isFavorite(repo.owner, repo.name);
  const visibility = getVisibility(repo.owner, repo.name);

  async function confirmToggleVisibility() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    ctxToggle(repo.owner, repo.name);
    setSubmitting(false);
    setShowConfirm(false);
  }

  return (
    <>
      <header className="pb-4 border-b border-gh-border mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <BookOpen className="w-4 h-4 text-gh-fg-muted" />
            <h1 className="text-xl">
              <span className="text-gh-accent hover:underline cursor-pointer">{repo.owner}</span>
              <span className="text-gh-fg-muted mx-1">/</span>
              <span className="text-gh-accent font-semibold hover:underline cursor-pointer">{repo.name}</span>
            </h1>
            <Badge variant={visibility === "public" ? "muted" : "warning"}>
              {visibility === "public" ? (
                <Globe className="w-3 h-3 mr-1" />
              ) : (
                <Lock className="w-3 h-3 mr-1" />
              )}
              {visibility}
            </Badge>

            {/* MEJORA 3: Visibility toggle directly in repo header */}
            <Button size="sm" onClick={() => setShowConfirm(true)} title={`Change repository visibility (currently ${visibility})`}>
              {visibility === "public" ? (
                <>
                  <Lock className="w-3 h-3" /> Make private
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" /> Make public
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" onClick={() => toggleFavorite(repo.owner, repo.name)} aria-pressed={starred}>
              <Star className={`w-3.5 h-3.5 ${starred ? "fill-gh-warning text-gh-warning" : ""}`} />
              {starred ? "Starred" : "Star"}
              <span className="border-l border-gh-border pl-2 ml-1">
                {repo.stars - (repo.isFavorite ? 1 : 0) + (starred ? 1 : 0)}
              </span>
            </Button>
            <Button size="sm">
              <GitFork className="w-3.5 h-3.5" />
              Fork
              <span className="border-l border-gh-border pl-2 ml-1">{repo.forks}</span>
            </Button>
            <Button size="sm">
              <Eye className="w-3.5 h-3.5" />
              Watch
            </Button>
          </div>
        </div>

        <p className="text-sm text-gh-fg-muted">{repo.description}</p>

        {/* Reframe callout: justifies the visibility toggle's placement here */}
        <aside
          aria-label="UX rationale"
          className="mt-3 flex items-start gap-2 p-2.5 bg-gh-accent/10 border border-gh-accent/20 rounded text-xs text-gh-fg-muted"
        >
          <Info className="w-3.5 h-3.5 text-gh-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-gh-accent">Frecuencia sobre completitud:</span>{" "}
            el toggle de visibilidad vive aquí, junto a Star y Fork, porque es una decisión que el
            usuario revisa con frecuencia. GitHub clásico lo entierra en
            {" "}<code className="text-gh-fg">Settings → Danger Zone</code>, asumiendo que cambiar
            visibilidad es siempre &quot;peligroso&quot;.
          </p>
        </aside>
      </header>

      <Modal isOpen={showConfirm} onClose={() => !submitting && setShowConfirm(false)} title="Change repository visibility">
        <p className="text-sm text-gh-fg mb-4">
          ¿Estás seguro de que quieres hacer este repositorio{" "}
          <strong>{visibility === "public" ? "privado" : "público"}</strong>?
          {visibility === "public"
            ? " Dejará de ser visible para el público general."
            : " Será visible para cualquier persona en internet."}
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={() => setShowConfirm(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant={visibility === "public" ? "danger" : "primary"}
            onClick={confirmToggleVisibility}
            disabled={submitting}
          >
            {submitting ? "Applying..." : `Change to ${visibility === "public" ? "private" : "public"}`}
          </Button>
        </div>
      </Modal>
    </>
  );
}
