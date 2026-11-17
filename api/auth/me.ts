
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { crearClienteSupabaseServidor } from "../_lib/supabase.js";
import {
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  obtenerCookie,
  establecerCookiesSesion,
  eliminarCookiesSesion,
} from "../_lib/cookies.js";

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

  let accessToken = obtenerCookie(req, COOKIE_ACCESS);
  const refreshToken = obtenerCookie(req, COOKIE_REFRESH);

  if (!accessToken && !refreshToken) {
    return res.status(401).json({
      error: "No hay una sesión activa.",
    });
  }

  try {
    let usuarioAuth = null;

    if (accessToken) {
      const supabase = crearClienteSupabaseServidor();
      const { data, error } = await supabase.auth.getUser(accessToken);

      if (!error && data.user) {
        usuarioAuth = data.user;
      }
    }

    if (!usuarioAuth) {
      if (!refreshToken) {
        eliminarCookiesSesion(res);
        return res.status(401).json({
          error: "Sesión vencida.",
        });
      }

      const supabase = crearClienteSupabaseServidor();

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session || !data.user) {
        eliminarCookiesSesion(res);
        return res.status(401).json({
          error: "No se pudo renovar la sesión.",
        });
      }

      accessToken = data.session.access_token;
      usuarioAuth = data.user;

      establecerCookiesSesion(
        res,
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_in
      );
    }

    const supabase = crearClienteSupabaseServidor(accessToken!);

    const { data: usuario, error: perfilError } = await supabase
      .from("usuario")
      .select("id_usuario, email, nombre, rol, created_at")
      .eq("id_usuario", usuarioAuth.id)
      .single();

    if (perfilError || !usuario) {
      return res.status(404).json({
        error: "No se encontró el perfil del usuario.",
      });
    }

    return res.status(200).json({
      usuario,
    });
  } catch (error) {
    console.error("Error al consultar sesión:", error);

    return res.status(500).json({
      error: "No se pudo consultar la sesión.",
    });
  }
}
