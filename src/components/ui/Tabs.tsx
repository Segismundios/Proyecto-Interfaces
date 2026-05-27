"use client";

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div role="tablist" className="flex border-b border-gh-border">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            className={[
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gh-canvas focus-visible:rounded-sm",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              isActive
                ? "border-gh-accent text-gh-fg"
                : "border-transparent text-gh-fg-muted hover:text-gh-fg hover:border-gh-border",
            ].join(" ")}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${isActive ? "bg-gh-accent/20 text-gh-accent" : "bg-gh-btn-bg text-gh-fg-muted"}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
