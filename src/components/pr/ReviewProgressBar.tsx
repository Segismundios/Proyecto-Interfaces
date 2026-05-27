import { Reviewer, DiffFile } from "@/types";
import { collaborators, currentUser } from "@/data/users";
import { Check, X, Clock, MessageCircle, Info } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

interface ReviewProgressBarProps {
  reviewers: Reviewer[];
  files: DiffFile[];
  fileReviews: Record<string, string[]>;
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

export function ReviewProgressBar({ reviewers, files, fileReviews }: ReviewProgressBarProps) {
  const responded = reviewers.filter((r) => r.status !== "pending").length;
  const total = reviewers.length;
  const progressPct = total > 0 ? (responded / total) * 100 : 0;

  const reviewedCount = files.filter((f) => (fileReviews[f.filename]?.length ?? 0) > 0).length;

  return (
    <div className="border border-gh-border rounded-lg p-4">
      {/* Reviewer response progress */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gh-fg">Review Progress</h3>
        <span className="text-xs text-gh-fg-muted">
          {responded} of {total} reviewers responded
        </span>
      </div>

      <div className="w-full h-2 bg-gh-btn-bg rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gh-success rounded-full transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="space-y-3">
        {reviewers.map((reviewer) => {
          const config = statusConfig[reviewer.status];
          const Icon = config.icon;
          const reviewedByUser = files.filter((f) =>
            (fileReviews[f.filename] ?? []).includes(reviewer.username)
          ).length;
          const filePct = files.length > 0 ? (reviewedByUser / files.length) * 100 : 0;
          return (
            <div key={reviewer.username} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar src={getUserAvatar(reviewer.username)} alt={reviewer.username} size="sm" />
                  <span className="text-sm text-gh-fg">{reviewer.username}</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${config.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </div>
              </div>
              {files.length > 0 && (
                <div className="flex items-center gap-2 pl-7">
                  <div className="flex-1 h-1.5 bg-gh-btn-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gh-accent rounded-full transition-all duration-300"
                      style={{ width: `${filePct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gh-fg-muted shrink-0">
                    {reviewedByUser}/{files.length} files
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* File coverage */}
      {files.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gh-border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gh-fg">File Coverage</h4>
            <span className="text-xs text-gh-fg-muted">
              {reviewedCount} / {files.length} files
            </span>
          </div>

          {/* Coverage progress bar */}
          <div className="w-full h-2.5 bg-gh-btn-bg rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-gh-success rounded-full transition-all duration-300"
              style={{ width: files.length > 0 ? `${(reviewedCount / files.length) * 100}%` : "0%" }}
            />
          </div>

          {/* Per-file list */}
          <div className="space-y-1.5">
            {files.map((file) => {
              const reviewersForFile = fileReviews[file.filename] ?? [];
              const isReviewed = reviewersForFile.length > 0;
              return (
                <div key={file.filename} className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isReviewed ? "bg-gh-success" : "bg-gh-btn-bg border border-gh-border"
                    }`}
                  />
                  <span
                    className="text-xs font-mono text-gh-fg-muted truncate flex-1"
                    title={file.filename}
                  >
                    {file.filename.split("/").pop()}
                  </span>
                  {isReviewed && (
                    <div className="flex -space-x-1 shrink-0">
                      {reviewersForFile.slice(0, 3).map((username) => (
                        <div key={username} title={username}>
                          <Avatar src={getUserAvatar(username)} alt={username} size="sm" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reframe callout */}
      <div className="mt-4 pt-3 border-t border-gh-border flex items-start gap-2 text-xs text-gh-fg-muted">
        <Info className="w-3.5 h-3.5 text-gh-accent shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-gh-accent">Proceso visible:</span> el progreso de
          revisión está visible para todos. En GitHub clásico, cada reviewer ve sólo su propio
          estado y hay que abrir el menú &quot;Reviewers&quot; para saber dónde va el proceso.
        </p>
      </div>
    </div>
  );
}
