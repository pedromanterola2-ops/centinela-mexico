import type { Metadata } from "next";
import Link from "next/link";
import { getLatestNoticias } from "@/lib/queries";
import { getItemsEspecializados } from "@/lib/ingest";
import { fuentesPorTier, paisLabel } from "@/lib/fuentes";
import { Badge } from "@/components/ui/Badge";
import { formatFecha, hostFromUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Actualidad",
  description:
    "Boletines de fuentes oficiales (SEDENA, SEMAR, Guardia Nacional, CNPC, DOF) y publicaciones recientes de medios y canales especializados. Cada nota enlaza a su fuente.",
};

// La sección hace fetch de feeds externos: revalida en bloque cada 30 min.
export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<{ nivel?: string }>;
}

type Tier = "oficial" | "especializada";

interface Item {
  id: string;
  titulo: string;
  url: string | null;
  fecha: string | null;
  resumen: string | null;
  fuente: string;
  tier: Tier;
  tipo: "gobierno" | "medio" | "youtube";
  pais?: string;
  prioridad?: boolean;
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

function TierBadge({ tier }: { tier: Tier }) {
  return tier === "oficial" ? (
    <Badge variant="verde">Oficial</Badge>
  ) : (
    <span className="rounded-sm border border-cobre-500/30 bg-cobre-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cobre-400">
      Divulgación
    </span>
  );
}

export default async function ActualidadPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const nivel =
    sp.nivel === "oficial" || sp.nivel === "especializada" ? sp.nivel : undefined;

  const [noticias, especializados] = await Promise.all([
    getLatestNoticias(100),
    getItemsEspecializados(),
  ]);

  const oficiales: Item[] = noticias.map((n) => ({
    id: n.id,
    titulo: n.titulo,
    url: n.url,
    fecha: n.fecha,
    resumen: n.resumen,
    fuente: n.fuente_oficial ?? n.dependencia ?? "Fuente oficial",
    tier: "oficial",
    tipo: "gobierno",
  }));

  // Fuentes especializadas con contenido de México ahora mismo (para el directorio).
  const presentes = new Set(especializados.map((e) => e.fuenteSlug));

  const especiales: Item[] = especializados.map((e) => ({
    id: e.id,
    titulo: e.titulo,
    url: e.url,
    fecha: e.fecha,
    resumen: e.resumen,
    fuente: e.fuente,
    tier: "especializada",
    tipo: e.tipo,
    pais: e.pais,
    prioridad: e.prioridad,
  }));

  const combinadas = [...oficiales, ...especiales].sort((a, b) => {
    const fa = a.fecha ?? "";
    const fb = b.fecha ?? "";
    if (fa !== fb) return fb.localeCompare(fa);
    if (!!a.prioridad !== !!b.prioridad) return a.prioridad ? -1 : 1;
    return a.tier === b.tier ? 0 : a.tier === "oficial" ? -1 : 1;
  });

  const items = nivel ? combinadas.filter((i) => i.tier === nivel) : combinadas;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Actualidad</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Dos niveles de fuentes: boletines de dependencias{" "}
          <strong>oficiales</strong> y publicaciones recientes de{" "}
          <strong>medios y canales especializados</strong> de divulgación y
          análisis (no oficiales). Cada nota enlaza directamente a su fuente. De
          las fuentes especializadas solo se muestran las publicaciones
          relacionadas con México; las que no tratan del país no aparecen.
        </p>
      </div>

      {/* Filtro por nivel */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
          Nivel
        </span>
        <Chip href="/actualidad" activo={!nivel}>
          Todas
        </Chip>
        <Chip href="/actualidad?nivel=oficial" activo={nivel === "oficial"}>
          Oficiales
        </Chip>
        <Chip href="/actualidad?nivel=especializada" activo={nivel === "especializada"}>
          Especializadas
        </Chip>
      </div>

      {/* Listado combinado */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-center">
          <p className="text-sm text-text-muted">
            No hay publicaciones para este filtro en este momento.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <article
              key={n.id}
              className="group rounded-lg border border-border bg-bg-surface p-5 transition-colors hover:border-green-500/40"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <TierBadge tier={n.tier} />
                <span className="text-[11px] text-text-muted/80">{n.fuente}</span>
                {n.pais && (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted/50">
                    {paisLabel(n.pais)}
                  </span>
                )}
                <span className="text-[11px] text-text-muted/70 font-mono ml-auto">
                  {formatFecha(n.fecha)}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-text mb-1.5 leading-snug">
                {n.url ? (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group-hover:text-green-400 transition-colors"
                  >
                    {n.titulo}
                  </a>
                ) : (
                  n.titulo
                )}
              </h2>
              {n.resumen && (
                <p className="text-xs text-text-muted leading-relaxed mb-3 max-w-3xl">
                  {n.resumen}
                </p>
              )}
              {n.url && (
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-green-400 hover:underline font-mono"
                >
                  {n.tipo === "youtube" ? "youtube.com" : hostFromUrl(n.url)} →
                </a>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Directorio de fuentes por nivel */}
      <section className="mt-12 space-y-8">
        {(["oficial", "especializada"] as Tier[]).map((tier) => {
          const lista =
            tier === "oficial"
              ? fuentesPorTier(tier)
              : fuentesPorTier(tier).filter((f) => presentes.has(f.slug));
          if (lista.length === 0) return null;
          return (
          <div key={tier}>
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-4">
              {tier === "oficial"
                ? "Fuentes oficiales"
                : "Divulgación y análisis especializado (no oficial)"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lista.map((f) => (
                <a
                  key={f.slug}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-bg-surface p-4 transition-colors hover:border-green-500/40"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-text group-hover:text-green-400 transition-colors">
                      {f.nombre}
                    </p>
                    {f.prioridad && (
                      <span className="font-mono text-[8px] uppercase tracking-wider text-cobre-400">
                        ★
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted/70 leading-snug mb-1">
                    {f.descripcion}
                  </p>
                  <p className="font-mono text-[10px] text-text-muted/50">
                    {hostFromUrl(f.url)}
                    {f.tier === "especializada" ? ` · ${paisLabel(f.pais)}` : ""} →
                  </p>
                </a>
              ))}
            </div>
          </div>
          );
        })}
      </section>

      <p className="mt-10 text-[11px] text-text-muted/50 leading-relaxed">
        {items.length} publicación(es). Las fuentes oficiales son la columna
        vertebral del proyecto; las fuentes especializadas se incluyen como
        material de divulgación y análisis, claramente diferenciado y no oficial.
        Cada nota enlaza a su fuente para su verificación directa.
      </p>
    </div>
  );
}
