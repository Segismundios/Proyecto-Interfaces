import { PRComment } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { collaborators, currentUser } from "@/data/users";
import { timeAgo } from "@/lib/utils";
import { MessageCircle, CheckCircle, AlertCircle } from "lucide-react";

interface PRTimelineProps {
  comments: PRComment[];
}

function getUserAvatar(username: string) {
  if (username === currentUser.username) return currentUser.avatarUrl;
  const user = collaborators.find((u) => u.username === username);
  return user?.avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=128`;
}

export function PRTimeline({ comments }: PRTimelineProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-gh-fg-muted p-4 text-center">No comments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, i) => {
        const icon =
          comment.type === "review" ? (
            <CheckCircle className="w-4 h-4 text-gh-success" />
          ) : comment.type === "system" ? (
            <AlertCircle className="w-4 h-4 text-gh-fg-muted" />
          ) : (
            <MessageCircle className="w-4 h-4 text-gh-accent" />
          );

        return (
          <div key={i} className="flex gap-3">
            <Avatar src={getUserAvatar(comment.author)} alt={comment.author} size="md" />
            <div className="flex-1 border border-gh-border rounded-md">
              <div className="flex items-center gap-2 px-4 py-2 bg-gh-canvas-subtle border-b border-gh-border rounded-t-md">
                {icon}
                <span className="text-sm font-semibold text-gh-fg">{comment.author}</span>
                <span className="text-xs text-gh-fg-muted">{comment.type === "review" ? "reviewed" : "commented"}</span>
                <span className="text-xs text-gh-fg-muted ml-auto">{timeAgo(comment.createdAt)}</span>
              </div>
              <div className="px-4 py-3 text-sm text-gh-fg">{comment.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
