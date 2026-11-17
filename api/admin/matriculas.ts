import type { VercelRequest, VercelResponse } from "@vercel/node";
import { exigirAdmin } from "../_lib/sesion.js";

const ESTADOS_REVISION = ["verificada", "rechazada"];

/** RF-18: listar matrículas y marcarlas como verificadas o rechazadas. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const admin = await exigirAdmin(req, res);
    if (!admin) return;

    if (req.method === "GET") {
      const { data, error } = await admin.supabase
        .from("matricula")
        .select(
          "id_matricula, numero, estado_verificacion, servicio_categoria(nombre), profesional(usuario(nombre))"
        )
        .order("id_matricula", { ascending: false });

      if (error) throw error;
      return res.status(200).json({ matriculas: data });
    }

    if (req.method === "PATCH") {
      const { id_matricula, estado_verificacion } = req.body ?? {};

      if (
        !Number.isInteger(id_matricula) ||
        !ESTADOS_REVISION.includes(estado_verificacion)
      ) {
        return res.status(400).json({ error: "Datos inválidos." });
      }

      const { data, error } = await admin.supabase
        .from("matricula")
        .update({ estado_verificacion })
        .eq("id_matricula", id_matricula)
        .select("id_matricula");

      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No se encontró la matrícula." });
      }
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    console.error("Error en /api/admin/matriculas:", error);
    return res.status(500).json({ error: "No se pudo completar la operación." });
  }
}
