import type {
  AccionRespuestaReserva,
  EstadoMatricula,
  Reserva,
} from "../types/reserva";

/**
 * La sesión vive en cookies HttpOnly; el backend consulta Supabase con el
 * token validado y RLS limita la respuesta al cliente o profesional actual.
 */
export async function obtenerReservas(): Promise<Reserva[]> {
  const respuesta = await fetch("/api/reservas", {
    credentials: "same-origin",
    cache: "no-store",
  });
  const resultado = (await respuesta.json()) as
    | { reservas?: Reserva[]; error?: string };

  if (!respuesta.ok) {
    throw new Error(resultado.error ?? "No se pudieron cargar las reservas.");
  }

  if (!Array.isArray(resultado.reservas)) {
    throw new Error("El servidor devolvió una respuesta de reservas inválida.");
  }

  return resultado.reservas;
}

async function gestionarReserva(
  datos:
    | {
        accion: "modificar";
        id_reserva: number;
        id_disponibilidad: number;
        descripcion_trabajo: string;
      }
    | { accion: "cancelar"; id_reserva: number }
    | { accion: AccionRespuestaReserva; id_reserva: number },
): Promise<void> {
  const respuesta = await fetch("/api/reservas", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(datos),
  });
  const resultado = (await respuesta.json()) as {
    ok?: boolean;
    error?: string;
  };

  if (!respuesta.ok) {
    throw new Error(resultado.error ?? "No se pudo actualizar la reserva.");
  }
  if (!resultado.ok) {
    throw new Error("El servidor no confirmó el cambio de la reserva.");
  }
}

export function modificarReserva(
  idReserva: number,
  idDisponibilidad: number,
  descripcionTrabajo: string,
): Promise<void> {
  return gestionarReserva({
    accion: "modificar",
    id_reserva: idReserva,
    id_disponibilidad: idDisponibilidad,
    descripcion_trabajo: descripcionTrabajo,
  });
}

export function cancelarReserva(idReserva: number): Promise<void> {
  return gestionarReserva({ accion: "cancelar", id_reserva: idReserva });
}

export function responderReserva(
  idReserva: number,
  accion: AccionRespuestaReserva,
): Promise<void> {
  return gestionarReserva({ accion, id_reserva: idReserva });
}

/**
 * Estado de la mejor matrícula del profesional autenticado (RN-05):
 * una verificada gana sobre el resto; `null` si no cargó ninguna.
 */
export async function obtenerEstadoMatricula(): Promise<EstadoMatricula | null> {
  const respuesta = await fetch("/api/matricula", {
    credentials: "same-origin",
    cache: "no-store",
  });
  const resultado = (await respuesta.json()) as
    | { estado: EstadoMatricula | null; error?: string }
    | { error: string };

  if (!respuesta.ok) {
    throw new Error(resultado.error ?? "No se pudo cargar la matrícula.");
  }

  if (!("estado" in resultado)) {
    throw new Error("El servidor devolvió una respuesta de matrícula inválida.");
  }

  return resultado.estado;
}
