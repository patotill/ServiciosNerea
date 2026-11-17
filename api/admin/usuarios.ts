import type { VercelRequest, VercelResponse } from "@vercel/node";
import { exigirAdmin } from "../_lib/sesion.js";

/** RF-16: listar usuarios y bloquear/habilitar cuentas. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const admin = await exigirAdmin(req, res);
    if (!admin) return;

    if (req.method === "GET") {
      const { data, error } = await admin.supabase
        .from("usuario")
        .select("id_usuario, nombre, email, rol, activo")
        .order("nombre", { ascending: true });

      if (error) throw error;
      return res.status(200).json({ usuarios: data });
    }

    if (req.method === "PATCH") {
      const { id_usuario, activo } = req.body ?? {};

      if (typeof id_usuario !== "string" || typeof activo !== "boolean") {
        return res.status(400).json({ error: "Datos inválidos." });
      }

      if (id_usuario === admin.idUsuario) {
        return res
          .status(400)
          .json({ error: "No podés bloquear tu propia cuenta." });
      }

      const { data, error } = await admin.supabase
        .from("usuario")
        .update({ activo })
        .eq("id_usuario", id_usuario)
        .select("id_usuario");

      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No se encontró el usuario." });
      }
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    console.error("Error en /api/admin/usuarios:", error);
    return res.status(500).json({ error: "No se pudo completar la operación." });
  }
}
