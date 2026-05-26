import { PersonalAccessToken } from "@/types";

export const tokens: PersonalAccessToken[] = [
  {
    id: "1",
    name: "laptop-dev-token",
    scopes: ["repo", "read:org", "workflow"],
    createdAt: "2026-01-15T10:00:00Z",
    lastUsed: "2026-04-08T08:30:00Z",
    expiresAt: "2026-07-15T10:00:00Z",
    tokenPreview: "ghp_****...x3Kf",
  },
  {
    id: "2",
    name: "ci-deploy-token",
    scopes: ["repo", "write:packages"],
    createdAt: "2026-03-01T14:00:00Z",
    lastUsed: "2026-04-07T22:00:00Z",
    expiresAt: "2026-09-01T14:00:00Z",
    tokenPreview: "ghp_****...m9Rp",
  },
  {
    id: "3",
    name: "vscode-extension",
    scopes: ["repo", "gist"],
    createdAt: "2025-12-10T09:00:00Z",
    lastUsed: "2026-04-06T15:00:00Z",
    expiresAt: "2026-06-10T09:00:00Z",
    tokenPreview: "ghp_****...aB2n",
  },
];
