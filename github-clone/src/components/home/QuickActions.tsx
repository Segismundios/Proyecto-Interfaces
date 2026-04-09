import { Plus, GitPullRequest, BookOpen, Settings } from "lucide-react";
import Link from "next/link";

const actions = [
  { icon: Plus, label: "New Repository", href: "#", color: "text-gh-success" },
  { icon: GitPullRequest, label: "New Pull Request", href: "#", color: "text-gh-done" },
  { icon: BookOpen, label: "Explore Repos", href: "#", color: "text-gh-accent" },
  { icon: Settings, label: "Settings", href: "/settings", color: "text-gh-fg-muted" },
];

export function QuickActions() {
  return (
    <div>
      <h2 className="text-base font-semibold text-gh-fg mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-2 p-4 bg-gh-canvas-subtle border border-gh-border rounded-md hover:border-gh-accent/50 transition-colors"
          >
            <action.icon className={`w-6 h-6 ${action.color}`} />
            <span className="text-xs text-gh-fg-muted">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
