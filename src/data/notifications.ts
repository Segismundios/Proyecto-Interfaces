import { AppNotification } from "@/types";

// Notificaciones mock del usuario javier-lopez.
// Forma consistente con los tipos: pr, issue, mention, ci.
export const notificationsData: AppNotification[] = [
  {
    id: "notif-1",
    type: "pr",
    title: "carlos-ruiz requested changes on PR #1",
    body: "Changes requested in 'feat: add improved settings page with token management'",
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    href: "/javier-lopez/proyecto-interfaces/pull/1",
    read: false,
    createdAt: "2026-04-07T16:00:00Z",
  },
  {
    id: "notif-2",
    type: "issue",
    title: "carlos-ruiz opened issue #2: El modal de New Repository no limpia el formulario",
    body: "Bug reportado en el modal de Quick Actions",
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    href: "/javier-lopez/proyecto-interfaces/issues/2",
    read: false,
    createdAt: "2026-04-12T14:00:00Z",
  },
  {
    id: "notif-3",
    type: "mention",
    title: "maria-garcia mentioned you in PR #1",
    body: "@javier-lopez LGTM on the settings layout, but please check the token preview truncation on mobile.",
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    href: "/javier-lopez/proyecto-interfaces/pull/1",
    read: true,
    createdAt: "2026-04-06T18:00:00Z",
  },
  {
    id: "notif-4",
    type: "ci",
    title: "CI failed on feature/settings-redesign",
    body: "Build failed: TypeScript error in src/app/settings/tokens/page.tsx",
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    href: "/javier-lopez/proyecto-interfaces",
    read: true,
    createdAt: "2026-04-06T14:05:00Z",
  },
];
