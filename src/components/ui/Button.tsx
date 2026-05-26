interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
}

const variantClasses = {
  default: "bg-gh-btn-bg border-gh-border text-gh-fg hover:bg-gh-btn-hover",
  primary: "bg-gh-btn-primary border-gh-btn-primary text-white hover:bg-gh-btn-primary-hover",
  danger: "bg-gh-danger/10 border-gh-danger/40 text-gh-danger hover:bg-gh-danger hover:text-white",
  outline: "bg-transparent border-gh-border text-gh-fg hover:bg-gh-btn-bg",
};

const sizeClasses = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

export function Button({ variant = "default", size = "md", children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 font-medium rounded-md border transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
