# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm start        # Run production build
npm run lint     # ESLint
```

No test suite is configured.

## Project Purpose

This is a **GitHub UI clone with UX improvements**, built as a frontend-only prototype for a UX/UI course (IIC2182). It implements 5 specific UX improvements over GitHub's current interface:

1. **Home Dashboard** — richer landing page with repos, activity, and quick actions
2. **Settings reorganization** — PAT tokens promoted to top-level settings
3. **Visibility toggle** — repo visibility toggle in the repo header (not in Danger Zone)
4. **Folder download** — download button on folders in the file browser
5. **PR visualization** — merge direction banner + review progress bar

## Architecture

**Stack:** Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS, Lucide icons.

**No backend.** All data is hardcoded mock data in `src/data/`.

### Routing (`src/app/`)

| Route | Page |
|---|---|
| `/` | Home dashboard |
| `/[user]/[repo]` | Repository view |
| `/[user]/[repo]/pull/[id]` | Pull request view |
| `/settings` | Settings hub |
| `/settings/tokens` | Personal access tokens |
| `/settings/ssh-keys` | SSH keys |

### Components (`src/components/`)

Organized by domain:
- `ui/` — primitives: Button, Badge, Avatar, Card, Modal, Tabs, Toggle, EmptyState, SecurityGate
- `layout/` — Navbar
- `home/` — FavoriteRepos, MostUsedRepos, RecentActivity, QuickActions
- `repo/` — RepoHeader, FileBrowser, ReadmePreview
- `pr/` — MergeDirectionBanner, ReviewProgressBar, DiffViewer, PRTimeline, CommitList
- `settings/` — SettingsSidebar

### Contexts (`src/context/`)

Client-side global state, all persisted in `localStorage`:
- `FavoritesContext` — set of `"owner/name"` strings marked as favorites
- `VisibilityContext` — per-repo visibility overrides (public/private)
- `SecurityContext` — verification gate for sensitive routes (tokens, SSH keys). Verification persists for 30 minutes via a timestamp in `localStorage` (key: `gh-security-verified-until`). Direct URL access to `/settings/tokens` or `/settings/ssh-keys` triggers `<SecurityGate>` until the user confirms a password.

### Types (`src/types/index.ts`)

All TypeScript interfaces are centralized here: `User`, `Repository`, `FileEntry`, `PullRequest`, `Commit`, `Reviewer`, `DiffFile`, `DiffLine`, `PRComment`, `PersonalAccessToken`, `SSHKey`.

### Styling

Tailwind CSS with a custom GitHub dark theme. Color palette uses `gh-*` prefixed classes defined in `tailwind.config.ts`.

Path alias `@/*` maps to `./src/*`.
