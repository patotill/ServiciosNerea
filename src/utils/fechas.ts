// `fecha` llega como "YYYY-MM-DD" y `hora` como "HH:MM:SS".
export function obtenerFechaLocal(): string {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

export function esFechaHoraFutura(fecha: string, hora: string): boolean {
  const zonaHoraria = "America/Argentina/Buenos_Aires";
  const fechaActual = new Intl.DateTimeFormat("en", {
    timeZone: zonaHoraria,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const valor = (tipo: string) =>
    fechaActual.find((parte) => parte.type === tipo)?.value ?? "";
  const hoy = `${valor("year")}-${valor("month")}-${valor("day")}`;

  if (fecha !== hoy) return fecha > hoy;

  const horaActual = new Intl.DateTimeFormat("en-GB", {
    timeZone: zonaHoraria,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
  return hora.slice(0, 5) > horaActual;
}

export function formatearFranja(
  fecha: string,
  horaInicio: string,
  horaFin: string,
): string {
  const dia = new Date(`${fecha}T00:00`).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${dia} · ${horaInicio.slice(0, 5)} a ${horaFin.slice(0, 5)}`;
}

// `fechaIso` llega como timestamp ISO (p. ej. `created_at`).
export function formatearFechaAlta(fechaIso: string): string {
  return new Date(fechaIso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
