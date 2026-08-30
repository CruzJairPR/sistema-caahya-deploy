export type NivelUrgencia = "vencido" | "critico" | "advertencia" | "normal";

export const calcularUrgenciaPorFechas = (
  fechaTerminoStr?: string | Date,
): NivelUrgencia => {
  if (!fechaTerminoStr) return "normal";

  const hoy = new Date();
  const termino = new Date(fechaTerminoStr);

  if (isNaN(termino.getTime())) return "normal";

  // Obtenemos la diferencia en milisegundos y la convertimos directamente a días
  const diffTime = termino.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = diffDays / 30;

  if (diffDays < 0) {
    return "vencido";
  }

  // 3 meses o menos (~90 días) -> Rojo (crítico)
  if (diffMonths <= 3) {
    return "critico";
  }

  // 6 meses o menos (~180 días) -> Amarillo (advertencia)
  if (diffMonths <= 6) {
    return "advertencia";
  }

  return "normal";
};
