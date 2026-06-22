"use client";

import { useState, useRef, useEffect, useId } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);
  const listboxId = useId();

  const filtered = query
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const isOpen = focused && filtered.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setFocused(false);
      router.push(`/busqueda?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSuggestion(s: string) {
    setQuery(s);
    setFocused(false);
    router.push(`/busqueda?q=${encodeURIComponent(s)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  // Cerrar sugerencias al interactuar fuera (mouse y touch)
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4">
      <form ref={formRef} onSubmit={handleSubmit} className="relative">
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
            id="search-input"
            type="text"
            role="combobox"
            aria-label="Búsqueda global"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-haspopup="listbox"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar fuerza armada, estado, equipo, operativo…"
            className="search-input pl-11 pr-24"
          />

          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 text-sm font-medium hover:bg-green-500/20 transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Sugerencias — listbox ARIA */}
        {isOpen && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Sugerencias de búsqueda"
            className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-bg-elevated shadow-xl list-none p-0 m-0"
          >
            {filtered.map((s) => (
              <li key={s} role="option" aria-selected={false}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // evita que el input pierda el foco antes del click
                    handleSuggestion(s);
                  }}
                  className="w-full text-left px-4 py-2.5 text-base text-text-muted hover:text-text hover:bg-bg-surface transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <span className="text-green-400 mr-2 text-sm" aria-hidden="true">→</span>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

      <p className="mt-2 text-center text-sm text-text-muted/60">
        Busca en fuerzas armadas, estados, equipamiento y operativos
      </p>
    </div>
  );
}
