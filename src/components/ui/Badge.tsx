interface BadgeProps {
  variant: "success" | "danger" | "warning" | "accent" | "muted" | "done";
  children: React.ReactNode;
}

const variantClasses: Record<BadgeProps["variant"], string> = {
  success: "bg-gh-success/20 text-gh-success border-gh-success/40",
  danger: "bg-gh-danger/20 text-gh-danger border-gh-danger/40",
  warning: "bg-gh-warning/20 text-gh-warning border-gh-warning/40",
  accent: "bg-gh-accent/20 text-gh-accent border-gh-accent/40",
  muted: "bg-gh-btn-bg text-gh-fg-muted border-gh-border",
  done: "bg-gh-done/20 text-gh-done border-gh-done/40",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
