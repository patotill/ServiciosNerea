import type { EstadoMatricula, Reserva } from "../types/reserva";
import { Supabase } from "../utils/supabase";

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
  const { data: profesional, error: errorProfesional } =
    await Supabase.obtenerProfesionalActual();

  if (errorProfesional || !profesional) {
    throw new Error("No se pudo cargar el perfil del profesional.");
  }

  const { data, error } = await Supabase.client
    .from("matricula")
    .select("estado_verificacion")
    .eq("id_profesional", profesional.id_profesional)
    .returns<{ estado_verificacion: EstadoMatricula }[]>();

  if (error) {
    throw new Error("No se pudo cargar la matrícula.");
  }

  const estados = data.map((m) => m.estado_verificacion);
  if (estados.includes("verificada")) return "verificada";
  return estados[0] ?? null;
}
