import type { EstadoMatricula, Reserva } from "../types/reserva";

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
