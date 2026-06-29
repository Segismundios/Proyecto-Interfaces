import { PRComment, Reviewer } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { collaborators, currentUser } from "@/data/users";
import { timeAgo } from "@/lib/utils";
import { MessageCircle, CheckCircle, AlertCircle } from "lucide-react";

interface PRTimelineProps {
  comments: PRComment[];
  /** Autor de la PR — para etiquetar su comentario como "Author". */
  prAuthor: string;
  /** Revisores de la PR — para etiquetar sus comentarios como "Reviewer". */
  reviewers: Reviewer[];
}

function getUserAvatar(username: string) {
  if (username === currentUser.username) return currentUser.avatarUrl;
  const user = collaborators.find((u) => u.username === username);
  return user?.avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=128`;
}

// HALLAZGO E3 (Salinas): pidió una etiqueta de rol (autor/reviewer) en los
// comentarios de la conversación para identificar de un vistazo quién habla.
// Principio: identidad/jerarquía de la información.
function RoleBadge({ role }: { role: "author" | "reviewer" }) {
  const cfg =
    role === "author"
      ? { label: "Author", cls: "bg-gh-done/15 text-gh-done border-gh-done/40" }
      : { label: "Reviewer", cls: "bg-gh-accent/15 text-gh-accent border-gh-accent/40" };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export function PRTimeline({ comments, prAuthor, reviewers }: PRTimelineProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-gh-fg-muted p-4 text-center">No comments yet.</p>;
  }

  const reviewerSet = new Set(reviewers.map((r) => r.username));

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const icon =
          comment.type === "review" ? (
            <CheckCircle className="w-4 h-4 text-gh-success" />
          ) : comment.type === "system" ? (
            <AlertCircle className="w-4 h-4 text-gh-fg-muted" />
          ) : (
            <MessageCircle className="w-4 h-4 text-gh-accent" />
          );

        const role: "author" | "reviewer" | null =
          comment.author === prAuthor
            ? "author"
            : reviewerSet.has(comment.author)
            ? "reviewer"
            : null;

        return (
          <div key={`${comment.author}-${comment.createdAt}`} className="flex gap-3">
            <Avatar src={getUserAvatar(comment.author)} alt={comment.author} size="md" />
            <div className="flex-1 border border-gh-border rounded-md">
              <div className="flex items-center gap-2 px-4 py-2 bg-gh-canvas-subtle border-b border-gh-border rounded-t-md">
                {icon}
                <span className="text-sm font-semibold text-gh-fg">{comment.author}</span>
                {role && <RoleBadge role={role} />}
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
