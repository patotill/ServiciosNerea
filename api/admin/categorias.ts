import type { VercelRequest, VercelResponse } from "@vercel/node";
import { exigirAdmin } from "../_lib/sesion.js";

const FK_VIOLATION = "23503";
const UNIQUE_VIOLATION = "23505";

function datosCategoria(body: unknown) {
  const { nombre, descripcion } = (body ?? {}) as Record<string, unknown>;

  if (typeof nombre !== "string" || !nombre.trim()) return null;
  if (descripcion !== undefined && typeof descripcion !== "string") return null;

  return {
    nombre: nombre.trim(),
    descripcion: (descripcion as string | undefined)?.trim() || null,
  };
}

/** RF-17: alta, edición y baja de categorías de servicio. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const admin = await exigirAdmin(req, res);
    if (!admin) return;

    const tabla = admin.supabase.from("servicio_categoria");

    if (req.method === "GET") {
      const { data, error } = await tabla
        .select("id_servicio, nombre, descripcion")
        .order("nombre", { ascending: true });

      if (error) throw error;
      return res.status(200).json({ categorias: data });
    }

    if (req.method === "POST") {
      const datos = datosCategoria(req.body);
      if (!datos) return res.status(400).json({ error: "Datos inválidos." });

      const { error } = await tabla.insert(datos);

      if (error?.code === UNIQUE_VIOLATION) {
        return res
          .status(409)
          .json({ error: "Ya existe una categoría con ese nombre." });
      }
      if (error) throw error;
      return res.status(201).json({ ok: true });
    }

    if (req.method === "PUT") {
      const datos = datosCategoria(req.body);
      const idServicio = req.body?.id_servicio;

      if (!datos || !Number.isInteger(idServicio)) {
        return res.status(400).json({ error: "Datos inválidos." });
      }

      const { data, error } = await tabla
        .update(datos)
        .eq("id_servicio", idServicio)
        .select("id_servicio");

      if (error?.code === UNIQUE_VIOLATION) {
        return res
          .status(409)
          .json({ error: "Ya existe una categoría con ese nombre." });
      }
      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No se encontró la categoría." });
      }
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const idServicio = req.body?.id_servicio;

      if (!Number.isInteger(idServicio)) {
        return res.status(400).json({ error: "Datos inválidos." });
      }

      const { data, error } = await tabla
        .delete()
        .eq("id_servicio", idServicio)
        .select("id_servicio");

      if (error?.code === FK_VIOLATION) {
        return res.status(409).json({
          error:
            "No se puede borrar: hay reservas, matrículas o profesionales que usan esta categoría.",
        });
      }
      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No se encontró la categoría." });
      }
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, PUT, DELETE");
    return res.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    console.error("Error en /api/admin/categorias:", error);
    return res.status(500).json({ error: "No se pudo completar la operación." });
  }
}
