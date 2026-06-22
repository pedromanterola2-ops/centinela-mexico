"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Registrar el error en consola para debugging
    console.error("[Centinela Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Código visual */}
      <p className="font-mono text-[80px] font-bold leading-none text-guinda-500/10 select-none mb-4">
        500
      </p>

      {/* Mensaje */}
      <h1 className="text-2xl font-bold text-text mb-2">
        Algo salió mal
      </h1>
      <p className="text-base text-text-muted max-w-sm leading-relaxed mb-8">
        Ocurrió un error inesperado al cargar esta página. Puedes intentar
        recargarla o regresar al inicio.
      </p>

      {/* Acciones */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="rounded-md bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-2.5 text-sm font-medium hover:bg-green-500/20 transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-md border border-border text-text-muted px-5 py-2.5 text-sm font-medium hover:text-text hover:bg-bg-elevated transition-colors"
        >
          Ir al inicio
        </Link>
      </div>

      {/* Digest para debugging (solo visible en dev) */}
      {process.env.NODE_ENV === "development" && error.message && (
        <p className="mt-8 font-mono text-xs text-text-muted/40 max-w-md break-all">
          {error.message}
        </p>
      )}

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
