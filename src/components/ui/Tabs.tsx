// Client component: Radix Tabs gestiona aria-selected, navegación por flechas
// (izquierda/derecha, Home/End) y focus management; requiere eventos de browser.
"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <RadixTabs.Root value={activeTab} onValueChange={onTabChange}>
      <RadixTabs.List
        className="flex border-b border-gh-border"
        aria-label="Navegación de secciones"
      >
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className={[
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gh-canvas focus-visible:rounded-sm",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "data-[state=active]:border-gh-accent data-[state=active]:text-gh-fg",
              "data-[state=inactive]:border-transparent data-[state=inactive]:text-gh-fg-muted",
              "data-[state=inactive]:hover:text-gh-fg data-[state=inactive]:hover:border-gh-border",
            ].join(" ")}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? "bg-gh-accent/20 text-gh-accent"
                    : "bg-gh-btn-bg text-gh-fg-muted"
                }`}
              >
                {tab.count}
              </span>
            )}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
    </RadixTabs.Root>
  );
}
