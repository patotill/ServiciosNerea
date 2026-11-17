import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { SupabaseClient } from "@supabase/supabase-js";
import { crearClienteSupabaseServidor } from "./supabase.js";
import {
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  obtenerCookie,
  establecerCookiesSesion,
  eliminarCookiesSesion,
} from "./cookies.js";

export type SesionServidor = {
  accessToken: string;
  idUsuario: string;
};

/**
 * Valida la sesión de las cookies HttpOnly y la renueva con el refresh token
 * si el access venció. Devuelve `null` si no hay sesión válida.
 */
export async function obtenerSesion(
  req: VercelRequest,
  res: VercelResponse
): Promise<SesionServidor | null> {
  const accessToken = obtenerCookie(req, COOKIE_ACCESS);
  const refreshToken = obtenerCookie(req, COOKIE_REFRESH);

  if (!accessToken && !refreshToken) return null;

  const supabase = crearClienteSupabaseServidor();

  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (!error && data.user) {
      return { accessToken, idUsuario: data.user.id };
    }
  }

  if (!refreshToken) {
    eliminarCookiesSesion(res);
    return null;
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session || !data.user) {
    eliminarCookiesSesion(res);
    return null;
  }

  establecerCookiesSesion(
    res,
    data.session.access_token,
    data.session.refresh_token,
    data.session.expires_in
  );

  return { accessToken: data.session.access_token, idUsuario: data.user.id };
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

export type SesionAdmin = {
  supabase: SupabaseClient;
  idUsuario: string;
};

/**
 * Deja pasar solo a un administrador activo. Si no, ya respondió el error y
 * devuelve `null`. Las consultas posteriores corren con el token del admin,
 * así que las políticas RLS de Supabase siguen siendo la garantía real.
 */
export async function exigirAdmin(
  req: VercelRequest,
  res: VercelResponse
): Promise<SesionAdmin | null> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET" && !mismoOrigen(req)) {
    res.status(403).json({ error: "Origen de solicitud no permitido." });
    return null;
  }

  const sesion = await obtenerSesion(req, res);

  if (!sesion) {
    res.status(401).json({ error: "No hay una sesión activa." });
    return null;
  }

  const supabase = crearClienteSupabaseServidor(sesion.accessToken);

  const { data: perfil, error } = await supabase
    .from("usuario")
    .select("rol, activo")
    .eq("id_usuario", sesion.idUsuario)
    .single();

  // Un fallo de la consulta no es "no sos admin": lo atrapa el catch del endpoint.
  if (error) throw error;

  if (perfil.rol !== "admin" || !perfil.activo) {
    res.status(403).json({ error: "Acceso solo para administradores." });
    return null;
  }

  return { supabase, idUsuario: sesion.idUsuario };
}
