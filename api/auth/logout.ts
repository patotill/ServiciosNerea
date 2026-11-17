
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { crearClienteSupabaseServidor } from "../_lib/supabase.js";
import {
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  obtenerCookie,
  eliminarCookiesSesion,
} from "../_lib/cookies.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Método no permitido.",
    });
  }

  const origen = req.headers.origin;
  const host = req.headers.host;

  try {
    if (!origen || !host || new URL(origen).host !== host) {
      return res.status(403).json({
        error: "Origen de solicitud no permitido.",
      });
    }
  } catch {
    return res.status(403).json({
      error: "Origen de solicitud no permitido.",
    });
  }

  const accessToken = obtenerCookie(req, COOKIE_ACCESS);
  const refreshToken = obtenerCookie(req, COOKIE_REFRESH);

  if (!accessToken && !refreshToken) {
    eliminarCookiesSesion(res);
    return res.status(200).json({
      mensaje: "Sesión cerrada correctamente.",
    });
  }

  try {
    if (!accessToken || !refreshToken) {
      throw new Error("Faltan credenciales para revocar la sesión.");
    }

    const supabase = crearClienteSupabaseServidor();

    const { error: sesionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sesionError) throw sesionError;

    const { error: logoutError } = await supabase.auth.signOut({
      scope: "global",
    });

    if (logoutError) throw logoutError;

    eliminarCookiesSesion(res);

    return res.status(200).json({
      mensaje: "Sesión cerrada correctamente.",
    });
  } catch (error) {
    console.error("Error al revocar sesión:", error);

    eliminarCookiesSesion(res);

    return res.status(502).json({
      error: "Se cerró la sesión local, pero no se pudo confirmar su revocación.",
    });
  }
}
