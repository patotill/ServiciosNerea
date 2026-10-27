import type { EstadoMatricula, Reserva } from "../types/reserva";
import { Supabase } from "../utils/supabase";

const CAMPOS_RESERVA =
  "id_reserva, tipo_reserva, descripcion_trabajo, estado, fecha_creacion, servicio_categoria(nombre), disponibilidad(fecha, hora_inicio, hora_fin)";

/**
 * Las policies de RLS de `reserva` ya limitan el resultado a las reservas
 * del cliente o del profesional autenticado.
 */
export async function obtenerReservas(): Promise<Reserva[]> {
  const { data, error } = await Supabase.client
    .from("reserva")
    .select(CAMPOS_RESERVA)
    .order("fecha_creacion", { ascending: false })
    .returns<Reserva[]>();

  if (error) {
    throw new Error("No se pudieron cargar las reservas.");
  }

  return data;
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
