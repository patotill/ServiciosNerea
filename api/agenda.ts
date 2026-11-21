import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { DuracionTurno, Disponibilidad } from "../src/types/agenda.js";
import {
  generarTurnosDisponibles,
  obtenerFechaActualArgentina,
} from "../src/utils/agendaTurnos.js";
import { crearClienteSupabaseServidor } from "./_lib/supabase.js";
import { obtenerSesion } from "./_lib/sesion.js";

const CAMPOS_DISPONIBILIDAD =
  "id_disponibilidad, id_profesional, fecha, hora_inicio, hora_fin, estado, retirada";

type DatosAgenda = {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracion: DuracionTurno;
};

function enteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isSafeInteger(valor) && valor > 0;
}

function esquemaAgendaDesactualizado(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }
  return error.code === "42703" || error.code === "PGRST204";
}

function respuestaEsquemaDesactualizado(res: VercelResponse) {
  return res.status(503).json({
    error:
      "Falta actualizar la base de datos. Aplicá la versión actualizada de supabase/agenda_turnos.sql.",
  });
}

function datosAgenda(body: unknown): DatosAgenda | null {
  if (typeof body !== "object" || body === null) return null;

  const valores = body as Record<string, unknown>;
  const { fecha, horaInicio, horaFin, duracion } = valores;
  if (
    typeof fecha !== "string" ||
    typeof horaInicio !== "string" ||
    typeof horaFin !== "string" ||
    (duracion !== 60 && duracion !== 120 && duracion !== 180)
  ) {
    return null;
  }

  return { fecha, horaInicio, horaFin, duracion };
}

function mismoOrigen(req: VercelRequest): boolean {
  const origen = req.headers.origin;
  const host = req.headers.host;
  if (!origen || !host) return false;

  try {
    return new URL(origen).host === host;
  } catch {
    return false;
  }
}

async function obtenerProfesional(
  req: VercelRequest,
  res: VercelResponse,
) {
  const sesion = await obtenerSesion(req, res);
  if (!sesion) {
    res.status(401).json({ error: "Iniciá sesión para administrar tu agenda." });
    return null;
  }

  const supabase = crearClienteSupabaseServidor(sesion.accessToken);
  const { data: usuario, error: errorUsuario } = await supabase
    .from("usuario")
    .select("rol, activo")
    .eq("id_usuario", sesion.idUsuario)
    .maybeSingle();

  if (errorUsuario) throw errorUsuario;
  if (!usuario || usuario.rol !== "profesional" || !usuario.activo) {
    res.status(403).json({
      error: "Necesitás una cuenta profesional activa para administrar la agenda.",
    });
    return null;
  }

  const { data: profesional, error: errorProfesional } = await supabase
    .from("profesional")
    .select("id_profesional")
    .eq("id_usuario", sesion.idUsuario)
    .maybeSingle();

  if (errorProfesional) throw errorProfesional;
  if (!profesional) {
    res.status(404).json({ error: "No se encontró el perfil del profesional." });
    return null;
  }

  return { supabase, idProfesional: profesional.id_profesional };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const profesional = await obtenerProfesional(req, res);
      if (!profesional) return;

      const { data, error } = await profesional.supabase
        .from("disponibilidad")
        .select(CAMPOS_DISPONIBILIDAD)
        .eq("id_profesional", profesional.idProfesional)
        .eq("retirada", false)
        .gte("fecha", obtenerFechaActualArgentina())
        .order("fecha", { ascending: true })
        .order("hora_inicio", { ascending: true })
        .returns<Disponibilidad[]>();

      if (error) throw error;
      return res.status(200).json({ turnos: data });
    } catch (error) {
      console.error("Error al consultar agenda profesional:", error);
      if (esquemaAgendaDesactualizado(error)) {
        return respuestaEsquemaDesactualizado(res);
      }
      return res.status(500).json({ error: "No se pudo cargar tu agenda." });
    }
  }

  if (req.method !== "POST" && req.method !== "DELETE") {
    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Método no permitido." });
  }

  if (!mismoOrigen(req)) {
    return res.status(403).json({ error: "Origen de solicitud no permitido." });
  }

  if (req.method === "POST") {
    const datos = datosAgenda(req.body);
    if (!datos) {
      return res.status(400).json({ error: "Los datos del horario son inválidos." });
    }

    let turnos: ReturnType<typeof generarTurnosDisponibles>;
    try {
      turnos = generarTurnosDisponibles(
        datos.fecha,
        datos.horaInicio,
        datos.horaFin,
        datos.duracion,
      );
    } catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron validar los horarios.",
      });
    }

    try {
      const profesional = await obtenerProfesional(req, res);
      if (!profesional) return;

      const { data, error } = await profesional.supabase
        .from("disponibilidad")
        .insert(
          turnos.map((turno) => ({
            ...turno,
            id_profesional: profesional.idProfesional,
            estado: "disponible",
          })),
        )
        .select(CAMPOS_DISPONIBILIDAD)
        .returns<Disponibilidad[]>();

      if (error?.code === "23P01" || error?.code === "23505") {
        return res.status(409).json({
          error: "Ese horario se superpone con otro de tu agenda.",
        });
      }
      if (error?.code === "42501") {
        return res.status(403).json({
          error: "Supabase no permitió guardar esos horarios. Revisá las políticas de disponibilidad.",
        });
      }
      if (esquemaAgendaDesactualizado(error)) {
        return respuestaEsquemaDesactualizado(res);
      }
      if (error) throw error;

      return res.status(201).json({ turnos: data });
    } catch (error) {
      console.error("Error al guardar agenda profesional:", error);
      return res.status(500).json({
        error: "No se pudieron guardar los turnos disponibles.",
      });
    }
  }

  const valores = req.body as Record<string, unknown> | null;
  const idDisponibilidad = valores?.id_disponibilidad;
  if (!enteroPositivo(idDisponibilidad)) {
    return res.status(400).json({ error: "El turno indicado no es válido." });
  }

  try {
    const profesional = await obtenerProfesional(req, res);
    if (!profesional) return;

    const { data, error } = await profesional.supabase
      .from("disponibilidad")
      .update({ retirada: true })
      .eq("id_disponibilidad", idDisponibilidad)
      .eq("id_profesional", profesional.idProfesional)
      .eq("estado", "disponible")
      .eq("retirada", false)
      .select("id_disponibilidad")
      .maybeSingle();

    if (error?.code === "42501") {
      return res.status(403).json({
        error:
          "Supabase no permitió quitar el horario. Aplicá la versión actualizada de supabase/agenda_turnos.sql.",
      });
    }
    if (esquemaAgendaDesactualizado(error)) {
      return respuestaEsquemaDesactualizado(res);
    }
    if (error?.code === "23503") {
      return res.status(409).json({
        error:
          "El horario está asociado a una reserva histórica y no se puede borrar físicamente.",
      });
    }
    if (error) throw error;
    if (!data) {
      return res.status(404).json({
        error: "El turno ya no está disponible o ya fue quitado de tu agenda.",
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error al quitar turno de agenda:", error);
    return res.status(500).json({ error: "No se pudo quitar el turno de tu agenda." });
  }
}
