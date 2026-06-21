import Link from "next/link";

const STATS = [
  { label: "Fuerzas armadas", value: "4",  accent: true },
  { label: "Entidades federativas", value: "32" },
  { label: "Zonas militares", value: "46" },
  { label: "Equipos catalogados", value: "—" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 bg-grid">
      {/* Luz sutil en esquina superior izquierda */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 15% 0%, rgba(45,122,71,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 lg:gap-16 items-start">

          {/* ── Columna izquierda: texto editorial ── */}
          <div>
            {/* Etiqueta mono */}
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block h-px w-5 bg-green-500" />
              <span className="font-mono text-[9px] text-green-500 tracking-[0.22em] uppercase">
                Base de datos educativa · SEDENA · SEMAR · DOF
              </span>
            </div>

            {/* Título sin gradiente, peso pesado */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#e8f0ec] leading-[1.04] tracking-tight mb-5">
              Fuerzas de<br />
              seguridad<br />
              <span className="text-green-400">en México</span>
            </h1>

            <p className="text-sm text-text-muted leading-relaxed max-w-md mb-2">
              Información educativa compilada de fuentes oficiales. SEDENA, SEMAR,
              Guardia Nacional, CENAPRED, INEGI y DOF.
            </p>
            <p className="font-mono text-[9px] text-text-muted/40 tracking-[0.1em] mb-7">
              Solo fuentes oficiales y de acceso público
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/fuerzas-armadas"
                className="rounded-sm bg-green-500 text-white px-5 py-2.5 text-sm font-semibold hover:bg-green-400 transition-colors"
              >
                Explorar fuerzas →
              </Link>
              <Link
                href="/mapa"
                className="rounded-sm border border-border text-text-muted px-5 py-2.5 text-sm font-medium hover:border-green-500/30 hover:text-text transition-colors"
              >
                Ver mapa interactivo
              </Link>
            </div>
          </div>

          {/* ── Columna derecha: stack de estadísticas ── */}
          <div className="border border-border rounded-sm overflow-hidden">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  "px-4 py-4 flex items-baseline justify-between",
                  i < STATS.length - 1 ? "border-b border-border" : "",
                  stat.accent ? "bg-green-500/5" : "",
                ].join(" ")}
              >
                <div>
                  <p className="font-mono text-[9px] text-text-muted tracking-[0.15em] uppercase mb-1.5">
                    {stat.label}
                  </p>
                  <p
                    className={[
                      "font-mono text-2xl font-bold leading-none",
                      stat.accent ? "text-green-400" : "text-text",
                    ].join(" ")}
                  >
                    {stat.value}
                  </p>
                </div>
                <span className="font-mono text-[9px] text-border">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
