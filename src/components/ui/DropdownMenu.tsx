// Client component: Radix DropdownMenu gestiona arrow keys, Escape, focus trap
// y aria-expanded; requiere eventos de browser.
"use client";

import * as Radix from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

/* ─── Sub-componentes exportados para uso como DropdownMenu.Root, etc. ─── */

export const DropdownMenu = {
  Root: Radix.Root,
  Trigger: Radix.Trigger,
  Portal: Radix.Portal,

  /** Contenedor del panel flotante */
  Content: function DropdownContent({
    children,
    align = "start",
    className = "",
    ...props
  }: Radix.DropdownMenuContentProps & { className?: string }) {
    return (
      <Radix.Portal>
        <Radix.Content
          align={align}
          sideOffset={4}
          className={[
            "z-50 min-w-[180px] rounded-md border border-gh-border bg-gh-canvas-subtle shadow-xl py-1",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className,
          ].join(" ")}
          {...props}
        >
          {children}
        </Radix.Content>
      </Radix.Portal>
    );
  },

  /** Ítem clickeable */
  Item: function DropdownItem({
    children,
    className = "",
    onSelect,
    disabled,
    ...props
  }: Radix.DropdownMenuItemProps & { className?: string }) {
    return (
      <Radix.Item
        onSelect={onSelect}
        disabled={disabled}
        className={[
          "flex items-center gap-2 px-3 py-1.5 text-sm text-gh-fg cursor-pointer select-none",
          "focus:outline-none focus:bg-gh-btn-bg focus:text-white",
          "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </Radix.Item>
    );
  },

  /** Separador visual */
  Separator: function DropdownSeparator() {
    return <Radix.Separator className="my-1 border-t border-gh-border" />;
  },

  /** Label de sección (no clickeable) */
  Label: function DropdownLabel({
    children,
    className = "",
  }: {
    children: ReactNode;
    className?: string;
  }) {
    return (
      <Radix.Label
        className={`px-3 py-1 text-xs font-semibold text-gh-fg-muted uppercase tracking-wide ${className}`}
      >
        {children}
      </Radix.Label>
    );
  },
};
