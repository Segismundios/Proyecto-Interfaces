// Client component: useState para abrir/cerrar el modal de "New Repo" y delega
// la creación de PR en NewPullRequestModal (reutilizable, con selector de repo).
//
// HALLAZGO E3 (Felipe + Mananinane): "Settings" se repetía en quick actions, navbar
// y menú de usuario → redundante. Lo quitamos de aquí y agregamos "New Issue", una
// entrada de creación que faltaba (alinea las 3 acciones de creación + Explore).
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, GitPullRequest, CircleDot, Compass, Loader2, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { NewPullRequestModal } from "@/components/pr/NewPullRequestModal";
import { currentUser } from "@/data/users";

type ActionKey = "new-repo" | "new-pr" | "new-issue" | "explore";

const actions: Array<{
  key: ActionKey;
  icon: typeof Plus;
  label: string;
  color: string;
  href?: string;
}> = [
  { key: "new-repo", icon: Plus, label: "New Repository", color: "text-gh-success" },
  { key: "new-pr", icon: GitPullRequest, label: "New Pull Request", color: "text-gh-done" },
  {
    key: "new-issue",
    icon: CircleDot,
    label: "New Issue",
    color: "text-gh-warning",
    href: `/${currentUser.username}/proyecto-interfaces/issues`,
  },
  { key: "explore", icon: Compass, label: "Explore Repos", color: "text-gh-accent", href: "/explore" },
];

export function QuickActions() {
  const [openAction, setOpenAction] = useState<ActionKey | null>(null);

  return (
    <section aria-labelledby="quick-actions-heading">
      <h2 id="quick-actions-heading" className="text-base font-semibold text-gh-fg mb-3">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => {
          const className =
            "flex flex-col items-center gap-2 p-4 bg-gh-canvas-subtle border border-gh-border rounded-md hover:border-gh-accent/50 hover:bg-gh-btn-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gh-canvas";

          const inner = (
            <>
              <action.icon className={`w-6 h-6 ${action.color}`} />
              <span className="text-xs text-gh-fg">{action.label}</span>
            </>
          );

          if (action.href) {
            return (
              <Link key={action.key} href={action.href} className={className}>
                {inner}
              </Link>
            );
          }

          return (
            <button
              key={action.key}
              type="button"
              onClick={() => setOpenAction(action.key)}
              className={className}
            >
              {inner}
            </button>
          );
        })}
      </div>

      <NewRepoModal open={openAction === "new-repo"} onClose={() => setOpenAction(null)} />
      <NewPullRequestModal open={openAction === "new-pr"} onClose={() => setOpenAction(null)} />
    </section>
  );
}

function NewRepoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [phase, setPhase] = useState<"form" | "submitting" | "done">("form");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setDescription("");
    setVisibility("public");
    setPhase("form");
    setError(null);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 200);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError("El nombre del repositorio es obligatorio");
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
      setError("Solo se permiten letras, números, '.', '_' y '-'");
      return;
    }
    setError(null);
    setPhase("submitting");
    await new Promise((r) => setTimeout(r, 700));
    setPhase("done");
    setTimeout(handleClose, 1200);
  }

  return (
    <Modal isOpen={open} onClose={handleClose} title="New repository">
      {phase === "done" ? (
        <SuccessState message={`Repositorio "${name}" creado (mock).`} />
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="repo-name" className="block text-sm text-gh-fg mb-1.5">
              Repository name <span className="text-gh-danger">*</span>
            </label>
            <input
              id="repo-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-new-project"
              autoFocus
              disabled={phase === "submitting"}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 disabled:cursor-not-allowed"
              aria-invalid={error !== null}
              aria-describedby={error ? "repo-name-error" : undefined}
            />
            {error && (
              <p id="repo-name-error" className="mt-1.5 text-xs text-gh-danger">
                {error}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="repo-desc" className="block text-sm text-gh-fg mb-1.5">
              Description <span className="text-gh-fg-muted text-xs">(optional)</span>
            </label>
            <input
              id="repo-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your repository"
              disabled={phase === "submitting"}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <fieldset disabled={phase === "submitting"}>
            <legend className="block text-sm text-gh-fg mb-2">Visibility</legend>
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-md hover:bg-gh-canvas">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="mt-1 accent-gh-btn-primary"
                />
                <div>
                  <p className="text-sm text-gh-fg">Public</p>
                  <p className="text-xs text-gh-fg-muted">Anyone on the internet can see this repository.</p>
                </div>
              </label>
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-md hover:bg-gh-canvas">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="mt-1 accent-gh-btn-primary"
                />
                <div>
                  <p className="text-sm text-gh-fg">Private</p>
                  <p className="text-xs text-gh-fg-muted">You choose who can see and commit.</p>
                </div>
              </label>
            </div>
          </fieldset>

          <div className="flex justify-end gap-2 pt-2 border-t border-gh-border">
            <Button onClick={handleClose} disabled={phase === "submitting"}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={phase === "submitting"}>
              {phase === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create repository"
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function SuccessState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center text-center py-4">
      <div className="w-12 h-12 rounded-full bg-gh-success/15 border border-gh-success/40 flex items-center justify-center mb-3">
        <Check className="w-6 h-6 text-gh-success" />
      </div>
      <p className="text-sm text-gh-fg">{message}</p>
    </div>
  );
}
