import { PrideRaw, ComisionPride } from "../types/pride";

// MongoDB → Frontend (camelCase)
export function mapToPride(item: PrideRaw): ComisionPride {
  const id =
    typeof item._id === "object" ? item._id?.$oid : (item._id as string);

  return {
    _id: id,
    numero: item["Número"] ?? item.numero,
    entidad: item["Entidad"] ?? item.entidad ?? "",
    fuenteDeDesignacion:
      item["Fuente de Designación"] ?? item.fuenteDeDesignacion ?? "",
    tipoDeMiembro: item["Tipo de Miembro"] ?? item.tipoDeMiembro ?? "",
    miembro: item["Miembro"] ?? item.miembro ?? "",
    adscripcion: item["Adscripción"] ?? item.adscripcion ?? "",
    categoriaYNivel: item["Categoría y nivel"] ?? item.categoriaYNivel ?? "",
    periodo: item["Periodo"] ?? item.periodo ?? "",
    inicio: item["Inicio"] ?? item.inicio ?? "",
    termino: item["Término"] ?? item.termino ?? "",
    permanencia: item["Permanencia"] ?? item.permanencia ?? "",
    observaciones: item["Observaciones"] ?? item.observaciones ?? "",
    preferenciasDeAreasCAAHyA:
      item["Preferencias de áreas CAAHyA"] ??
      item.preferenciasDeAreasCAAHyA ??
      "",
    ultimaModificacion:
      item["Última modificación a la base"] ?? item.ultimaModificacion ?? "",
    miembroAnterior: item["Miembro anterior"] ?? item.miembroAnterior ?? "",
  };
}

// Frontend (camelCase) → MongoDB (claves originales en español)
export function mapToRaw(
  item: Partial<ComisionPride>,
): Record<string, unknown> {
  return {
    Número: item.numero,
    Entidad: item.entidad,
    "Fuente de Designación": item.fuenteDeDesignacion,
    "Tipo de Miembro": item.tipoDeMiembro,
    Miembro: item.miembro,
    Adscripción: item.adscripcion,
    "Categoría y nivel": item.categoriaYNivel,
    Periodo: item.periodo,
    Inicio: item.inicio,
    Término: item.termino,
    Permanencia: item.permanencia,
    Observaciones: item.observaciones,
    "Preferencias de áreas CAAHyA": item.preferenciasDeAreasCAAHyA,
    "Última modificación a la base": item.ultimaModificacion,
    "Miembro anterior": item.miembroAnterior,
  };
}
