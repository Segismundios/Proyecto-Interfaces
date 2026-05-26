import { Commit } from "@/types";
import { GitCommit, Copy } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { collaborators, currentUser } from "@/data/users";
import { timeAgo } from "@/lib/utils";

interface CommitListProps {
  commits: Commit[];
}

function getUserAvatar(username: string) {
  if (username === currentUser.username) return currentUser.avatarUrl;
  const user = collaborators.find((u) => u.username === username);
  return user?.avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=128`;
}

export function CommitList({ commits }: CommitListProps) {
  return (
    <div className="border border-gh-border rounded-md overflow-hidden">
      <div className="px-4 py-2 bg-gh-canvas-subtle border-b border-gh-border text-sm text-gh-fg">
        <strong>{commits.length}</strong> commits
      </div>
      {commits.map((commit, i) => (
        <div
          key={commit.sha}
          className={`flex items-center justify-between px-4 py-3 ${
            i < commits.length - 1 ? "border-b border-gh-border" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <GitCommit className="w-4 h-4 text-gh-fg-muted" />
            <Avatar src={getUserAvatar(commit.author)} alt={commit.author} size="sm" />
            <div>
              <p className="text-sm font-medium text-gh-fg">{commit.message}</p>
              <p className="text-xs text-gh-fg-muted">
                {commit.author} committed {timeAgo(commit.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono bg-gh-canvas px-2 py-1 rounded border border-gh-border text-gh-accent">
              {commit.sha}
            </code>
            <button className="text-gh-fg-muted hover:text-gh-fg">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
