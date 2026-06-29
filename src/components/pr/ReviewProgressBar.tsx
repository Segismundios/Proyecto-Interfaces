import { Reviewer, DiffFile } from "@/types";
import { collaborators, currentUser } from "@/data/users";
import { Check, X, Clock, Info } from "lucide-react";
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
  commented: { icon: Info, color: "text-gh-accent", bg: "bg-gh-accent", label: "Commented" },
};

// HALLAZGO E3 (Felipe): la barra estaba SIEMPRE verde. Debe reflejar el estado
// agregado de la revisión: rojo si alguien pidió cambios, verde sólo si todos
// aprobaron, amarillo mientras falte alguien. Principio: visibilidad del estado
// del sistema + mapeo color→significado.
type AggregateState = "changes_requested" | "approved" | "pending";

function getAggregateState(reviewers: Reviewer[]): AggregateState {
  if (reviewers.some((r) => r.status === "changes_requested")) return "changes_requested";
  if (reviewers.length > 0 && reviewers.every((r) => r.status === "approved")) return "approved";
  return "pending";
}

const aggregateConfig: Record<
  AggregateState,
  { bar: string; pillBg: string; pillText: string; pillBorder: string; label: string; icon: typeof Check }
> = {
  changes_requested: {
    bar: "bg-gh-danger",
    pillBg: "bg-gh-danger/15",
    pillText: "text-gh-danger",
    pillBorder: "border-gh-danger/40",
    label: "Changes requested",
    icon: X,
  },
  approved: {
    bar: "bg-gh-success",
    pillBg: "bg-gh-success/15",
    pillText: "text-gh-success",
    pillBorder: "border-gh-success/40",
    label: "Approved by all",
    icon: Check,
  },
  pending: {
    bar: "bg-gh-warning",
    pillBg: "bg-gh-warning/15",
    pillText: "text-gh-warning",
    pillBorder: "border-gh-warning/40",
    label: "Review pending",
    icon: Clock,
  },
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

  const aggregate = getAggregateState(reviewers);
  const agg = aggregateConfig[aggregate];
  const AggIcon = agg.icon;

  const reviewedCount = files.filter((f) => (fileReviews[f.filename]?.length ?? 0) > 0).length;

  return (
    <div className="border border-gh-border rounded-lg p-4">
      {/* Reviewer response progress */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <h3 className="text-sm font-semibold text-gh-fg">Review Progress</h3>
        {/* Pill de estado agregado (H1) */}
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${agg.pillBg} ${agg.pillText} ${agg.pillBorder}`}
          role="status"
          aria-label={`Estado de la revisión: ${agg.label}`}
        >
          <AggIcon className="w-3 h-3" />
          {agg.label}
        </span>
      </div>

      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gh-fg-muted">
          {responded} of {total} reviewers responded
        </span>
      </div>

      <div className="w-full h-2 bg-gh-btn-bg rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full ${agg.bar} rounded-full transition-all`}
          style={{ width: `${aggregate === "approved" ? 100 : progressPct}%` }}
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
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-gh-fg">File Coverage</h4>
            <span className="text-xs text-gh-fg-muted">
              {reviewedCount} / {files.length} files
            </span>
          </div>

          {/* Leyenda (H2 — Felipe no entendía qué significaban los puntos) */}
          <div className="flex items-center gap-3 mb-2 text-[10px] text-gh-fg-muted">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gh-success" /> revisado
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gh-btn-bg border border-gh-border" /> sin
              revisar
            </span>
            <span className="ml-auto italic">avatares = quién revisó</span>
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
              const extra = reviewersForFile.length - 3;
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
                    <div className="flex items-center -space-x-1 shrink-0">
                      {reviewersForFile.slice(0, 3).map((username) => (
                        <div key={username} title={username}>
                          <Avatar src={getUserAvatar(username)} alt={username} size="sm" />
                        </div>
                      ))}
                      {/* Overflow +N (H3 — Salinas: evitar amontonamiento) */}
                      {extra > 0 && (
                        <span
                          className="w-5 h-5 rounded-full bg-gh-btn-bg border border-gh-border ring-2 ring-gh-canvas flex items-center justify-center text-[9px] font-semibold text-gh-fg-muted"
                          title={reviewersForFile.slice(3).join(", ")}
                        >
                          +{extra}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
