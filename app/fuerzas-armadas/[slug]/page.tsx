import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllFuerzasArmadas,
  getFuerzaBySlug,
  getAllEquipamiento,
} from "@/lib/queries";
import { StatBlock } from "@/components/ui/StatBlock";
import { Badge } from "@/components/ui/Badge";
import {
  tipoFuerzaLabel,
  humanizeKey,
  hostFromUrl,
  parseEstructura,
  categoriaEquipamientoLabel,
  operadorToFuerzaSlug,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renderiza una ruta estática por cada fuerza del seed / Supabase. */
export async function generateStaticParams() {
  const fuerzas = await getAllFuerzasArmadas();
  return fuerzas.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fuerza = await getFuerzaBySlug(slug);
  if (!fuerza) return { title: "Fuerza no encontrada" };

  return {
    title: fuerza.siglas ?? fuerza.nombre,
    description:
      fuerza.descripcion ??
      `Ficha institucional de ${fuerza.nombre} en Centinela México.`,
  };
}

export default async function FuerzaArmadaDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const fuerza = await getFuerzaBySlug(slug);

  if (!fuerza) notFound();

  const verificada = !fuerza.pendiente_verificacion;
  const fuenteHost = fuerza.fuente_url ? hostFromUrl(fuerza.fuente_url) : null;
  const { escalares, listas } = parseEstructura(fuerza.estructura);

  // Relación inversa: equipamiento operado por esta fuerza
  const equipamiento = (await getAllEquipamiento()).filter(
    (e) => operadorToFuerzaSlug(e.operador) === fuerza.slug
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-text-muted">
        <Link href="/" className="hover:text-green-400 transition-colors">
          Inicio
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <Link
          href="/fuerzas-armadas"
          className="hover:text-green-400 transition-colors"
        >
          Fuerzas Armadas
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <span className="text-text">{fuerza.siglas ?? fuerza.nombre}</span>
      </nav>

      {/* Encabezado */}
      <header className="flex items-start gap-4 pb-6 mb-6 border-b border-border">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-green-500/40 bg-green-500/10 shrink-0">
          <span className="text-base font-bold text-green-400 font-mono">
            {(fuerza.siglas ?? fuerza.nombre).slice(0, 4)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl font-bold text-text">
              {fuerza.siglas ?? fuerza.nombre}
            </h1>
            {verificada ? (
              <Badge variant="verificado">Ficha verificada</Badge>
            ) : (
              <Badge variant="pendiente">Datos en verificación</Badge>
            )}
            <Badge variant="gris">{tipoFuerzaLabel(fuerza.tipo)}</Badge>
          </div>
          {fuerza.siglas && (
            <p className="text-sm text-text mb-1">{fuerza.nombre}</p>
          )}
          <p className="text-xs text-text-muted">
            {fuerza.dependencia ?? "Dependencia no especificada"}
            {fuerza.anio_fundacion && ` · Fundada en ${fuerza.anio_fundacion}`}
          </p>
        </div>
      </header>

      {/* Datos clave */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
          Datos clave
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {fuerza.anio_fundacion && (
            <StatBlock
              label="Año de fundación"
              value={fuerza.anio_fundacion}
              fuente={fuenteHost ?? undefined}
            />
          )}

          {escalares.map(({ key, value }) => (
            <StatBlock
              key={key}
              label={humanizeKey(key)}
              value={value}
              pendiente={value === null}
              accent={value === null ? "guinda" : "verde"}
              sublabel={value === null ? "Sin fuente confirmada" : undefined}
              fuente={value !== null ? fuenteHost ?? undefined : undefined}
            />
          ))}

          <StatBlock
            label="Efectivos aprox."
            value={fuerza.efectivos_aprox}
            pendiente={fuerza.efectivos_aprox === null}
            accent={fuerza.efectivos_aprox === null ? "guinda" : "verde"}
            sublabel={
              fuerza.efectivos_aprox === null
                ? "Por confirmar (PNT / DOF)"
                : undefined
            }
            fuente={fuerza.efectivos_aprox !== null ? fuenteHost ?? undefined : undefined}
          />

          <StatBlock
            label="Presupuesto aprox."
            value={fuerza.presupuesto_aprox}
            pendiente={fuerza.presupuesto_aprox === null}
            accent={fuerza.presupuesto_aprox === null ? "guinda" : "verde"}
            sublabel={
              fuerza.presupuesto_aprox === null
                ? "Por confirmar (PEF / DOF)"
                : fuerza.anio_presupuesto
                ? `Ejercicio ${fuerza.anio_presupuesto}`
                : undefined
            }
            fuente={fuerza.presupuesto_aprox !== null ? fuenteHost ?? undefined : undefined}
          />
        </div>
      </section>

      {/* Estructura (listas) */}
      {listas.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Estructura
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listas.map(({ key, value }) => (
              <div
                key={key}
                className="rounded-lg border border-border bg-bg-surface p-4"
              >
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2.5">
                  {humanizeKey(key)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {value.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/5 px-2.5 py-1 text-xs text-green-400"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Misión */}
      {fuerza.mision && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Misión
          </h2>
          <div className="rounded-lg border border-border bg-bg-surface p-5">
            <p className="text-sm text-text leading-relaxed italic">
              &ldquo;{fuerza.mision}&rdquo;
            </p>
          </div>
        </section>
      )}

      {/* Descripción */}
      {fuerza.descripcion && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Descripción
          </h2>
          <p className="text-sm text-text-muted leading-relaxed max-w-3xl">
            {fuerza.descripcion}
          </p>
        </section>
      )}

      {/* Historia */}
      {(fuerza as { historia?: string }).historia && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Historia
          </h2>
          <p className="text-sm text-text-muted leading-relaxed max-w-3xl">
            {(fuerza as { historia?: string }).historia}
          </p>
        </section>
      )}

      {/* Equipamiento asociado (relación inversa) */}
      {equipamiento.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Equipamiento asociado
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {equipamiento.map((e) => (
              <Link
                key={e.slug}
                href={`/equipamiento/${e.slug}`}
                className="group rounded-lg border border-border bg-bg-surface p-4 transition-colors hover:border-green-500/40"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-medium text-text group-hover:text-green-400 transition-colors leading-snug">
                    {e.nombre}
                  </span>
                  <Badge variant="gris">
                    {categoriaEquipamientoLabel(e.categoria)}
                  </Badge>
                </div>
                {e.origen_pais && (
                  <p className="text-[11px] text-text-muted/70 font-mono">
                    {e.origen_pais}
                  </p>
                )}
              </Link>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-text-muted/50">
            Relación derivada del operador registrado en el catálogo de
            equipamiento.
          </p>
        </section>
      )}

      {/* Fuente oficial */}
      {fuerza.fuente_url && (
        <section className="mb-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/[0.06] p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-green-400 mb-0.5">
                Fuente oficial
              </p>
              <p className="text-xs text-text-muted font-mono break-all">
                {fuerza.fuente_url}
              </p>
            </div>
            <a
              href={fuerza.fuente_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md border border-green-500/30 text-green-400 px-3.5 py-2 text-xs font-medium hover:bg-green-500/10 transition-colors"
            >
              Visitar fuente →
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
