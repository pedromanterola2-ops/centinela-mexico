import type { Metadata } from "next";
import Link from "next/link";
import { globalSearch } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Búsqueda",
  description:
    "Busca fuerzas armadas, estados, equipamiento y términos del glosario en Centinela México.",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

const TIPO_CONFIG = {
  fuerza: {
    label: "Fuerza armada",
    href: (slug?: string) => `/fuerzas-armadas/${slug}`,
    color: "text-green-400 border-green-500/30 bg-green-500/10",
  },
  estado: {
    label: "Estado",
    href: (slug?: string) => `/estados/${slug}`,
    color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  },
  equipamiento: {
    label: "Equipamiento",
    href: (slug?: string) => `/equipamiento/${slug}`,
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  glosario: {
    label: "Glosario",
    href: () => `/glosario`,
    color: "text-text-muted border-border bg-bg-elevated",
  },
} as const;

export default async function BusquedaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const resultados = query.length >= 2 ? await globalSearch(query) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Búsqueda global
        </p>
        <h1 className="text-3xl font-bold text-text mb-6">
          {query ? `Resultados para "${query}"` : "Buscar en Centinela México"}
        </h1>

        {/* Formulario de búsqueda */}
        <form method="GET" action="/busqueda" className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Busca fuerzas, estados, equipamiento…"
            autoFocus
            className="flex-1 rounded-md border border-border bg-bg-surface px-4 py-2.5 text-sm text-text placeholder-text-muted/50 outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-colors"
          />
          <button
            type="submit"
            className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-400 hover:bg-green-500/20 transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Sin query */}
      {!query && (
        <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-10 text-center">
          <p className="text-sm text-text-muted">
            Escribe al menos 2 caracteres para buscar.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["SEDENA", "Jalisco", "FX-05", "Guardia Nacional", "DN-III-E"].map(
              (ejemplo) => (
                <Link
                  key={ejemplo}
                  href={`/busqueda?q=${encodeURIComponent(ejemplo)}`}
                  className="rounded-full border border-border bg-bg-surface px-3 py-1 text-xs text-text-muted hover:text-text hover:border-green-500/30 transition-colors"
                >
                  {ejemplo}
                </Link>
              )
            )}
          </div>
        </div>
      )}

      {/* Query muy corto */}
      {query && query.length < 2 && (
        <p className="text-sm text-text-muted">
          Escribe al menos 2 caracteres para buscar.
        </p>
      )}

      {/* Sin resultados */}
      {query.length >= 2 && resultados.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-10 text-center">
          <p className="text-sm text-text-muted">
            Sin resultados para{" "}
            <span className="font-semibold text-text">&ldquo;{query}&rdquo;</span>.
          </p>
          <p className="mt-1 text-xs text-text-muted/60">
            Prueba con otro término, siglas o nombre completo.
          </p>
        </div>
      )}

      {/* Resultados */}
      {resultados.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted mb-4">
            {resultados.length} resultado{resultados.length !== 1 ? "s" : ""}
          </p>
          {resultados.map((r, i) => {
            const cfg = TIPO_CONFIG[r.tipo];
            const href = cfg.href(r.slug);
            return (
              <Link
                key={`${r.tipo}-${r.id}-${i}`}
                href={href}
                className="group flex items-center gap-4 rounded-lg border border-border bg-bg-surface px-4 py-3.5 transition-all hover:border-green-500/30 hover:bg-bg-elevated"
              >
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.color}`}
                >
                  {cfg.label}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text group-hover:text-green-400 transition-colors truncate">
                    {r.label}
                  </p>
                  {r.sublabel && (
                    <p className="text-xs text-text-muted/70 truncate">
                      {r.sublabel}
                    </p>
                  )}
                </div>
                <span className="ml-auto text-text-muted/30 group-hover:text-green-400/50 text-sm transition-colors">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
