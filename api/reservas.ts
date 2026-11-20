import type { VercelRequest, VercelResponse } from "@vercel/node";
import { crearClienteSupabaseServidor } from "./_lib/supabase.js";
import { obtenerSesion } from "./_lib/sesion.js";

const CAMPOS_RESERVA =
  "id_reserva, tipo_reserva, descripcion_trabajo, estado, fecha_creacion, servicio_categoria(nombre), disponibilidad(fecha, hora_inicio, hora_fin)";

type DatosReserva = {
  id_profesional: number;
  id_servicio: number;
  id_disponibilidad: number;
};

function enteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isSafeInteger(valor) && valor > 0;
}

function datosReserva(body: unknown): DatosReserva | null {
  if (typeof body !== "object" || body === null) return null;

  const valores = body as Record<string, unknown>;
  const { id_profesional, id_servicio, id_disponibilidad } = valores;

  if (
    !enteroPositivo(id_profesional) ||
    !enteroPositivo(id_servicio) ||
    !enteroPositivo(id_disponibilidad)
  ) {
    return null;
  }

  return {
    id_profesional,
    id_servicio,
    id_disponibilidad,
  };
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const sesion = await obtenerSesion(req, res);
      if (!sesion) {
        return res.status(401).json({ error: "Iniciá sesión para ver tus reservas." });
      }

      const supabase = crearClienteSupabaseServidor(sesion.accessToken);
      const { data: usuario, error: errorUsuario } = await supabase
        .from("usuario")
        .select("rol, activo")
        .eq("id_usuario", sesion.idUsuario)
        .maybeSingle();

      if (errorUsuario) throw errorUsuario;
      if (!usuario || !usuario.activo) {
        return res.status(403).json({ error: "Tu cuenta no está activa." });
      }

      let campoPerfil: "id_cliente" | "id_profesional";
      let idPerfil: number;

      if (usuario.rol === "cliente") {
        const { data: cliente, error } = await supabase
          .from("cliente")
          .select("id_cliente")
          .eq("id_usuario", sesion.idUsuario)
          .maybeSingle();
        if (error) throw error;
        if (!cliente) {
          return res.status(403).json({
            error: "La cuenta no tiene un perfil de cliente asociado.",
          });
        }
        campoPerfil = "id_cliente";
        idPerfil = cliente.id_cliente;
      } else if (usuario.rol === "profesional") {
        const { data: profesional, error } = await supabase
          .from("profesional")
          .select("id_profesional")
          .eq("id_usuario", sesion.idUsuario)
          .maybeSingle();
        if (error) throw error;
        if (!profesional) {
          return res.status(403).json({
            error: "La cuenta no tiene un perfil profesional asociado.",
          });
        }
        campoPerfil = "id_profesional";
        idPerfil = profesional.id_profesional;
      } else {
        return res.status(403).json({
          error: "Este perfil no puede consultar reservas.",
        });
      }

      const { data: reservas, error } = await supabase
        .from("reserva")
        .select(CAMPOS_RESERVA)
        .eq(campoPerfil, idPerfil)
        .order("fecha_creacion", { ascending: false });

      if (error) throw error;
      return res.status(200).json({ reservas });
    } catch (error) {
      console.error("Error al consultar reservas:", error);
      return res.status(500).json({
        error: "No se pudieron cargar las reservas.",
      });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Método no permitido." });
  }

  if (!mismoOrigen(req)) {
    return res.status(403).json({ error: "Origen de solicitud no permitido." });
  }

  const reserva = datosReserva(req.body);
  if (!reserva) {
    return res.status(400).json({ error: "Los datos del turno son inválidos." });
  }

  try {
    const sesion = await obtenerSesion(req, res);
    if (!sesion) {
      return res.status(401).json({ error: "Iniciá sesión para reservar un turno." });
    }

    const supabase = crearClienteSupabaseServidor(sesion.accessToken);
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuario")
      .select("rol, activo")
      .eq("id_usuario", sesion.idUsuario)
      .maybeSingle();

    if (errorUsuario) throw errorUsuario;
    if (!usuario || usuario.rol !== "cliente" || !usuario.activo) {
      return res.status(403).json({
        error: "Necesitás una cuenta de cliente activa para reservar.",
      });
    }

    const { data: cliente, error: errorCliente } = await supabase
      .from("cliente")
      .select("id_cliente")
      .eq("id_usuario", sesion.idUsuario)
      .maybeSingle();

    if (errorCliente) {
      console.error("Error al consultar el perfil de cliente:", {
        codigo: errorCliente.code,
        mensaje: errorCliente.message,
      });
      return res.status(500).json({
        error:
          "No se pudo consultar tu perfil. Revisá los permisos de lectura de la tabla cliente en Supabase.",
      });
    }

    if (!cliente) {
      return res.status(409).json({
        error:
          "Tu cuenta no tiene un perfil de cliente asociado. Contactá a un administrador.",
      });
    }

    const { data, error } = await supabase
      .from("reserva")
      .insert({
        ...reserva,
        id_cliente: cliente.id_cliente,
        tipo_reserva: "visita",
        descripcion_trabajo: null,
        estado: "pendiente",
      })
      .select("id_reserva")
      .single();

    if (error?.code === "23505" || error?.code === "23P01") {
      return res.status(409).json({
        error: "Ese turno ya no está disponible. Elegí otro.",
      });
    }

    if (error?.code === "42501") {
      console.error("La base de datos rechazó la reserva:", {
        codigo: error.code,
        mensaje: error.message,
      });
      return res.status(403).json({
        error:
          "Supabase no permitió insertar o devolver la reserva. Aplicá nuevamente supabase/agenda_turnos.sql y volvé a intentar.",
      });
    }

    if (error) throw error;

    return res.status(201).json({
      id_reserva: data.id_reserva,
      estado: "pendiente",
    });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    return res.status(500).json({
      error: "No se pudo enviar la solicitud de reserva.",
    });
  }
}
