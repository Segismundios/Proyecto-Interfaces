"use client";

import { useState } from "react";
import { sshKeys as initialKeys } from "@/data/sshKeys";
import { SSHKey } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Shield, Trash2, Plus, Fingerprint } from "lucide-react";
import { formatDate, timeAgo } from "@/lib/utils";

export default function SSHKeysPage() {
  const [keys, setKeys] = useState<SSHKey[]>(initialKeys);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newKey, setNewKey] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim() || !newKey.trim()) return;
    const key: SSHKey = {
      id: String(Date.now()),
      title: newTitle,
      fingerprint: `SHA256:${Math.random().toString(36).slice(2, 15)}${Math.random().toString(36).slice(2, 15)}`,
      addedAt: new Date().toISOString(),
      lastUsed: "Never",
    };
    setKeys([...keys, key]);
    setNewTitle("");
    setNewKey("");
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gh-fg">SSH Keys</h1>
          <p className="text-sm text-gh-fg-muted mt-1">
            SSH keys allow you to establish a secure connection to your repositories.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add SSH key
        </Button>
      </div>

      {/* Key list */}
      <div className="border border-gh-border rounded-md overflow-hidden">
        {keys.map((key, i) => (
          <div
            key={key.id}
            className={`flex items-center justify-between px-4 py-3 ${
              i < keys.length - 1 ? "border-b border-gh-border" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gh-success" />
              <div>
                <p className="text-sm font-semibold text-gh-fg">{key.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Fingerprint className="w-3 h-3 text-gh-fg-muted" />
                  <code className="text-xs text-gh-fg-muted">{key.fingerprint}</code>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gh-fg-muted text-right">
                <p>Added {formatDate(key.addedAt)}</p>
                <p>Last used {typeof key.lastUsed === "string" && key.lastUsed === "Never" ? "never" : timeAgo(key.lastUsed)}</p>
              </div>
              <button
                onClick={() => handleDelete(key.id)}
                className="text-gh-danger hover:text-gh-danger/80 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add SSH Key">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gh-fg mb-1">Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. My laptop"
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg focus:outline-none focus:border-gh-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-gh-fg mb-1">Public key</label>
            <textarea
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Begins with 'ssh-rsa', 'ssh-ed25519', etc."
              rows={4}
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg font-mono focus:outline-none focus:border-gh-accent resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd}>Add key</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
