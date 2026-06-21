import { getAllEstados, getAllInstalaciones } from "@/lib/queries";
import type { EstadoPresencia } from "@/components/ui/PresenceMap";

/**
 * Construye el índice de "presencia institucional documentada" por entidad.
 *
 * Score compuesto, todo proveniente de fuentes oficiales de acceso público:
 *   1  base — toda entidad tiene mando territorial militar (zona/región militar, SEDENA/DOF)
 *  +1  si tiene presencia naval (litoral, SEMAR)
 *  +N  instalaciones indexadas en la entidad (con fuente)
 *
 * No es una medida de intensidad operativa ni de capacidad de fuerza: sólo
 * cuántos elementos institucionales están documentados en esta base por estado.
 */
export async function getPresenciaPorEntidad(): Promise<EstadoPresencia[]> {
  const [estados, instalaciones] = await Promise.all([
    getAllEstados(),
    getAllInstalaciones(),
  ]);

  const countByEstado = new Map<string, number>();
  for (const i of instalaciones) {
    if (!i.estado) continue;
    countByEstado.set(i.estado, (countByEstado.get(i.estado) ?? 0) + 1);
  }

  return estados.map((e) => {
    const inst = countByEstado.get(e.nombre) ?? 0;
    const score = 1 + (e.presencia_naval ? 1 : 0) + inst;
    return {
      slug: e.slug,
      nombre: e.nombre,
      score,
      instalaciones: inst,
      zonaMilitar: e.zona_militar,
      regionMilitar: e.region_militar,
      presenciaNaval: e.presencia_naval,
      pendiente: e.pendiente_verificacion,
    };
  });
}
