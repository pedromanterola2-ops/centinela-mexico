import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe en Centinela México.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Código de error */}
      <p className="font-mono text-[80px] font-bold leading-none text-green-500/10 select-none mb-4">
        404
      </p>

      {/* Mensaje */}
      <h1 className="text-2xl font-bold text-text mb-2">
        Página no encontrada
      </h1>
      <p className="text-base text-text-muted max-w-sm leading-relaxed mb-8">
        La ruta que solicitaste no existe en Centinela México o fue removida.
      </p>

      {/* Acciones */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="rounded-md bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-2.5 text-sm font-medium hover:bg-green-500/20 transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          href="/fuerzas-armadas"
          className="rounded-md border border-border text-text-muted px-5 py-2.5 text-sm font-medium hover:text-text hover:bg-bg-elevated transition-colors"
        >
          Fuerzas Armadas
        </Link>
        <Link
          href="/estados"
          className="rounded-md border border-border text-text-muted px-5 py-2.5 text-sm font-medium hover:text-text hover:bg-bg-elevated transition-colors"
        >
          Estados
        </Link>
      </div>

      {/* Separador visual */}
      <div className="mt-12 flex items-center gap-3">
        <span className="h-px w-10 bg-border" />
        <span className="font-mono text-[11px] text-text-muted/40 uppercase tracking-[0.2em]">
          Centinela México
        </span>
        <span className="h-px w-10 bg-border" />
      </div>
    </div>
  );
}
