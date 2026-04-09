import { PullRequest } from "@/types";

export const pullRequests: PullRequest[] = [
  {
    id: 1,
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    title: "feat: add improved settings page with token management",
    body: "This PR adds the new settings page with direct access to personal access tokens and SSH keys, addressing Improvement #2 from our UX research.\n\n## Changes\n- New settings layout with sidebar navigation\n- Token management page\n- SSH key management page\n- Reorganized navigation structure",
    status: "open",
    author: "javier-lopez",
    baseBranch: "main",
    headBranch: "feature/settings-redesign",
    createdAt: "2026-04-06T10:00:00Z",
    commits: [
      {
        sha: "a1b2c3d",
        message: "feat: add settings layout with sidebar",
        author: "javier-lopez",
        date: "2026-04-06T10:00:00Z",
      },
      {
        sha: "e4f5g6h",
        message: "feat: add token management page",
        author: "javier-lopez",
        date: "2026-04-06T14:00:00Z",
      },
      {
        sha: "i7j8k9l",
        message: "feat: add SSH key management page",
        author: "javier-lopez",
        date: "2026-04-07T09:00:00Z",
      },
      {
        sha: "m0n1o2p",
        message: "fix: correct sidebar active state styling",
        author: "javier-lopez",
        date: "2026-04-07T11:00:00Z",
      },
    ],
    reviewers: [
      { username: "maria-garcia", status: "approved" },
      { username: "carlos-ruiz", status: "changes_requested" },
      { username: "ana-martinez", status: "pending" },
    ],
    diffFiles: [
      {
        filename: "src/app/settings/layout.tsx",
        additions: 45,
        deletions: 0,
        hunks: [
          {
            header: "@@ -0,0 +1,45 @@",
            lines: [
              { type: "addition", content: "import { SettingsSidebar } from '@/components/settings/SettingsSidebar';", newLineNumber: 1 },
              { type: "addition", content: "", newLineNumber: 2 },
              { type: "addition", content: "export default function SettingsLayout({", newLineNumber: 3 },
              { type: "addition", content: "  children,", newLineNumber: 4 },
              { type: "addition", content: "}: {", newLineNumber: 5 },
              { type: "addition", content: "  children: React.ReactNode;", newLineNumber: 6 },
              { type: "addition", content: "}) {", newLineNumber: 7 },
              { type: "addition", content: "  return (", newLineNumber: 8 },
              { type: "addition", content: "    <div className=\"flex gap-8 max-w-6xl mx-auto\">", newLineNumber: 9 },
              { type: "addition", content: "      <SettingsSidebar />", newLineNumber: 10 },
              { type: "addition", content: "      <main className=\"flex-1\">{children}</main>", newLineNumber: 11 },
              { type: "addition", content: "    </div>", newLineNumber: 12 },
              { type: "addition", content: "  );", newLineNumber: 13 },
              { type: "addition", content: "}", newLineNumber: 14 },
            ],
          },
        ],
      },
      {
        filename: "src/app/settings/tokens/page.tsx",
        additions: 38,
        deletions: 0,
        hunks: [
          {
            header: "@@ -0,0 +1,38 @@",
            lines: [
              { type: "addition", content: "'use client';", newLineNumber: 1 },
              { type: "addition", content: "", newLineNumber: 2 },
              { type: "addition", content: "import { useState } from 'react';", newLineNumber: 3 },
              { type: "addition", content: "import { tokens as initialTokens } from '@/data/tokens';", newLineNumber: 4 },
              { type: "addition", content: "", newLineNumber: 5 },
              { type: "addition", content: "export default function TokensPage() {", newLineNumber: 6 },
              { type: "addition", content: "  const [tokens, setTokens] = useState(initialTokens);", newLineNumber: 7 },
              { type: "addition", content: "  // ... token management logic", newLineNumber: 8 },
              { type: "addition", content: "}", newLineNumber: 9 },
            ],
          },
        ],
      },
      {
        filename: "src/components/settings/SettingsSidebar.tsx",
        additions: 52,
        deletions: 0,
        hunks: [
          {
            header: "@@ -0,0 +1,52 @@",
            lines: [
              { type: "addition", content: "'use client';", newLineNumber: 1 },
              { type: "addition", content: "", newLineNumber: 2 },
              { type: "addition", content: "import Link from 'next/link';", newLineNumber: 3 },
              { type: "addition", content: "import { usePathname } from 'next/navigation';", newLineNumber: 4 },
              { type: "addition", content: "import { Key, Shield, User, Bell } from 'lucide-react';", newLineNumber: 5 },
            ],
          },
        ],
      },
      {
        filename: "src/components/layout/Navbar.tsx",
        additions: 8,
        deletions: 3,
        hunks: [
          {
            header: "@@ -15,8 +15,13 @@",
            lines: [
              { type: "context", content: "  return (", oldLineNumber: 15, newLineNumber: 15 },
              { type: "context", content: "    <nav className=\"bg-gh-canvas-subtle border-b border-gh-border\">", oldLineNumber: 16, newLineNumber: 16 },
              { type: "deletion", content: "      <Link href=\"/\">Home</Link>", oldLineNumber: 17 },
              { type: "deletion", content: "      <Link href=\"/explore\">Explore</Link>", oldLineNumber: 18 },
              { type: "deletion", content: "      <Link href=\"/profile\">Profile</Link>", oldLineNumber: 19 },
              { type: "addition", content: "      <Link href=\"/\">Home</Link>", newLineNumber: 17 },
              { type: "addition", content: "      <Link href=\"/explore\">Explore</Link>", newLineNumber: 18 },
              { type: "addition", content: "      <Link href=\"/settings\">Settings</Link>", newLineNumber: 19 },
              { type: "addition", content: "      {/* Added direct settings link */}", newLineNumber: 20 },
              { type: "context", content: "    </nav>", oldLineNumber: 20, newLineNumber: 21 },
            ],
          },
        ],
      },
    ],
    comments: [
      {
        author: "maria-garcia",
        body: "The sidebar navigation looks great! Much easier to find tokens now. Approved.",
        createdAt: "2026-04-07T10:00:00Z",
        type: "review",
      },
      {
        author: "carlos-ruiz",
        body: "Could we add a confirmation dialog before deleting a token? I think that would prevent accidental deletions.",
        createdAt: "2026-04-07T12:00:00Z",
        type: "review",
      },
      {
        author: "javier-lopez",
        body: "Good point @carlos-ruiz, I'll add a confirmation modal in the next commit.",
        createdAt: "2026-04-07T13:00:00Z",
        type: "comment",
      },
    ],
  },
  {
    id: 2,
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    title: "feat: add home dashboard with favorite repos",
    body: "Implements the new home dashboard (Improvement #1) with pinned repos, most used repos, and recent PRs.",
    status: "merged",
    author: "maria-garcia",
    baseBranch: "main",
    headBranch: "feature/home-dashboard",
    createdAt: "2026-04-03T08:00:00Z",
    commits: [
      {
        sha: "q3r4s5t",
        message: "feat: add favorite repos component",
        author: "maria-garcia",
        date: "2026-04-03T08:00:00Z",
      },
      {
        sha: "u6v7w8x",
        message: "feat: add recent activity feed",
        author: "maria-garcia",
        date: "2026-04-03T14:00:00Z",
      },
    ],
    reviewers: [
      { username: "javier-lopez", status: "approved" },
      { username: "carlos-ruiz", status: "approved" },
    ],
    diffFiles: [],
    comments: [
      {
        author: "javier-lopez",
        body: "Looks perfect! The favorite repos section is exactly what we discussed.",
        createdAt: "2026-04-04T09:00:00Z",
        type: "review",
      },
    ],
  },
  {
    id: 3,
    repoOwner: "javier-lopez",
    repoName: "algoritmos-avanzados",
    title: "fix: correct binary search edge case",
    body: "Fixes an off-by-one error in the binary search implementation that caused incorrect results for arrays of size 1.",
    status: "open",
    author: "carlos-ruiz",
    baseBranch: "main",
    headBranch: "fix/binary-search",
    createdAt: "2026-04-07T16:00:00Z",
    commits: [
      {
        sha: "y9z0a1b",
        message: "fix: handle single-element array in binary search",
        author: "carlos-ruiz",
        date: "2026-04-07T16:00:00Z",
      },
    ],
    reviewers: [
      { username: "javier-lopez", status: "pending" },
    ],
    diffFiles: [],
    comments: [],
  },
];
