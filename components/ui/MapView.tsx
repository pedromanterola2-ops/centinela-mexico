"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Instalacion } from "@/types";
import { categoriaInstalacionLabel } from "@/lib/utils";

interface MapViewProps {
  instalaciones: Instalacion[];
  height?: string;
}

/** Color por categoría de instalación (consistente con el tema). */
const CATEGORIA_COLOR: Record<string, string> = {
  base_militar:        "#3d9e5e",
  zona_naval:          "#0ea5e9",
  aeropuerto_militar:  "#a78bfa",
  coordinacion_estatal:"#f59e0b",
  coordinacion_gn:     "#fb923c",   // naranja — GN diferenciada de coord. estatal
  c4_c5:               "#e2576b",
  academia:            "#2dd4bf",
  hospital_militar:    "#f472b6",
  astillero:           "#38bdf8",   // azul claro — instalación naval de industria
  proteccion_civil:    "#facc15",   // amarillo — alerta y emergencia
  industria_militar:   "#6b7280",   // gris oscuro — DGIM / fábrica
  otro:                "#94a3b8",
};

function colorDe(cat: string): string {
  return CATEGORIA_COLOR[cat] ?? CATEGORIA_COLOR.otro;
}

export function MapView({ instalaciones, height = "70vh" }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const mlRef = useRef<typeof import("maplibre-gl") | null>(null);
  const [ready, setReady] = useState(false);

  // Categorías presentes en los datos
  const categorias = useMemo(
    () => [...new Set(instalaciones.map((i) => i.categoria))],
    [instalaciones]
  );
  const estados = useMemo(
    () =>
      [...new Set(instalaciones.map((i) => i.estado).filter(Boolean))].sort(
        (a, b) => (a as string).localeCompare(b as string, "es")
      ) as string[],
    [instalaciones]
  );

  const [activas, setActivas] = useState<Set<string>>(new Set());
  const [estadoFiltro, setEstadoFiltro] = useState<string>("");
  const [query, setQuery] = useState("");
  const [seleccion, setSeleccion] = useState<Instalacion | null>(null);

  // Inicializa el set de categorías activas cuando llegan los datos
  useEffect(() => {
    setActivas(new Set(categorias));
  }, [categorias]);

  const filtradas = useMemo(
    () =>
      instalaciones.filter(
        (i) =>
          i.lat !== null &&
          i.lng !== null &&
          activas.has(i.categoria) &&
          (!estadoFiltro || i.estado === estadoFiltro) &&
          (!query ||
            i.nombre.toLowerCase().includes(query.toLowerCase()) ||
            (i.estado ?? "").toLowerCase().includes(query.toLowerCase()))
      ),
    [instalaciones, activas, estadoFiltro, query]
  );

  // Inicializa el mapa una sola vez (carga diferida de maplibre-gl)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !containerRef.current || mapRef.current) return;
      mlRef.current = maplibregl;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center: [-102, 23.5],
        zoom: 4.2,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        if (!cancelled) setReady(true);
      });
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // (Re)dibuja marcadores cuando cambian los filtros
  useEffect(() => {
    const maplibregl = mlRef.current;
    const map = mapRef.current;
    if (!ready || !maplibregl || !map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    for (const inst of filtradas) {
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", inst.nombre);
      el.style.cssText = `width:16px;height:16px;border-radius:9999px;border:2px solid #080d0b;background:${colorDe(
        inst.categoria
      )};cursor:pointer;box-shadow:0 0 0 1px rgba(255,255,255,.15);`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSeleccion(inst);
        map.flyTo({ center: [inst.lng as number, inst.lat as number], zoom: 7 });
      });
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([inst.lng as number, inst.lat as number])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [filtradas, ready]);

  function toggle(cat: string) {
    setActivas((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <div className="relative">
      {/* Controles */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar instalación o estado…"
            className="flex-1 min-w-[200px] rounded-lg border border-border bg-bg-surface px-3.5 py-2 text-sm text-text placeholder:text-text-muted focus:border-green-500/50 focus:outline-none"
            aria-label="Buscar instalación"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="rounded-lg border border-border bg-bg-surface px-3.5 py-2 text-sm text-text focus:border-green-500/50 focus:outline-none"
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            {estados.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles de capa por categoría */}
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => {
            const on = activas.has(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggle(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  on
                    ? "border-border bg-bg-elevated text-text"
                    : "border-border bg-bg-surface text-text-muted/50"
                }`}
                aria-pressed={on}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: on ? colorDe(cat) : "transparent", border: `1px solid ${colorDe(cat)}` }}
                />
                {categoriaInstalacionLabel(cat)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mapa + panel */}
      <div className="relative overflow-hidden rounded-lg border border-border">
        <div ref={containerRef} style={{ height }} className="w-full bg-bg-surface" />

        {/* Panel lateral de detalle */}
        {seleccion && (
          <div className="absolute top-0 right-0 h-full w-full sm:w-80 overflow-y-auto border-l border-border bg-bg-base/95 backdrop-blur-sm p-5">
            <button
              type="button"
              onClick={() => setSeleccion(null)}
              className="mb-3 text-xs text-text-muted hover:text-text"
              aria-label="Cerrar panel"
            >
              ✕ Cerrar
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ background: colorDe(seleccion.categoria) }}
              />
              <span className="text-[10px] uppercase tracking-wider text-text-muted">
                {categoriaInstalacionLabel(seleccion.categoria)}
              </span>
            </div>
            <h3 className="text-base font-semibold text-text mb-1">
              {seleccion.nombre}
            </h3>
            {seleccion.dependencia && (
              <p className="text-xs text-green-400 mb-3">{seleccion.dependencia}</p>
            )}
            <dl className="space-y-2 text-xs">
              {seleccion.estado && (
                <div>
                  <dt className="text-text-muted">Estado</dt>
                  <dd className="text-text">{seleccion.estado}</dd>
                </div>
              )}
              <div>
                <dt className="text-text-muted">Coordenadas (aprox.)</dt>
                <dd className="text-text font-mono">
                  {seleccion.lat?.toFixed(2)}, {seleccion.lng?.toFixed(2)}
                </dd>
              </div>
              {seleccion.descripcion && (
                <div>
                  <dt className="text-text-muted">Descripción</dt>
                  <dd className="text-text-muted leading-relaxed">
                    {seleccion.descripcion}
                  </dd>
                </div>
              )}
            </dl>
            {seleccion.pendiente_verificacion && (
              <p className="mt-3 inline-flex items-center gap-1 rounded-full border border-guinda-500/30 bg-guinda-500/10 px-2 py-0.5 text-[10px] text-guinda-300">
                Ubicación aproximada · en verificación
              </p>
            )}
            {seleccion.fuente_url && (
              <a
                href={seleccion.fuente_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-xs text-green-400 hover:underline font-mono break-all"
              >
                Fuente: {seleccion.fuente_url} →
              </a>
            )}
          </div>
        )}

        {/* Contador */}
        <div className="absolute bottom-2 left-2 rounded-md border border-border bg-bg-base/90 px-2.5 py-1 text-[11px] text-text-muted">
          {filtradas.length} instalación(es) en el mapa
        </div>
      </div>
    </div>
  );
}
