import type { VercelRequest, VercelResponse } from "@vercel/node";
import { crearClienteSupabaseServidor } from "../_lib/supabase.js";
import { eliminarCookiesSesion } from "../_lib/cookies.js";
import { obtenerSesion } from "../_lib/sesion.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Método no permitido.",
    });
  }

  try {
    const sesion = await obtenerSesion(req, res);

    if (!sesion) {
      return res.status(401).json({
        error: "No hay una sesión activa.",
      });
    }

    const supabase = crearClienteSupabaseServidor(sesion.accessToken);

    const { data: usuario, error: perfilError } = await supabase
      .from("usuario")
      .select("id_usuario, email, nombre, telefono, codigo_postal, rol, created_at, activo")
      .eq("id_usuario", sesion.idUsuario)
      .single();

    if (perfilError || !usuario) {
      return res.status(404).json({
        error: "No se encontró el perfil del usuario.",
      });
    }

    // RF-16: corta también las sesiones ya abiertas de una cuenta bloqueada.
    if (!usuario.activo) {
      eliminarCookiesSesion(res);
      return res.status(401).json({
        error: "Tu cuenta está bloqueada.",
      });
    }

    const { activo: _activo, ...datosUsuario } = usuario;

    return res.status(200).json({
      usuario: datosUsuario,
    });
  } catch (error) {
    console.error("Error al consultar sesión:", error);

    return res.status(500).json({
      error: "No se pudo consultar la sesión.",
    });
  }
}
