import type { VercelRequest, VercelResponse } from "@vercel/node";
import { crearClienteSupabaseServidor } from "./_lib/supabase.js";
import { obtenerSesion } from "./_lib/sesion.js";

const CAMPOS_RESERVA =
  "id_reserva, id_profesional, id_servicio, id_disponibilidad, tipo_reserva, descripcion_trabajo, estado, fecha_creacion, servicio_categoria(nombre), disponibilidad(id_disponibilidad, fecha, hora_inicio, hora_fin)";

type DatosReserva = {
  id_profesional: number;
  id_servicio: number;
  id_disponibilidad: number;
  descripcion_trabajo: string | null;
};

type DatosGestionReserva =
  | {
      accion: "modificar";
      id_reserva: number;
      id_disponibilidad: number;
      descripcion_trabajo: string | null;
    }
  | {
      accion: "cancelar" | "aceptar" | "rechazar" | "completar";
      id_reserva: number;
    };

type DatosContactoReserva = {
  id_reserva: number;
  nombre: string | null;
  email: string | null;
  telefono: string | null;
};

function enteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isSafeInteger(valor) && valor > 0;
}

function datosGestionReserva(body: unknown): DatosGestionReserva | null {
  if (typeof body !== "object" || body === null) return null;

  const valores = body as Record<string, unknown>;
  if (!enteroPositivo(valores.id_reserva)) return null;

  if (
    valores.accion === "cancelar" ||
    valores.accion === "aceptar" ||
    valores.accion === "rechazar" ||
    valores.accion === "completar"
  ) {
    return {
      accion: valores.accion,
      id_reserva: valores.id_reserva,
    };
  }
  if (
    valores.accion !== "modificar" ||
    !enteroPositivo(valores.id_disponibilidad) ||
    typeof valores.descripcion_trabajo !== "string"
  ) {
    return null;
  }

  const descripcion = valores.descripcion_trabajo.trim();
  if (descripcion.length > 1000) return null;

  return {
    accion: "modificar",
    id_reserva: valores.id_reserva,
    id_disponibilidad: valores.id_disponibilidad,
    descripcion_trabajo: descripcion || null,
  };
}

function datosReserva(body: unknown): DatosReserva | null {
  if (typeof body !== "object" || body === null) return null;

  const valores = body as Record<string, unknown>;
  const {
    id_profesional,
    id_servicio,
    id_disponibilidad,
    descripcion_trabajo,
  } = valores;

  if (
    !enteroPositivo(id_profesional) ||
    !enteroPositivo(id_servicio) ||
    !enteroPositivo(id_disponibilidad) ||
    (descripcion_trabajo !== undefined &&
      descripcion_trabajo !== null &&
      typeof descripcion_trabajo !== "string")
  ) {
    return null;
  }

  const descripcion =
    typeof descripcion_trabajo === "string"
      ? descripcion_trabajo.trim()
      : "";
  if (descripcion.length > 1000) return null;

  return {
    id_profesional,
    id_servicio,
    id_disponibilidad,
    descripcion_trabajo: descripcion || null,
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

      if (usuario.rol === "profesional") {
        const reservasVisibles = reservas.filter(
          (reserva) => reserva.estado !== "cancelada",
        );
        const { data: contactos, error: errorContactos } = await supabase
          .rpc("agenda_contactos_reservas_profesional")
          .returns<DatosContactoReserva[]>();

        if (errorContactos?.code === "PGRST202" || errorContactos?.code === "42703") {
          return res.status(503).json({
            error:
              "Falta actualizar la base de datos. Aplicá la versión actualizada de supabase/agenda_turnos.sql.",
          });
        }
        if (errorContactos) throw errorContactos;

        const contactosPorReserva = new Map(
          (contactos ?? []).map(({ id_reserva, ...contacto }) => [
            id_reserva,
            contacto,
          ]),
        );
        if (
          reservasVisibles.some(
            (reserva) => !contactosPorReserva.has(reserva.id_reserva),
          )
        ) {
          console.error(
            "La consulta de contactos no devolvió datos para todas las reservas del profesional.",
          );
          return res.status(503).json({
            error:
              "No se pudieron cargar los datos de contacto. Aplicá la versión actualizada de supabase/agenda_turnos.sql.",
          });
        }

        return res.status(200).json({
          reservas: reservasVisibles.map((reserva) => ({
            ...reserva,
            cliente: contactosPorReserva.get(reserva.id_reserva) ?? null,
          })),
        });
      }

      return res.status(200).json({ reservas });
    } catch (error) {
      console.error("Error al consultar reservas:", error);
      return res.status(500).json({
        error: "No se pudieron cargar las reservas.",
      });
    }
  }

  if (req.method !== "POST" && req.method !== "PATCH") {
    res.setHeader("Allow", "GET, POST, PATCH");
    return res.status(405).json({ error: "Método no permitido." });
  }

  if (!mismoOrigen(req)) {
    return res.status(403).json({ error: "Origen de solicitud no permitido." });
  }

  if (req.method === "PATCH") {
    const gestion = datosGestionReserva(req.body);
    if (!gestion) {
      return res.status(400).json({
        error: "Los datos para gestionar la reserva son inválidos.",
      });
    }

    try {
      const sesion = await obtenerSesion(req, res);
      if (!sesion) {
        return res.status(401).json({
          error: "Iniciá sesión para modificar una reserva.",
        });
      }

      const supabase = crearClienteSupabaseServidor(sesion.accessToken);
      const { data: usuario, error: errorUsuario } = await supabase
        .from("usuario")
        .select("rol, activo")
        .eq("id_usuario", sesion.idUsuario)
        .maybeSingle();

      if (errorUsuario) throw errorUsuario;

      if (
        gestion.accion === "aceptar" ||
        gestion.accion === "rechazar" ||
        gestion.accion === "completar"
      ) {
        if (!usuario || usuario.rol !== "profesional" || !usuario.activo) {
          return res.status(403).json({
            error:
              "Necesitás una cuenta profesional activa para responder reservas.",
          });
        }

        const { data: profesional, error: errorProfesional } = await supabase
          .from("profesional")
          .select("id_profesional")
          .eq("id_usuario", sesion.idUsuario)
          .maybeSingle();

        if (errorProfesional) throw errorProfesional;
        if (!profesional) {
          return res.status(403).json({
            error: "La cuenta no tiene un perfil profesional asociado.",
          });
        }

        const estadoAnterior =
          gestion.accion === "completar" ? "confirmada" : "pendiente";
        const estado =
          gestion.accion === "aceptar"
            ? "confirmada"
            : gestion.accion === "rechazar"
              ? "rechazada"
              : "completada";
        const { data, error } = await supabase
          .from("reserva")
          .update({ estado })
          .eq("id_reserva", gestion.id_reserva)
          .eq("id_profesional", profesional.id_profesional)
          .eq("estado", estadoAnterior)
          .select("id_reserva")
          .maybeSingle();

        if (error?.code === "42501") {
          return res.status(403).json({
            error:
              "Supabase no permitió actualizar el estado. Aplicá la versión actualizada de supabase/agenda_turnos.sql.",
          });
        }
        if (error?.code === "23P01" || error?.code === "23505") {
          return res.status(409).json({
            error: "La reserva ya cambió de estado. Actualizá la lista.",
          });
        }
        if (error) throw error;
        if (!data) {
          return res.status(409).json({
            error:
              "La reserva ya cambió de estado o no pertenece a tu agenda. Actualizá la lista.",
          });
        }

        return res.status(200).json({ ok: true });
      }

      if (!usuario || usuario.rol !== "cliente" || !usuario.activo) {
        return res.status(403).json({
          error: "Necesitás una cuenta de cliente activa para gestionar reservas.",
        });
      }

      const { data: cliente, error: errorCliente } = await supabase
        .from("cliente")
        .select("id_cliente")
        .eq("id_usuario", sesion.idUsuario)
        .maybeSingle();

      if (errorCliente) throw errorCliente;
      if (!cliente) {
        return res.status(403).json({
          error: "La cuenta no tiene un perfil de cliente asociado.",
        });
      }

      const cambios =
        gestion.accion === "cancelar"
          ? { estado: "cancelada" as const }
          : {
              id_disponibilidad: gestion.id_disponibilidad,
              descripcion_trabajo: gestion.descripcion_trabajo,
            };

      const { data, error } = await supabase
        .from("reserva")
        .update(cambios)
        .eq("id_reserva", gestion.id_reserva)
        .eq("id_cliente", cliente.id_cliente)
        .eq("estado", "pendiente")
        .select("id_reserva")
        .maybeSingle();

      if (error?.code === "23P01" || error?.code === "23505") {
        return res.status(409).json({
          error: "Ese turno ya no está disponible. Elegí otro.",
        });
      }
      if (error?.code === "22023") {
        return res.status(409).json({
          error: "Solo podés gestionar reservas pendientes y futuras.",
        });
      }
      if (error?.code === "42501") {
        return res.status(403).json({
          error:
            "Supabase no permitió actualizar la reserva. Aplicá la versión actualizada de supabase/agenda_turnos.sql.",
        });
      }
      if (error) throw error;
      if (!data) {
        return res.status(409).json({
          error:
            "La reserva ya no está pendiente o no se puede gestionar. Actualizá la lista e intentá de nuevo.",
        });
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Error al gestionar reserva del cliente:", error);
      return res.status(500).json({
        error: "No se pudo actualizar la reserva.",
      });
    }
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
