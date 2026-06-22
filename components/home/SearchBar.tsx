"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const SEARCH_SUGGESTIONS = [
  "SEDENA",
  "Guardia Nacional",
  "Armada de México",
  "Fuerza Aérea Mexicana",
  "Jalisco",
  "Ciudad de México",
  "FX-05",
  "DN-III-E",
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busqueda?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSuggestion(s: string) {
    setQuery(s);
    inputRef.current?.focus();
  }

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.closest("form")?.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Icono de búsqueda — decorativo, el input ya tiene aria-label */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Buscar fuerza armada, estado, equipo, operativo…"
            className="search-input pl-11 pr-24"
            aria-label="Búsqueda global"
          />

          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 text-sm font-medium hover:bg-green-500/20 transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Sugerencias */}
        {focused && filtered.length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-bg-elevated shadow-xl">
            {filtered.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => handleSuggestion(s)}
                className="w-full text-left px-4 py-2.5 text-base text-text-muted hover:text-text hover:bg-bg-surface transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-green-400 mr-2 text-sm">→</span>
                {s}
              </button>
            ))}
          </div>
        )}
      </form>

      <p className="mt-2 text-center text-sm text-text-muted/60">
        Busca en fuerzas armadas, estados, equipamiento y operativos
      </p>
    </div>
  );
}
