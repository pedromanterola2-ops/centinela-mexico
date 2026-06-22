/**
 * CompareTable — tabla comparativa lado a lado entre dos entidades o fuerzas.
 *
 * Cada fila puede marcar cuál columna tiene el valor "mayor" (numérico) para
 * resaltarlo visualmente. El resaltado es neutral: indica magnitud, no juicio
 * de valor. Los valores nulos se muestran como "Pendiente".
 */

import { cn, formatNumber } from "@/lib/utils";

export interface CompareRow {
  campo: string;
  valorA: string | number | null;
  valorB: string | number | null;
  /** Columna con el valor numérico mayor; resalta esa celda. */
  mayor?: "A" | "B" | null;
}

interface CompareTableProps {
  labelA?: string;
  labelB?: string;
  rows?: CompareRow[];
  className?: string;
}

function renderValor(valor: string | number | null) {
  if (valor === null) {
    return <span className="text-text-muted text-xs">Pendiente</span>;
  }
  if (typeof valor === "number") {
    return <span className="font-mono">{formatNumber(valor)}</span>;
  }
  return valor;
}

export function CompareTable({
  labelA = "Entidad A",
  labelB = "Entidad B",
  rows = [],
  className = "",
}: CompareTableProps) {
  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-border bg-bg-surface p-8 text-text-muted",
          className
        )}
      >
        <p className="text-sm">Selecciona dos elementos para comparar.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-border bg-bg-surface",
        className
      )}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-elevated/50">
            <th className="py-3 px-4 text-left text-xs text-text-muted uppercase tracking-wider font-medium w-1/3">
              Campo
            </th>
            <th className="py-3 px-4 text-center font-semibold text-green-400">
              {labelA}
            </th>
            <th className="py-3 px-4 text-center font-semibold text-guinda-300">
              {labelB}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="py-2.5 px-4 text-text-muted text-xs uppercase tracking-wide">
                {row.campo}
              </td>
              <td
                className={cn(
                  "py-2.5 px-4 text-center text-text",
                  row.mayor === "A" &&
                    "bg-green-500/10 text-green-300 font-semibold"
                )}
              >
                {renderValor(row.valorA)}
                {row.mayor === "A" && (
                  <span className="ml-1 text-[10px] text-green-400/70">▲</span>
                )}
              </td>
              <td
                className={cn(
                  "py-2.5 px-4 text-center text-text",
                  row.mayor === "B" &&
                    "bg-guinda-500/10 text-guinda-200 font-semibold"
                )}
              >
                {renderValor(row.valorB)}
                {row.mayor === "B" && (
                  <span className="ml-1 text-[10px] text-guinda-300/70">▲</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
