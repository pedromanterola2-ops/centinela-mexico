import { fuentesIngeribles, type Fuente } from "@/lib/fuentes";

/**
 * Ingestor ligero de feeds RSS 2.0 / Atom para la sección Actualidad.
 *
 * - Sin dependencias externas: parseo por extracción de etiquetas.
 * - Cada feed se obtiene con caché incremental de Next (revalidate) y un
 *   timeout corto; los fallos se aíslan por fuente (allSettled) para que una
 *   fuente caída nunca rompa la página.
 * - Solo se ingieren fuentes marcadas con ingesta "activa" en seed/fuentes.json.
 */

export interface ItemActualidad {
  id: string;
  titulo: string;
  url: string | null;
  /** Fecha en formato YYYY-MM-DD (compatible con formatFecha). */
  fecha: string | null;
  resumen: string | null;
  fuente: string;
  fuenteSlug: string;
  tier: "especializada";
  tipo: Fuente["tipo"];
  pais: string;
  prioridad: boolean;
}

const REVALIDATE_SECONDS = 1800; // 30 min
const TIMEOUT_MS = 8000;
const PER_SOURCE = 6;

/**
 * Filtro de relevancia a México (alta precisión). Solo se conservan los items
 * de fuentes especializadas que mencionan a México o a sus instituciones/estados
 * de seguridad. Una fuente sin coincidencias simplemente no aporta items y se
 * oculta de la sección.
 */
const ES_MEXICO =
  /m[eé]xic|mexican[oa]s?|sedena|\bsemar\b|sheinbaum|\bcdmx\b|cenapred|\bcjng\b|michoac[aá]n|sinaloa|tamaulipas|\bchiapas\b|\boaxaca\b|\bjalisco\b|guardia nacional|ej[eé]rcito mexicano|fuerza a[eé]rea mexicana|armada de m[eé]xico/i;

/** Decodifica el cuerpo respetando el charset declarado (header o prólogo XML). */
function decodeBuffer(buf: ArrayBuffer, contentType: string | null): string {
  const bytes = new Uint8Array(buf);
  // Prólogo en ASCII para leer la declaración de codificación.
  const head = new TextDecoder("ascii").decode(bytes.subarray(0, 200));
  let charset =
    (contentType?.match(/charset=([\w-]+)/i)?.[1] ??
      head.match(/encoding=["']([\w-]+)["']/i)?.[1] ??
      "utf-8").toLowerCase();
  if (charset === "latin1" || charset === "iso8859-1") charset = "iso-8859-1";
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : null;
}

function toYMD(raw: string | null): string | null {
  if (!raw) return null;
  const d = new Date(raw.trim());
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function truncate(s: string | null, n = 220): string | null {
  if (!s) return null;
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function parseFeed(xml: string, f: Fuente): ItemActualidad[] {
  const isAtom = /<feed[\s>]/i.test(xml) && /<entry[\s>]/i.test(xml);
  const blocks = isAtom
    ? xml.split(/<entry[\s>]/i).slice(1).map((b) => "<entry " + b.split(/<\/entry>/i)[0] + "</entry>")
    : xml.split(/<item[\s>]/i).slice(1).map((b) => "<item " + b.split(/<\/item>/i)[0] + "</item>");

  const items: ItemActualidad[] = [];
  for (const block of blocks) {
    if (items.length >= PER_SOURCE) break;
    const titulo = decode(tag(block, "title") ?? "");
    if (!titulo) continue;

    const resumenRaw0 = isAtom
      ? tag(block, "media:description") ?? tag(block, "summary") ?? tag(block, "content")
      : tag(block, "description") ?? tag(block, "content:encoded");
    const resumenFull = decode(resumenRaw0 ?? "");

    // Filtro de relevancia a México sobre título + resumen completo.
    if (!ES_MEXICO.test(`${titulo} ${resumenFull}`)) continue;

    let url: string | null = null;
    if (isAtom) {
      const linkAlt =
        block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) ||
        block.match(/<link[^>]*href=["']([^"']+)["']/i);
      url = linkAlt ? linkAlt[1] : null;
    } else {
      url = decode(tag(block, "link") ?? "") || null;
    }

    const fechaRaw = isAtom
      ? tag(block, "published") ?? tag(block, "updated")
      : tag(block, "pubDate") ?? tag(block, "dc:date");

    items.push({
      id: `${f.slug}:${url ?? titulo}`,
      titulo,
      url,
      fecha: toYMD(fechaRaw),
      resumen: truncate(resumenFull) || null,
      fuente: f.nombre,
      fuenteSlug: f.slug,
      tier: "especializada",
      tipo: f.tipo,
      pais: f.pais,
      prioridad: f.prioridad,
    });
  }
  return items;
}

async function fetchFeed(f: Fuente): Promise<ItemActualidad[]> {
  if (!f.rss_url) return [];
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(f.rss_url, {
      signal: ctrl.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; CentinelaMexicoBot/1.0; +https://centinela-mexico.vercel.app)",
        accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const buf = await res.arrayBuffer();
    const xml = decodeBuffer(buf, res.headers.get("content-type"));
    return parseFeed(xml, f);
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

/**
 * Obtiene los items de todas las fuentes especializadas con ingesta activa.
 * Las fuentes prioritarias se ordenan primero a igualdad de fecha.
 */
export async function getItemsEspecializados(): Promise<ItemActualidad[]> {
  const settled = await Promise.allSettled(fuentesIngeribles().map(fetchFeed));
  const all = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  return all.sort((a, b) => {
    const fa = a.fecha ?? "";
    const fb = b.fecha ?? "";
    if (fa !== fb) return fb.localeCompare(fa); // más reciente primero
    if (a.prioridad !== b.prioridad) return a.prioridad ? -1 : 1; // prioridad antes
    return a.fuente.localeCompare(b.fuente);
  });
}
