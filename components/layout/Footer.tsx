import Link from "next/link";

const FUENTES = [
  { label: "SEDENA", href: "https://www.gob.mx/sedena" },
  { label: "SEMAR", href: "https://www.gob.mx/semar" },
  { label: "Guardia Nacional", href: "https://www.gob.mx/guardianacional" },
  { label: "CNPC", href: "https://www.gob.mx/cnpc" },
  { label: "INEGI", href: "https://www.inegi.org.mx" },
  { label: "DOF", href: "https://www.dof.gob.mx" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identidad */}
          <div>
            <p className="text-[11px] font-bold text-[#e8f0ec] tracking-[0.05em] uppercase mb-2">
              Centinela México
            </p>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Base de datos educativa sobre las fuerzas de seguridad y defensa de México.
              Compilada de fuentes oficiales y de acceso público.
            </p>
          </div>

          {/* Fuentes */}
          <div>
            <p className="font-mono text-[9px] text-text-muted/50 uppercase tracking-[0.2em] mb-3">
              Fuentes oficiales
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {FUENTES.map((f) => (
                <a
                  key={f.href}
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-text-muted hover:text-green-400 transition-colors"
                >
                  {f.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-[9px] text-text-muted/50 uppercase tracking-[0.2em] mb-3">
              Proyecto
            </p>
            <div className="flex flex-col gap-1.5">
              <Link href="/glosario" className="text-[11px] text-text-muted hover:text-text transition-colors">
                Glosario de términos
              </Link>
              <Link href="/acerca-de" className="text-[11px] text-text-muted hover:text-text transition-colors">
                Acerca de este proyecto
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer con acento cobre */}
        <div className="mt-7 pt-6 border-t border-border">
          <div className="border-l-2 border-cobre-500 pl-4 py-1">
            <p className="text-[11px] text-text-muted leading-relaxed">
              <span className="font-semibold text-cobre-400">Aviso:</span>{" "}
              Información con fines educativos e informativos, compilada de fuentes
              oficiales y de acceso público. No representa la posición oficial de ninguna
              institución gubernamental. Todos los datos deben verificarse con las fuentes
              citadas.
            </p>
          </div>
          <p className="mt-5 font-mono text-[9px] text-text-muted/30 tracking-[0.08em]">
            © {year} Centinela México — Proyecto sin fines de lucro
          </p>
        </div>
      </div>
    </footer>
  );
}
