"use client";

import { useRouter } from "next/navigation";

export interface CompareOption {
  slug: string;
  nombre: string;
}

interface CompareSelectorProps {
  tipo: "estados" | "fuerzas";
  estados: CompareOption[];
  fuerzas: CompareOption[];
  a?: string;
  b?: string;
}

export function CompareSelector({
  tipo,
  estados,
  fuerzas,
  a,
  b,
}: CompareSelectorProps) {
  const router = useRouter();
  const opciones = tipo === "estados" ? estados : fuerzas;

  function navegar(nextTipo: string, nextA?: string, nextB?: string) {
    const params = new URLSearchParams();
    params.set("tipo", nextTipo);
    if (nextA) params.set("a", nextA);
    if (nextB) params.set("b", nextB);
    router.push(`/comparador?${params.toString()}`);
  }

  function cambiarTipo(nextTipo: "estados" | "fuerzas") {
    if (nextTipo === tipo) return;
    navegar(nextTipo); // reinicia selección al cambiar de tipo
  }

  const selectClass =
    "w-full appearance-none rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-sm text-text focus:border-green-500/50 focus:outline-none focus:ring-1 focus:ring-green-500/30 transition-colors";

  return (
    <div className="space-y-5">
      {/* Toggle de tipo */}
      <div className="inline-flex rounded-lg border border-border bg-bg-surface p-1">
        <button
          type="button"
          onClick={() => cambiarTipo("estados")}
          className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
            tipo === "estados"
              ? "bg-green-500/15 text-green-400"
              : "text-text-muted hover:text-text"
          }`}
        >
          Estados
        </button>
        <button
          type="button"
          onClick={() => cambiarTipo("fuerzas")}
          className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
            tipo === "fuerzas"
              ? "bg-green-500/15 text-green-400"
              : "text-text-muted hover:text-text"
          }`}
        >
          Fuerzas armadas
        </button>
      </div>

      {/* Dos selectores */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold text-green-400 uppercase tracking-widest">
            Columna A
          </label>
          <select
            value={a ?? ""}
            onChange={(e) => navegar(tipo, e.target.value || undefined, b)}
            className={selectClass}
            aria-label="Seleccionar primer elemento a comparar"
          >
            <option value="">Selecciona…</option>
            {opciones.map((o) => (
              <option key={o.slug} value={o.slug} disabled={o.slug === b}>
                {o.nombre}
              </option>
            ))}
          </select>
        </div>

        <span className="hidden sm:block text-text-muted/50 text-xs font-mono pt-5">
          vs
        </span>

        <div>
          <label className="mb-1.5 block text-[10px] font-semibold text-guinda-300 uppercase tracking-widest">
            Columna B
          </label>
          <select
            value={b ?? ""}
            onChange={(e) => navegar(tipo, a, e.target.value || undefined)}
            className={selectClass}
            aria-label="Seleccionar segundo elemento a comparar"
          >
            <option value="">Selecciona…</option>
            {opciones.map((o) => (
              <option key={o.slug} value={o.slug} disabled={o.slug === a}>
                {o.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
