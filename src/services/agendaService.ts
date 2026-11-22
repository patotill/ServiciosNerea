import type {
  Disponibilidad,
  DuracionTurno,
  ProfesionalParaReserva,
  ReservaCreada,
} from "../types/agenda";
import { generarTurnosDisponibles } from "../utils/agendaTurnos";
import { obtenerFechaLocal } from "../utils/fechas";
import { Supabase } from "../utils/supabase";

const CAMPOS_DISPONIBILIDAD =
  "id_disponibilidad, id_profesional, fecha, hora_inicio, hora_fin, estado, retirada";

type FilaProfesional = {
  id_profesional: number;
  nombre: string;
  ids_servicio: (number | string)[] | null;
  servicios: string[] | null;
};

export async function obtenerAgendaProfesional(): Promise<Disponibilidad[]> {
  const respuesta = await fetch("/api/agenda", {
    credentials: "same-origin",
    cache: "no-store",
  });
  const resultado = (await respuesta.json()) as {
    turnos?: Disponibilidad[];
    error?: string;
  };

  if (!respuesta.ok) {
    throw new Error(resultado.error ?? "No se pudo cargar tu agenda.");
  }
  if (!Array.isArray(resultado.turnos)) {
    throw new Error("El servidor devolvió una respuesta de agenda inválida.");
  }
  return resultado.turnos;
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
  const turnos = generarTurnosDisponibles(
    fecha,
    horaInicio,
    horaFin,
    duracion,
  );
  const primera = turnos[0];
  const ultima = turnos[turnos.length - 1];
  const respuesta = await fetch("/api/agenda", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      fecha: primera.fecha,
      horaInicio: primera.hora_inicio,
      horaFin: ultima.hora_fin,
      duracion,
    }),
  });
  const resultado = (await respuesta.json()) as {
    turnos?: Disponibilidad[];
    error?: string;
  };

  if (!respuesta.ok) {
    throw new Error(
      resultado.error ?? "No se pudieron guardar los turnos disponibles.",
    );
  }
  if (!Array.isArray(resultado.turnos)) {
    throw new Error("El servidor devolvió una respuesta de agenda inválida.");
  }
  return resultado.turnos;
}

export async function eliminarTurnoDisponible(
  idDisponibilidad: number,
): Promise<void> {
  const respuesta = await fetch("/api/agenda", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ id_disponibilidad: idDisponibilidad }),
  });
  const resultado = (await respuesta.json()) as {
    ok?: boolean;
    error?: string;
  };

  if (!respuesta.ok) {
    throw new Error(
      resultado.error ?? "No se pudo quitar el turno de tu agenda.",
    );
  }
  if (!resultado.ok) {
    throw new Error("El servidor no confirmó que se quitó el turno.");
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
    .eq("retirada", false)
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
    descripcion_trabajo: string | null;
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
