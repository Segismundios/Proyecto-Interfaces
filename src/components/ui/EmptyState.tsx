import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: React.ReactNode;
  size?: "sm" | "md";
}

export function EmptyState({ icon: Icon, title, description, cta, size = "md" }: EmptyStateProps) {
  const padding = size === "sm" ? "py-6 px-4" : "py-10 px-6";
  const iconBox = size === "sm" ? "w-10 h-10" : "w-12 h-12";
  const iconSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";

  return (
    <div
      className={`flex flex-col items-center text-center bg-gh-canvas-subtle border border-dashed border-gh-border rounded-md ${padding}`}
    >
      <div
        className={`${iconBox} rounded-full bg-gh-canvas border border-gh-border flex items-center justify-center mb-3`}
      >
        <Icon className={`${iconSize} text-gh-fg-muted`} aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-gh-fg">{title}</p>
      {description && (
        <p className="text-xs text-gh-fg-muted mt-1 max-w-sm">{description}</p>
      )}
      {cta && <div className="mt-3">{cta}</div>}
    </div>
  );
}
