import { cn } from "@/lib/utils";

type BadgeVariant = "verde" | "guinda" | "gris" | "pendiente" | "verificado";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  verde:
    "bg-green-500/10 text-green-400 border border-green-500/20",
  guinda:
    "bg-guinda-500/10 text-guinda-300 border border-guinda-500/20",
  gris:
    "bg-bg-elevated text-text-muted border border-border",
  pendiente:
    "bg-guinda-500/10 text-guinda-300 border border-guinda-500/20",
  verificado:
    "bg-green-500/10 text-green-400 border border-green-500/20",
};

export function Badge({ children, variant = "gris", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
        variantClasses[variant],
        className
      )}
    >
      {variant === "pendiente" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {variant === "verificado" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  );
}
