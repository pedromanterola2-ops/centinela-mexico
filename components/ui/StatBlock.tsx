import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

interface StatBlockProps {
  label: string;
  value: number | string | null;
  sublabel?: string;
  fuente?: string;
  pendiente?: boolean;
  className?: string;
  accent?: "verde" | "guinda" | "none";
}

export function StatBlock({
  label,
  value,
  sublabel,
  fuente,
  pendiente = false,
  className,
  accent = "verde",
}: StatBlockProps) {
  const displayValue =
    value === null
      ? "—"
      : typeof value === "number"
      ? formatNumber(value)
      : value;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-bg-surface p-4",
        accent === "verde" && "border-l-2 border-l-green-500",
        accent === "guinda" && "border-l-2 border-l-guinda-500",
        className
      )}
    >
      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-semibold text-text font-mono">
        {pendiente ? (
          <span className="text-text-muted text-base">Pendiente</span>
        ) : (
          displayValue
        )}
      </p>
      {sublabel && (
        <p className="text-xs text-text-muted mt-0.5">{sublabel}</p>
      )}
      {fuente && (
        <p className="text-[10px] text-text-muted/60 mt-2 leading-snug">
          Fuente: {fuente}
        </p>
      )}
    </div>
  );
}
