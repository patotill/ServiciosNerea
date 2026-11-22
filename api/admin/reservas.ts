import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { ContactoClienteReserva } from "../../src/types/reserva.js";
import type { ReservaAdmin } from "../../src/types/admin.js";
import { exigirAdmin } from "../_lib/sesion.js";

const CAMPOS_RESERVA_ADMIN =
  "id_reserva, id_cliente, id_profesional, id_servicio, id_disponibilidad, tipo_reserva, descripcion_trabajo, estado, fecha_creacion, servicio_categoria(nombre), disponibilidad(id_disponibilidad, fecha, hora_inicio, hora_fin), cliente(usuario(nombre, email)), profesional(usuario(nombre))";

type Relacion<T> = T | T[] | null;

type FilaReservaAdmin = Omit<ReservaAdmin, "cliente" | "profesional"> & {
  cliente: Relacion<{
    usuario: Relacion<Pick<ContactoClienteReserva, "nombre" | "email">>;
  }>;
  profesional: Relacion<{
    usuario: Relacion<{ nombre: string | null }>;
  }>;
};

type DatosGestionReservaAdmin =
  | {
      accion: "modificar";
      id_reserva: number;
      id_disponibilidad: number;
      descripcion_trabajo: string | null;
    }
  | { accion: "aceptar" | "rechazar"; id_reserva: number };

function enteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isSafeInteger(valor) && valor > 0;
}

function unico<T>(valor: Relacion<T> | undefined): T | null {
  return Array.isArray(valor) ? (valor[0] ?? null) : (valor ?? null);
}

function datosGestion(body: unknown): DatosGestionReservaAdmin | null {
  if (typeof body !== "object" || body === null) return null;

  const valores = body as Record<string, unknown>;
  if (!enteroPositivo(valores.id_reserva)) return null;

  if (valores.accion === "aceptar" || valores.accion === "rechazar") {
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

function datosEliminacion(body: unknown): number | null {
  if (typeof body !== "object" || body === null) return null;
  const idReserva = (body as Record<string, unknown>).id_reserva;
  return enteroPositivo(idReserva) ? idReserva : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const admin = await exigirAdmin(req, res);
    if (!admin) return;

    if (req.method === "GET") {
      const esConteo = new URL(req.url ?? "/", "http://localhost")
        .searchParams.get("total") === "true";

      if (esConteo) {
        const { count, error } = await admin.supabase
          .from("reserva")
          .select("id_reserva", { count: "exact", head: true });

        if (error) throw error;
        if (count === null) {
          throw new Error("Supabase no devolvió el total de reservas.");
        }

        return res.status(200).json({ total: count });
      }

      const { data, error } = await admin.supabase
        .from("reserva")
        .select(CAMPOS_RESERVA_ADMIN)
        .order("fecha_creacion", { ascending: false })
        .returns<FilaReservaAdmin[]>();

      if (error) throw error;

      const reservas: ReservaAdmin[] = data.map((fila) => ({
        ...fila,
        cliente: unico(unico(fila.cliente)?.usuario),
        profesional: unico(unico(fila.profesional)?.usuario),
      }));

      return res.status(200).json({ reservas });
    }

    if (req.method === "PATCH") {
      const gestion = datosGestion(req.body);
      if (!gestion) {
        return res.status(400).json({ error: "Los datos para gestionar la reserva son inválidos." });
      }

      const cambios =
        gestion.accion === "modificar"
          ? {
              id_disponibilidad: gestion.id_disponibilidad,
              descripcion_trabajo: gestion.descripcion_trabajo,
            }
          : {
              estado: gestion.accion === "aceptar" ? "confirmada" : "rechazada",
            };

      let consulta = admin.supabase
        .from("reserva")
        .update(cambios)
        .eq("id_reserva", gestion.id_reserva);

      if (gestion.accion !== "modificar") {
        consulta = consulta.eq("estado", "pendiente");
      }

      const { data, error } = await consulta
        .select("id_reserva")
        .maybeSingle();

      if (error?.code === "23P01" || error?.code === "23505") {
        return res.status(409).json({
          error: "El turno ya no está disponible o se superpone con otra reserva.",
        });
      }
      if (error?.code === "22023") {
        return res.status(409).json({
          error: "No se puede asignar ese turno a la reserva.",
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
            gestion.accion === "modificar"
              ? "La reserva ya no existe o no se pudo modificar."
              : "Solo se pueden aceptar o rechazar reservas pendientes.",
        });
      }

      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const idReserva = datosEliminacion(req.body);
      if (idReserva === null) {
        return res.status(400).json({ error: "La reserva indicada no es válida." });
      }

      const { data, error } = await admin.supabase
        .from("reserva")
        .delete()
        .eq("id_reserva", idReserva)
        .select("id_reserva")
        .maybeSingle();

      if (error?.code === "42501") {
        return res.status(403).json({
          error:
            "Supabase no permitió eliminar la reserva. Aplicá la versión actualizada de supabase/agenda_turnos.sql.",
        });
      }
      if (error?.code === "23503") {
        return res.status(409).json({
          error: "La reserva no se puede eliminar porque tiene datos relacionados.",
        });
      }
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: "No se encontró la reserva." });
      }

      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PATCH, DELETE");
    return res.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    console.error("Error en /api/admin/reservas:", error);
    return res.status(500).json({ error: "No se pudo completar la operación." });
  }
}
