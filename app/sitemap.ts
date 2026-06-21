import type { MetadataRoute } from "next";
import {
  getAllFuerzasArmadas,
  getAllEstados,
  getAllEquipamiento,
  getAllOperativos,
} from "@/lib/queries";

const BASE_URL = "https://centinelamex.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [fuerzas, estados, equipamiento, operativos] = await Promise.all([
    getAllFuerzasArmadas(),
    getAllEstados(),
    getAllEquipamiento(),
    getAllOperativos(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/fuerzas-armadas`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE_URL}/estados`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE_URL}/comparador`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/equipamiento`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/operativos`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/proteccion-civil`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/actualidad`, priority: 0.8, changeFrequency: "daily" },
    { url: `${BASE_URL}/mapa`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/glosario`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/acerca-de`, priority: 0.5, changeFrequency: "yearly" },
  ];

  const fuerzaRoutes: MetadataRoute.Sitemap = fuerzas.map((f) => ({
    url: `${BASE_URL}/fuerzas-armadas/${f.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const estadoRoutes: MetadataRoute.Sitemap = estados.map((e) => ({
    url: `${BASE_URL}/estados/${e.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const equipamientoRoutes: MetadataRoute.Sitemap = equipamiento.map((e) => ({
    url: `${BASE_URL}/equipamiento/${e.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const operativoRoutes: MetadataRoute.Sitemap = operativos.map((o) => ({
    url: `${BASE_URL}/operativos/${o.slug}`,
    priority: 0.6,
    changeFrequency: "yearly" as const,
  }));

  return [
    ...staticRoutes,
    ...fuerzaRoutes,
    ...estadoRoutes,
    ...equipamientoRoutes,
    ...operativoRoutes,
  ];
}
