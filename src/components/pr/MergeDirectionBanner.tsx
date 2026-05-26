import { ArrowRight, GitBranch } from "lucide-react";

interface MergeDirectionBannerProps {
  headBranch: string;
  baseBranch: string;
  status: "open" | "merged" | "closed";
}

export function MergeDirectionBanner({ headBranch, baseBranch, status }: MergeDirectionBannerProps) {
  const statusColors = {
    open: "border-gh-success/30 bg-gh-success/5",
    merged: "border-gh-done/30 bg-gh-done/5",
    closed: "border-gh-danger/30 bg-gh-danger/5",
  };

  const statusLabel = {
    open: "Wants to merge",
    merged: "Merged",
    closed: "Closed",
  };

  return (
    <div className={`border rounded-lg p-4 ${statusColors[status]}`}>
      <p className="text-xs text-gh-fg-muted mb-3 text-center font-medium uppercase tracking-wide">
        {statusLabel[status]} into {baseBranch} from {headBranch}
      </p>
      <div className="flex items-center justify-center gap-4">
        {/* Head branch */}
        <div className="flex items-center gap-2 bg-gh-accent/20 border border-gh-accent/40 rounded-lg px-4 py-2">
          <GitBranch className="w-4 h-4 text-gh-accent" />
          <span className="text-sm font-mono font-semibold text-gh-accent">{headBranch}</span>
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <div className="w-12 h-0.5 bg-gh-fg-muted" />
          <ArrowRight className="w-5 h-5 text-gh-fg-muted -ml-1" />
        </div>

        {/* Base branch */}
        <div className="flex items-center gap-2 bg-gh-success/20 border border-gh-success/40 rounded-lg px-4 py-2">
          <GitBranch className="w-4 h-4 text-gh-success" />
          <span className="text-sm font-mono font-semibold text-gh-success">{baseBranch}</span>
        </div>
      </div>

      {/* UX callout */}
      <div className="mt-3 text-center">
        <span className="text-[10px] text-gh-accent bg-gh-accent/10 px-2 py-0.5 rounded-full">
          UX Improvement: Clear visual merge direction
        </span>
      </div>
    </div>
  );
}
