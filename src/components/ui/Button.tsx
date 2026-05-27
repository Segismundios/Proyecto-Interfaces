interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
}

const variantClasses = {
  default:
    "bg-gh-btn-bg border-gh-border text-gh-fg hover:bg-gh-btn-hover hover:border-gh-fg-muted/50 active:bg-gh-btn-hover/80",
  primary:
    "bg-gh-btn-primary border-gh-btn-primary text-white hover:bg-gh-btn-primary-hover hover:border-gh-btn-primary-hover active:bg-gh-btn-primary",
  danger:
    "bg-gh-danger/10 border-gh-danger/40 text-gh-danger hover:bg-gh-danger hover:text-white hover:border-gh-danger active:bg-gh-danger/90",
  outline:
    "bg-transparent border-gh-border text-gh-fg hover:bg-gh-btn-bg hover:border-gh-fg-muted/50 active:bg-gh-btn-hover",
};

const sizeClasses = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

export function Button({ variant = "default", size = "md", children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center gap-2 font-medium rounded-md border",
        "transition-all duration-150",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gh-canvas",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
