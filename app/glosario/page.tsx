import type { Metadata } from "next";
import Link from "next/link";
import { getAllGlosario } from "@/lib/queries";
import { categoriaGlosarioLabel } from "@/lib/utils";
import type { GlosarioEntry } from "@/types";

export const metadata: Metadata = {
  title: "Glosario",
  description:
    "Términos, siglas y definiciones de las fuerzas de seguridad y defensa de México. SEDENA, SEMAR, Guardia Nacional, Protección Civil y más.",
};

interface PageProps {
  searchParams: Promise<{ vista?: string }>;
}

const CATEGORIAS_ORDEN = [
  "institucional",
  "organico",
  "operativo",
  "tactico",
  "juridico",
  "tecnico",
  "estadistico",
] as const;

function EntradaGlosario({ entrada }: { entrada: GlosarioEntry }) {
  return (
    <div className="group border-b border-border/60 py-5 last:border-0">
      <div className="flex items-start gap-4">
        {entrada.siglas ? (
          <span className="shrink-0 w-20 text-right font-mono text-xs font-bold text-green-400 pt-0.5 leading-relaxed">
            {entrada.siglas}
          </span>
        ) : (
          <span className="shrink-0 w-20" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text leading-snug mb-1">
            {entrada.termino}
          </p>
          {entrada.definicion && (
            <p className="text-sm text-text-muted leading-relaxed">
              {entrada.definicion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({
  href,
  activo,
  children,
}: {
  href: string;
  activo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        activo
          ? "border-green-500/40 bg-green-500/15 text-green-400"
          : "border-border bg-bg-surface text-text-muted hover:text-text hover:border-green-500/30"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function GlosarioPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const vista = sp.vista === "categoria" ? "categoria" : "letra";

  const entradas = await getAllGlosario();

  // ── Vista por letra ───────────────────────────────────────────────────────
  const gruposLetra = entradas.reduce<Record<string, GlosarioEntry[]>>(
    (acc, e) => {
      const inicial = e.termino[0].toUpperCase();
      if (!acc[inicial]) acc[inicial] = [];
      acc[inicial].push(e);
      return acc;
    },
    {}
  );
  const letras = Object.keys(gruposLetra).sort();

  // ── Vista por categoría ───────────────────────────────────────────────────
  const gruposCategoria = entradas.reduce<Record<string, GlosarioEntry[]>>(
    (acc, e) => {
      const cat = e.categoria ?? "general";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(e);
      return acc;
    },
    {}
  );
  const categoriasPresentes = CATEGORIAS_ORDEN.filter(
    (c) => gruposCategoria[c]
  );
  if (gruposCategoria["general"]) categoriasPresentes.push("general" as never);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Referencia
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Glosario</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Términos, siglas y definiciones utilizados en el ámbito de las fuerzas
          de seguridad y defensa de México. Compilado de fuentes y documentos
          oficiales de acceso público.
        </p>
      </div>

      {/* Selector de vista */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
          Vista
        </span>
        <Chip href="/glosario" activo={vista === "letra"}>
          Por letra
        </Chip>
        <Chip href="/glosario?vista=categoria" activo={vista === "categoria"}>
          Por categoría
        </Chip>
      </div>

      {entradas.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-center">
          <p className="text-sm text-text-muted">
            El glosario aún no tiene entradas indexadas.
          </p>
        </div>
      )}

      {/* ── Vista por letra ───────────────────────────────────────────────── */}
      {vista === "letra" && entradas.length > 0 && (
        <>
          {/* Índice de letras */}
          <div className="mb-8 flex flex-wrap gap-1.5">
            {letras.map((letra) => (
              <a
                key={letra}
                href={`#letra-${letra}`}
                className="rounded border border-border bg-bg-surface px-2.5 py-1 font-mono text-xs text-text-muted hover:border-green-500/30 hover:text-green-400 transition-colors"
              >
                {letra}
              </a>
            ))}
          </div>

          <div className="space-y-10">
            {letras.map((letra) => (
              <section key={letra} id={`letra-${letra}`}>
                <h2 className="mb-3 font-mono text-lg font-bold text-green-400/80 scroll-mt-16">
                  {letra}
                </h2>
                <div className="rounded-lg border border-border bg-bg-surface px-4 sm:px-6">
                  {gruposLetra[letra].map((e) => (
                    <EntradaGlosario key={e.id} entrada={e} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {/* ── Vista por categoría ───────────────────────────────────────────── */}
      {vista === "categoria" && entradas.length > 0 && (
        <>
          {/* Índice de categorías */}
          <div className="mb-8 flex flex-wrap gap-1.5">
            {categoriasPresentes.map((cat) => (
              <a
                key={cat}
                href={`#cat-${cat}`}
                className="rounded border border-border bg-bg-surface px-2.5 py-1 text-xs text-text-muted hover:border-green-500/30 hover:text-green-400 transition-colors"
              >
                {categoriaGlosarioLabel(cat)}
                <span className="ml-1.5 text-text-muted/50 font-mono">
                  ({gruposCategoria[cat]?.length ?? 0})
                </span>
              </a>
            ))}
          </div>

          <div className="space-y-10">
            {categoriasPresentes.map((cat) => (
              <section key={cat} id={`cat-${cat}`}>
                <h2 className="mb-3 text-sm font-semibold text-green-400 uppercase tracking-widest scroll-mt-16">
                  {categoriaGlosarioLabel(cat)}
                  <span className="ml-2 text-text-muted/50 font-mono text-xs normal-case tracking-normal">
                    {gruposCategoria[cat]?.length ?? 0} términos
                  </span>
                </h2>
                <div className="rounded-lg border border-border bg-bg-surface px-4 sm:px-6">
                  {(gruposCategoria[cat] ?? []).map((e) => (
                    <EntradaGlosario key={e.id} entrada={e} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      <p className="mt-10 text-[11px] text-text-muted/50">
        {entradas.length} término{entradas.length !== 1 ? "s" : ""} indexado
        {entradas.length !== 1 ? "s" : ""}. Definiciones de fuentes oficiales de
        acceso público.
      </p>
    </div>
  );
}
