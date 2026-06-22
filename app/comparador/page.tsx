import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllEstados,
  getEstadoBySlug,
  getAllFuerzasArmadas,
  getFuerzaBySlug,
} from "@/lib/queries";
import { CompareTable, type CompareRow } from "@/components/ui/CompareTable";
import {
  CompareSelector,
  type CompareOption,
} from "@/components/comparador/CompareSelector";
import { tipoFuerzaLabel } from "@/lib/utils";
import type { Estado, FuerzaArmada } from "@/types";

export const metadata: Metadata = {
  title: "Comparador",
  description:
    "Compara lado a lado dos entidades federativas o dos fuerzas armadas de México: población, efectivos, presupuesto y datos institucionales.",
  // Los query params generan URLs diferentes; el canonical evita contenido duplicado
  alternates: {
    canonical: "/comparador",
  },
};

interface PageProps {
  searchParams: Promise<{ tipo?: string; a?: string; b?: string }>;
}

/** Determina qué columna tiene el valor numérico mayor (resaltado neutral). */
function mayorNum(a: number | null, b: number | null): "A" | "B" | null {
  if (a == null || b == null || a === b) return null;
  return a > b ? "A" : "B";
}

function filasEstados(a: Estado, b: Estado): CompareRow[] {
  return [
    { campo: "Región", valorA: a.region, valorB: b.region },
    { campo: "Capital", valorA: a.capital, valorB: b.capital },
    {
      campo: "Población (2020)",
      valorA: a.poblacion,
      valorB: b.poblacion,
      mayor: mayorNum(a.poblacion, b.poblacion),
    },
    {
      campo: "Corporación estatal",
      valorA: a.corporacion_estatal,
      valorB: b.corporacion_estatal,
    },
    {
      campo: "Secretaría de seguridad",
      valorA: a.secretaria_seguridad,
      valorB: b.secretaria_seguridad,
    },
    {
      campo: "Efectivos estatales aprox.",
      valorA: a.efectivos_aprox,
      valorB: b.efectivos_aprox,
      mayor: mayorNum(a.efectivos_aprox, b.efectivos_aprox),
    },
    {
      campo: "Presupuesto de seguridad",
      valorA: a.presupuesto_seguridad,
      valorB: b.presupuesto_seguridad,
      mayor: mayorNum(a.presupuesto_seguridad, b.presupuesto_seguridad),
    },
    {
      campo: "Estado del dato",
      valorA: a.pendiente_verificacion ? "En verificación" : "Verificada",
      valorB: b.pendiente_verificacion ? "En verificación" : "Verificada",
    },
  ];
}

function filasFuerzas(a: FuerzaArmada, b: FuerzaArmada): CompareRow[] {
  return [
    { campo: "Siglas", valorA: a.siglas, valorB: b.siglas },
    {
      campo: "Tipo",
      valorA: tipoFuerzaLabel(a.tipo),
      valorB: tipoFuerzaLabel(b.tipo),
    },
    { campo: "Dependencia", valorA: a.dependencia, valorB: b.dependencia },
    {
      campo: "Año de fundación",
      valorA: a.anio_fundacion,
      valorB: b.anio_fundacion,
    },
    {
      campo: "Efectivos aprox.",
      valorA: a.efectivos_aprox,
      valorB: b.efectivos_aprox,
      mayor: mayorNum(a.efectivos_aprox, b.efectivos_aprox),
    },
    {
      campo: "Presupuesto aprox.",
      valorA: a.presupuesto_aprox,
      valorB: b.presupuesto_aprox,
      mayor: mayorNum(a.presupuesto_aprox, b.presupuesto_aprox),
    },
    {
      campo: "Estado del dato",
      valorA: a.pendiente_verificacion ? "En verificación" : "Verificada",
      valorB: b.pendiente_verificacion ? "En verificación" : "Verificada",
    },
  ];
}

export default async function ComparadorPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tipo = sp.tipo === "fuerzas" ? "fuerzas" : "estados";
  const a = sp.a;
  const b = sp.b;

  const [estados, fuerzas] = await Promise.all([
    getAllEstados(),
    getAllFuerzasArmadas(),
  ]);

  const estadoOpts: CompareOption[] = estados.map((e) => ({
    slug: e.slug,
    nombre: e.nombre,
  }));
  const fuerzaOpts: CompareOption[] = fuerzas.map((f) => ({
    slug: f.slug,
    nombre: f.siglas ? `${f.siglas} — ${f.nombre}` : f.nombre,
  }));

  // Resolver las dos selecciones según el tipo
  let rows: CompareRow[] = [];
  let labelA = "Columna A";
  let labelB = "Columna B";
  let listo = false;

  if (a && b && a !== b) {
    if (tipo === "estados") {
      const [ea, eb] = await Promise.all([
        getEstadoBySlug(a),
        getEstadoBySlug(b),
      ]);
      if (ea && eb) {
        rows = filasEstados(ea, eb);
        labelA = ea.nombre;
        labelB = eb.nombre;
        listo = true;
      }
    } else {
      const [fa, fb] = await Promise.all([
        getFuerzaBySlug(a),
        getFuerzaBySlug(b),
      ]);
      if (fa && fb) {
        rows = filasFuerzas(fa, fb);
        labelA = fa.siglas ?? fa.nombre;
        labelB = fb.siglas ?? fb.nombre;
        listo = true;
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Comparador</h1>
        <p className="text-base text-text-muted max-w-2xl leading-relaxed">
          Compara lado a lado dos entidades federativas o dos fuerzas armadas.
          Se resalta el valor numérico mayor en cada métrica equivalente; los
          datos sin fuente confirmada aparecen como &quot;Pendiente&quot;.
        </p>
      </div>

      {/* Selectores */}
      <div className="mb-8 rounded-lg border border-border bg-bg-surface/50 p-5">
        <CompareSelector
          tipo={tipo}
          estados={estadoOpts}
          fuerzas={fuerzaOpts}
          a={a}
          b={b}
        />
      </div>

      {/* Resultado */}
      {listo ? (
        <>
          <CompareTable labelA={labelA} labelB={labelB} rows={rows} />
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {tipo === "estados" ? (
              <>
                <Link
                  href={`/estados/${a}`}
                  className="text-green-400 hover:underline"
                >
                  Ver ficha de {labelA} →
                </Link>
                <Link
                  href={`/estados/${b}`}
                  className="text-guinda-300 hover:underline"
                >
                  Ver ficha de {labelB} →
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/fuerzas-armadas/${a}`}
                  className="text-green-400 hover:underline"
                >
                  Ver ficha de {labelA} →
                </Link>
                <Link
                  href={`/fuerzas-armadas/${b}`}
                  className="text-guinda-300 hover:underline"
                >
                  Ver ficha de {labelB} →
                </Link>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-center">
          <p className="text-base text-text-muted">
            Elige {tipo === "estados" ? "dos entidades" : "dos fuerzas"} en los
            selectores para ver la comparación.
          </p>
          <p className="mt-1 text-sm text-text-muted/60">
            Por ejemplo: Veracruz vs Jalisco, o SEDENA vs SEMAR.
          </p>
        </div>
      )}

      <p className="mt-8 text-[13px] text-text-muted/50">
        Datos de fuentes oficiales de acceso público. El resaltado indica
        magnitud, no una valoración cualitativa.
      </p>
    </div>
  );
}
