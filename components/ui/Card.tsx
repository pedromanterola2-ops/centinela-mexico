import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}

export function Card({ children, className, accent = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-bg-surface transition-colors",
        accent && "border-l-2 border-l-green-500",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("px-4 py-3 border-b border-border", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardHeaderProps) {
  return <div className={cn("px-4 py-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("px-4 py-3 border-t border-border", className)}>
      {children}
    </div>
  );
}
