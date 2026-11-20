import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { EstadoMatricula } from "../src/types/reserva.js";
import { crearClienteSupabaseServidor } from "./_lib/supabase.js";
import { obtenerSesion } from "./_lib/sesion.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido." });
  }

  try {
    const sesion = await obtenerSesion(req, res);
    if (!sesion) {
      return res.status(401).json({ error: "Iniciá sesión para consultar la matrícula." });
    }

    const supabase = crearClienteSupabaseServidor(sesion.accessToken);
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuario")
      .select("rol, activo")
      .eq("id_usuario", sesion.idUsuario)
      .maybeSingle();

    if (errorUsuario) throw errorUsuario;
    if (!usuario || usuario.rol !== "profesional" || !usuario.activo) {
      return res.status(403).json({
        error: "Se necesita una cuenta profesional activa para consultar la matrícula.",
      });
    }

    const { data: profesional, error: errorProfesional } = await supabase
      .from("profesional")
      .select("id_profesional")
      .eq("id_usuario", sesion.idUsuario)
      .maybeSingle();

    if (errorProfesional) throw errorProfesional;
    if (!profesional) {
      return res.status(404).json({
        error: "No se encontró el perfil del profesional.",
      });
    }

    const { data: matriculas, error: errorMatricula } = await supabase
      .from("matricula")
      .select("estado_verificacion")
      .eq("id_profesional", profesional.id_profesional)
      .returns<{ estado_verificacion: EstadoMatricula }[]>();

    if (errorMatricula) throw errorMatricula;

    const estados = matriculas.map((matricula) => matricula.estado_verificacion);
    const estado = estados.includes("verificada")
      ? "verificada"
      : (estados[0] ?? null);

    return res.status(200).json({ estado });
  } catch (error) {
    console.error("Error al consultar la matrícula:", error);
    return res.status(500).json({
      error: "No se pudo consultar la matrícula.",
    });
  }
}
