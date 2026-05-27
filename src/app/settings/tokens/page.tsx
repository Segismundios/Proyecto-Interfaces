// Client component: formulario con useState (CRUD de tokens) + loading state
// + validación inline; toda la interactividad requiere browser.
"use client";

import { useState } from "react";
import { tokens as initialTokens } from "@/data/tokens";
import { PersonalAccessToken } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SecurityGate } from "@/components/ui/SecurityGate";
import { Key, Trash2, Plus, Copy, Loader2, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";

const AVAILABLE_SCOPES = ["repo", "workflow", "write:packages", "read:org", "gist", "admin:repo_hook"];

export default function TokensPage() {
  const [tokens, setTokens] = useState<PersonalAccessToken[]>(initialTokens);
  const [showModal, setShowModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function resetForm() {
    setNewTokenName("");
    setSelectedScopes([]);
    setError(null);
    setSubmitting(false);
  }

  function closeModal() {
    setShowModal(false);
    setTimeout(resetForm, 200);
  }

  async function handleCreate() {
    if (!newTokenName.trim()) {
      setError("El nombre del token es obligatorio");
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(newTokenName)) {
      setError("Solo se permiten letras, números, '.', '_' y '-'");
      return;
    }
    if (selectedScopes.length === 0) {
      setError("Selecciona al menos un scope");
      return;
    }
    if (tokens.some((t) => t.name === newTokenName.trim())) {
      setError("Ya existe un token con ese nombre");
      return;
    }
    setError(null);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const newToken: PersonalAccessToken = {
      id: String(Date.now()),
      name: newTokenName.trim(),
      scopes: selectedScopes,
      createdAt: new Date().toISOString(),
      lastUsed: "Never",
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      tokenPreview: `ghp_****...${Math.random().toString(36).slice(-4)}`,
    };
    setTokens([newToken, ...tokens]);
    closeModal();
  }

  function handleDelete(id: string) {
    setTokens(tokens.filter((t) => t.id !== id));
  }

  function toggleScope(scope: string) {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
    if (error) setError(null);
  }

  async function handleCopy(preview: string, id: string) {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore — clipboard API may be unavailable in some browsers
    }
  }

  return (
    <SecurityGate
      title="Access Tokens protegidos"
      description="Los Personal Access Tokens son credenciales sensibles. Confirma tu contraseña para verlos o crearlos."
    >
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gh-fg">Personal Access Tokens</h1>
          <p className="text-sm text-gh-fg-muted mt-1">
            Tokens que has generado para acceder a la API de manera autenticada.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Generate new token
        </Button>
      </header>

      {tokens.length === 0 ? (
        <EmptyState
          icon={Key}
          title="No tienes tokens aún"
          description="Genera un Personal Access Token para autenticarte desde tu terminal, scripts o integraciones."
          cta={
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              Generate your first token
            </Button>
          }
        />
      ) : (
        <div className="border border-gh-border rounded-md overflow-hidden">
          {tokens.map((token, i) => (
            <div
              key={token.id}
              className={`flex items-center justify-between px-4 py-3 hover:bg-gh-canvas-subtle transition-colors ${
                i < tokens.length - 1 ? "border-b border-gh-border" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Key className="w-4 h-4 text-gh-fg-muted shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gh-fg truncate">{token.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-gh-canvas px-1.5 py-0.5 rounded text-gh-fg-muted">
                      {token.tokenPreview}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(token.tokenPreview, token.id)}
                      title="Copy token preview"
                      aria-label={`Copy ${token.name} token preview`}
                      className="text-gh-fg-muted hover:text-gh-fg p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent"
                    >
                      {copied === token.id ? (
                        <Check className="w-3 h-3 text-gh-success" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1 flex-wrap justify-end max-w-xs">
                  {token.scopes.map((scope) => (
                    <Badge key={scope} variant="muted">
                      {scope}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gh-fg-muted text-right whitespace-nowrap">
                  <p>Created {formatDate(token.createdAt)}</p>
                  <p>Expires {formatDate(token.expiresAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(token.id)}
                  title={`Delete ${token.name}`}
                  aria-label={`Delete ${token.name}`}
                  className="text-gh-danger hover:text-white hover:bg-gh-danger p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title="Generate new token">
        <div className="space-y-4">
          <div>
            <label htmlFor="token-name" className="block text-sm text-gh-fg mb-1.5">
              Token name <span className="text-gh-danger">*</span>
            </label>
            <input
              id="token-name"
              type="text"
              value={newTokenName}
              onChange={(e) => {
                setNewTokenName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. my-laptop-token"
              autoFocus
              disabled={submitting}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 disabled:cursor-not-allowed"
              aria-invalid={error !== null}
            />
          </div>

          <fieldset disabled={submitting}>
            <legend className="block text-sm text-gh-fg mb-2">
              Scopes <span className="text-gh-danger">*</span>
            </legend>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {AVAILABLE_SCOPES.map((scope) => (
                <label
                  key={scope}
                  className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-gh-canvas"
                >
                  <input
                    type="checkbox"
                    checked={selectedScopes.includes(scope)}
                    onChange={() => toggleScope(scope)}
                    className="accent-gh-btn-primary"
                  />
                  <code className="text-sm text-gh-fg">{scope}</code>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <div
              role="alert"
              className="text-xs text-gh-danger bg-gh-danger/10 border border-gh-danger/30 rounded-md px-3 py-2"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-gh-border">
            <Button onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate token"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </SecurityGate>
  );
}
