// Client component: useState para el modal de confirmación de visibilidad
// y consume FavoritesContext/VisibilityContext/UserDataContext (estado reactivo del browser).
"use client";

import { useState } from "react";
import { Repository } from "@/types";
import { Star, GitFork, Eye, EyeOff, Lock, Globe, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useFavorites } from "@/context/FavoritesContext";
import { useVisibility } from "@/context/VisibilityContext";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "@/components/ui/Toast";

interface RepoHeaderProps {
  repo: Repository;
}

export function RepoHeader({ repo }: RepoHeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getVisibility, toggleVisibility: ctxToggle } = useVisibility();
  const { forks, watches, toggleFork, toggleWatch } = useUserData();
  const { toast } = useToast();

  const starred = isFavorite(repo.owner, repo.name);
  const visibility = getVisibility(repo.owner, repo.name);
  const repoKey = `${repo.owner}/${repo.name}`;
  const isForked = forks.includes(repoKey);
  const isWatching = watches.includes(repoKey);

  const forkCount = repo.forks + (isForked ? 1 : 0);
  const starCount = repo.stars - (repo.isFavorite ? 1 : 0) + (starred ? 1 : 0);

  async function confirmToggleVisibility() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    ctxToggle(repo.owner, repo.name);
    setSubmitting(false);
    setShowConfirm(false);
    toast({
      title: `Repositorio ahora es ${visibility === "public" ? "privado" : "público"}`,
      variant: "success",
    });
  }

  function handleFork() {
    toggleFork(repoKey);
    if (!isForked) {
      toast({
        title: `Forked ${repo.owner}/${repo.name}`,
        description: "El fork fue agregado a tus repositorios.",
        variant: "success",
      });
    }
  }

  function handleWatch() {
    toggleWatch(repoKey);
    toast({
      title: isWatching ? "Dejaste de observar este repositorio" : "Ahora observas este repositorio",
      variant: "info",
    });
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
              <span className="text-gh-accent font-semibold hover:underline cursor-pointer">
                {repo.name}
              </span>
            </h1>
            <Badge variant={visibility === "public" ? "muted" : "warning"}>
              {visibility === "public" ? (
                <Globe className="w-3 h-3 mr-1" />
              ) : (
                <Lock className="w-3 h-3 mr-1" />
              )}
              {visibility}
            </Badge>

            {/* MEJORA 3: Visibility toggle inline en el header del repo */}
            <Button
              size="sm"
              onClick={() => setShowConfirm(true)}
              title={`Cambiar visibilidad (actualmente ${visibility})`}
            >
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
            {/* Star (favorito) */}
            <Button
              size="sm"
              onClick={() => toggleFavorite(repo.owner, repo.name)}
              aria-pressed={starred}
            >
              <Star
                className={`w-3.5 h-3.5 ${starred ? "fill-gh-warning text-gh-warning" : ""}`}
              />
              {starred ? "Starred" : "Star"}
              <span className="border-l border-gh-border pl-2 ml-1">{starCount}</span>
            </Button>

            {/* Fork */}
            <Button
              size="sm"
              onClick={handleFork}
              aria-pressed={isForked}
              title={isForked ? "Ya has hecho fork de este repositorio" : "Fork este repositorio"}
            >
              <GitFork className={`w-3.5 h-3.5 ${isForked ? "text-gh-accent" : ""}`} />
              {isForked ? "Forked" : "Fork"}
              <span className="border-l border-gh-border pl-2 ml-1">{forkCount}</span>
            </Button>

            {/* Watch */}
            <Button
              size="sm"
              onClick={handleWatch}
              aria-pressed={isWatching}
              title={isWatching ? "Dejar de observar" : "Observar este repositorio"}
            >
              {isWatching ? (
                <EyeOff className="w-3.5 h-3.5 text-gh-accent" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              {isWatching ? "Watching" : "Watch"}
            </Button>
          </div>
        </div>

        <p className="text-sm text-gh-fg-muted">{repo.description}</p>

        {/* Callout de reframe: justifica la decisión de diseño (Mejora 3) */}
        <aside
          aria-label="UX rationale"
          className="mt-3 flex items-start gap-2 p-2.5 bg-gh-accent/10 border border-gh-accent/20 rounded text-xs text-gh-fg-muted"
        >
          <Info className="w-3.5 h-3.5 text-gh-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-gh-accent">Frecuencia sobre completitud:</span>{" "}
            el toggle de visibilidad vive aquí, junto a Star y Fork, porque es una decisión que el
            usuario revisa con frecuencia. GitHub clásico lo entierra en{" "}
            <code className="text-gh-fg">Settings → Danger Zone</code>, asumiendo que cambiar
            visibilidad es siempre &quot;peligroso&quot;.
          </p>
        </aside>
      </header>

      <Modal
        isOpen={showConfirm}
        onClose={() => !submitting && setShowConfirm(false)}
        title="Cambiar visibilidad del repositorio"
      >
        <p className="text-sm text-gh-fg mb-4">
          ¿Estás seguro de que quieres hacer este repositorio{" "}
          <strong>{visibility === "public" ? "privado" : "público"}</strong>?
          {visibility === "public"
            ? " Dejará de ser visible para el público general."
            : " Será visible para cualquier persona en internet."}
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={() => setShowConfirm(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant={visibility === "public" ? "danger" : "primary"}
            onClick={confirmToggleVisibility}
            disabled={submitting}
          >
            {submitting
              ? "Aplicando…"
              : `Cambiar a ${visibility === "public" ? "privado" : "público"}`}
          </Button>
        </div>
      </Modal>
    </>
  );
}
