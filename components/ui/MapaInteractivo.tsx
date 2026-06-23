"use client";

/**
 * MapaInteractivo — Leaflet + OpenStreetMap
 *
 * Muestra las instalaciones indexadas (academias, bases, zonas navales, etc.)
 * como marcadores sobre un mapa real de México.
 *
 * Decisión de diseño: se muestran solo instalaciones con fuente oficial
 * confirmada y coordenadas aproximadas de dominio público. No se incluyen
 * ubicaciones precisas de instalaciones operativas sensibles.
 *
 * Nota Next.js: este componente se importa siempre con `{ ssr: false }` para
 * evitar errores de `window` / `document` durante el render del servidor.
 */

import { useEffect, useRef } from "react";
import type { Instalacion } from "@/types";
import { categoriaInstalacionLabel } from "@/lib/utils";

// Colores por dependencia (accent neutros, no agresivos)
const COLOR_DEP: Record<string, string> = {
  SEDENA: "#4ade80",       // verde militar
  SEMAR: "#38bdf8",        // azul marino
  "Fuerza Aérea Mexicana": "#a78bfa", // violeta
  "Guardia Nacional": "#fb923c",       // naranja
  "CENAPRED / SSPC": "#facc15",       // amarillo
};
const COLOR_DEFAULT = "#94a3b8"; // gris

function colorParaDep(dep: string | null): string {
  if (!dep) return COLOR_DEFAULT;
  return COLOR_DEP[dep] ?? COLOR_DEFAULT;
}

// SVG de marcador personalizado (círculo con borde)
function iconSvg(color: string): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="24" height="32">
      <circle cx="12" cy="12" r="9" fill="${color}" fill-opacity="0.9" stroke="#1a1a1a" stroke-width="1.5"/>
      <line x1="12" y1="21" x2="12" y2="31" stroke="${color}" stroke-width="2" stroke-opacity="0.7"/>
    </svg>
  `.trim();
}

export interface MapaInteractivoProps {
  instalaciones: Instalacion[];
  height?: string;
}

export function MapaInteractivo({
  instalaciones,
  height = "500px",
}: MapaInteractivoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Importación dinámica dentro del useEffect (solo cliente)
    import("leaflet").then((L) => {
      // Eliminar CSS duplicado si ya existe
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!containerRef.current || mapRef.current) return;

      // Centro aproximado de México
      const map = L.map(containerRef.current, {
        center: [23.6, -102.5],
        zoom: 5,
        scrollWheelZoom: true,
      });

      // Tiles OpenStreetMap (gratuito)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Marcadores
      instalaciones
        .filter((i) => i.lat !== null && i.lng !== null)
        .forEach((inst) => {
          const color = colorParaDep(inst.dependencia);

          const icon = L.divIcon({
            html: iconSvg(color),
            className: "",
            iconSize: [24, 32],
            iconAnchor: [12, 31],
            popupAnchor: [0, -30],
          });

          const popup = `
            <div style="font-family:system-ui,sans-serif;min-width:200px;max-width:260px">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#f1f5f9">${inst.nombre}</p>
              <p style="margin:0 0 2px;font-size:11px;color:#94a3b8">${categoriaInstalacionLabel(inst.categoria)}</p>
              ${inst.dependencia ? `<p style="margin:0 0 6px;font-size:11px;color:${color}">${inst.dependencia}</p>` : ""}
              ${inst.estado ? `<p style="margin:0 0 6px;font-size:11px;color:#64748b">${inst.estado}</p>` : ""}
              <a href="/instalaciones/${inst.id}"
                 style="font-size:12px;color:#4ade80;text-decoration:none"
                 target="_self">
                Ver ficha →
              </a>
            </div>
          `;

          L.marker([inst.lat!, inst.lng!], { icon })
            .bindPopup(popup, {
              className: "centinela-popup",
              maxWidth: 280,
            })
            .addTo(map);
        });

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  }, [instalaciones]);

  return (
    <>
      {/* CSS global del popup (oscuro para el tema del sitio) */}
      <style>{`
        .centinela-popup .leaflet-popup-content-wrapper {
          background: #1e2433;
          border: 1px solid #334155;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.6);
          padding: 0;
        }
        .centinela-popup .leaflet-popup-content {
          margin: 12px 14px;
        }
        .centinela-popup .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          font-size: 18px !important;
          top: 6px !important;
          right: 8px !important;
        }
        .leaflet-container {
          background: #0f172a;
          border-radius: 8px;
        }
      `}</style>
      <div ref={containerRef} style={{ height, width: "100%" }} />
    </>
  );
}
