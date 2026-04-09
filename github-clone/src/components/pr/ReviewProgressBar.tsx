import { Reviewer } from "@/types";
import { collaborators } from "@/data/users";
import { currentUser } from "@/data/users";
import { Check, X, Clock, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

interface ReviewProgressBarProps {
  reviewers: Reviewer[];
}

const statusConfig = {
  approved: { icon: Check, color: "text-gh-success", bg: "bg-gh-success", label: "Approved" },
  changes_requested: { icon: X, color: "text-gh-danger", bg: "bg-gh-danger", label: "Changes requested" },
  pending: { icon: Clock, color: "text-gh-warning", bg: "bg-gh-warning", label: "Pending" },
  commented: { icon: MessageCircle, color: "text-gh-accent", bg: "bg-gh-accent", label: "Commented" },
};

function getUserAvatar(username: string) {
  if (username === currentUser.username) return currentUser.avatarUrl;
  const user = collaborators.find((u) => u.username === username);
  return user?.avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=128`;
}

export function ReviewProgressBar({ reviewers }: ReviewProgressBarProps) {
  const responded = reviewers.filter((r) => r.status !== "pending").length;
  const total = reviewers.length;
  const progressPct = total > 0 ? (responded / total) * 100 : 0;

  return (
    <div className="border border-gh-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gh-fg">Review Progress</h3>
        <span className="text-xs text-gh-fg-muted">
          {responded} of {total} reviewers responded
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gh-btn-bg rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gh-success rounded-full transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Reviewer list */}
      <div className="space-y-2">
        {reviewers.map((reviewer) => {
          const config = statusConfig[reviewer.status];
          const Icon = config.icon;
          return (
            <div key={reviewer.username} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={getUserAvatar(reviewer.username)} alt={reviewer.username} size="sm" />
                <span className="text-sm text-gh-fg">{reviewer.username}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs ${config.color}`}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* UX callout */}
      <div className="mt-3 pt-3 border-t border-gh-border">
        <span className="text-[10px] text-gh-accent bg-gh-accent/10 px-2 py-0.5 rounded-full">
          UX Improvement: Review progress visible to all reviewers
        </span>
      </div>
    </div>
  );
}
