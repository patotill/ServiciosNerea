
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { crearClienteSupabaseServidor } from "../_lib/supabase.js";
import { establecerCookiesSesion } from "../_lib/cookies.js";

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

  if (
    !origen ||
    !host ||
    (() => {
      try {
        return new URL(origen).host !== host;
      } catch {
        return true;
      }
    })()
  ) {
    return res.status(403).json({
      error: "Origen de solicitud no permitido.",
    });
  }

  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      error: "Email y contraseña obligatorios.",
    });
  }

  try {
    const supabase = crearClienteSupabaseServidor();

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error || !data.user || !data.session) {
      console.error("Diagnóstico de autenticación:", {
        codigo: error?.code ?? "sin_codigo",
        estado: error?.status ?? "sin_estado",
        mensaje: error?.message ?? "Sin usuario o sesión",
      });

      return res.status(401).json({
        error: "Credenciales incorrectas.",
      });
    }

    const {
      access_token,
      refresh_token,
      expires_in,
    } = data.session;

    // RF-16: una cuenta bloqueada por el administrador no inicia sesión.
    const { data: perfil, error: perfilError } =
      await crearClienteSupabaseServidor(access_token)
        .from("usuario")
        .select("activo")
        .eq("id_usuario", data.user.id)
        .single();

    if (perfilError || !perfil) {
      throw new Error("No se pudo consultar el estado de la cuenta.");
    }

    if (!perfil.activo) {
      return res.status(403).json({
        error: "Tu cuenta está bloqueada. Contactá a un administrador.",
      });
    }

    establecerCookiesSesion(
      res,
      access_token,
      refresh_token,
      expires_in
    );

    return res.status(200).json({
      mensaje: "Inicio de sesión correcto.",
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      error: "No se pudo iniciar sesión.",
    });
  }
}
