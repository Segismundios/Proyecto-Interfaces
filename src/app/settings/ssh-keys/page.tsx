"use client";

import { useState } from "react";
import { sshKeys as initialKeys } from "@/data/sshKeys";
import { SSHKey } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SecurityGate } from "@/components/ui/SecurityGate";
import { Shield, Trash2, Plus, Fingerprint, Loader2 } from "lucide-react";
import { formatDate, timeAgo } from "@/lib/utils";

const VALID_KEY_PREFIXES = ["ssh-rsa", "ssh-ed25519", "ssh-dss", "ecdsa-sha2-nistp256", "ecdsa-sha2-nistp384", "ecdsa-sha2-nistp521"];

export default function SSHKeysPage() {
  const [keys, setKeys] = useState<SSHKey[]>(initialKeys);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newKey, setNewKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setNewTitle("");
    setNewKey("");
    setError(null);
    setSubmitting(false);
  }

  function closeModal() {
    setShowModal(false);
    setTimeout(resetForm, 200);
  }

  async function handleAdd() {
    if (!newTitle.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!newKey.trim()) {
      setError("La clave pública es obligatoria");
      return;
    }
    const trimmedKey = newKey.trim();
    if (!VALID_KEY_PREFIXES.some((p) => trimmedKey.startsWith(p))) {
      setError(`La clave debe comenzar con uno de: ${VALID_KEY_PREFIXES.slice(0, 3).join(", ")}, ...`);
      return;
    }
    setError(null);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const key: SSHKey = {
      id: String(Date.now()),
      title: newTitle.trim(),
      fingerprint: `SHA256:${Math.random().toString(36).slice(2, 15)}${Math.random().toString(36).slice(2, 15)}`,
      addedAt: new Date().toISOString(),
      lastUsed: "Never",
    };
    setKeys([key, ...keys]);
    closeModal();
  }

  function handleDelete(id: string) {
    setKeys(keys.filter((k) => k.id !== id));
  }

  return (
    <SecurityGate
      title="SSH Keys protegidas"
      description="Las claves SSH son credenciales sensibles. Confirma tu contraseña para verlas o agregarlas."
    >
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gh-fg">SSH Keys</h1>
          <p className="text-sm text-gh-fg-muted mt-1">
            Las claves SSH permiten conectarte de forma segura a tus repositorios sin contraseña.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add SSH key
        </Button>
      </header>

      {keys.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No tienes SSH keys configuradas"
          description="Agrega tu llave pública para hacer push y pull sin tener que escribir tu contraseña cada vez."
          cta={
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              Add your first SSH key
            </Button>
          }
        />
      ) : (
        <div className="border border-gh-border rounded-md overflow-hidden">
          {keys.map((key, i) => (
            <div
              key={key.id}
              className={`flex items-center justify-between px-4 py-3 hover:bg-gh-canvas-subtle transition-colors ${
                i < keys.length - 1 ? "border-b border-gh-border" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Shield className="w-4 h-4 text-gh-success shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gh-fg truncate">{key.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Fingerprint className="w-3 h-3 text-gh-fg-muted shrink-0" />
                    <code className="text-xs text-gh-fg-muted truncate">{key.fingerprint}</code>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-gh-fg-muted text-right whitespace-nowrap">
                  <p>Added {formatDate(key.addedAt)}</p>
                  <p>
                    Last used{" "}
                    {typeof key.lastUsed === "string" && key.lastUsed === "Never"
                      ? "never"
                      : timeAgo(key.lastUsed)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(key.id)}
                  title={`Delete ${key.title}`}
                  aria-label={`Delete ${key.title}`}
                  className="text-gh-danger hover:text-white hover:bg-gh-danger p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title="Add SSH Key">
        <div className="space-y-4">
          <div>
            <label htmlFor="ssh-title" className="block text-sm text-gh-fg mb-1.5">
              Title <span className="text-gh-danger">*</span>
            </label>
            <input
              id="ssh-title"
              type="text"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. My laptop"
              autoFocus
              disabled={submitting}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="ssh-key" className="block text-sm text-gh-fg mb-1.5">
              Public key <span className="text-gh-danger">*</span>
            </label>
            <textarea
              id="ssh-key"
              value={newKey}
              onChange={(e) => {
                setNewKey(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Begins with 'ssh-rsa', 'ssh-ed25519', etc."
              rows={4}
              disabled={submitting}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg font-mono placeholder:text-gh-fg-muted placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Button onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAdd} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add key"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </SecurityGate>
  );
}
