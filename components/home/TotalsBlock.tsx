"use client";

import type { TotalesIndexados } from "@/types";
import { formatNumber } from "@/lib/utils";

interface TotalesBlockProps {
  totales?: TotalesIndexados | null;
}

const ITEMS: { key: keyof TotalesIndexados; sublabel: string }[] = [
  { key: "fuerzas_armadas", sublabel: "Fuerzas / dependencias" },
  { key: "estados",         sublabel: "Entidades federativas" },
  { key: "equipamiento",    sublabel: "Equipos catalogados" },
  { key: "operativos",      sublabel: "Operativos documentados" },
  { key: "desastres",       sublabel: "Desastres registrados" },
  { key: "instalaciones",   sublabel: "Instalaciones indexadas" },
  { key: "glosario",        sublabel: "Términos en glosario" },
  { key: "noticias",        sublabel: "Boletines oficiales" },
];

// Fallback actualizado para reflejar el seed real (útil si getTotales falla)
const PLACEHOLDER: TotalesIndexados = {
  fuerzas_armadas: 5,
  estados: 32,
  equipamiento: 37,
  operativos: 30,
  desastres: 15,
  instalaciones: 29,
  glosario: 45,
  noticias: 7,
};

export function TotalsBlock({ totales }: TotalesBlockProps) {
  const data = totales ?? PLACEHOLDER;

  // Duplicamos los items para lograr el efecto de carrusel infinito
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <section className="border-y border-border overflow-hidden">
      {/* La pista se desplaza de derecha a izquierda; al hacer hover se pausa */}
      <div className="carousel-track flex items-stretch">
        {doubled.map((item, idx) => (
          <div
            key={`${item.key}-${idx}`}
            className="flex items-baseline gap-2.5 px-5 py-3.5 shrink-0 border-r border-border"
          >
            <span className="font-mono text-base font-bold text-text leading-none">
              {data[item.key] > 0 ? (
                formatNumber(data[item.key])
              ) : (
                <span className="text-text-muted/40 text-sm font-normal">—</span>
              )}
            </span>
            <span className="font-mono text-[9px] text-text-muted/60 tracking-[0.1em] uppercase leading-tight whitespace-nowrap">
              {item.sublabel}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
