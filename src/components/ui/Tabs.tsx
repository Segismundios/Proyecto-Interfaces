"use client";

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-gh-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? "border-gh-accent text-gh-fg"
              : "border-transparent text-gh-fg-muted hover:text-gh-fg hover:border-gh-border"
          }`}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className="px-1.5 py-0.5 text-xs bg-gh-btn-bg rounded-full">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
