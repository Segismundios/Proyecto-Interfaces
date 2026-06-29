// Client component: modal reutilizable para abrir un pull request.
//
// HALLAZGO E3 (Mananinane): no se podía crear una PR — el quick-action no dejaba
// elegir repositorio y dentro del repo no existía la opción. Este componente
// resuelve ambos: se usa desde QuickActions (con selector de repo) y desde el tab
// "Pull Requests" del repo (con `lockedRepo`, repo fijo). Las ramas base/compare
// son dropdowns poblados desde `repoBranches`, no campos de texto a ciegas.
"use client";

import { useEffect, useMemo, useState } from "react";
import { GitPullRequest, Loader2, Check, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { repositories } from "@/data/repos";
import { getBranches, DEFAULT_BRANCH } from "@/data/branches";

interface NewPullRequestModalProps {
  open: boolean;
  onClose: () => void;
  /** Si se entrega, el repositorio queda fijo y se oculta el selector. */
  lockedRepo?: string;
}

const selectClass =
  "w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 disabled:cursor-not-allowed";

export function NewPullRequestModal({ open, onClose, lockedRepo }: NewPullRequestModalProps) {
  const [repo, setRepo] = useState(lockedRepo ?? repositories[0].name);
  const [title, setTitle] = useState("");
  const [base, setBase] = useState(DEFAULT_BRANCH);
  const [head, setHead] = useState("");
  const [phase, setPhase] = useState<"form" | "submitting" | "done">("form");
  const [error, setError] = useState<string | null>(null);

  const branches = useMemo(() => getBranches(repo), [repo]);

  // Al cambiar de repo (o al abrir con lockedRepo) recalibramos las ramas:
  // base = rama por defecto, head = primera rama distinta disponible.
  useEffect(() => {
    if (!open) return;
    const effectiveRepo = lockedRepo ?? repo;
    const b = getBranches(effectiveRepo);
    setBase(b.includes(DEFAULT_BRANCH) ? DEFAULT_BRANCH : b[0]);
    setHead(b.find((x) => x !== (b.includes(DEFAULT_BRANCH) ? DEFAULT_BRANCH : b[0])) ?? "");
    setError(null);
  }, [open, repo, lockedRepo]);

  function reset() {
    setRepo(lockedRepo ?? repositories[0].name);
    setTitle("");
    setBase(DEFAULT_BRANCH);
    setHead("");
    setPhase("form");
    setError(null);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 200);
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!head) {
      setError("Selecciona la rama de origen (compare)");
      return;
    }
    if (head === base) {
      setError("La rama de origen y la de destino no pueden ser la misma");
      return;
    }
    setError(null);
    setPhase("submitting");
    await new Promise((r) => setTimeout(r, 700));
    setPhase("done");
    setTimeout(handleClose, 1300);
  }

  const headOptions = branches.filter((b) => b !== base);

  return (
    <Modal isOpen={open} onClose={handleClose} title="Open a pull request">
      {phase === "done" ? (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-12 h-12 rounded-full bg-gh-success/15 border border-gh-success/40 flex items-center justify-center mb-3">
            <Check className="w-6 h-6 text-gh-success" />
          </div>
          <p className="text-sm text-gh-fg">
            Pull request <strong>&ldquo;{title}&rdquo;</strong> abierto en{" "}
            <code className="text-gh-accent">{repo}</code> (mock).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Selector de repositorio (oculto si lockedRepo) */}
          {!lockedRepo ? (
            <div>
              <label htmlFor="pr-repo" className="block text-sm text-gh-fg mb-1.5">
                Repository <span className="text-gh-danger">*</span>
              </label>
              <select
                id="pr-repo"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                disabled={phase === "submitting"}
                className={selectClass}
              >
                {repositories.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.owner}/{r.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-sm bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-gh-fg-muted">
              Repositorio: <code className="text-gh-fg">{lockedRepo}</code>
            </div>
          )}

          {/* Preview dirección del merge (coherente con MergeDirectionBanner) */}
          <div className="flex items-center justify-center gap-3 text-sm bg-gh-canvas border border-gh-border rounded-md p-3">
            <code className="text-gh-accent font-mono">{head || "<compare>"}</code>
            <ArrowRight className="w-4 h-4 text-gh-fg-muted" aria-label="hacia" />
            <code className="text-gh-success font-mono">{base}</code>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pr-base" className="block text-sm text-gh-fg mb-1.5">
                Base branch
              </label>
              <select
                id="pr-base"
                value={base}
                onChange={(e) => {
                  const newBase = e.target.value;
                  setBase(newBase);
                  if (head === newBase) setHead("");
                }}
                disabled={phase === "submitting"}
                className={selectClass}
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pr-head" className="block text-sm text-gh-fg mb-1.5">
                Compare branch <span className="text-gh-danger">*</span>
              </label>
              <select
                id="pr-head"
                value={head}
                onChange={(e) => setHead(e.target.value)}
                disabled={phase === "submitting"}
                className={selectClass}
              >
                <option value="">Selecciona…</option>
                {headOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="pr-title" className="block text-sm text-gh-fg mb-1.5">
              Pull request title <span className="text-gh-danger">*</span>
            </label>
            <input
              id="pr-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Add new feature"
              autoFocus
              disabled={phase === "submitting"}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 disabled:cursor-not-allowed"
              aria-invalid={error !== null}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="text-xs text-gh-danger bg-gh-danger/10 border border-gh-danger/30 rounded-md px-3 py-2"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-gh-border">
            <Button onClick={handleClose} disabled={phase === "submitting"}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={phase === "submitting"}>
              {phase === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <GitPullRequest className="w-4 h-4" />
                  Create pull request
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
