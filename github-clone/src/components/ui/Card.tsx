interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-gh-canvas-subtle border border-gh-border rounded-md p-4 ${className}`}>
      {children}
    </div>
  );
}
