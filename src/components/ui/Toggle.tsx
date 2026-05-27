// Client component: Radix Switch gestiona aria-checked, focus y keyboard
// interaction (Space para toggle); requiere eventos de browser.
"use client";

import * as Switch from "@radix-ui/react-switch";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}: ToggleProps) {
  const switchId = id ?? "toggle-switch";

  return (
    <div
      className={`inline-flex items-center gap-2 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <Switch.Root
        id={switchId}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={[
          "relative w-10 h-5 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gh-canvas",
          "disabled:cursor-not-allowed",
          checked
            ? "bg-gh-btn-primary"
            : "bg-gh-btn-bg border border-gh-border",
        ].join(" ")}
      >
        <Switch.Thumb
          className={[
            "block w-4 h-4 rounded-full bg-white transition-transform",
            "data-[state=checked]:translate-x-5",
            "data-[state=unchecked]:translate-x-0.5",
          ].join(" ")}
        />
      </Switch.Root>
      {label && (
        <label
          htmlFor={switchId}
          className={`text-sm text-gh-fg select-none ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
}
