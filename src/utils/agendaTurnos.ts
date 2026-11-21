import type { DuracionTurno } from "../types/agenda";

export type TurnoDisponible = {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
};

const DURACIONES_VALIDAS: DuracionTurno[] = [60, 120, 180];

export function obtenerFechaActualArgentina(): string {
  const partes = new Intl.DateTimeFormat("en", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const parte = (tipo: string) =>
    partes.find((item) => item.type === tipo)?.value ?? "";

  return `${parte("year")}-${parte("month")}-${parte("day")}`;
}

function minutosDesdeHora(hora: string): number | null {
  const coincidencia = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!coincidencia) return null;

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  if (horas > 23 || minutos > 59) return null;
  return horas * 60 + minutos;
}

function horaDesdeMinutos(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return `${String(horas).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

function fechaValida(fecha: string): boolean {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!partes) return false;

  const año = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const fechaUtc = new Date(Date.UTC(año, mes - 1, dia));
  return (
    fechaUtc.getUTCFullYear() === año &&
    fechaUtc.getUTCMonth() === mes - 1 &&
    fechaUtc.getUTCDate() === dia
  );
}

export function generarTurnosDisponibles(
  fecha: string,
  horaInicio: string,
  horaFin: string,
  duracion: DuracionTurno,
): TurnoDisponible[] {
  if (!fechaValida(fecha)) {
    throw new Error("Elegí una fecha válida.");
  }
  if (fecha < obtenerFechaActualArgentina()) {
    throw new Error("Elegí una fecha de hoy en adelante.");
  }
  if (!DURACIONES_VALIDAS.includes(duracion)) {
    throw new Error("La duración debe ser de 1, 2 o 3 horas.");
  }

  const inicio = minutosDesdeHora(horaInicio);
  const fin = minutosDesdeHora(horaFin);
  if (inicio === null || fin === null || fin <= inicio) {
    throw new Error("La hora de fin debe ser posterior a la hora de inicio.");
  }
  if ((fin - inicio) % duracion !== 0) {
    throw new Error(
      "El rango debe dividirse exactamente en turnos de esa duración.",
    );
  }

  const turnos: TurnoDisponible[] = [];
  for (let cursor = inicio; cursor < fin; cursor += duracion) {
    turnos.push({
      fecha,
      hora_inicio: horaDesdeMinutos(cursor),
      hora_fin: horaDesdeMinutos(cursor + duracion),
    });
  }
  return turnos;
}
