import Link from "next/link";
import { cn } from "@/lib/utils";

interface Section {
  href: string;
  title: string;
  description: string;
  count?: string;
  accent?: boolean;
}

const SECTIONS: Section[] = [
  {
    href: "/fuerzas-armadas",
    title: "Fuerzas Armadas",
    description: "SEDENA, SEMAR, Fuerza Aérea y Guardia Nacional. Personal, presupuesto y estructura.",
    count: "4 instituciones",
    accent: true,
  },
  {
    href: "/estados",
    title: "Estados",
    description: "Las 32 entidades federativas: policías estatales, zonas militares y presencia de GN.",
    count: "32 entidades",
  },
  {
    href: "/comparador",
    title: "Comparador",
    description: "Compara dos fuerzas o dos entidades federativas lado a lado.",
  },
  {
    href: "/equipamiento",
    title: "Equipamiento",
    description: "Catálogo de aeronaves, vehículos, embarcaciones y armamento de fuentes oficiales.",
  },
  {
    href: "/operativos",
    title: "Operativos",
    description: "Cronología interactiva de operativos y despliegues de seguridad documentados.",
  },
  {
    href: "/proteccion-civil",
    title: "Protección Civil",
    description: "CNPC, CENAPRED y capacidades de respuesta a desastres en cada entidad.",
  },
  {
    href: "/actualidad",
    title: "Actualidad",
    description: "Noticias y boletines de fuentes oficiales sobre seguridad y defensa.",
  },
  {
    href: "/mapa",
    title: "Mapa Interactivo",
    description: "Visualiza zonas militares, navalías, cuarteles y presencia por entidad.",
    accent: true,
  },
];

export function SectionGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Encabezado con línea */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-[9px] text-text-muted tracking-[0.2em] uppercase">
          Secciones
        </span>
        <span className="flex-1 h-px bg-border" />
        <span className="font-mono text-[9px] text-border">08</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className={cn(
              "group relative rounded-sm border bg-bg-surface p-3.5 transition-colors duration-150",
              "border-l-2 hover:bg-bg-elevated",
              section.accent
                ? "border-border border-l-green-500 hover:border-green-500/40"
                : "border-border border-l-border hover:border-l-green-500/40"
            )}
          >
            {/* Número */}
            <p className="font-mono text-[9px] text-text-muted/50 tracking-[0.12em] mb-2.5">
              {String(i + 1).padStart(2, "0")}
            </p>

            {/* Título */}
            <h3
              className={cn(
                "text-[12px] font-bold leading-tight mb-1.5 tracking-tight transition-colors",
                section.accent
                  ? "text-green-400 group-hover:text-green-300"
                  : "text-[#e8f0ec] group-hover:text-green-400"
              )}
            >
              {section.title}
            </h3>

            {/* Descripción */}
            <p className="text-[10px] text-text-muted leading-relaxed mb-3">
              {section.description}
            </p>

            {/* Footer: count en cobre o flecha */}
            <p className={cn(
              "font-mono text-[9px]",
              section.count ? "text-cobre-500" : "text-text-muted/40"
            )}>
              {section.count ? `${section.count} →` : "→"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
