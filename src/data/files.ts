import { FileEntry } from "@/types";

export const repoFiles: Record<string, FileEntry[]> = {
  "proyecto-interfaces": [
    {
      name: "src",
      type: "folder",
      lastCommitMessage: "feat: add settings page layout",
      lastCommitDate: "2026-04-08T09:30:00Z",
      children: [
        {
          name: "components",
          type: "folder",
          lastCommitMessage: "feat: add visibility toggle component",
          lastCommitDate: "2026-04-07T14:00:00Z",
          children: [
            { name: "Navbar.tsx", type: "file", lastCommitMessage: "feat: add navigation bar", lastCommitDate: "2026-04-05T10:00:00Z" },
            { name: "Button.tsx", type: "file", lastCommitMessage: "feat: add button component", lastCommitDate: "2026-04-04T12:00:00Z" },
            { name: "Card.tsx", type: "file", lastCommitMessage: "feat: add card component", lastCommitDate: "2026-04-04T12:00:00Z" },
            { name: "VisibilityToggle.tsx", type: "file", lastCommitMessage: "feat: add visibility toggle", lastCommitDate: "2026-04-07T14:00:00Z" },
          ],
        },
        {
          name: "app",
          type: "folder",
          lastCommitMessage: "feat: add settings page layout",
          lastCommitDate: "2026-04-08T09:30:00Z",
          children: [
            { name: "page.tsx", type: "file", lastCommitMessage: "feat: add home dashboard", lastCommitDate: "2026-04-06T16:00:00Z" },
            { name: "layout.tsx", type: "file", lastCommitMessage: "feat: add root layout", lastCommitDate: "2026-04-03T09:00:00Z" },
            { name: "globals.css", type: "file", lastCommitMessage: "style: github dark theme", lastCommitDate: "2026-04-03T09:00:00Z" },
          ],
        },
        {
          name: "data",
          type: "folder",
          lastCommitMessage: "feat: add mock data for repos",
          lastCommitDate: "2026-04-06T11:00:00Z",
          children: [
            { name: "users.ts", type: "file", lastCommitMessage: "feat: add mock users", lastCommitDate: "2026-04-05T10:00:00Z" },
            { name: "repos.ts", type: "file", lastCommitMessage: "feat: add mock repos", lastCommitDate: "2026-04-06T11:00:00Z" },
          ],
        },
      ],
    },
    {
      name: "public",
      type: "folder",
      lastCommitMessage: "init: project setup",
      lastCommitDate: "2026-04-03T09:00:00Z",
      children: [
        { name: "favicon.ico", type: "file", lastCommitMessage: "init: project setup", lastCommitDate: "2026-04-03T09:00:00Z" },
      ],
    },
    { name: "README.md", type: "file", lastCommitMessage: "docs: update README with project info", lastCommitDate: "2026-04-07T18:00:00Z" },
    { name: "package.json", type: "file", lastCommitMessage: "feat: add lucide-react dependency", lastCommitDate: "2026-04-04T09:00:00Z" },
    { name: "tsconfig.json", type: "file", lastCommitMessage: "init: project setup", lastCommitDate: "2026-04-03T09:00:00Z" },
    { name: "tailwind.config.ts", type: "file", lastCommitMessage: "style: add github color palette", lastCommitDate: "2026-04-03T10:00:00Z" },
    { name: ".gitignore", type: "file", lastCommitMessage: "init: project setup", lastCommitDate: "2026-04-03T09:00:00Z" },
  ],
};
