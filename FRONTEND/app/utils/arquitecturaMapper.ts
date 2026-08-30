import { ArquitecturaRaw, MiembroArquitectura } from "../types/arquitectura";

export function mapToArquitectura(item: ArquitecturaRaw): MiembroArquitectura {
  // Encontrar dinámicamente cualquier variante de la llave nombramiento
  const llaveNombramiento = Object.keys(item).find((k) =>
    k.toUpperCase().includes("NOMBRAMIENTO"),
  );
  const valorNombramiento = llaveNombramiento
    ? String(item[llaveNombramiento])
    : "";

  return {
    _id: item._id,
    persona: item["PERSONA"] || item["persona"] || "",
    nombramiento: valorNombramiento || "",
    carrera: item["CARRERA"] || item["carrera"] || "",
    facultad: item["FACU"] || item["facu"] || "",
    correo:
      item["CORREO ELECTRÓNICO"] || item["correo"] || "Sin correo especificado",
  };
}

export function mapToRaw(
  item: Partial<MiembroArquitectura>,
): Record<string, unknown> {
  return {
    _id: item._id,
    persona: item.persona,
    appointment: item.appointment,
    carrera: item.carrera,
    facu: item.facultad,
    correo: item.correo,
  };
}
