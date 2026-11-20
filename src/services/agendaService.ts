import type {
  Disponibilidad,
  DuracionTurno,
  ProfesionalParaReserva,
  ReservaCreada,
} from "../types/agenda";
import { obtenerFechaLocal } from "../utils/fechas";
import { Supabase } from "../utils/supabase";

const CAMPOS_DISPONIBILIDAD =
  "id_disponibilidad, id_profesional, fecha, hora_inicio, hora_fin, estado";
const DURACIONES_VALIDAS: DuracionTurno[] = [60, 120, 180];

type FilaProfesional = {
  id_profesional: number;
  nombre: string;
  ids_servicio: (number | string)[] | null;
  servicios: string[] | null;
};

type NuevaDisponibilidad = {
  id_profesional: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: "disponible";
};

function minutosDesdeHora(hora: string): number | null {
  const coincidencia = /^(\d{2}):(\d{2})/.exec(hora);
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

function generarTurnos(
  fecha: string,
  horaInicio: string,
  horaFin: string,
  duracion: DuracionTurno,
  idProfesional: number,
): NuevaDisponibilidad[] {
  if (fecha < obtenerFechaLocal()) {
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
    throw new Error("El rango debe dividirse exactamente en turnos de esa duración.");
  }

  const turnos: NuevaDisponibilidad[] = [];
  for (let cursor = inicio; cursor < fin; cursor += duracion) {
    turnos.push({
      id_profesional: idProfesional,
      fecha,
      hora_inicio: horaDesdeMinutos(cursor),
      hora_fin: horaDesdeMinutos(cursor + duracion),
      estado: "disponible",
    });
  }
  return turnos;
}

async function obtenerProfesionalActual() {
  const { data, error } = await Supabase.obtenerProfesionalActual();
  if (error || !data) {
    throw new Error("No se pudo cargar el perfil del profesional.");
  }
  return data;
}

export async function obtenerAgendaProfesional(): Promise<Disponibilidad[]> {
  const profesional = await obtenerProfesionalActual();
  const { data, error } = await Supabase.client
    .from("disponibilidad")
    .select(CAMPOS_DISPONIBILIDAD)
    .eq("id_profesional", profesional.id_profesional)
    .gte("fecha", obtenerFechaLocal())
    .order("fecha", { ascending: true })
    .order("hora_inicio", { ascending: true })
    .returns<Disponibilidad[]>();

  if (error) {
    throw new Error("No se pudo cargar tu agenda.");
  }
  return data;
}

export async function crearTurnosDisponibles({
  fecha,
  horaInicio,
  horaFin,
  duracion,
}: {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracion: DuracionTurno;
}): Promise<Disponibilidad[]> {
  const profesional = await obtenerProfesionalActual();
  const turnos = generarTurnos(
    fecha,
    horaInicio,
    horaFin,
    duracion,
    profesional.id_profesional,
  );
  const { data: existentes, error: errorExistentes } = await Supabase.client
    .from("disponibilidad")
    .select("hora_inicio, hora_fin")
    .eq("id_profesional", profesional.id_profesional)
    .eq("fecha", fecha)
    .returns<{ hora_inicio: string; hora_fin: string }[]>();

  if (errorExistentes) {
    throw new Error("No se pudo verificar si el horario ya está ocupado.");
  }

  const haySuperposicion = existentes.some((existente) => {
    const inicioExistente = minutosDesdeHora(existente.hora_inicio);
    const finExistente = minutosDesdeHora(existente.hora_fin);
    return turnos.some((turno) => {
      const inicioNuevo = minutosDesdeHora(turno.hora_inicio);
      const finNuevo = minutosDesdeHora(turno.hora_fin);
      return (
        inicioExistente !== null &&
        finExistente !== null &&
        inicioNuevo !== null &&
        finNuevo !== null &&
        inicioExistente < finNuevo &&
        finExistente > inicioNuevo
      );
    });
  });

  if (haySuperposicion) {
    throw new Error("Ese rango se superpone con otro horario de tu agenda.");
  }

  const { data, error } = await Supabase.client
    .from("disponibilidad")
    .insert(turnos)
    .select(CAMPOS_DISPONIBILIDAD)
    .returns<Disponibilidad[]>();

  if (error) {
    if (error.code === "23P01" || error.code === "23505") {
      throw new Error("Ese horario se superpone con otro de tu agenda.");
    }
    throw new Error("No se pudieron guardar los turnos disponibles.");
  }
  return data;
}

export async function eliminarTurnoDisponible(
  idDisponibilidad: number,
): Promise<void> {
  const { data, error } = await Supabase.client
    .from("disponibilidad")
    .delete()
    .eq("id_disponibilidad", idDisponibilidad)
    .eq("estado", "disponible")
    .select("id_disponibilidad")
    .maybeSingle();

  if (error) {
    throw new Error("No se pudo quitar el turno de tu agenda.");
  }
  if (!data) {
    throw new Error("Solo podés quitar turnos disponibles que todavía no se reservaron.");
  }
}

export async function obtenerProfesionalParaReserva(
  idProfesional: number,
): Promise<ProfesionalParaReserva | null> {
  const { data, error } = await Supabase.client
    .from("profesional_publico")
    .select("id_profesional, nombre, ids_servicio, servicios")
    .eq("id_profesional", idProfesional)
    .limit(1)
    .returns<FilaProfesional[]>();

  if (error) {
    throw new Error("No se pudo cargar el perfil del profesional.");
  }

  const profesional = data[0];
  if (!profesional) return null;
  return {
    ...profesional,
    ids_servicio: (profesional.ids_servicio ?? []).map(Number),
    servicios: profesional.servicios ?? [],
  };
}

export async function obtenerTurnosDisponibles(
  idProfesional: number,
): Promise<Disponibilidad[]> {
  const { data, error } = await Supabase.client
    .from("disponibilidad")
    .select(CAMPOS_DISPONIBILIDAD)
    .eq("id_profesional", idProfesional)
    .eq("estado", "disponible")
    .gte("fecha", obtenerFechaLocal())
    .order("fecha", { ascending: true })
    .order("hora_inicio", { ascending: true })
    .returns<Disponibilidad[]>();

  if (error) {
    throw new Error("No se pudieron cargar los turnos disponibles.");
  }

  const ahora = new Date();
  const horaActual = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;
  return data.filter(
    (turno) =>
      turno.fecha !== obtenerFechaLocal() || turno.hora_inicio.slice(0, 5) > horaActual,
  );
}

export async function crearReservaPendiente(
  reserva: {
    id_profesional: number;
    id_servicio: number;
    id_disponibilidad: number;
  },
): Promise<ReservaCreada> {
  const respuesta = await fetch("/api/reservas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(reserva),
  });

  const resultado = (await respuesta.json()) as
    | ReservaCreada
    | { error?: string };

  if (!respuesta.ok) {
    throw new Error(
      "error" in resultado && resultado.error
        ? resultado.error
        : "No se pudo enviar la solicitud de reserva.",
    );
  }

  if (
    !("id_reserva" in resultado) ||
    !Number.isInteger(resultado.id_reserva) ||
    resultado.estado !== "pendiente"
  ) {
    throw new Error("El servidor devolvió una respuesta de reserva inválida.");
  }

  return resultado;
}
