import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEstados, getEstadoBySlug } from "@/lib/queries";
import { StatBlock } from "@/components/ui/StatBlock";
import { Badge } from "@/components/ui/Badge";
import { hostFromUrl, parseEstructura, humanizeKey } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renderiza una ruta estática por cada entidad del seed / Supabase. */
export async function generateStaticParams() {
  const estados = await getAllEstados();
  return estados.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const estado = await getEstadoBySlug(slug);
  if (!estado) return { title: "Entidad no encontrada" };

  return {
    title: estado.nombre,
    description:
      estado.descripcion ??
      `Ficha de la fuerza estatal de seguridad de ${estado.nombre} en Centinela México.`,
  };
}

export default async function EstadoDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const estado = await getEstadoBySlug(slug);

  if (!estado) notFound();

  const verificada = !estado.pendiente_verificacion;
  const fuenteHost = estado.fuente_url ? hostFromUrl(estado.fuente_url) : null;
  const inicial = estado.nombre
    .replace(/^(Estado de |Heroica )/, "")
    .slice(0, 3)
    .toUpperCase();
  const { escalares, listas } = parseEstructura(estado.estructura);
  const tieneDetalle = escalares.length > 0 || listas.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-text-muted">
        <Link href="/" className="hover:text-green-400 transition-colors">
          Inicio
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <Link href="/estados" className="hover:text-green-400 transition-colors">
          Estados
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <span className="text-text">{estado.nombre}</span>
      </nav>

      {/* Encabezado */}
      <header className="flex items-start gap-4 pb-6 mb-6 border-b border-border">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-green-500/40 bg-green-500/10 shrink-0">
          <span className="text-base font-bold text-green-400 font-mono">
            {inicial}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl font-bold text-text">{estado.nombre}</h1>
            {verificada ? (
              <Badge variant="verificado">Ficha verificada</Badge>
            ) : (
              <Badge variant="pendiente">Datos en verificación</Badge>
            )}
            {estado.region && <Badge variant="gris">{estado.region}</Badge>}
          </div>
          <p className="text-sm text-text-muted">
            {estado.capital
              ? `Capital: ${estado.capital}`
              : "Capital no especificada"}
            {estado.corporacion_estatal && ` · ${estado.corporacion_estatal}`}
          </p>
        </div>
      </header>

      {/* Datos clave */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
          Datos clave
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatBlock
            label="Población"
            value={estado.poblacion}
            pendiente={estado.poblacion === null}
            accent={estado.poblacion === null ? "guinda" : "verde"}
            sublabel={estado.poblacion !== null ? "Censo 2020" : "Por confirmar"}
            fuente={estado.poblacion !== null ? "inegi.org.mx" : undefined}
          />

          <StatBlock
            label="Efectivos estatales aprox."
            value={estado.efectivos_aprox}
            pendiente={estado.efectivos_aprox === null}
            accent={estado.efectivos_aprox === null ? "guinda" : "verde"}
            sublabel={
              estado.efectivos_aprox === null
                ? "Por confirmar (PNT / estatal)"
                : undefined
            }
            fuente={
              estado.efectivos_aprox !== null ? fuenteHost ?? undefined : undefined
            }
          />

          <StatBlock
            label="Presupuesto de seguridad"
            value={estado.presupuesto_seguridad}
            pendiente={estado.presupuesto_seguridad === null}
            accent={estado.presupuesto_seguridad === null ? "guinda" : "verde"}
            sublabel={
              estado.presupuesto_seguridad === null
                ? "Por confirmar (presupuesto estatal)"
                : undefined
            }
            fuente={
              estado.presupuesto_seguridad !== null
                ? fuenteHost ?? undefined
                : undefined
            }
          />

          {estado.region && (
            <StatBlock label="Región" value={estado.region} accent="none" />
          )}
        </div>
      </section>

      {/* Contexto geopolítico y militar */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
          Contexto geopolítico y militar
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {estado.litoral && (
            <StatBlock
              label="Litoral"
              value={estado.litoral === "pacifico" ? "Pacífico" : estado.litoral === "golfo" ? "Golfo de México" : estado.litoral}
              accent="verde"
            />
          )}
          {estado.frontera && (
            <StatBlock
              label="Frontera"
              value={estado.frontera === "norte" ? "Frontera Norte (EE.UU.)" : estado.frontera === "sur" ? "Frontera Sur (Guatemala/Belice)" : estado.frontera}
              accent="verde"
            />
          )}
          <StatBlock
            label="Presencia naval"
            value={estado.presencia_naval ? "Sí (SEMAR)" : "No"}
            accent={estado.presencia_naval ? "verde" : "none"}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {estado.zona_militar && (
            <div className="rounded-lg border border-border bg-bg-surface p-4">
              <p className="text-sm text-text-muted uppercase tracking-wider mb-2">
                Zona(s) militar(es) — SEDENA
              </p>
              <p className="text-base text-text">{estado.zona_militar}</p>
            </div>
          )}
          {estado.region_militar && (
            <div className="rounded-lg border border-border bg-bg-surface p-4">
              <p className="text-sm text-text-muted uppercase tracking-wider mb-2">
                Región militar
              </p>
              <p className="text-base text-text">{estado.region_militar}</p>
            </div>
          )}
          {estado.zona_naval && (
            <div className="rounded-lg border border-border bg-bg-surface p-4">
              <p className="text-sm text-text-muted uppercase tracking-wider mb-2">
                Zona(s) naval(es) — SEMAR
              </p>
              <p className="text-base text-text">{estado.zona_naval}</p>
            </div>
          )}
          {estado.riesgos_principales.length > 0 && (
            <div className="rounded-lg border border-border bg-bg-surface p-4">
              <p className="text-sm text-text-muted uppercase tracking-wider mb-2.5">
                Riesgos principales — CENAPRED
              </p>
              <div className="flex flex-wrap gap-1.5">
                {estado.riesgos_principales.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-sm text-amber-400"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mando y corporación */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
          Mando y corporación
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-bg-surface p-4">
            <p className="text-sm text-text-muted uppercase tracking-wider mb-2">
              Corporación estatal
            </p>
            <p className="text-base text-text">
              {estado.corporacion_estatal ?? (
                <span className="text-text-muted">Pendiente de confirmar</span>
              )}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg-surface p-4">
            <p className="text-sm text-text-muted uppercase tracking-wider mb-2">
              Secretaría de seguridad
            </p>
            <p className="text-base text-text">
              {estado.secretaria_seguridad ?? (
                <span className="text-text-muted">Pendiente de confirmar</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Detalle de la corporación (estructura) */}
      {tieneDetalle && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
            Detalle de la corporación
          </h2>
          {escalares.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
              {escalares.map(({ key, value }) => (
                <StatBlock
                  key={key}
                  label={humanizeKey(key)}
                  value={value}
                  pendiente={value === null}
                  accent={value === null ? "guinda" : "verde"}
                />
              ))}
            </div>
          )}
          {listas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listas.map(({ key, value }) => (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-bg-surface p-4"
                >
                  <p className="text-sm text-text-muted uppercase tracking-wider mb-2.5">
                    {humanizeKey(key)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {value.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/5 px-2.5 py-1 text-sm text-green-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Descripción */}
      {estado.descripcion && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
            Descripción
          </h2>
          <p className="text-base text-text-muted leading-relaxed max-w-3xl">
            {estado.descripcion}
          </p>
        </section>
      )}

      {/* Fuente oficial */}
      {estado.fuente_url && (
        <section className="mb-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/[0.06] p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-green-400 mb-0.5">
                Fuente oficial
              </p>
              <p className="text-sm text-text-muted font-mono break-all">
                {estado.fuente_url}
              </p>
            </div>
            <a
              href={estado.fuente_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md border border-green-500/30 text-green-400 px-3.5 py-2 text-sm font-medium hover:bg-green-500/10 transition-colors"
            >
              Visitar fuente →
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
