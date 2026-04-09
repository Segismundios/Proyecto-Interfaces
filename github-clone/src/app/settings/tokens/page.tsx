"use client";

import { useState } from "react";
import { tokens as initialTokens } from "@/data/tokens";
import { PersonalAccessToken } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Key, Trash2, Plus, Copy } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TokensPage() {
  const [tokens, setTokens] = useState<PersonalAccessToken[]>(initialTokens);
  const [showModal, setShowModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const availableScopes = ["repo", "workflow", "write:packages", "read:org", "gist", "admin:repo_hook"];

  const handleCreate = () => {
    if (!newTokenName.trim()) return;
    const newToken: PersonalAccessToken = {
      id: String(Date.now()),
      name: newTokenName,
      scopes: selectedScopes,
      createdAt: new Date().toISOString(),
      lastUsed: "Never",
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      tokenPreview: `ghp_****...${Math.random().toString(36).slice(-4)}`,
    };
    setTokens([...tokens, newToken]);
    setNewTokenName("");
    setSelectedScopes([]);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setTokens(tokens.filter((t) => t.id !== id));
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gh-fg">Personal Access Tokens</h1>
          <p className="text-sm text-gh-fg-muted mt-1">
            Tokens you have generated that can be used to access the API.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Generate new token
        </Button>
      </div>

      {/* Token list */}
      <div className="border border-gh-border rounded-md overflow-hidden">
        {tokens.map((token, i) => (
          <div
            key={token.id}
            className={`flex items-center justify-between px-4 py-3 ${
              i < tokens.length - 1 ? "border-b border-gh-border" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-gh-fg-muted" />
              <div>
                <p className="text-sm font-semibold text-gh-fg">{token.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-gh-canvas px-1.5 py-0.5 rounded text-gh-fg-muted">
                    {token.tokenPreview}
                  </code>
                  <button className="text-gh-fg-muted hover:text-gh-fg">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1 flex-wrap">
                {token.scopes.map((scope) => (
                  <Badge key={scope} variant="muted">{scope}</Badge>
                ))}
              </div>
              <div className="text-xs text-gh-fg-muted text-right">
                <p>Created {formatDate(token.createdAt)}</p>
                <p>Expires {formatDate(token.expiresAt)}</p>
              </div>
              <button
                onClick={() => handleDelete(token.id)}
                className="text-gh-danger hover:text-gh-danger/80 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Generate new token">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gh-fg mb-1">Token name</label>
            <input
              type="text"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              placeholder="e.g. my-laptop-token"
              className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg focus:outline-none focus:border-gh-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-gh-fg mb-2">Scopes</label>
            <div className="space-y-2">
              {availableScopes.map((scope) => (
                <label key={scope} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedScopes.includes(scope)}
                    onChange={() => toggleScope(scope)}
                    className="accent-gh-btn-primary"
                  />
                  <span className="text-sm text-gh-fg">{scope}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Generate token</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
