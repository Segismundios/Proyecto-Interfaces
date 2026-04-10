"use client";

import { useState } from "react";
import { Repository } from "@/types";
import { Star, GitFork, Eye, Lock, Globe, BookOpen } from "lucide-react";
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
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getVisibility, toggleVisibility: ctxToggle } = useVisibility();
  const starred = isFavorite(repo.owner, repo.name);
  const visibility = getVisibility(repo.owner, repo.name);

  const toggleVisibility = () => {
    ctxToggle(repo.owner, repo.name);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="pb-4 border-b border-gh-border mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gh-fg-muted" />
            <h1 className="text-xl">
              <span className="text-gh-accent hover:underline cursor-pointer">{repo.owner}</span>
              <span className="text-gh-fg-muted mx-1">/</span>
              <span className="text-gh-accent font-semibold hover:underline cursor-pointer">{repo.name}</span>
            </h1>
            <Badge variant={visibility === "public" ? "muted" : "warning"}>
              {visibility === "public" ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
              {visibility}
            </Badge>

            {/* MEJORA 3: Visibility toggle directly in repo header */}
            <Button size="sm" onClick={() => setShowConfirm(true)}>
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

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toggleFavorite(repo.owner, repo.name)}>
              <Star className={`w-3.5 h-3.5 ${starred ? "fill-gh-warning text-gh-warning" : ""}`} />
              {starred ? "Starred" : "Star"}
              <span className="border-l border-gh-border pl-2 ml-1">{repo.stars - (repo.isFavorite ? 1 : 0) + (starred ? 1 : 0)}</span>
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

        {/* UX improvement callout */}
        <div className="mt-3 p-2 bg-gh-accent/10 border border-gh-accent/20 rounded text-xs text-gh-accent">
          UX Improvement: Visibility toggle is directly accessible here instead of Settings &gt; Danger Zone
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Change repository visibility">
        <p className="text-sm text-gh-fg mb-4">
          Are you sure you want to make this repository{" "}
          <strong>{visibility === "public" ? "private" : "public"}</strong>?
          {visibility === "public"
            ? " This will hide it from public view."
            : " This will make it visible to everyone."}
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant={visibility === "public" ? "danger" : "primary"} onClick={toggleVisibility}>
            Change to {visibility === "public" ? "private" : "public"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
