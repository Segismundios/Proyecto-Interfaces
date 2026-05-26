import { BookOpen } from "lucide-react";

interface ReadmePreviewProps {
  repoName: string;
}

export function ReadmePreview({ repoName }: ReadmePreviewProps) {
  return (
    <div className="border border-gh-border rounded-md mt-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-gh-canvas-subtle border-b border-gh-border">
        <BookOpen className="w-4 h-4 text-gh-fg-muted" />
        <span className="text-sm font-semibold text-gh-fg">README.md</span>
      </div>
      <div className="px-6 py-4 prose prose-invert max-w-none">
        <h1 className="text-2xl font-bold text-gh-fg border-b border-gh-border pb-2 mb-4">
          {repoName}
        </h1>
        <p className="text-sm text-gh-fg mb-4">
          A web app built with Next.js and Tailwind CSS that demonstrates UX improvements
          identified through user research with computer science students and junior developers.
        </p>

        <h2 className="text-lg font-semibold text-gh-fg border-b border-gh-border pb-1 mb-3 mt-6">
          UX Improvements
        </h2>
        <ol className="list-decimal list-inside text-sm text-gh-fg space-y-2 mb-4">
          <li><strong>Home Dashboard</strong> - Quick access to favorite repos, most used repos, and recent PRs</li>
          <li><strong>Settings Reorganization</strong> - Tokens and SSH keys directly accessible from settings</li>
          <li><strong>Visibility Toggle</strong> - Change repo visibility directly from the repo header</li>
          <li><strong>Folder Download</strong> - Download specific folders without cloning the entire repo</li>
          <li><strong>PR Review Visualization</strong> - Clear merge direction and review progress</li>
        </ol>

        <h2 className="text-lg font-semibold text-gh-fg border-b border-gh-border pb-1 mb-3 mt-6">
          Getting Started
        </h2>
        <div className="bg-gh-canvas border border-gh-border rounded-md p-3 font-mono text-sm text-gh-fg mb-4">
          <p>npm install</p>
          <p>npm run dev</p>
        </div>

        <h2 className="text-lg font-semibold text-gh-fg border-b border-gh-border pb-1 mb-3 mt-6">
          Tech Stack
        </h2>
        <ul className="list-disc list-inside text-sm text-gh-fg space-y-1">
          <li>Next.js 14 (App Router)</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Lucide React Icons</li>
        </ul>
      </div>
    </div>
  );
}
