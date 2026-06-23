"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/fuerzas-armadas", label: "Fuerzas Armadas" },
  { href: "/estados", label: "Estados" },
  { href: "/comparador", label: "Comparador" },
  { href: "/equipamiento", label: "Equipamiento" },
  { href: "/operativos", label: "Operativos" },
  { href: "/proteccion-civil", label: "Protección Civil" },
  { href: "/instalaciones", label: "Instalaciones" },
  { href: "/actualidad", label: "Actualidad" },
  { href: "/mapa", label: "Mapa" },
];

const SECONDARY_NAV = [
  { href: "/glosario", label: "Glosario" },
  { href: "/acerca-de", label: "Acerca de" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-base/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center gap-0">

          {/* Logotipo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-4">
            <div className="flex h-6 w-6 items-center justify-center border border-green-500/40 bg-green-500/10 rounded-sm">
              <span className="text-[11px] font-bold text-green-400 font-mono tracking-wider">CM</span>
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#e8f0ec] leading-none tracking-[0.05em] uppercase">
                Centinela
              </span>
              <span className="block text-[10px] text-text-muted leading-none tracking-[0.2em] uppercase mt-0.5">
                México
              </span>
            </div>
          </Link>

          {/* Separador vertical */}
          <div className="hidden lg:block w-px h-5 bg-border shrink-0 mr-4" />

          {/* Navegación desktop */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-sm px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-green-500/10 text-green-400"
                    : "text-text-muted hover:text-text hover:bg-bg-elevated"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Derecha: búsqueda + links secundarios + indicador + hamburger */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Ícono de búsqueda — visible siempre */}
            <Link
              href="/busqueda"
              aria-label="Búsqueda global"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-sm transition-colors",
                pathname.startsWith("/busqueda")
                  ? "bg-green-500/10 text-green-400"
                  : "text-text-muted hover:text-text hover:bg-bg-elevated"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {SECONDARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-text-muted/60 hover:text-text-muted transition-colors px-2 py-1"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Indicador fuentes abiertas */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-border">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 opacity-80" />
              <span className="font-mono text-[10px] text-text-muted/50 tracking-[0.15em] uppercase">
                Fuentes abiertas
              </span>
            </div>

            {/* Hamburguesa (mobile) */}
            <button
              className="lg:hidden flex flex-col gap-[5px] p-2"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <span className={cn("block h-px w-5 bg-text-muted transition-transform", menuOpen && "translate-y-[7px] rotate-45")} />
              <span className={cn("block h-px w-5 bg-text-muted transition-opacity",   menuOpen && "opacity-0")} />
              <span className={cn("block h-px w-5 bg-text-muted transition-transform", menuOpen && "-translate-y-[7px] -rotate-45")} />
            </button>
          </div>
        </div>

        {/* Menú mobile */}
        {menuOpen && (
          <nav aria-label="Menú de navegación" className="lg:hidden border-t border-border py-3">
            <div className="grid grid-cols-2 gap-1">
              {[...NAV_ITEMS, ...SECONDARY_NAV].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-sm px-3 py-2 text-base transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-green-500/10 text-green-400"
                      : "text-text-muted hover:text-text hover:bg-bg-elevated"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
